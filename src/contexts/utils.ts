import { Option, Track } from "@/interfaces";
import modal from "@/stores/modal";

export const separator: Option = {
  type: "separator",
};

export function get_new_playlist_option(
  modalStore: typeof modal,
  track?: Track
): Option {
  return {
    label: "New playlist",
    action: () => {
      modalStore().showNewPlaylistModal(track);
    },
  };
}
