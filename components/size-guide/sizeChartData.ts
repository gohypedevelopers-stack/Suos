/** Garment measurements per denim fit, shown on /size-guide and in the product size chart. */
export type FitType = "bootcut" | "straight" | "regular"

export type SizeRow = { size: string; waist: string; hip: string; inseam: string; length: string }

/** Tab order follows the Figma: Bootcut, Straight, Regular. */
export const FIT_OPTIONS: { id: FitType; label: string }[] = [
  { id: "bootcut", label: "Bootcut" },
  { id: "straight", label: "Straight" },
  { id: "regular", label: "Regular" },
]

export const SIZE_CHARTS: Record<FitType, { title: string; inches: SizeRow[]; cm: SizeRow[] }> = {
  regular: {
    title: "REGULAR FIT DENIM",
    inches: [
      { size: "28", waist: "28", hip: "37", inseam: "31.25", length: "41.5" },
      { size: "30", waist: "30", hip: "39", inseam: "31", length: "41.5" },
      { size: "32", waist: "32", hip: "41", inseam: "30.75", length: "41.5" },
      { size: "34", waist: "34", hip: "43", inseam: "30.5", length: "41.5" },
      { size: "36", waist: "36", hip: "45", inseam: "30.25", length: "41.5" },
      { size: "38", waist: "38", hip: "47", inseam: "30", length: "41.5" },
    ],
    cm: [
      { size: "28", waist: "71.1", hip: "94", inseam: "79.4", length: "105.4" },
      { size: "30", waist: "76.2", hip: "99.1", inseam: "78.7", length: "105.4" },
      { size: "32", waist: "81.3", hip: "104.1", inseam: "78.1", length: "105.4" },
      { size: "34", waist: "86.4", hip: "109.2", inseam: "77.5", length: "105.4" },
      { size: "36", waist: "91.4", hip: "114.3", inseam: "76.8", length: "105.4" },
      { size: "38", waist: "96.5", hip: "119.4", inseam: "76.2", length: "105.4" },
    ],
  },
  bootcut: {
    title: "BOOTCUT FIT DENIM",
    inches: [
      { size: "28", waist: "29", hip: "37", inseam: "31.25", length: "41" },
      { size: "30", waist: "31", hip: "39", inseam: "31", length: "41" },
      { size: "32", waist: "33", hip: "41", inseam: "30.75", length: "41" },
      { size: "34", waist: "35", hip: "43", inseam: "30.5", length: "41" },
      { size: "36", waist: "37", hip: "45", inseam: "30.25", length: "41.5" },
      { size: "38", waist: "39", hip: "47", inseam: "30", length: "41" },
    ],
    cm: [
      { size: "28", waist: "73.7", hip: "94", inseam: "79.4", length: "104.1" },
      { size: "30", waist: "78.7", hip: "99.1", inseam: "78.7", length: "104.1" },
      { size: "32", waist: "83.8", hip: "104.1", inseam: "78.1", length: "104.1" },
      { size: "34", waist: "88.9", hip: "109.2", inseam: "77.5", length: "104.1" },
      { size: "36", waist: "94", hip: "114.3", inseam: "76.8", length: "104.1" },
      { size: "38", waist: "99.1", hip: "119.4", inseam: "76.2", length: "104.1" },
    ],
  },
  straight: {
    title: "STRAIGHT FIT DENIM",
    inches: [
      { size: "28", waist: "29", hip: "39", inseam: "32.5", length: "42.5" },
      { size: "30", waist: "31", hip: "41", inseam: "32.25", length: "42.5" },
      { size: "32", waist: "33", hip: "43", inseam: "32", length: "42.5" },
      { size: "34", waist: "35", hip: "45", inseam: "31.75", length: "42.5" },
      { size: "36", waist: "37", hip: "47", inseam: "31.5", length: "42.5" },
      { size: "38", waist: "39", hip: "49", inseam: "31.25", length: "42.5" },
    ],
    cm: [
      { size: "28", waist: "73.7", hip: "99.1", inseam: "82.5", length: "108" },
      { size: "30", waist: "78.7", hip: "104.1", inseam: "81.9", length: "108" },
      { size: "32", waist: "83.8", hip: "109.2", inseam: "81.3", length: "108" },
      { size: "34", waist: "88.9", hip: "114.3", inseam: "80.6", length: "108" },
      { size: "36", waist: "94", hip: "119.4", inseam: "80", length: "108" },
      { size: "38", waist: "99.1", hip: "124.5", inseam: "79.4", length: "108" },
    ],
  },
}
