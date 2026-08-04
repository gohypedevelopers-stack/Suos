import type { Metadata } from "next"
import Link from "next/link"

import {
  PolicyDocument,
  PolicyIntroduction,
  PolicyList,
  PolicySection,
} from "@/components/legal/PolicyDocument"

export const metadata: Metadata = {
  title: "Terms & Conditions | SUOS",
  description: "Terms governing access to and use of the SUOS platform and services.",
}

const navigation = [
  { href: "#eligibility", label: "1. Eligibility" },
  { href: "#product-information", label: "2. Product information" },
  { href: "#pricing-payments", label: "3. Pricing and payments" },
  { href: "#orders-delivery", label: "4. Orders and delivery" },
  { href: "#returns-refunds", label: "5. Returns, exchanges and refunds" },
  { href: "#privacy-data", label: "6. Privacy and data protection" },
  { href: "#user-conduct", label: "7. User conduct" },
  { href: "#intellectual-property", label: "8. Intellectual property" },
  { href: "#liability", label: "9. Limitation of liability" },
  { href: "#governing-law", label: "10. Governing law and jurisdiction" },
  { href: "#modifications", label: "11. Modifications" },
  { href: "#contact", label: "12. Contact" },
] as const

export default function TermsPage() {
  return (
    <main className="flex-1 bg-white text-black">
      <PolicyDocument title="Terms & Conditions" navigation={navigation}>
        <PolicyIntroduction>
          <p>
            These Terms &amp; Conditions govern access to and use of the SUOS website, mobile
            platforms, and related services (the &quot;Platform&quot;). By accessing the Platform or
            placing an order, the user agrees to be bound by these Terms, the Privacy Policy, and
            the Return &amp; Refund Policy.
          </p>
          <p>If the user does not agree to these Terms, use of the Platform must be discontinued.</p>
        </PolicyIntroduction>

        <PolicySection id="eligibility" title="1. Eligibility">
          <p>
            Use of the Platform is permitted only to individuals who are legally capable of
            entering into a binding contract under applicable law. Users below 18 years of age
            may use the Platform only under parental or legal guardian supervision.
          </p>
        </PolicySection>

        <PolicySection id="product-information" title="2. Product Information">
          <p>All products offered on the Platform are subject to availability.</p>
          <p>
            Product images are for representation purposes only. Minor variations in color,
            fabric texture, or fit may occur due to photography, lighting conditions, screen
            settings, or manufacturing processes.
          </p>
          <p>
            SUOS reserves the right to modify product details, pricing, or availability without
            prior notice.
          </p>
        </PolicySection>

        <PolicySection id="pricing-payments" title="3. Pricing & Payments">
          <p>All prices are displayed in Indian Rupees (INR), unless stated otherwise.</p>
          <p>
            Payments must be completed at the time of purchase through authorized payment
            gateways. SUOS does not store credit card, debit card, UPI, or banking information.
          </p>
          <p>
            Orders may be cancelled in the event of pricing errors, payment failures, or suspected
            fraudulent activity.
          </p>
        </PolicySection>

        <PolicySection id="orders-delivery" title="4. Orders & Delivery">
          <p>Order confirmation does not constitute acceptance.</p>
          <p>
            Once an order has been shipped, it cannot be cancelled. Delivery timelines provided
            are estimates and may vary due to logistics, force majeure events, or other external
            factors.
          </p>
          <p>Risk and ownership of the product transfer to the customer upon successful delivery.</p>
        </PolicySection>

        <PolicySection id="returns-refunds" title="5. Returns, Exchanges & Refunds">
          <p>Returns or exchanges are accepted only within 7 days from the date of delivery.</p>
          <p>
            Returned items must be unused, unwashed, undamaged, and returned with original tags
            and packaging intact. Certain products, including discounted or clearance items, may
            not be eligible for return.
          </p>
          <p>
            Refunds, if approved, will be processed to the original payment method in accordance
            with the Return &amp; Refund Policy.
          </p>
        </PolicySection>

        <PolicySection id="privacy-data" title="6. Privacy & Data Protection">
          <p>
            Use of the Platform is subject to the SUOS Privacy Policy. Personal information is
            collected, processed, and stored in accordance with applicable laws, including the
            Information Technology Act, 2000.
          </p>
        </PolicySection>

        <PolicySection id="user-conduct" title="7. User Conduct">
          <p>Users shall not:</p>
          <PolicyList>
            <li>Engage in fraudulent, unlawful, or abusive conduct</li>
            <li>Misuse promotions, discounts, or return policies</li>
            <li>Attempt unauthorized access to systems or data</li>
            <li>Interfere with the operation or security of the Platform</li>
          </PolicyList>
          <p>SUOS reserves the right to take appropriate action in case of violations.</p>
        </PolicySection>

        <PolicySection id="intellectual-property" title="8. Intellectual Property">
          <p>
            All content, including trademarks, logos, designs, images, text, and graphics, is the
            exclusive property of SUOS and may not be used without prior written permission.
          </p>
        </PolicySection>

        <PolicySection id="liability" title="9. Limitation of Liability">
          <p>
            To the extent permitted by law, SUOS shall not be liable for indirect, incidental, or
            consequential damages. Total liability, if any, shall not exceed the amount paid for
            the product giving rise to the claim.
          </p>
          <p>Products are provided on an &quot;as is&quot; and &quot;as available&quot; basis.</p>
        </PolicySection>

        <PolicySection id="governing-law" title="10. Governing Law & Jurisdiction">
          <p>
            These Terms are governed by the laws of India. All disputes shall be subject to the
            exclusive jurisdiction of the courts located in Delhi, India.
          </p>
        </PolicySection>

        <PolicySection id="modifications" title="11. Modifications">
          <p>
            SUOS reserves the right to modify these Terms at any time. Continued use of the
            Platform constitutes acceptance of the revised Terms.
          </p>
        </PolicySection>

        <PolicySection id="contact" title="12. Contact">
          <p>
            For queries or concerns, email SUOS at{" "}
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
    </main>
  )
}
