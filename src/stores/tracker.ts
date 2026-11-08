import { ref } from "vue";
import { defineStore } from "pinia";

import useQueue from "./queue";
import { audioSource } from "./player";
import { FromOptions } from "@/enums";
import useTracklist, { From } from "@/stores/queue/tracklist";

let enableCall = true;
let throttleTimeout: number = 1000;

function throttle(
  callback: CallableFunction,
  interval: number = throttleTimeout
) {
  return function (...args: any[]) {
    if (!enableCall) return;
    enableCall = false;

    // @ts-ignore
    callback.apply(this, args);
    setTimeout(() => (enableCall = true), interval);
  };
}

export function getSource(source: From) {
  switch (source.type) {
    case FromOptions.album:
      return `al:${source.albumhash}`;
    case FromOptions.artist:
      return `ar:${source.artisthash}`;
    case FromOptions.folder:
      return `fo:${source.path}`;
    case FromOptions.playlist:
      return `pl:${source.id}`;
    case FromOptions.search:
      return `q:${source.query}`;
    case FromOptions.favorite:
      return `favorite`;
    case FromOptions.mix:
      return `mix:${source.mixid}.${source.sourcehash}`;
    case FromOptions.work:
      return `wk:${source.workhash}`;
    default:
      return "";
  }
}

export type SourceInfo = {
  name?: string;
  image?: { type: "mix" | "track"; image: string };
};

// The inverse of getSource, with display data from the server.
export function fromSource(source: string, info: SourceInfo, albumhash = ""): From {
  const i = source.indexOf(":");
  const kind = i < 0 ? source : source.slice(0, i);
  const value = source.slice(i + 1);
  const name = info.name ?? "";

  switch (kind) {
    case "al":
      return { type: FromOptions.album, name, albumhash: value };
    case "ar":
      return { type: FromOptions.artist, artistname: name, artisthash: value };
    case "fo":
      return { type: FromOptions.folder, name, path: value };
    case "pl":
      return { type: FromOptions.playlist, name, id: Number(value) };
    case "q":
      return { type: FromOptions.search, query: value };
    case "favorite":
      return { type: FromOptions.favorite };
    case "wk":
      return { type: FromOptions.work, name, workhash: value, albumhash };
    case "mix": {
      const dot = value.lastIndexOf(".");
      return {
        type: FromOptions.mix,
        name,
        mixid: value.slice(0, dot),
        sourcehash: value.slice(dot + 1),
        image: info.image ?? { type: "track", image: "" },
      };
    }
    default:
      return {} as From;
  }
}

export function sendLogData(
  trackhash: string,
  duration: number,
  from: From,
  timestamp: number
) {
  if (window.Worker) {
    const worker = new Worker("/workers/logtrack.js");

    const seconds = Math.round(duration / 1000);
    const source = getSource(from);
    worker.postMessage({ trackhash, duration: seconds, source, timestamp });
  }
}

export default defineStore(
  "playTracker",
  () => {
    const duration = ref(0);
    const trackhash = ref("");
    const timestamp = ref(0);

    const key = ref(0);
    const prevKey = ref(0);

    // @ts-ignore
    const from = ref({
      type: null,
      path: "",
      name: "",
    } as From);

    let prev_date = 0;
    let can_submit = true;

    const queue = useQueue();

    function resetData() {
      from.value = useTracklist().from;
      duration.value = 0;
      trackhash.value = queue.currenttrack.trackhash;
      prev_date = Date.now();
      timestamp.value = 0;
    }

    function updateDuration() {
      const now = Date.now();
      const diff = now - prev_date;

      if (diff > throttleTimeout * 1.75) {
        return (prev_date = now);
      }

      duration.value += diff;
      prev_date = now;
      timestamp.value = Math.floor(now / 1000);
    }

    function lockSubmit() {
      can_submit = false;

      setTimeout(() => {
        can_submit = true;
      }, 1000);
    }

    function submitData() {
      if (!can_submit) return;
      lockSubmit();
      sendLogData(trackhash.value, duration.value, from.value, timestamp.value);
      resetData();
      prevKey.value = key.value;
    }

    function reassignEventListener() {
      if (trackhash.value == "") {
        trackhash.value = queue.currenttrackhash;
      }

      audioSource.playingSource.addEventListener(
        "timeupdate",
        throttle(() => {
          if (audioSource.playingSource.paused) {
            prev_date = 0;
          }

          if (
            key.value !== prevKey.value &&
            trackhash.value !== "" &&
            duration.value > 1000 &&
            can_submit
          ) {
            submitData();
          }

          updateDuration();
        })
      );
    }

    function changeKey() {
      prevKey.value = key.value;
      key.value = Math.random();
    }

    return {
      trackhash,
      timestamp,
      duration,
      from,
      key,
      prevKey,
      submitData,
      reassignEventListener,
      changeKey,
      resetData,
    };
  },
  {
    persist: true,
  }
);
