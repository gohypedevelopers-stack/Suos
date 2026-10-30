import { Inter } from "next/font/google";
import localFont from "next/font/local";

// woff2 copies of the three Figma weights (~100 KB in total versus ~1.7 MB
// for all 11 .ttf files), so Regular arrives quickly and the Arial fallback
// barely flashes. 600 (font-semibold) resolves to Bold.
export const akzidenzGrotesk = localFont({
  src: [
    {
      path: "../fonts/Akzidenz Grotesk/AkzidenzGroteskPro-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Akzidenz Grotesk/AkzidenzGroteskPro-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Akzidenz Grotesk/AkzidenzGroteskPro-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-akzidenz-grotesk",
  display: "swap",
});

export const georgia = localFont({
  src: [
    {
      path: "../fonts/Georgia/georgia.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Georgia/georgiai.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/Georgia/georgiab.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Georgia/georgiaz.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-georgia",
  display: "swap",
  preload: false,
});

export const holiday = localFont({
  src: [
    {
      path: "../fonts/Holiday.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-holiday",
  display: "swap",
  preload: false,
});

// Secondary face for small supporting text (card names, prices, descriptions).
// Headings, nav and buttons stay in Akzidenz-Grotesk. Use the `font-inter` class.
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter-family",
  display: "swap",
  preload: false,
});
