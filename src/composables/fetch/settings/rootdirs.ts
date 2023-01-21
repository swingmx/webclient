import useAxios from "../useAxios";
import { paths } from "@/config";
import { NotifType, useNotifStore } from "@/stores/notification";
import { Folder } from "@/interfaces";

const { add_root_dir, get_root_dirs, remove_root_dir } = paths.api.settings;

export async function getRootDirs() {
  const { data, error } = await useAxios({
    url: get_root_dirs,
    get: true,
  });

  if (error) {
    return [];
  }

  return data.dirs as string[];
}

export async function addRootDirs(new_dirs: string[], removed: string[]) {
  const { error } = await useAxios({
    url: add_root_dir,
    props: { new_dirs, removed },
  });

  if (error) {
    useNotifStore().showNotification("Error adding root dirs", NotifType.Error);
    return;
  }

  useNotifStore().showNotification(
    "Root directories configured",
    NotifType.Success
  );
}

export async function removeRootDirs(dirs: string[]) {
  const { error } = await useAxios({
    url: remove_root_dir,
    props: { dirs },
  });

  if (error) {
    useNotifStore().showNotification(
      "Error removing root dirs",
      NotifType.Error
    );
  }
}

export async function getFolders(folder: string = "$home") {
  const { data, error } = await useAxios({
    url: paths.api.dir_browser,
    props: {
      folder,
    },
  });

  if (error) {
    return [];
  }

  return data.folders as Folder[];
}
