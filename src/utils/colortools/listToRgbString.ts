export default (list: number[] | undefined) => {
  return list ? `rgb(${list.join(",")})` : "";
};
