/**
 * Formats a timestamp into a date string of the format "Month day, year"
 * @returns formatted date
 */
export function formatDate(timestamp: number) {
    // format date as Month day, year
    const date = new Date(timestamp * 1000)

    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
}
