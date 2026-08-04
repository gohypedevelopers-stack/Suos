import type { Metadata } from "next"
import Link from "next/link"

import {
  PolicyDocument,
  PolicyIntroduction,
  PolicyList,
  PolicySection,
} from "@/components/legal/PolicyDocument"

export const metadata: Metadata = {
  title: "Privacy Policy | SUOS",
  description: "How SUOS collects, uses, protects, and manages personal information.",
}

const navigation = [
  { href: "#personal-information", label: "Use of personal information" },
  { href: "#data-collection", label: "Data collection purpose" },
  { href: "#cookies", label: "Cookies and website data" },
  { href: "#disclosure", label: "Disclosure of information" },
  { href: "#data-security", label: "Data security" },
  { href: "#data-rights", label: "Access, update and removal" },
  { href: "#fraud-awareness", label: "Fraud and scam awareness" },
] as const

export default function PrivacyPage() {
  return (
    <main className="flex-1 bg-white text-black">
      <PolicyDocument title="Privacy Policy" navigation={navigation}>
        <PolicyIntroduction>
          <p>At SUOS, we are committed to protecting your privacy and personal information.</p>
          <p>
            It is our policy to act in accordance with applicable laws and follow current best
            practices for online data protection. We strive to be responsible, transparent, and
            secure in the way we collect and use your data.
          </p>
        </PolicyIntroduction>

        <PolicySection id="personal-information" title="Use of Personal Information">
          <p>
            SUOS does not sell, rent, or trade your personal information to third parties,
            including your name, address, email, or contact details.
          </p>
          <p>
            If we believe there is something relevant or beneficial for you, such as updates,
            offers, or product launches, we will communicate directly with you using the contact
            details you have provided.
          </p>
          <p>
            We do not link your personal data with third parties to create demographic profiles,
            and we do not intentionally collect unnecessary personal data.
          </p>
        </PolicySection>

        <PolicySection id="data-collection" title="Data Collection Purpose">
          <p>We collect and process information for the following purposes:</p>
          <PolicyList>
            <li>Technical administration of the website</li>
            <li>Improving your browsing and shopping experience</li>
            <li>Order processing, customer support, and service communication</li>
            <li>Marketing and promotion of SUOS products (only where consent is provided)</li>
          </PolicyList>
          <p>
            If we intend to use your personal information for any purpose not outlined above, we
            will seek your prior consent.
          </p>
        </PolicySection>

        <PolicySection id="cookies" title="Cookies & Website Data">
          <p>
            SUOS may use cookies and similar technologies to improve website functionality,
            performance, and user experience. These cookies do not store sensitive personal
            information.
          </p>
          <p>You may manage or disable cookies through your browser settings.</p>
        </PolicySection>

        <PolicySection id="disclosure" title="Disclosure of Information">
          <p>We reserve the right to share personal information where required:</p>
          <PolicyList>
            <li>To comply with legal or regulatory obligations</li>
            <li>To enforce our Terms &amp; Conditions or other agreements</li>
            <li>To prevent fraud, security threats, or unlawful activity</li>
          </PolicyList>
          <p>
            This may include sharing information with relevant authorities or organizations for
            fraud prevention and credit risk reduction, where legally permitted.
          </p>
        </PolicySection>

        <PolicySection id="data-security" title="Data Security">
          <p>
            While we take reasonable steps to safeguard your personal information using
            appropriate technical and organizational measures, no method of data transmission
            over the internet is completely secure.
          </p>
          <p>
            By using our services, you acknowledge that any information shared with SUOS is done
            at your own risk.
          </p>
        </PolicySection>

        <PolicySection id="data-rights" title="Access, Update & Removal of Data">
          <p>You may request to:</p>
          <PolicyList>
            <li>Update or correct your personal information</li>
            <li>Withdraw consent for marketing communications</li>
            <li>Be removed from our systems entirely</li>
          </PolicyList>
          <p>To do so, please contact us using the details provided on our website.</p>
        </PolicySection>

        <PolicySection id="fraud-awareness" title="Fraud & Scam Awareness">
          <p>SUOS will never contact customers to request:</p>
          <PolicyList>
            <li>Advance payments</li>
            <li>Additional charges after an order is placed</li>
            <li>OTPs, passwords, or sensitive banking details</li>
          </PolicyList>
          <p>
            Please remain cautious of fraudulent calls, messages, or phishing attempts claiming
            to represent SUOS.
          </p>
          <p>
            If you encounter such activity, report it immediately to the National Cyber Crime
            Helpline at 1930 or file a complaint through the{" "}
            <Link
              href="https://cybercrime.gov.in/Webform/Helpline.aspx"
              target="_blank"
              rel="noreferrer"
              className="text-black underline underline-offset-2"
            >
              National Cyber Crime Reporting Portal
            </Link>
            .
          </p>
          <p>
            After registering a complaint, you may also contact SUOS customer support with your
            reference number so we can assist you further.
          </p>
        </PolicySection>
      </PolicyDocument>
    </main>
  )
}
