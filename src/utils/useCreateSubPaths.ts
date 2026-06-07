import { subPath } from '@/interfaces'

const toSegments = (p: string) => (p ?? '').replace(/\\/g, '/').split('/').filter(Boolean)

/**
 * Breaks a path into sub-paths.
 * @param {string} newpath the new path to break into sub-paths.
 * @param {string} oldpath the old path to compare with the new path.
 */
export default function createSubPaths(newpath: string, oldpath: string): [string, subPath[]] {
    const prefix = (newpath ?? '').startsWith('/') || (newpath ?? '').startsWith('\\') ? '/' : ''
    const suffix = (newpath ?? '').endsWith('/') || (newpath ?? '').endsWith('\\') ? '/' : ''
    const wrapPath = (segments: string[]) => prefix + segments.join('/') + suffix

    const newSegments = toSegments(newpath)
    const oldSegments = toSegments(oldpath)

    const current = newSegments.at(-1) ?? ''
    const useOld = oldSegments.join('/').includes(newSegments.join('/'))
    const segments = useOld ? oldSegments : newSegments

    return [wrapPath(segments), createSubs(segments, current)]

    function createSubs(list: string[], current: string) {
        const paths = list.map((name, index) => ({
            active: name === current,
            name,
            path: wrapPath(list.slice(0, index + 1)),
        }))

        // only mark the last match as active (preserves original behavior for duplicate names)
        let lastActiveIndex = -1
        for (let i = 0; i < paths.length; i++) {
            if (paths[i].name === current) lastActiveIndex = i
            paths[i].active = false
        }
        if (lastActiveIndex !== -1) paths[lastActiveIndex].active = true

        return paths
    }
}
