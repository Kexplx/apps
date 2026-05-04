// utils
const toNum = (v) => (v ? parseFloat(v.replace(",", ".")) : null);
const toTitleCase = (str) =>
  str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
function formatRelativeDate(input) {
  const [datePart, timePart] = input.split(" ");
  const [d, m, y] = datePart.split(".").map(Number);

  const target = new Date(y, m - 1, d);
  const now = new Date();

  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.floor((startToday - target) / 86400000);

  if (diffDays === 0) return `heute ${timePart}`;
  if (diffDays === 1) return `gestern ${timePart}`;
  return input;
}
