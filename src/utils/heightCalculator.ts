export default function getComponentHeight(wrapperHeight: number) {
  return wrapperHeight / 2 < 150
    ? wrapperHeight + 50
    : (wrapperHeight - 5 * 16) / 2 + 64;
}
