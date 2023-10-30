import { defineStore } from "pinia";
import Vibrant from "node-vibrant";
import listToRgbString from "@/utils/colortools/listToRgbString";

async function getImageColor(url: string) {
  const vibrant = new Vibrant(url);

  const palette = await vibrant.getPalette();
  const lightvibrant = listToRgbString(palette.LightVibrant?.getRgb()) || "";
  const darkvibrant = listToRgbString(palette.Muted?.getRgb()) || "";

  return { lightvibrant, darkvibrant };
}

export default defineStore("SwingMusicColors", {
  state: () => ({
    theme1: "",
    theme2: "",
  }),
  actions: {
    async setTheme1Color(url: string) {
      const { lightvibrant, darkvibrant} = await getImageColor(url);
      this.theme1 = lightvibrant;
      this.theme2 = darkvibrant 
    },
  },
  persist: true,
});
