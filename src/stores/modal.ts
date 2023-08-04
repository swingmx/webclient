import { defineStore } from "pinia";
import { Playlist, Track } from "../interfaces";
import { useRoute } from "vue-router";

enum ModalOptions {
  newPlaylist,
  updatePlaylist,
  welcome,
  deletePlaylist,
  SetIP,
  rootDirsPrompt,
  setRootDirs,
  saveFolderAsPlaylist,
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
    showNewPlaylistModal(track?: Track) {
      const props = track ? { track } : {};
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
    showSaveAlbumAsPlaylistModal(name: string, albumhash: string) {
      const props = {
        playlist_name: name,
        albumhash,
      };
      this.showModal(ModalOptions.newPlaylist, props);
    },
    showEditPlaylistModal() {
      this.showModal(ModalOptions.updatePlaylist);
    },
    showWelcomeModal() {
      this.showModal(ModalOptions.welcome);
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
    hideModal() {
      this.visible = false;
      this.setTitle("");
    },
    setTitle(new_title: string) {
      this.title = new_title;
    },
  },
});
