import localFont from "next/font/local";

export const akzidenzGrotesk = localFont({
  src: [
    {
      path: "../fonts/Akzidenz Grotesk/AkzidenzGroteskPro-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/Akzidenz Grotesk/AkzidenzGroteskPro-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/Akzidenz Grotesk/AkzidenzGroteskPro-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Akzidenz Grotesk/AkzidenzGroteskPro-RegularItalic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/Akzidenz Grotesk/AkzidenzGroteskPro-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Akzidenz Grotesk/AkzidenzGroteskPro-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Akzidenz Grotesk/AkzidenzGroteskPro-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/Akzidenz Grotesk/AkzidenzGroteskPro-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../fonts/Akzidenz Grotesk/AkzidenzGroteskPro-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../fonts/Akzidenz Grotesk/AkzidenzGroteskPro-Super.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/Akzidenz Grotesk/AkzidenzGroteskPro-SuperItalic.ttf",
      weight: "900",
      style: "italic",
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
