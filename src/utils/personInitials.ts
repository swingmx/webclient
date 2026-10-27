import { SUFFIXES } from './composerSurname'

/**
 * The first letters of a person's first and last names, leaving out
 * particles and suffixes: "Ludwig van Beethoven" -> "LB", "Johann Strauss
 * Jr" -> "JS".
 */
export default function personInitials(name: string) {
    const words = name.replace(/,/g, ' ').trim().split(/\s+/).filter(word => !SUFFIXES.has(word.toLowerCase()))
    const capitals = words.filter(word => word[0] !== word[0].toLowerCase())
    const names = capitals.length ? capitals : words
    const letters = names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0]?.[0] ?? ''
    return letters.toUpperCase()
}
