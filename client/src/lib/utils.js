import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

/**
 * A utility function for merging Tailwind CSS classes.
 * @param {...(string|string[])} inputs - The classes to merge.
 * @returns {string} The merged classes.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
