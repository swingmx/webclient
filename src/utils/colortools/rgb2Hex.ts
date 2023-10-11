function rgbToArray(rgb: string): number[] | null {
  try {
    return rgb.match(/\d+/g)!.map(Number);
  } catch (error) {
    return null;
  }
}

export default function rgb2Hex(rgb: string): string {
  if (rgb.startsWith("#")) return rgb;
  const rgb_array = rgbToArray(rgb);

  if (!rgb_array) return "";

  const [r, g, b] = rgb_array;

  const toHex = (num: number) => {
    const hex = num.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
