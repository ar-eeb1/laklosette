import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const sortings = [
  { label: 'Default Sorting', value: 'default_sorting' },
  { label: 'Ascending Order', value: 'asc' },
  { label: 'Descending Order', value: 'dsc' },
  { label: 'Price: High To Low', value: 'price_low_high' },
  { label: 'Price: Low To High', value: 'price_high_low' },
];

export const orderStatus = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'unverified']
