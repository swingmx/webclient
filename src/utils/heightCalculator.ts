export default function getComponentHeight(wrapperHeight: number) {
  return wrapperHeight / 2 < 150
    ? wrapperHeight + 46
    : (wrapperHeight - 5 * 16) / 2 + 46;
}
