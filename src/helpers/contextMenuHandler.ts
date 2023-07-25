import { Ref } from "vue";
import { Store } from "pinia";
import { useRoute } from "vue-router";

import useContextStore from "@/stores/context";

import { Track } from "@/interfaces";
import { ContextSrc } from "@/enums";

import albumContextItems from "@/context_menus/album";
import trackContext from "@/context_menus/track";
import folderContextMenu from "@/context_menus/folder";

let prev_track = "";
let stop_prev_watcher = () => {};

function flagWatcher(menu: Store, flag: Ref<boolean>) {
  stop_prev_watcher();

  // watch for context menu visibility and reset flag
  stop_prev_watcher = menu.$subscribe((mutation, state) => {
    //@ts-ignore
    flag.value = state.visible;
  });
}

export const showTrackContextMenu = (
  e: MouseEvent,
  track: Track,
  flag: Ref<boolean>,
  route: ReturnType<typeof useRoute>,
  on_playlist = false
) => {
  const menu = useContextStore();
  const options = () => trackContext(track, route, on_playlist);

  menu.showContextMenu(e, options, ContextSrc.Track);

  stop_prev_watcher();
  // 👇 this block updates the flag on visibility change 😂
  if (prev_track !== track.filepath) {
    prev_track = track.filepath || "";
    flagWatcher(menu, flag);
  }
};

export const showAlbumContextMenu = (e: MouseEvent, flag: Ref<boolean>) => {
  const menu = useContextStore();

  const options = () => albumContextItems();
  menu.showContextMenu(e, options, ContextSrc.AHeader);

  flagWatcher(menu, flag);
};

export const showFolderContextMenu = (e: MouseEvent, flag: Ref<boolean>) => {
  const menu = useContextStore();

  const options = () => folderContextMenu();
  menu.showContextMenu(e, options, ContextSrc.Folder);

  flagWatcher(menu, flag);
};
