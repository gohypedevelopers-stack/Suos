import localFont from "next/font/local";

// The site typeface (Inter) is declared with plain @font-face in app/globals.css
// (files in public/fonts/inter) so the browser and dev tools show its real
// name instead of a generated one.

/** Font files every page needs straight away; preloaded from the root layout. */
export const FONT_PRELOADS = ["/fonts/inter/inter-latin-wght-normal.woff2"];

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
