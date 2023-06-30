export default function getComponentHeight(
  wrapperHeight: number,
  offset: number = 0
) {
  const paddings = 48;
  wrapperHeight += 64;

  return wrapperHeight / 2 < 150
    ? wrapperHeight + paddings
    : wrapperHeight / 2 - offset + paddings;
}
