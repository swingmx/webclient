/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Google Cast SDK types
declare namespace cast {
  namespace framework {
    class CastContext {
      static getInstance(): CastContext
      setOptions(options: any): void
      requestSession(): Promise<void>
      getCurrentSession(): CastSession | null
      addEventListener(type: string, listener: (event: any) => void): void
      static readonly DEFAULT_MEDIA_RECEIVER_APP_ID: string
    }
    
    class CastSession {
      loadMedia(loadRequest: any): Promise<void>
      endSession(stopCasting: boolean): void
    }
    
    enum CastState {
      NO_DEVICES_AVAILABLE = 'NO_DEVICES_AVAILABLE',
      NOT_CONNECTED = 'NOT_CONNECTED',
      CONNECTING = 'CONNECTING',
      CONNECTED = 'CONNECTED'
    }
    
    enum AutoJoinPolicy {
      ORIGIN_SCOPED = 'ORIGIN_SCOPED'
    }
    
    enum CastContextEventType {
      CAST_STATE_CHANGED = 'caststatechanged'
    }
  }
}

declare namespace chrome.cast.media {
  class MediaInfo {
    constructor(contentId: string, contentType: string)
    metadata: any
  }
  
  class LoadRequest {
    constructor(mediaInfo: MediaInfo)
    autoplay: boolean
  }
  
  class MusicTrackMediaMetadata {
    title: string
    artist: string
    albumName: string
    images: Array<{url: string}>
  }
}

interface Window {
  cast: typeof cast
  chrome: {
    cast: {
      media: typeof chrome.cast.media
    }
  }
  __onGCastApiAvailable: (isAvailable: boolean) => void
}
