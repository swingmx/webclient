import useQStore from "@/stores/queue";
import useModalStore from "@/stores/modal";
import useContextStore from "@/stores/context";

let key_down_fired = false;

function focusPageSearchBox() {
  const elem = document.getElementById(
    "page-search-trigger"
  ) as HTMLButtonElement;
  if (elem) {
    elem.dispatchEvent(new MouseEvent("click", { bubbles: false }));
  }
}

export default function (queue: typeof useQStore, modal: typeof useModalStore) {
  const q = queue();

  window.addEventListener("keydown", (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (e.altKey) return;
    if (e.shiftKey) return;

    let ctrlKey = e.ctrlKey;

    function FocusedOnInput(target: HTMLElement) {
      return target.tagName === "INPUT" || target.tagName === "TEXTAREA";
    }

    if (FocusedOnInput(target)) {
      if (e.key == "Escape") {
        target.blur();
      }

      return;
    }

    if (key_down_fired) return;

    switch (e.key) {
      case "ArrowRight":
        {
          setTimeout(() => {
            key_down_fired = false;
          }, 1000);

          q.playNext();
        }
        break;

      case "ArrowLeft":
        {
          q.playPrev();

          setTimeout(() => {
            key_down_fired = false;
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
      }

      case "Escape": {
        const m = modal();
        const c = useContextStore();

        if (m.visible) {
          m.hideModal();
        }

        if (c.visible) {
          c.hideContextMenu();
        }
      }
    }

    key_down_fired = true;
  });
}

window.addEventListener("keyup", () => {
  key_down_fired = false;
});
