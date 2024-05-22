import Vibrant from "node-vibrant";
import listToRgbString from "./listToRgbString";

/**
 * Assigns values to the `colors.bg` and `colors.btn` properties in a store.
 *
 * @param {any} store - The store object to assign the color values to.
 * @param {string} img_url - The URL of the image to extract colors from.
 * @param {boolean} [btn_only=false] - If true, only assign the `colors.btn` property.
 */
export default (store: any, img_url: string, btn_only: boolean = false) => {
  const vibrant = new Vibrant(img_url);

  vibrant.getPalette().then((palette) => {
    store.colors.btn = listToRgbString(palette.LightVibrant?.getRgb()) || "";

    if (btn_only) return;
    store.colors.bg = listToRgbString(palette.DarkMuted?.getRgb()) || "";
  });
};
