
// @ts-ignore
import { colorShift, brightness } from "@nextcss/color-tools";
import rgb2Hex from "./rgb2Hex";

/**
 * Shifts a color by a multiplier to get a lighter or darker color.
 * @param color rgb color
 * @param multipliers Two multipliers for the shift. First one is used when the color is light (positive), and the other when color is dark (negative)
 */
export function getShift(color: string, multipliers: number[]) {
  if (!color) return "";

  color = rgb2Hex(color);
  const is_light = brightness(color) > 50;

  return is_light
    ? colorShift(color, multipliers[0])
    : colorShift(color, multipliers[1]);
}

export function getTextColor(color: string) {
  return getShift(color, [80, -80]);
}

export function getBackgroundColor(color: string) {
  return getShift(color, [-50, 50]);
}

// TODO: Support more levels of brightness. ie. slightly light, light, slightly dark, dark
export function addOpacity(rgbString: string, opacity = 1) {
  // Remove spaces and match RGB values
  const rgbValues = rgbString.replace(/\s/g, '').match(/^rgb\((\d+),(\d+),(\d+)\)$/);
  
  if (!rgbValues) {
      throw new Error('Invalid RGB string format. Expected format: rgb(r,g,b)');
  }
  
  // Convert opacity to a value between 0 and 1
  const validOpacity = Math.max(0, Math.min(1, opacity));
  
  return `rgba(${rgbValues[1]}, ${rgbValues[2]}, ${rgbValues[3]}, ${validOpacity})`;
}