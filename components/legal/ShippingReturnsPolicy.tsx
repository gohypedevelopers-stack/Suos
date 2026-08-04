import Link from "next/link"

import {
  PolicyDocument,
  PolicyList,
  PolicySection,
  PolicySubsection,
} from "@/components/legal/PolicyDocument"

const navigation = [
  { href: "#shipping-policy", label: "Shipping policy" },
  { href: "#returns-policy", label: "Returns policy" },
  { href: "#exchange-policy", label: "Exchange policy" },
  { href: "#policy-support", label: "Contact and support" },
] as const

export function ShippingReturnsPolicy() {
  return (
    <PolicyDocument
      id="policy"
      title="Shipping, Returns & Exchange Policy"
      navigation={navigation}
    >
      <PolicySection id="shipping-policy" title="Shipping Policy">
        <PolicyList>
          <li>
            A Cash on Delivery (COD) charge of ₹100 is applicable on COD orders below ₹3,000.
          </li>
          <li>
            Products are shipped from the warehouse within 4 working days from order confirmation.
          </li>
          <li>Orders are typically delivered within 10 working days from the date of shipment.</li>
          <li>Once shipped, the order tracking number will be shared via email or SMS.</li>
          <li>
            For international orders, customs duties or import taxes may be levied by the
            destination country at the time of delivery. Such charges are the responsibility of
            the customer.
          </li>
        </PolicyList>
      </PolicySection>

      <PolicySection id="returns-policy" title="Returns Policy">
        <PolicyList>
          <li>
            SUOS offers a 7-day return window from the date of delivery, applicable only to
            returnable products.
          </li>
          <li>
            Returned products must be unused, unworn, unwashed, and returned with original tags
            and packaging intact.
          </li>
          <li>International orders are not eligible for return.</li>
          <li>
            Items purchased during sale or clearance are non-returnable (exchange only, if
            applicable).
          </li>
        </PolicyList>

        <PolicySubsection title="Charges & Refunds">
          <PolicyList>
            <li>Shipping charges and COD charges are non-refundable.</li>
            <li>A non-refundable COD charge of ₹100 applies to all COD orders below ₹3,000.</li>
            <li>Once the product is picked up, refunds are initiated within 3 working days:</li>
            <li>Prepaid orders: Refund to original payment method</li>
            <li>
              COD orders: Refund processed via Razorpay link sent to the registered email ID
            </li>
          </PolicyList>
        </PolicySubsection>

        <PolicySubsection title="Important Return Conditions">
          <PolicyList>
            <li>
              An unboxing video is mandatory for claims related to wrong product or missing items.
            </li>
            <li>Do not hand over the product without a valid pickup slip or SMS confirmation.</li>
            <li>Products must not be handed over if the package appears tampered.</li>
            <li>Do not share OTP with the delivery partner unless the product has been received.</li>
            <li>Post-wash issues will be considered only within 30 days from delivery.</li>
          </PolicyList>
        </PolicySubsection>

        <PolicySubsection title="Non-Serviceable Pincode Returns">
          <PolicyList>
            <li>
              If reverse pickup is unavailable at the delivery location, the customer must
              self-ship the product.
            </li>
            <li>Courier reimbursement will be capped at ₹300.</li>
            <li>Customers are advised to ship via India Post (Speed Post).</li>
          </PolicyList>
        </PolicySubsection>
      </PolicySection>

      <PolicySection id="exchange-policy" title="Exchange Policy">
        <PolicyList>
          <li>Exchanges are free of charge.</li>
          <li>Size exchanges are subject to availability.</li>
          <li>
            For exchanges involving a lower-priced item, the balance amount will be issued as a
            gift voucher.
          </li>
          <li>Only one exchange per order is permitted.</li>
          <li>Orders purchased during sale or offers are eligible only for exchange, not return.</li>
          <li>An unboxing video is mandatory for wrong product exchange requests.</li>
        </PolicyList>
      </PolicySection>

      <PolicySection id="policy-support" title="Contact & Support">
        <p>
          For shipping, return, or exchange-related queries, email customer support at{" "}
          <Link
            href="mailto:support@suosindia.in"
            className="text-black underline underline-offset-2"
          >
            support@suosindia.in
          </Link>
          .
        </p>
      </PolicySection>
    </PolicyDocument>
  )
}
