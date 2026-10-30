import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { akzidenzGrotesk, georgia, holiday, inter } from "@/lib/fonts";
import { SiteChrome } from "@/components/SiteChrome";
import { Toaster } from "@/components/ui/sonner";
import { WishlistProvider } from "@/lib/wishlist-context";
import { CartProvider } from "@/lib/cart-context";
import { AnalyticsBeacon } from "@/components/analytics/AnalyticsBeacon";
import { SessionRecorder } from "@/components/analytics/SessionRecorder";
import { SiteContentProvider } from "@/lib/site-content-context";
import { getSiteContent } from "@/lib/server/dal/site-content";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://suosindia.com"),
  title: "SUOS | Luxury Menswear & Premium Denim",
  description:
    "Discover SUOS — contemporary luxury menswear, artisanal denim, and tailored essentials crafted in India.",
  applicationName: "SUOS",
  keywords: [
    "SUOS",
    "SUOS India",
    "Luxury Menswear",
    "Premium Denim",
    "Designer Jeans",
    "Men's Luxury Fashion",
    "Contemporary Menswear",
    "Indian Luxury Brand",
  ],
  authors: [{ name: "SUOS" }],
  creator: "SUOS",
  publisher: "SUOS",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "SUOS | Luxury Menswear & Premium Denim",
    description:
      "Contemporary luxury menswear, artisanal denim, and tailored essentials crafted in India.",
    url: "https://suosindia.com",
    siteName: "SUOS",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SUOS | Luxury Menswear & Premium Denim",
    description:
      "Contemporary luxury menswear, artisanal denim, and tailored essentials crafted in India.",
  },
  robots: {
    index: true,
    follow: true,
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
        inter.variable,
        georgia.variable,
        holiday.variable,
        "font-sans"
      )}
    >
      {/* Browser extensions (e.g. ColorZilla's cz-shortcut-listen) add attributes to
          <body> before React loads; ignore those attribute mismatches on this tag only. */}
      <body className="min-h-full flex flex-col bg-white text-black" suppressHydrationWarning>
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
