import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const CROP_EMOJIS = {
  tomatoes: "\u{1F345}",
  garden_eggs: "\u{1F346}",
  okra: "\u{1F33F}",
  peppers: "\u{1F336}",
  leafy_greens: "\u{1F96C}",
  other: "\u{1F4E6}"
};
const CROP_LABELS = {
  tomatoes: "Tomatoes",
  garden_eggs: "Garden Eggs",
  okra: "Okra",
  peppers: "Peppers",
  leafy_greens: "Leafy Greens",
  other: "Other"
};
const formatCurrency = (amount) => {
  return `\u20B5${amount.toFixed(2)}`;
};
const formatWeight = (kg) => {
  return `${kg}kg`;
};
export {
  CROP_EMOJIS,
  CROP_LABELS,
  cn,
  formatCurrency,
  formatWeight
};
