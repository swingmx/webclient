import { defineStore } from "pinia";

export enum ModalOptions {
  newPlaylist,
  updatePlaylist,
  deletePlaylist,
  SetIP,
  rootDirsPrompt,
  setRootDirs,
  saveFolderAsPlaylist,
  login,
  settings
}

export default defineStore("newModal", {
  state: () => ({
    title: "",
    options: ModalOptions,
    component: <any>null,
    props: <any>{},
    visible: false,
  }),
  actions: {
    showModal(modalOption: ModalOptions, props: any = {}) {
      this.component = modalOption;
      this.visible = true;
      this.props = props;
    },
    showNewPlaylistModal(props: any = {}) {
      this.showModal(ModalOptions.newPlaylist, props);
    },
    showSaveFolderAsPlaylistModal(path: string) {
      const playlist_name = path.split("/").pop();
      const props = {
        playlist_name,
        path,
      };
      this.showModal(ModalOptions.newPlaylist, props);
    },
    showSaveArtistAsPlaylistModal(name: string, artisthash: string) {
      const props = {
        artisthash,
        playlist_name: `This is ${name}`,
      };
      this.showModal(ModalOptions.newPlaylist, props);
    },
    showSaveQueueAsPlaylistModal(name: string) {
      const props = {
        is_queue: true,
        playlist_name: name,
      };
      this.showModal(ModalOptions.newPlaylist, props);
    },
    showEditPlaylistModal() {
      this.showModal(ModalOptions.updatePlaylist);
    },
    showDeletePlaylistModal(pid: number) {
      const props = {
        pid: pid,
      };
      this.showModal(ModalOptions.deletePlaylist, props);
    },
    showSetIPModal() {
      this.showModal(ModalOptions.SetIP);
    },
    showRootDirsPromptModal() {
      this.showModal(ModalOptions.rootDirsPrompt);
    },
    showSetRootDirsModal() {
      this.showModal(ModalOptions.setRootDirs);
    },
    showLoginModal(){
      this.showModal(ModalOptions.login);
    },
    showSettingsModal(){
      this.showModal(ModalOptions.settings);
    },
    hideModal() {
      this.visible = false;
      this.setTitle("");
    },
    setTitle(new_title: string) {
      this.title = new_title;
    },
  },
});
