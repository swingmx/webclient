import { dropSources } from "@/enums";
import { Track } from "@/interfaces";

export function showDragStart(
  e: DragEvent,
  track: Track,
  oldIndex: number,
  source: dropSources = dropSources.folder
) {
  console.log("drag start");
  console.log(source);
  const dragDiv = document.getElementById("drag-img") as HTMLDivElement;
  dragDiv.innerText = track.title;
  e.dataTransfer?.setDragImage(dragDiv, -15, 0);

  // add track object to dataTransfer
  e.dataTransfer?.clearData();
  e.dataTransfer?.setData(
    "swing-track",
    JSON.stringify({ track, source, oldIndex })
  );
}

export function handleDrop(e: DragEvent, index: number, top: boolean) {
  const data = e.dataTransfer?.getData("swing-track");
  if (!data) return;

  const drop_data = JSON.parse(data) as {
    track: Track;
    oldIndex: number;
    source: dropSources;
  };
  console.log(drop_data);

  // find dropped index
  const newIndex = top ? index - 1 : index + 1;
  console.log(newIndex + 1);
  return { ...drop_data, newIndex };
}
