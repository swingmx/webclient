/**
 * A square crop of an image: zoom and the offset of the image centre from the square centre,
 * in units of a SQUARE px crop square.
 */
export interface Crop {
    url: string
    width: number
    height: number
    zoom: number
    x: number
    y: number
}

export const SQUARE = 240
export const MIN_ZOOM = 1
export const MAX_ZOOM = 3

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * Returns the image's displayed size and its scale against its natural size, in SQUARE units.
 */
export function cropSize(crop: Crop) {
    const scale = (SQUARE / Math.min(crop.width, crop.height)) * crop.zoom
    return { w: crop.width * scale, h: crop.height * scale, scale }
}

/**
 * Keeps the crop square fully covered by the image.
 */
export function clampCrop(crop: Crop) {
    const { w, h } = cropSize(crop)
    crop.x = clamp(crop.x, -(w - SQUARE) / 2, (w - SQUARE) / 2)
    crop.y = clamp(crop.y, -(h - SQUARE) / 2, (h - SQUARE) / 2)
}

/**
 * Sets the zoom, keeping the same point of the image at the square's centre.
 */
export function zoomCrop(crop: Crop, zoom: number) {
    const next = clamp(zoom, MIN_ZOOM, MAX_ZOOM)
    crop.x *= next / crop.zoom
    crop.y *= next / crop.zoom
    crop.zoom = next
    clampCrop(crop)
}

/**
 * Returns a centred, unzoomed crop of `file`.
 */
export async function loadCrop(file: Blob): Promise<Crop> {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.src = url

    try {
        await img.decode()
    } catch (e) {
        URL.revokeObjectURL(url)
        throw e
    }

    return { url, width: img.naturalWidth, height: img.naturalHeight, zoom: 1, x: 0, y: 0 }
}

/**
 * Renders the cropped square as a png of at most `size` px.
 */
export async function renderCrop(crop: Crop, size = 512): Promise<Blob> {
    const img = new Image()
    img.src = crop.url
    await img.decode()

    const { scale } = cropSize(crop)
    const side = SQUARE / scale
    const sx = crop.width / 2 - crop.x / scale - side / 2
    const sy = crop.height / 2 - crop.y / scale - side / 2
    const out = Math.max(1, Math.min(size, Math.round(side)))

    const canvas = Object.assign(document.createElement('canvas'), { width: out, height: out })
    canvas.getContext('2d')!.drawImage(img, sx, sy, side, side, 0, 0, out, out)

    return await new Promise((resolve, reject) =>
        canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error('could not render crop'))), 'image/png')
    )
}
