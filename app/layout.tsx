import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { akzidenzGrotesk, georgia, holiday } from "@/lib/fonts";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "SUOS",
  description: "Luxury retail navigation concept for SUOS.",
  icons: {
    icon: "/logo.svg",
  },
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
      <body className="min-h-full flex flex-col bg-white text-black">
        <div className="relative flex flex-1 flex-col overflow-x-hidden">
          <SiteHeader />
          <div className="flex flex-1 flex-col pt-[var(--header-stack-height)]">
            {children}
          </div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
