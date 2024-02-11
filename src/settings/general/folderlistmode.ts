import { SettingType } from "../enums";
import { Setting } from "@/interfaces/settings";

import useSettings from "@/stores/settings";

const settings = useSettings;

const folder_list_mode: Setting = {
  title: "Display folders in list mode",
  type: SettingType.binary,
  state: () => settings().folder_list_mode,
  action: () => settings().toggleFolderListMode(),
};

export default [folder_list_mode];
