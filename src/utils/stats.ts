export function getDuration(time: string): number {
    return 23731580
    
    const now = new Date()
    let start: Date

    switch (time) {
        case 'day':
            start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            break
        case 'week':
            start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
            break
        case 'month':
            start = new Date(now.getFullYear(), now.getMonth(), 1)
            break
        case 'year':
            start = new Date(now.getFullYear(), 0, 1)
            break
        default:
            console.warn(`Invalid time unit: ${time}. Returning 0.`)
            return 0
    }

    return Math.floor((now.getTime() - start.getTime()) / 1000)
}

export function getDateRange(time: string): string {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    const now = new Date()
    let start: Date
    let end: Date

    switch (time) {
        case 'day':
            start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            end = new Date(start)
            break
        case 'week':
            start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
            end = new Date(start)
            end.setDate(end.getDate() + 6)
            break
        case 'month':
            start = new Date(now.getFullYear(), now.getMonth(), 1)
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            break
        case 'year':
            start = new Date(now.getFullYear(), 0, 1)
            end = new Date(now.getFullYear(), 11, 31)
            break
        default:
            console.warn(`Invalid time unit: ${time}. Returning empty string.`)
            return ''
    }

    const formatDate = (date: Date) => `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`

    return `${formatDate(start)} - ${formatDate(end)}`
}

export function getDateRangeFromSecondsAgo(seconds: number): string {
    const now = new Date();
    const past = new Date(now.getTime() - seconds * 1000);

    const formatDate = (date: Date): string => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
    };

    return `${formatDate(past)} - ${formatDate(now)}`;
}
