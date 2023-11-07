import { FetchProps } from "@/interfaces";
import axios, { AxiosError, AxiosResponse } from "axios";

import useLoaderStore from "@/stores/loader";

export default async (args: FetchProps) => {
  let data: any = null;
  let error: string | null = null;
  let status: number = 0;

  const on_ngrok = args.url.includes("ngrok");
  const ngrok_config = {
    headers: {
      "ngrok-skip-browser-warning": "stupid-SOAB!",
    },
  };

  function getAxios() {
    if (args.get) {
      return axios.get(args.url, on_ngrok ? ngrok_config : {});
    }

    if (args.put) {
      return axios.put(args.url, args.props, on_ngrok ? ngrok_config : {});
    }

    return axios.post(args.url, args.props, on_ngrok ? ngrok_config : {});
  }

  const { startLoading, stopLoading } = useLoaderStore();
  startLoading();
  await getAxios()
    .then((res: AxiosResponse) => {
      data = res.data;
      status = res.status;
    })
    .catch((err: AxiosError) => {
      error = err.message as string;
      status = err.response?.status as number;
    })
    .then(() => stopLoading());

  return { data, error, status };
};

// TODO: Set base url in axios config
