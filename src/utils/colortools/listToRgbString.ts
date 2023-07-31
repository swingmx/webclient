export default (list: number[] | undefined) => {
  list = list?.map((n) => Math.round(n));
  return list ? `rgb(${list.join(",")})` : "";
};
