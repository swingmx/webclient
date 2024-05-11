import useQueue from "@/stores/queue";
import useModal from "@/stores/modal";
import useContextMenu from "@/stores/context";
import useSettings from "@/stores/settings";

let key_down_fired = "";

function focusPageSearchBox() {
  const elem = document.getElementById(
    "page-search-trigger"
  ) as HTMLButtonElement;
  if (elem) {
    elem.dispatchEvent(new MouseEvent("click", { bubbles: false }));
  }
}

function resetKeyFired() {
  key_down_fired = "";
}

export default function (queue: typeof useQueue, modal: typeof useModal) {
  const q = queue();

  window.addEventListener("keydown", (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;

    if (e.altKey) return;
    const ctrlKey = e.ctrlKey;
    const shiftKey = e.shiftKey;

    const no_text_selection = !window.getSelection()?.toString();

    function focusedOnInput() {
      const targett = target as HTMLInputElement;

      return (
        (targett.tagName === "INPUT" && targett.type !== "range") ||
        targett.tagName === "TEXTAREA"
      );
    }

    function triggerSeek() {
      if (shiftKey) return false;
      if (ctrlKey) return true;
    }

    if (focusedOnInput()) {
      if (e.key == "Escape") {
        target.blur();
      }

      return;
    }

    if (key_down_fired == e.key.toLowerCase()) {
      return;
    }

    function setKeyFired() {
      key_down_fired = e.key.toLowerCase();
    }

    switch (e.key.toLowerCase()) {
      case "arrowright":
        {
          const doSeek = triggerSeek();

          if (doSeek) {
            e.preventDefault();
            q.seek(q.duration.current + 10);
            return;
          }

          setTimeout(() => {
            // fire event after 1 second
            resetKeyFired();
          }, 1000);

          if (no_text_selection) {
            q.playNext();
          }
        }
        break;

      case "arrowleft":
        {
          const doSeek = triggerSeek();

          if (doSeek) {
            e.preventDefault();
            q.seek(q.duration.current - 10);
            return;
          }

          if (no_text_selection) {
            q.playPrev();
          }

          setTimeout(() => {
            resetKeyFired();
          }, 1000);
        }

        break;

      case " ": // space
        {
          e.preventDefault();
          q.playPause();
        }

        break;

      case "f": {
        if (!ctrlKey) return;
        e.preventDefault();
        focusPageSearchBox();
        break;
      }

      case "b": {
        if (!ctrlKey) return;
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();

        const { toggleDisableSidebar } = useSettings();
        toggleDisableSidebar();
        setKeyFired();
        break;
      }

      case "escape": {
        const m = modal();
        const c = useContextMenu();

        if (m.visible) {
          m.hideModal();
        }

        if (c.visible) {
          c.hideContextMenu();
        }
      }
    }

    setKeyFired();
  });
}

window.addEventListener("keyup", () => {
  resetKeyFired();
});
