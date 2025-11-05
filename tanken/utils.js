// utils
const toNum = (v) => (v ? parseFloat(v.replace(",", ".")) : null);
const toTitleCase = (str) =>
  str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
