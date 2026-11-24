import { defineStore } from 'pinia'
import useUI from '@/stores/interface'
import { useT } from '@/i18n'

const { t } = useT()

export enum ModalOptions {
    newPlaylist,
    page,
    updatePlaylist,
    deletePlaylist,
    SetIP,
    rootDirsPrompt,
    setRootDirs,
    saveFolderAsPlaylist,
    login,
    settings,
    editArtist,
    mergeArtist,
}

export default defineStore('newModal', {
    state: () => ({
        title: '',
        subtitle: '',
        options: ModalOptions,
        component: <any>null,
        props: <any>{},
        visible: false,
    }),
    actions: {
        showModal(modalOption: ModalOptions, props: any = {}, title = '') {
            this.component = modalOption
            this.visible = true
            this.props = props
            if (title) this.setTitle(title)
        },
        showNewPlaylistModal(props: any = {}) {
            this.showModal(ModalOptions.newPlaylist, props)
        },
        showCollectionModal(props: any = {}) {
            this.showModal(ModalOptions.page, props)
        },
        showSaveFolderAsPlaylistModal(path: string) {
            const playlist_name = path.split('/').pop()
            const props = {
                playlist_name,
                path,
            }
            this.showModal(ModalOptions.newPlaylist, props)
        },
        showSaveArtistAsPlaylistModal(name: string, artisthash: string) {
            const props = {
                artisthash,
                playlist_name: t('Menus.Artist.ThisIsPlaylist', { artist: name }),
            }
            this.showModal(ModalOptions.newPlaylist, props)
        },
        showSaveQueueAsPlaylistModal(name: string) {
            const props = {
                is_queue: true,
                playlist_name: name,
            }
            this.showModal(ModalOptions.newPlaylist, props)
        },
        /**
         * Opens the artist editor, straight in the crop step when given an image.
         */
        showEditArtistModal(image: File | null = null) {
            this.showModal(ModalOptions.editArtist, { image })
        },
        /**
         * Opens the artist editor as a form for a new collective starting with `member`.
         */
        showNewCollectiveModal(member: { hash: string; name: string }) {
            this.showModal(ModalOptions.editArtist, { firstMember: member })
        },
        showMergeArtistModal(artisthash: string, artistname: string) {
            this.showModal(ModalOptions.mergeArtist, { artisthash, artistname }, t('Modal.MergeArtist.Title'))
        },
        /**
         * Opens the playlist editor, straight in the crop step when given an image.
         */
        showEditPlaylistModal(image: File | null = null) {
            this.showModal(ModalOptions.updatePlaylist, { image })
        },
        showDeletePlaylistModal(pid: number) {
            const props = {
                pid: pid,
            }
            this.showModal(ModalOptions.deletePlaylist, props, t('Modal.DeletePlaylistTitle'))
        },
        showSetIPModal() {
            this.showModal(ModalOptions.SetIP)
        },
        showRootDirsPromptModal() {
            this.showModal(ModalOptions.rootDirsPrompt, {}, t('RootDirsPrompt.WhereToLook'))
        },
        showSetRootDirsModal() {
            this.showModal(ModalOptions.setRootDirs, {}, t('Settings.RootDirs.Title'))
        },
        showLoginModal() {
            if (useUI().hideUI) {
                console.log('🙊 showLoginModal but hideUI is true')
                return
            }

            console.log('🙉 showLoginModal')
            this.showModal(ModalOptions.login)
        },
        showSettingsModal() {
            this.showModal(ModalOptions.settings)
        },
        hideModal() {
            this.visible = false
            this.setTitle('')
        },
        setTitle(new_title: string, subtitle = '') {
            this.title = new_title
            this.subtitle = subtitle
        },
        resetModal() {
            this.visible = false
            this.title = ''
            this.subtitle = ''
            this.props = {}
            this.component = null
        },
    },
})
