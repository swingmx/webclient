import { Option } from "@/interfaces";
import * as icons from "@/icons";
import { separator } from "./utils";

export default async () => {
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
    play_next,
    add_to_queue,
    separator,
    add_to_playlist,
    save_as_playlist,
  ];
};
