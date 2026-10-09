import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { akzidenzGrotesk, georgia, holiday } from "@/lib/fonts";
import { SiteChrome } from "@/components/SiteChrome";
import { Toaster } from "@/components/ui/sonner";
import { WishlistProvider } from "@/lib/wishlist-context";
import { CartProvider } from "@/lib/cart-context";
import { AnalyticsBeacon } from "@/components/analytics/AnalyticsBeacon";
import { SessionRecorder } from "@/components/analytics/SessionRecorder";
import { SiteContentProvider } from "@/lib/site-content-context";
import { getSiteContent } from "@/lib/server/dal/site-content";

export const metadata: Metadata = {
  title: "SUOS",
  description: "Luxury retail navigation concept for SUOS.",
  icons: {
    icon: "/logo.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteContent = await getSiteContent();

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
        <Toaster position="bottom-right" />
        <AnalyticsBeacon />
        <SessionRecorder />
        <div className="relative flex flex-1 flex-col overflow-x-clip">
          <SiteContentProvider content={siteContent}>
          <CartProvider>
          <WishlistProvider>
            <SiteChrome>{children}</SiteChrome>
          </WishlistProvider>
          </CartProvider>
          </SiteContentProvider>
        </div>
      </body>
    </html>
  );
}
