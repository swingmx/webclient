let eventSource = null
let reconnectTimer = null
let reconnectDelay = 1000
let maxReconnectDelay = 30000
let reconnectAttempts = 0
let maxReconnectAttempts = 10
let isConnected = false

const is_dev = location.port === '5173'
const protocol = location.protocol.replace(':', '')
const base_url = is_dev ? `${protocol}://${location.hostname}:1980` : location.origin
const sse_url = base_url + '/events/stream'

function connect() {
    console.log('connect called')
    if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
        return
    }

    try {
        eventSource = new EventSource(sse_url, {
            withCredentials: true,
        })
        console.log('eventSource created')

        eventSource.onopen = function (event) {
            isConnected = true
            reconnectAttempts = 0
            reconnectDelay = 1000

            postMessage({
                type: 'connection',
                status: 'connected',
                timestamp: Date.now(),
            })
        }

        eventSource.onmessage = function (event) {
            try {
                postMessage({
                    type: 'message',
                    data: JSON.parse(event.data),
                    timestamp: Date.now(),
                })
            } catch (error) {
                postMessage({
                    type: 'error',
                    error: 'Failed to parse message data',
                    rawData: event.data,
                    timestamp: Date.now(),
                })
            }
        }

        eventSource.onerror = function (event) {
            isConnected = false

            postMessage({
                type: 'connection',
                status: 'error',
                readyState: eventSource.readyState,
                timestamp: Date.now(),
            })

            if (eventSource.readyState === EventSource.CLOSED) {
                scheduleReconnect()
            }
        }
    } catch (error) {
        console.log('Failed to create EventSource', error)
        postMessage({
            type: 'error',
            error: 'Failed to create EventSource',
            message: error.message,
            timestamp: Date.now(),
        })
        scheduleReconnect()
    }
}

function scheduleReconnect() {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer)
    }

    if (reconnectAttempts >= maxReconnectAttempts) {
        postMessage({
            type: 'connection',
            status: 'max_reconnect_attempts_reached',
            attempts: reconnectAttempts,
            timestamp: Date.now(),
        })
        return
    }

    postMessage({
        type: 'connection',
        status: 'reconnecting',
        delay: reconnectDelay,
        attempt: reconnectAttempts + 1,
        timestamp: Date.now(),
    })

    reconnectTimer = setTimeout(() => {
        reconnectAttempts++
        connect()
        reconnectDelay = Math.min(reconnectDelay * 2, maxReconnectDelay)
    }, reconnectDelay)
}

function disconnect() {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer)
        reconnectTimer = null
    }

    if (eventSource) {
        eventSource.close()
        eventSource = null
    }

    isConnected = false
    reconnectAttempts = 0
    reconnectDelay = 1000

    postMessage({
        type: 'connection',
        status: 'disconnected',
        timestamp: Date.now(),
    })
}

function getConnectionStatus() {
    postMessage({
        type: 'status',
        connected: isConnected,
        readyState: eventSource ? eventSource.readyState : null,
        reconnectAttempts: reconnectAttempts,
        timestamp: Date.now(),
    })
}

onmessage = function (e) {
    const { command, options } = e.data
    console.log('command', command)
    console.log('options', options)

    switch (command) {
        case 'connect':
            if (options && options.maxReconnectAttempts !== undefined) {
                maxReconnectAttempts = options.maxReconnectAttempts
            }
            if (options && options.reconnectDelay !== undefined) {
                reconnectDelay = options.reconnectDelay
            }
            if (options && options.maxReconnectDelay !== undefined) {
                maxReconnectDelay = options.maxReconnectDelay
            }
            connect()
            break

        case 'disconnect':
            disconnect()
            break

        case 'status':
            getConnectionStatus()
            break

        case 'retry':
            if (!isConnected) {
                reconnectAttempts = 0
                reconnectDelay = 1000
                connect()
            }
            break

        default:
            postMessage({
                type: 'error',
                error: 'Unknown command',
                command: command,
                timestamp: Date.now(),
            })
    }
}

self.addEventListener('online', function () {
    postMessage({
        type: 'network',
        status: 'online',
        timestamp: Date.now(),
    })

    if (!isConnected) {
        reconnectAttempts = 0
        reconnectDelay = 1000
        connect()
    }
})

self.addEventListener('offline', function () {
    postMessage({
        type: 'network',
        status: 'offline',
        timestamp: Date.now(),
    })
})
