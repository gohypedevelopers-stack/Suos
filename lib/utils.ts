import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// The Figma text styles in globals.css (text-h1 … text-caption) are font
// sizes. Without this, tailwind-merge reads them as text colours and drops
// them whenever a colour class (e.g. text-ink-800) appears in the same list.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["h1", "h2", "h3", "h4", "body-lg", "body", "button", "caption"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
