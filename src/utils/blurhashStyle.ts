import { decode } from 'blurhash'

const SIZE = 32
const cache = new Map<string, string>()
let canvas: HTMLCanvasElement | null = null

/**
 * A 32x32 data url of a blurhash, cached by hash. Empty for a missing or invalid hash.
 */
export function blurhashUrl(hash?: string | null) {
    if (!hash) return ''

    let url = cache.get(hash)
    if (url !== undefined) return url

    try {
        canvas ??= Object.assign(document.createElement('canvas'), { width: SIZE, height: SIZE })
        const ctx = canvas.getContext('2d')!
        const pixels = decode(hash, SIZE, SIZE)
        ctx.putImageData(new ImageData(pixels, SIZE, SIZE), 0, 0)
        url = canvas.toDataURL()
    } catch {
        url = ''
    }

    cache.set(hash, url)
    return url
}

/**
 * Background style showing a blurhash behind an image until it loads.
 */
export default function blurhashStyle(hash?: string | null) {
    const url = blurhashUrl(hash)
    return url ? { backgroundImage: `url(${url})`, backgroundSize: 'cover' } : {}
}
