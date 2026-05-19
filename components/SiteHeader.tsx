import { Navbar } from "@/components/Navbar"
import { ShippingAnnouncementBar } from "@/components/home/ShippingAnnouncementBar"

export function SiteHeader() {
  return (
    <div className="absolute inset-x-0 top-0 z-50">
      <ShippingAnnouncementBar />
      <Navbar variant="overlay" />
    </div>
  )
}
