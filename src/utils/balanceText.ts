import { isSmallPhone } from "@/stores/content-width";

export function balanceText(
  text: string,
  container_width: number,
  font_size: string = "2.75rem"
) {
  if (isSmallPhone.value) return [text];

  const tempElem = document.createElement("span");
  tempElem.classList.add("balance-text-temp");
  tempElem.style.fontSize = font_size;
  tempElem.style.fontWeight = "700";
  tempElem.innerText = text;
  document.body.appendChild(tempElem);

  const tempWidth = tempElem.offsetWidth;

  document.body.removeChild(tempElem);

  const ratio = tempWidth / container_width;

  if (ratio < 0.9 || ratio > 1.75) {
    // text fits properly or overflows 2 lines.
    return [text];
  }

  const words = text.split(" ");
  const wordsPerLine = Math.ceil(words.length / 2);
  // TODO: use characters to determine if text should be split. Check if the middle word is too short or too long, and if so, split at the next word or previous.

  const firstLine = words.slice(0, wordsPerLine).join(" ");
  const secondLine = words.slice(wordsPerLine).join(" ");

  return [firstLine, secondLine];
}
