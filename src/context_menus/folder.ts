import { Option } from "@/interfaces";
import * as icons from "@/icons";
import { separator } from "./utils";
import useSettingsStore from "@/stores/settings";
import { ContextSrc } from "@/enums";

export default async (trigger_src: ContextSrc) => {
  const settings = useSettingsStore();

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
    action: () => {
      () => {};
    },
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
