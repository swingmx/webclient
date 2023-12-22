import { paths } from "@/config";
import useAxios from "./useAxios";

export default async function getSilence(filepath: string) {
  const { data } = await useAxios({
    url: paths.api.files + "/silence",
    props: {
      filepath,
    },
  });

  return data;
}
