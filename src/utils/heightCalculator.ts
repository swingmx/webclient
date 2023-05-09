export default function getComponentHeight(wrapperHeight: number) {
  const paddings = 64;

  return wrapperHeight / 2 < 150
    ? wrapperHeight + paddings
    : (wrapperHeight - 5 * 16) / 2 + paddings;
}
