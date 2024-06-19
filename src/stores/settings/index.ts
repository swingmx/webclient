import { defineStore } from 'pinia'

import { xxl } from '@/composables/useBreakpoints'
import { DBSettings, contextChildrenShowMode } from '@/enums'
import { pluginSetActive, updatePluginSettings } from '@/requests/plugins'

import { usePlayer } from '@/stores/player'
import { content_width } from '../content-width'

export default defineStore('settings', {
    state: () => ({
        version: '',
        use_np_img: true,
        use_sidebar: false,
        extend_width: false,
        contextChildrenShowMode: contextChildrenShowMode.hover,
        artist_top_tracks_count: 5,
        repeat_all: true,
        repeat_one: false,
        root_dir_set: false,
        root_dirs: <string[]>[],
        folder_list_mode: false,
        volume: 1.0,
        mute: false,

        feat: true,
        prodby: true,
        clean_titles: true,
        hide_remaster: true,
        merge_albums: false,
        show_albums_as_singles: false,
        separators: <string[]>[],

        // client
        useCircularArtistImg: true,

        // plugins
        use_lyrics_plugin: <boolean | undefined>false,
        lyrics_plugin_settings: {
            auto_download: false,
            overide_unsynced: false,
        },

        // audio
        use_silence_skip: true,
        use_crossfade: false,
        crossfade_duration: 2000, // milliseconds
        use_legacy_streaming_endpoint: false,

        // layout
        layout: '',
    }),
    actions: {
        mapDbSettings(settings: DBSettings) {
            this.version = settings.version
            this.root_dirs = settings.root_dirs
            this.feat = settings.extract_feat
            this.prodby = settings.remove_prod
            this.clean_titles = settings.clean_album_title
            this.hide_remaster = settings.remove_remaster
            this.merge_albums = settings.merge_albums
            this.separators = settings.artist_separators
            this.show_albums_as_singles = settings.show_albums_as_singles

            this.use_lyrics_plugin = settings.plugins.find(p => p.name === 'lyrics_finder')?.active

            if (this.use_lyrics_plugin) {
                this.lyrics_plugin_settings = settings.plugins.find(p => p.name === 'lyrics_finder')?.settings
            }
        },
        setArtistSeparators(separators: string[]) {
            this.separators = separators
        },
        // now playing 👇
        toggleUseNPImg() {
            this.use_np_img = !this.use_np_img
        },
        // sidebar 👇
        toggleDisableSidebar() {
            if (this.is_alt_layout) {
                this.use_sidebar = false
                return
            }

            this.use_sidebar = !this.use_sidebar
        },
        toggleExtendWidth() {
            this.extend_width = !this.extend_width
        },
        // context menu 👇
        setContextChildrenShowMode(mode: contextChildrenShowMode) {
            this.contextChildrenShowMode = mode
        },
        toggleContextChildrenShowMode() {
            this.contextChildrenShowMode =
                this.contextChildrenShowMode === contextChildrenShowMode.click
                    ? contextChildrenShowMode.hover
                    : contextChildrenShowMode.click
        },
        // repeat 👇
        toggleRepeatMode() {
            if (this.repeat_all) {
                this.repeat_all = false
                this.repeat_one = true
                return
            }

            if (this.repeat_one) {
                this.repeat_one = false
                this.repeat_all = false
                return
            }

            if (!this.repeat_all && !this.repeat_one) {
                this.repeat_all = true
            }
        },
        // root dirs 👇
        toggleRootDirSet() {
            this.root_dir_set = !this.root_dir_set
        },
        setRootDirs(dirs: string[]) {
            this.root_dirs = dirs
        },
        // folders 👇
        toggleFolderListMode() {
            this.folder_list_mode = !this.folder_list_mode
        },
        // titles 👇
        toggleProcessFeaturedArtists() {
            this.feat = !this.feat
        },
        toggleRemoveProdBy() {
            this.prodby = !this.prodby
        },
        toggleCleanTrackTitles() {
            this.clean_titles = !this.clean_titles
        },
        toggleRemoveRemasterInfoFromTitles() {
            this.hide_remaster = !this.hide_remaster
        },
        toggleMergeAlbumVersions() {
            this.merge_albums = !this.merge_albums
        },
        toggleShowAlbumAsSingle() {
            this.show_albums_as_singles = !this.show_albums_as_singles
        },
        // volume 👇
        setVolume(new_value: number) {
            const { setVolume } = usePlayer()

            setVolume(new_value)
            this.volume = new_value
        },
        toggleMute() {
            this.mute = !this.mute
            const { setMute } = usePlayer()
            setMute(this.mute)
        },
        initializeVolume() {
            const { setVolume, setMute } = usePlayer()
            setVolume(this.volume)
            setMute(this.mute)
        },
        toggleUseCircularArtistImg() {
            this.useCircularArtistImg = !this.useCircularArtistImg
        },
        toggleLyricsPlugin() {
            pluginSetActive('lyrics_finder', !this.use_lyrics_plugin).then(() => {
                this.use_lyrics_plugin = !this.use_lyrics_plugin
            })
        },
        toggleLyricsAutoDownload() {
            const state = this.lyrics_plugin_settings.auto_download ? false : true

            updatePluginSettings('lyrics_finder', {
                ...this.lyrics_plugin_settings,
                auto_download: state,
            }).then(() => {
                this.lyrics_plugin_settings.auto_download = state
            })
        },
        toggleLyricsOverideUnsynced() {
            const state = this.lyrics_plugin_settings.overide_unsynced ? false : true

            updatePluginSettings('lyrics_finder', {
                ...this.lyrics_plugin_settings,
                overide_unsynced: state,
            }).then(() => {
                this.lyrics_plugin_settings.overide_unsynced = state
            })
        },
        // audio 👇
        toggleUseSilenceSkip() {
            this.use_silence_skip = !this.use_silence_skip
        },
        toggleCrossfade() {
            this.use_crossfade = !this.use_crossfade
        },
        setCrossfadeDuration(duration: number) {
            this.crossfade_duration = duration * 1000
        },

        toggleUseLegacyStreamingEndpoint() {
            this.use_legacy_streaming_endpoint = !this.use_legacy_streaming_endpoint
        },

        // layout 👇
        toggleLayout() {
            if (this.layout == '') {
                this.layout = 'alternate'
                this.use_sidebar = false
                this.use_np_img = false
                return
            }

            this.layout = ''
            this.use_np_img = true
        },
    },
    getters: {
        can_extend_width(): boolean {
            return this.is_default_layout && xxl.value
        },
        no_repeat(): boolean {
            return !this.repeat_all && !this.repeat_one
        },
        crossfade_duration_seconds(): number {
            return this.crossfade_duration / 1000
        },
        crossfade_on(): boolean {
            return this.use_crossfade && this.crossfade_duration > 0
        },
        is_default_layout: state => state.layout === '',
        is_alt_layout: state => state.layout === 'alternate' && content_width.value > 900,
    },
    persist: {
        afterRestore: context => {
            let store = context.store
            store.root_dirs = []
            store.root_dir_set = false

            // reset plugin settings
            store.use_lyrics_plugin = false
            store.lyrics_plugin_settings = {}
        },
    },
})
