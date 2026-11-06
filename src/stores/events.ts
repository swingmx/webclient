interface EventData {
    event: string
    data: {
        [key: string]: any
    }
    timestamp: number
}

class Events {
    private worker: Worker | null = null
    private events: { [event: string]: (data: any) => any } = {}

    // opened on first subscribe, so only onboarding holds the /events connection
    private connect() {
        if (this.worker) return
        this.worker = new Worker(new URL('/workers/sse-events.js', import.meta.url))
        this.worker.postMessage({
            command: "connect",
            options: {
                maxReconnectAttempts: 10,
                reconnectDelay: 1000,
                maxReconnectDelay: 30000,
            },
        })

        this.worker.onmessage = (event) => {
            const { data } = event.data as { data: EventData }

            if (!data) return

            const eventType = data.event
            const callback = this.events[eventType]
            if (callback) {
                callback(data.data)
            }
        }
    }

    async subscribe(eventName: string, callback: (data: any) => any) {
        this.connect()
        this.events[eventName] = callback
    }

    unsubscribe(event: string, callback?: ((data: any) => any)) {
        delete this.events[event]

        if (callback) {
            callback(null)
        }
    }
}

const events = new Events()
export default events