import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Aplica um canal alpha a uma cor `oklch(...)` injetando `/ alpha` antes do `)`.
 * Tolera whitespace ao redor do `)` final.
 */
export const withAlpha = (oklch: string, alpha: number): string =>
  oklch.replace(/\s*\)\s*$/, ` / ${alpha})`);
