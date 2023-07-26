import * as icons from "@/icons";
import { separator } from "./utils";
import { ContextSrc } from "@/enums";
import { Option } from "@/interfaces";

import useSettingsStore from "@/stores/settings";
import useModalStore from "@/stores/modal";

export default async (trigger_src: ContextSrc, path: string) => {
  const settings = useSettingsStore();
  const modal = useModalStore();

  const getListModeOption = () =>
    <Option>{
      label: settings.folder_list_mode ? "Grid Mode" : "List Mode",
      action: () => settings.toggleFolderListMode(),
      icon: settings.folder_list_mode ? icons.GridIcon : icons.PlaylistIcon,
    };

  // if trigger source is folder nav, show list mode option
  let items =
    trigger_src === ContextSrc.FolderNav
      ? [getListModeOption(), separator]
      : [];

  const play_next = <Option>{
    label: "Play next",
    action: () => {
      () => {};
    },
    icon: icons.PlayNextIcon,
  };

  const add_to_queue = <Option>{
    label: "Add to Queue",
    action: () => {
      () => {};
    },
    icon: icons.AddToQueueIcon,
  };

  const add_to_playlist = <Option>{
    label: "Add to Playlist",
    action: () => {
      () => {};
    },
    icon: icons.PlusIcon,
  };

  const save_as_playlist = <Option>{
    label: "Save as Playlist",
    action: () =>
      modal.showSaveFolderAsPlaylistModal(path),
    icon: icons.PlaylistIcon,
  };

  return [
    ...items,
    play_next,
    add_to_queue,
    separator,
    add_to_playlist,
    save_as_playlist,
  ];
};
