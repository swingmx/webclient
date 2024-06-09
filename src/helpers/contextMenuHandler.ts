import { Store } from "pinia";
import { Ref } from "vue";
import { useRoute } from "vue-router";

import { ContextSrc } from "@/enums";
import { Track } from "@/interfaces";
import useContextStore from "@/stores/context";

import albumContextItems from "@/context_menus/album";
import artistContextItems from "@/context_menus/artist";
import folderContextItems from "@/context_menus/folder";
import trackContextItems from "@/context_menus/track";
import queueContextItems from "@/context_menus/queue";

let stop_prev_watcher = () => {};

function flagWatcher(menu: Store, flag: Ref<boolean>) {
  stop_prev_watcher();

  if (flag.value) {
    return (flag.value = false);
  }

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
) => {
  const menu = useContextStore();
  const options = () => trackContextItems(track);

  menu.showContextMenu(e, options, ContextSrc.Track);

  flagWatcher(menu, flag);
};

export const showAlbumContextMenu = (e: MouseEvent, flag: Ref<boolean>) => {
  const menu = useContextStore();

  const options = () => albumContextItems();
  menu.showContextMenu(e, options, ContextSrc.AlbumHeader);

  flagWatcher(menu, flag);
};

export const showFolderContextMenu = (
  e: MouseEvent,
  flag: Ref<boolean>,
  source: ContextSrc,
  path: string
) => {
  const menu = useContextStore();

  const options = () => folderContextItems(path);
  menu.showContextMenu(e, options, source);

  flagWatcher(menu, flag);
};

export const showArtistContextMenu = (
  e: MouseEvent,
  flag: Ref<boolean>,
  artisthash: string,
  artistname: string
) => {
  const menu = useContextStore();

  const options = () => artistContextItems(artisthash, artistname);
  menu.showContextMenu(e, options, ContextSrc.ArtistHeader);

  flagWatcher(menu, flag);
};

export const showQueueContextMenu = (e: MouseEvent, flag: Ref<boolean>) => {
  const menu = useContextStore();

  const options = () => queueContextItems();
  menu.showContextMenu(e, options, ContextSrc.Queue);

  flagWatcher(menu, flag);
};
