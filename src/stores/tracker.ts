import { ref } from "vue";
import { defineStore } from "pinia";

import useQueue from "./queue";
import { audio } from "./player";
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

function getSource(source: From) {
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
    default:
      return "";
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
      setTimestamp();
      prevKey.value = key.value;
    }

    function setTimestamp() {
      timestamp.value = Math.floor(Date.now() / 1000);
    }

    function reassignEventListener() {
      if (trackhash.value == "") {
        trackhash.value = queue.currenttrackhash;
      }

      audio.addEventListener(
        "timeupdate",
        throttle(() => {
          if (audio.paused) {
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
      setTimestamp,
      reassignEventListener,
      changeKey,
      resetData,
    };
  },
  {
    persist: true,
  }
);
