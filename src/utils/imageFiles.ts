/**
 * The first image in a file list, or null.
 */
export function firstImage(files?: FileList | null): File | null {
    return Array.from(files || []).find(file => file.type.startsWith('image/')) || null
}
