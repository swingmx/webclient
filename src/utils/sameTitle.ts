/**
 * Whether two titles read the same without case, accents, quotes, or
 * punctuation: "Für Elise" and '"Fur Elise"'.
 */
export default function sameTitle(a: string | null | undefined, b: string | null | undefined) {
    if (!a || !b) return false
    const key = (text: string) =>
        text
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
    return key(a) === key(b)
}
