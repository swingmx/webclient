export default (list: number[]) => {
  try {
    return `rgb(${list.join(",")})`;
  } catch (e) {
    return "";
  }
};
