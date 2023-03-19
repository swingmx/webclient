import useAxios from "./useAxios";
import { paths } from "@/config";

export async function fetchAlbumColor(
  albumhash: string | undefined
): Promise<string> {
  const { data } = await useAxios({
    url: paths.api.colors.album + `/${albumhash}`,
    get: true,
  });


  return data.color;
}
