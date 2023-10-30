import { paths } from "@/config";
import useAxios from "./useAxios";

export default async function getLyrics(filepath: string) {
  const { data } = await useAxios({
    url: paths.api.lyrics,
    props: {
      filepath,
    },
  });

  return data;
}
