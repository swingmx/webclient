import { defineStore } from "pinia";
import Vibrant from "node-vibrant";
import listToRgbString from "@/utils/colortools/listToRgbString";

async function getImageColor(url: string) {
  const vibrant = new Vibrant(url);

  const palette = await vibrant.getPalette();
  const lightvibrant = listToRgbString(palette.LightVibrant?.getRgb()) || "";

  return { lightvibrant };
}

export default defineStore("SwingMusicColors", {
  state: () => ({
    theme1: "",
    theme2: "",
  }),
  actions: {
    async setTheme1Color(url: string) {
      const { lightvibrant } = await getImageColor(url);
      this.theme1 = lightvibrant;
    },
  },
  persist: true,
});
