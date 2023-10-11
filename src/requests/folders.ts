import { paths } from "@/config";
import { Folder, Track } from "@/interfaces";
import useAxios from "./useAxios";

export async function getFiles(path: string) {
  interface FolderData {
    tracks: Track[];
    folders: Folder[];
  }

  const { data, error } = await useAxios({
    url: paths.api.folder.base,
    props: {
      folder: path,
    },
  });

  if (error) {
    console.error(error);
  }

  if (data) {
    return data as FolderData;
  }

  return <FolderData>{
    tracks: [],
    folders: [],
  };
}

export async function openInFiles(path: string) {
  const { error } = await useAxios({
    url: paths.api.folder.showInFiles + `?path=${path}`,
    get: true,
  });

  if (error) {
    console.error(error);
  }
}

export async function getTracksInPath(path: string) {
  const { data, error } = await useAxios({
    url: paths.api.folder.base + "/tracks/all" + `?path=${path}`,
    get: true,
  });

  if (error) {
    console.error(error);
  }

  if (data) {
    return data.tracks as Track[];
  }

  return <Track[]>[];
}
