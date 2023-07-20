import { Option, Track } from "@/interfaces";
import modal from "@/stores/modal";

export const separator: Option = {
  type: "separator",
};

export function get_new_playlist_option(
  track?: Track
): Option {
  return {
    label: "New playlist",
    action: () => {
      modal().showNewPlaylistModal(track);
    },
  };
}
