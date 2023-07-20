import { Ref } from "vue";

import useModalStore from "@/stores/modal";
import useQueueStore from "@/stores/queue";
import useContextStore from "@/stores/context";

import { ContextSrc } from "./enums";
import { Track } from "@/interfaces";
import trackContext from "@/contexts/track_context";
import albumContextItems from "@/contexts/album";
import useAlbumStore from "@/stores/pages/album";

import { Store } from "pinia";
import { useRoute } from "vue-router";

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

  const options = () =>
    albumContextItems();
  menu.showContextMenu(e, options, ContextSrc.AHeader);

  flagWatcher(menu, flag);
};
