import { paths } from "@/config";
import useAxios from "./useAxios";

export async function getLyrics(filepath: string, trackhash: string) {
  const { data } = await useAxios({
    url: paths.api.lyrics,
    props: {
      filepath,
      trackhash,
    },
  });

  return data;
}

export const checkExists = async (filepath: string, trackhash: string) => {
  const { data } = await useAxios({
    url: paths.api.lyrics + "/check",
    props: {
      filepath,
      trackhash,
    },
  });

  return data;
};
