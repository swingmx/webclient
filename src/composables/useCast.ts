import { ref, computed } from 'vue'
import useQueueStore from '@/stores/queue'
import { useToast, NotifType } from '@/stores/notification'
import { paths } from '@/config'

const isConnected = ref(false)
const isConnecting = ref(false)
const castSession = ref<cast.framework.CastSession | null>(null)

export default function useCast() {
    const queue = useQueueStore()
    const toast = useToast()

    const isSupported = computed(() => {
        const supported = typeof window !== 'undefined' && 'cast' in window && 'framework' in window.cast
        console.log('Cast support check:', {
            hasWindow: typeof window !== 'undefined',
            hasCast: typeof window !== 'undefined' && 'cast' in window,
            hasFramework: typeof window !== 'undefined' && 'cast' in window && 'framework' in window.cast,
            supported
        })
        return supported
    })

    const canCast = computed(() => {
        return isSupported.value && queue.currenttrack && !isConnecting.value
    })

    function initCast() {
        console.log('initCast called, isSupported:', isSupported.value)
        
        // Always set up the API availability callback first
        window['__onGCastApiAvailable'] = (isAvailable: boolean) => {
            console.log('Cast API available callback:', isAvailable)
            if (isAvailable) {
                console.log('Cast API is now available, initializing...')
                initializeCastApi()
            } else {
                console.log('Cast API not available')
            }
        }

        // Try to load Cast SDK if it's not already loaded
        if (!window.cast) {
            console.log('Cast SDK not found, attempting to load dynamically...')
            loadCastSDK()
        } else if (window.cast && window.cast.framework) {
            console.log('Cast supported, initializing immediately')
            initializeCastApi()
        }
    }

    function loadCastSDK() {
        // Check if script already exists
        if (document.querySelector('script[src*="cast_sender.js"]')) {
            console.log('Cast SDK script already exists')
            return
        }

        console.log('Loading Cast SDK dynamically...')
        const script = document.createElement('script')
        script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'
        script.onload = () => {
            console.log('Cast SDK loaded dynamically')
        }
        script.onerror = () => {
            console.error('Failed to load Cast SDK dynamically')
            toast.showNotification('Cast SDK failed to load. Check your internet connection.', NotifType.Error)
        }
        document.head.appendChild(script)
    }

    function initializeCastApi() {
        console.log('initializeCastApi called')
        try {
            const context = cast.framework.CastContext.getInstance()
            console.log('CastContext obtained:', context)
            
            context.setOptions({
                receiverApplicationId: cast.framework.CastContext.DEFAULT_MEDIA_RECEIVER_APP_ID,
                autoJoinPolicy: cast.framework.AutoJoinPolicy.ORIGIN_SCOPED
            })
            console.log('Cast options set')

            context.addEventListener(cast.framework.CastContextEventType.CAST_STATE_CHANGED, (event) => {
                console.log('Cast state changed:', event.castState)
                switch (event.castState) {
                    case cast.framework.CastState.CONNECTED:
                        isConnected.value = true
                        isConnecting.value = false
                        castSession.value = context.getCurrentSession()
                        toast.showNotification('Connected to cast device', NotifType.Success)
                        break
                    case cast.framework.CastState.CONNECTING:
                        isConnecting.value = true
                        break
                    case cast.framework.CastState.NOT_CONNECTED:
                        isConnected.value = false
                        isConnecting.value = false
                        castSession.value = null
                        break
                }
            })
            console.log('Cast event listeners added')
        } catch (error) {
            console.error('Failed to initialize Cast API:', error)
        }
    }

    async function startCasting() {
        console.log('startCasting called')
        console.log('canCast:', canCast.value, 'window.cast:', !!window.cast)
        
        if (!canCast.value || !window.cast) {
            console.log('Cannot cast - either not supported or no current track')
            toast.showNotification('Cast not available', NotifType.Info)
            return
        }

        try {
            console.log('Requesting cast session...')
            const context = cast.framework.CastContext.getInstance()
            await context.requestSession()
            console.log('Cast session requested successfully')
            
            // Load current track
            if (queue.currenttrack && castSession.value) {
                console.log('Loading current track to cast device')
                loadCurrentTrack()
            }
        } catch (error) {
            isConnecting.value = false
            console.error('Cast request failed:', error)
            if (error.code === 'cancel') {
                console.log('User cancelled cast request')
                return
            }
            toast.showNotification('No cast devices found on your network', NotifType.Info)
        }
    }

    function loadCurrentTrack() {
        if (!castSession.value || !queue.currenttrack) return

        const track = queue.currenttrack
        const mediaInfo = new chrome.cast.media.MediaInfo(
            `${paths.api.files}/${track.trackhash}?filepath=${encodeURIComponent(track.filepath)}`,
            'audio/mpeg'
        )

        mediaInfo.metadata = new chrome.cast.media.MusicTrackMediaMetadata()
        mediaInfo.metadata.title = track.title
        mediaInfo.metadata.artist = track.artists.map(a => a.name).join(', ')
        mediaInfo.metadata.albumName = track.album
        
        if (track.image) {
            mediaInfo.metadata.images = [{
                url: paths.images.thumb.medium + track.image
            }]
        }

        const request = new chrome.cast.media.LoadRequest(mediaInfo)
        request.autoplay = queue.playing

        castSession.value.loadMedia(request)
            .then(() => {
                console.log('Media loaded successfully')
            })
            .catch((error) => {
                toast.showNotification('Failed to load media on cast device', NotifType.Error)
                console.error('Failed to load media:', error)
            })
    }

    function stopCasting() {
        if (!castSession.value) return

        try {
            castSession.value.endSession(true)
        } catch (error) {
            console.warn('Failed to stop casting:', error)
        }
    }

    function toggleCast() {
        console.log('toggleCast clicked! isConnected:', isConnected.value)
        if (isConnected.value) {
            console.log('Stopping cast...')
            stopCasting()
        } else {
            console.log('Starting cast...')
            startCasting()
        }
    }

    return {
        isSupported,
        canCast,
        isConnected,
        isConnecting,
        initCast,
        startCasting,
        stopCasting,
        toggleCast,
        loadCurrentTrack
    }
}