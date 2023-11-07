import { paths } from "@/config";
import useAxios from "../useAxios";

export const pluginSetActive = async (plugin: string, state: number) => {
  const { data } = await useAxios({
    url: paths.api.plugins + `/setactive?plugin=${plugin}&state=${state}`,
    get: true,
  });

  return data;
};

export async function updatePluginSettings(plugin: string, settings: any) {
  const { data } = await useAxios({
    url: paths.api.plugins + "/settings",
    props: {
      plugin,
      settings,
    },
  });

  return data;
}
