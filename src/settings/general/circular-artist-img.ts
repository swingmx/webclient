import { SettingType } from "../enums";
import { Setting } from "@/interfaces/settings";

import { isSmallPhone } from "@/stores/content-width";

import useSettingsStore from "@/stores/settings";

const settings = useSettingsStore;

export default <Setting>{
  title: "Simple artist page header",
  desc: "Disable the default gradient layout and use a simple circular image",
  type: SettingType.binary,
  state: () => settings().useCircularArtistImg,
  action: () => settings().toggleUseCircularArtistImg(),
  inactive: () => isSmallPhone.value,
  show_if: () => !isSmallPhone.value,
};
