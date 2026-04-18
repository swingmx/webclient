import createSubPaths from './useCreateSubPaths'
import focusElemByClass from './useFocusElem'
import formatSeconds from './useFormatSeconds'
import useFuse from './useFuse'
import { readLocalStorage, writeLocalStorage } from './useLocalStorage'
import putCommas from './usePutCommas'
import useVisibility from './useVisibility'
import useCreateTrackProps from './useCreateTrackProps'

/**
 * Pluralizes an english word
 *
 * @param word The english word to pluralize
 * @param count The number of items
 * @returns The pluralized word
 */
export function pruralize(word: string, count: number): string {
    return count !== 1 ? `${word}s` : word
}

export {
    readLocalStorage,
    writeLocalStorage,
    createSubPaths,
    focusElemByClass,
    useVisibility,
    formatSeconds,
    useCreateTrackProps as createTrackProps,
    putCommas,
    useFuse,
}
