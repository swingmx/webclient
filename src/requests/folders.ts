import { paths } from "@/config";
import { Folder, Track } from "@/interfaces";
import useAxios from "./useAxios";

export async function getFiles(path: string, tracks_only = false) {
  interface FolderData {
    tracks: Track[];
    folders: Folder[];
    path: string;
  }

  const { data, error } = await useAxios({
    url: paths.api.folder.base,
    props: {
      folder: path,
      tracks_only: tracks_only,
    },
  });

  if (error) {
    console.error(error);
  }

  if (data) {
    return data as FolderData;
  }

  return <FolderData>{
    path: "",
    tracks: [],
    folders: [],
  };
}

export async function openInFiles(path: string) {
  const { error } = await useAxios({
    url: paths.api.folder.showInFiles + `?path=${path}`,
    method: "GET",
  });

  if (error) {
    console.error(error);
  }
}

export async function getTracksInPath(path: string) {
  const { data, error } = await useAxios({
    url: paths.api.folder.base + "/tracks/all" + `?path=${path}`,
    method: "GET",
  });

  if (error) {
    console.error(error);
  }

  if (data) {
    return data.tracks as Track[];
  }

  return <Track[]>[];
}
