import { paths } from "@/config";
import useAxios from "../useAxios";

export function logTrack(trackhash: string, duration: number) {
  const timestamp = Date.now();

  return useAxios({
    url: paths.api.logger.logTrack,
    props: { trackhash, duration, timestamp },
  });
}
