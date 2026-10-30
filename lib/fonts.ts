import localFont from "next/font/local";

// Akzidenz-Grotesk Pro is declared with plain @font-face in app/globals.css
// (files in public/fonts/akzidenz-grotesk) so the browser and dev tools show
// its real name instead of a generated one. See AKZIDENZ_PRELOADS below.

/** Weights used above the fold on every page; preloaded from the root layout. */
export const AKZIDENZ_PRELOADS = [
  "/fonts/akzidenz-grotesk/AkzidenzGroteskPro-Regular.woff2",
  "/fonts/akzidenz-grotesk/AkzidenzGroteskPro-Medium.woff2",
];

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
