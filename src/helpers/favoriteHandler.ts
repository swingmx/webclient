import { addFavorite, removeFavorite } from "@/requests/favorite";
import useQueueStore from "@/stores/queue";
import { favType } from "../enums";
/**
 * Handles the favorite state of an item.
 * @param setter The ref to track the is_favorite state
 * @param type The type of item
 * @param itemhash The hash of the item
 */
export default async function favoriteHandler(
  flag: boolean | undefined,
  type: favType,
  itemhash: string,
  setter: (x?: unknown) => void,
  remover: (x?: unknown) => void
) {
  if (itemhash == "") return;

  const queue = useQueueStore();
  const is_current =
    type === favType.track && itemhash === queue.currenttrackhash;
  if (flag) {
    const removed = await removeFavorite(type, itemhash);
    if (removed) remover();
  } else {
    const added = await addFavorite(type, itemhash);
    if (added) setter();
  }

  if (is_current) {
    queue.toggleFav(queue.currentindex);
  }
}
