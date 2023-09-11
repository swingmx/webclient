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

    let ctrlKey = e.ctrlKey;
    const shiftKey = e.shiftKey;

    const selection = window.getSelection()?.toString();

    function FocusedOnInput(target: HTMLElement) {
      const targett = target as HTMLInputElement;

      return (
        (targett.tagName === "INPUT" && targett.type === "search") ||
        targett.tagName === "TEXTAREA"
      );
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
          if (shiftKey && selection) return;
          if (shiftKey) {
            e.preventDefault();
            q.seek(q.duration.current + 10);
            return;
          }

          setTimeout(() => {
            // fire event after 1 second
            key_down_fired = false;
          }, 1000);

          q.playNext();
        }
        break;

      case "ArrowLeft":
        {
          if (shiftKey && selection) return;
          if (shiftKey) {
            e.preventDefault();
            q.seek(q.duration.current - 10);
            return;
          }

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
        break;
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
