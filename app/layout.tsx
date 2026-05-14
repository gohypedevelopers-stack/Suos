import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { akzidenzGrotesk, georgia, holiday } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "SUOS",
  description: "Luxury retail navigation concept for SUOS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        akzidenzGrotesk.variable,
        georgia.variable,
        holiday.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col bg-white text-black">{children}</body>
    </html>
  );
}
