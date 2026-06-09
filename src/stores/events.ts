interface EventData {
    event: string
    data: {
        [key: string]: any
    }
    timestamp: number
}

class Events {
    private worker: Worker
    private events: { [event: string]: (data: any) => any } = {}

    constructor() {
        console.log('Events constructor')
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