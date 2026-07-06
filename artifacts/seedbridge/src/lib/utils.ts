import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CROP_EMOJIS: Record<string, string> = {
  tomatoes: "🍅",
  garden_eggs: "🍆",
  okra: "🌿",
  peppers: "🌶",
  leafy_greens: "🥬",
  other: "📦"
};

export const CROP_LABELS: Record<string, string> = {
  tomatoes: "Tomatoes",
  garden_eggs: "Garden Eggs",
  okra: "Okra",
  peppers: "Peppers",
  leafy_greens: "Leafy Greens",
  other: "Other"
};

export const formatCurrency = (amount: number) => {
  return `₵${amount.toFixed(2)}`;
};

export const formatWeight = (kg: number) => {
  return `${kg}kg`;
};
