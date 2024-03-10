import { paths } from "@/config";
import useAxios from "./useAxios";

export async function fetchAlbumColor(
  albumhash: string | undefined
): Promise<string> {
  const { data } = await useAxios({
    url: paths.api.colors.album + `/${albumhash}`,
    method: "GET",
  });


  return data.color;
}
