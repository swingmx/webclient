import { paths } from "@/config";
import useAxios from "../useAxios";

export async function findLyrics(
  title: string,
  artist: string,
  filepath: string,
  album: string,
  trackhash: string
) {
  const { data } = await useAxios({
    url: paths.api.plugins + "/lyrics/search",
    props: {
      trackhash,
      title,
      artist,
      filepath,
      album,
    },
  });

  return data;
}

