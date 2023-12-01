import { paths } from "@/config";
import useAxios from "./useAxios";

export async function getRecentlyAdded(limit: number) {
  const { data } = await useAxios({
    url: paths.api.home.recentlyAdded + "?limit=" + limit,
    get: true,
  });

  return data;
}
