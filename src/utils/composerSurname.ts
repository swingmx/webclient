// generational suffixes that stay with the surname: "Strauss Jr"
export const SUFFIXES = new Set(['jr', 'jr.', 'sr', 'sr.', 'ii', 'iii', 'iv'])

/**
 * A composer's surname with its suffix: "Ludwig van Beethoven" ->
 * "Beethoven", "Johann Strauss Jr" -> "Strauss Jr".
 */
export default function composerSurname(name: string) {
    const words = name.replace(/,/g, ' ').trim().split(/\s+/)
    let end = words.length
    while (end > 1 && SUFFIXES.has(words[end - 1].toLowerCase())) end--
    return words.slice(end - 1).join(' ')
}
