import { PolicyRenderer } from "@/components/legal/PolicyRenderer"
import { getSiteContent } from "@/lib/server/dal/site-content"

export async function ShippingReturnsPolicy() {
  const { shippingPolicy } = await getSiteContent()
  return <PolicyRenderer id="policy" policy={shippingPolicy} />
}
