import { FetchProps } from "@/interfaces";
import axios, { AxiosError, AxiosResponse } from "axios";

import useLoaderStore from "@/stores/loader";

export default async (args: FetchProps) => {
  let data: any = null;
  let error: string | null = null;
  let status: number = 0;

  const on_ngrok = args.url.includes("ngrok");
  const ngrok_config = {
      "ngrok-skip-browser-warning": "stupid-SOAB!",
  };

  const { startLoading, stopLoading } = useLoaderStore();
  startLoading();

  try {
    const res = await axios({
      url: args.url,
      data: args.props,
      // INFO: Most requests use POST
      method: args.method || "POST",
      // INFO: Add ngrok header and provided headers
      headers: {...args.headers, ...on_ngrok ? ngrok_config : {}}
    })

    stopLoading();
    return {
      data: res.data,
      status: res.status
    }

  } catch (error: any) {
    stopLoading();
    return {
      error: error.message,
      status: error.response?.status
    }
  }

  // await getAxios()
  //   .then((res: AxiosResponse) => {
  //     data = res.data;
  //     status = res.status;
  //   })
  //   .catch((err: AxiosError) => {
  //     error = err.message as string;
  //     status = err.response?.status as number;
  //   })
  //   .then(() => stopLoading());

  // return { data, error, status };
};

// TODO: Set base url in axios config
