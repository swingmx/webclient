import { paths } from "@/config";
import useAxios from "../useAxios";

export const pluginSetActive = async (plugin: string, active: boolean) => {
  const { data } = await useAxios({
    url: paths.api.plugins + "/setactive",
    props: {
      plugin,
      active,
    },
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
