import { ref } from "vue";
import { defineStore } from "pinia";

import useQueue from "./queue";
import useTracklist, { From } from "@/stores/queue/tracklist";
import { audio } from "./player";

import { FromOptions } from "@/enums";

function throttle(callback: CallableFunction, interval: number) {
  let enableCall = true;

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

export function sendLogData(trackhash: string, duration: number, from: From) {
  if (window.Worker) {
    const worker = new Worker("/workers/logtrack.js");

    const seconds = Math.round(duration / 1000);
    const source = getSource(from);
    worker.postMessage({ trackhash, duration: seconds, source });
  }
}

export default defineStore(
  "playTracker",
  () => {
    const duration = ref(0);
    const trackhash = ref("");
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
      console.log("resetting ...", duration);
      from.value = useTracklist().from;
      duration.value = 0;
      trackhash.value = queue.currenttrack.trackhash;
      prev_date = Date.now();
    }

    function updateDuration() {
      const now = Date.now();
      const diff = now - prev_date;

      if (diff > 1000) {
        return (prev_date = now);
      }

      duration.value += now - prev_date;
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
      sendLogData(trackhash.value, duration.value, from.value);
      resetData();
    }

    audio.addEventListener(
      "timeupdate",
      throttle(() => {
        if (audio.paused) {
          prev_date = 0;
        }

        if (queue.currenttrack.trackhash !== trackhash.value) {
          if (trackhash.value !== "" && duration.value > 1000 && can_submit) {
            lockSubmit();
            sendLogData(trackhash.value, duration.value, from.value);
          }

          resetData();
        }

        updateDuration();
      }, 500)
    );

    return {
      trackhash,
      duration,
      from,
      resetData,
      submitData,
      toggleLock: lockSubmit,
    };
  },
  {
    persist: true,
  }
);
