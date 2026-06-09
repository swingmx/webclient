/**
 * Thrown when a Waiter event times out
 */
export class TimeoutError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'TimeoutError'
    }
}

/**
 * Thrown when a Waiter event is aborted
 */
export class AbortError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'AbortError'
    }
}

// Bun does not support NodeJS.Timeout, so we need to create a type for it
type TimeoutType = ReturnType<typeof setTimeout>
/** Another possible solution
type TimeoutType = typeof globalThis extends { setTimeout: any }
    ? ReturnType<typeof setTimeout>
    : any
*/

type WaitEntry = {
    resolve: (value: any) => void
    reject: (reason?: any) => void
    promise: Promise<any>
    timeoutId: TimeoutType
    id: string

    /**
     * Optional state data to be associated with this wait entry
     */
    data?: any
}

export class Waiter {
    static preHeld: Map<string, null> = new Map()
    static waitList: Map<string, WaitEntry> = new Map()
    static keys = {
        ONBOARDING_COMPLETE: 'onboardingComplete',
        // etc
    }

    /**
     * Registers a waitable event with a given id
     *
     * @param id - The id of the event to wait for
     * @param timeout - The timeout for the event (null for infinite wait)
     * @returns The data of the resolved event
     */
    static async wait<T = any>(id: string, timeout: number | null = 10000): Promise<T> {
        if (Waiter.waitList.has(id)) {
            throw new Error(`[WAITER] Already waiting for id: ${id}`)
        }

        if (Waiter.preHeld.has(id)) {
            console.log(`[WAITER] Found pre-held key: ${id}`)
            Waiter.preHeld.delete(id)
            return null as T
        }

        const promise = new Promise<T>((resolve, reject) => {
            let timeoutId: TimeoutType | null = null

            if (timeout !== null) {
                timeoutId = setTimeout(() => {
                    Waiter.waitList.delete(id)
                    reject(new TimeoutError(`[WAITER] Timeout waiting for response: ${id}`))
                }, timeout) as TimeoutType
            }

            Waiter.waitList.set(id, {
                resolve,
                reject,
                timeoutId: timeoutId as TimeoutType,
                id,
                promise: null as unknown as Promise<T>,
            })

            console.log(`[WAITER] Created wait entry for ${id}`)
        })

        const entry = Waiter.waitList.get(id)
        if (!entry) {
            throw new Error(`[WAITER] Wait entry not found for ${id}`)
        }
        entry.promise = promise
        return promise
    }

    /**
     * Resolves the Promise registered with a given id with the provided data
     *
     * @param id - The id of the promise to resolve
     * @param data - The data to resolve the promise with
     */
    static resolve<T>(id: string, data?: T): T | null {
        const entry = Waiter.waitList.get(id)
        if (!entry) {
            console.warn(`[WAITER] No wait entry found for ${id}`)
            return null
        }

        clearTimeout(entry.timeoutId)
        Waiter.preHeld.delete(id)
        Waiter.waitList.delete(id)
        entry.resolve(data)
        console.log(`[WAITER] Resolved wait entry for ${id}`)

        return data || null
    }

    static preHold(id: string) {
        Waiter.preHeld.set(id, null)
    }

    /**
     * Throw an AbortError to abort an event with a given id.
     *
     * @param id - The id of the event to abort
     */
    static abort(id: string) {
        const entry = Waiter.waitList.get(id)
        if (!entry) {
            console.warn(`[WAITER] No wait entry found for ${id}`)
            return
        }

        clearTimeout(entry.timeoutId)
        Waiter.preHeld.delete(id)
        Waiter.waitList.delete(id)
        entry.reject(new AbortError(`[WAITER] Aborted wait entry for ${id}`))
    }

    /**
     * Checks if there is a promise registered with a given id
     *
     * @param id - The id to check
     * @returns Whether there is a promise registered with the id
     */
    static isWaiting(id: string): boolean {
        return Waiter.waitList.has(id)
    }
}
