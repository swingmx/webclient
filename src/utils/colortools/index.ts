import { brightness } from '@nextcss/color-tools'
import rgb2Hex from '@/utils/colortools/rgb2Hex'
import listToRgbString from '@/utils/colortools/listToRgbString'

function rgbToArray(rgb: string | null | undefined): number[] | null {
  if (!rgb || typeof rgb !== 'string') {
    return null;
  }
  try {
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) {
      return null;
    }
    return match.map(Number);
  } catch (error) {
    return null;
  }
}

export function getTypeColor(color: string) {
    const lightness = brightness(rgb2Hex(color))
    const is_light = lightness > 50
    return is_light ? 'rgb(109, 69, 16)' : '#ac8e68'
}

export function transitionColor(
  color1: string | null | undefined,
  color2: string | null | undefined,
  durationMs: number,
  onUpdate: (color: string) => void
): (() => void) | null {
  const startArray = rgbToArray(color1);
  const endArray = rgbToArray(color2);

  if (!startArray && !endArray) {
    return null;
  }

  if (!startArray) {
    if (color2) {
      onUpdate(color2);
    }
    return () => {};
  }

  if (!endArray) {
    if (color1) {
      onUpdate(color1);
    }
    return () => {};
  }

  if (startArray.length !== 3 || endArray.length !== 3) {
    throw new Error('Invalid RGB color format: colors must have exactly 3 components');
  }

  const startTime = performance.now();
  let animationFrameId: number | null = null;

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / durationMs, 1);

    const interpolated = startArray.map((start, index) => {
      const end = endArray[index];
      return start + (end - start) * progress;
    });

    const result = listToRgbString(interpolated);
    if (result) {
      onUpdate(result);
    }

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate);
    }
  };

  animationFrameId = requestAnimationFrame(animate);

  return () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}

