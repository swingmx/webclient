export default (title: string) => {
  const base = "Swing Music";

  if (title) {
    document.title = `${title} | ${base}`;
  } else {
    document.title = base;
  }
};
