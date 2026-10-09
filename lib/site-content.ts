/**
 * Editable storefront content. The defaults below are exactly what the
 * storefront rendered before the content manager existed, so an empty
 * `site_content` table changes nothing visually.
 */

export type PolicyBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }

export type PolicySubsection = {
  title: string
  blocks: PolicyBlock[]
}

export type PolicySection = {
  id: string
  title: string
  navLabel: string
  blocks: PolicyBlock[]
  subsections: PolicySubsection[]
}

export type PolicyContent = {
  title: string
  metaTitle: string
  metaDescription: string
  intro: string[]
  sections: PolicySection[]
}

export type AnnouncementsContent = {
  left: string
  center: string
  right: string
  mobile: string[]
}

export type LaunchOfferContent = {
  enabled: boolean
  label: string
  /** ISO timestamp the countdown counts down to. */
  endsAt: string
  ctaText: string
  ctaHref: string
}

export type LookbookSlideContent = {
  id: string
  image: string
  alt: string
  /** CSS object-position, e.g. "center 16%". */
  objectPosition: string
}

export type LookbookContent = {
  slides: LookbookSlideContent[]
}

export type EditsContent = {
  heading: string
  tabs: { label: string; active: boolean }[]
  slides: { id: string; image: string; alt: string; label: string; href: string }[]
}

export type ContactContent = {
  eyebrow: string
  titleLines: string[]
  description: string
  phone: string
  phoneHours: string
  email: string
  emailResponse: string
  chatLabel: string
  chatHours: string
  faqs: { question: string; answer: string }[]
}

export type FooterContent = {
  careEmail: string
  ordersPhone: string
  timings: string
}

export type ReturnsPageContent = {
  title: string
  image: string
  conditions: string[]
}

export type SizeGuideContent = {
  title: string
  subtitle: string
  images: string[]
}

export type SiteContent = {
  announcements: AnnouncementsContent
  launchOffer: LaunchOfferContent
  lookbook: LookbookContent
  edits: EditsContent
  contact: ContactContent
  footer: FooterContent
  returnsPage: ReturnsPageContent
  sizeGuide: SizeGuideContent
  privacyPolicy: PolicyContent
  termsPolicy: PolicyContent
  shippingPolicy: PolicyContent
}

export type SiteContentKey = keyof SiteContent

export const SITE_CONTENT_KEYS: SiteContentKey[] = [
  "announcements",
  "launchOffer",
  "lookbook",
  "edits",
  "contact",
  "footer",
  "returnsPage",
  "sizeGuide",
  "privacyPolicy",
  "termsPolicy",
  "shippingPolicy",
]

export const SITE_CONTENT_LABELS: Record<SiteContentKey, string> = {
  announcements: "Announcement bar",
  launchOffer: "Launch offer",
  lookbook: "Lookbook carousel",
  edits: "Edits carousel",
  contact: "Contact page & FAQs",
  footer: "Footer contact",
  returnsPage: "Returns page",
  sizeGuide: "Size guide",
  privacyPolicy: "Privacy policy",
  termsPolicy: "Terms & conditions",
  shippingPolicy: "Shipping & returns policy",
}

const p = (text: string): PolicyBlock => ({ type: "paragraph", text })
const list = (...items: string[]): PolicyBlock => ({ type: "list", items })

export const DEFAULT_SITE_CONTENT: SiteContent = {
  announcements: {
    left: "International Shipping Available",
    center: "Free Shipping on Orders above Rs 2,900 | Launch Offer 30% off",
    right: "Easy Exchange and Returns",
    mobile: [
      "Free Shipping on Orders above Rs 2,900",
      "Launch Offer — 30% Off",
      "International Shipping Available",
      "Easy Exchanges & Returns",
    ],
  },
  launchOffer: {
    enabled: true,
    label: "Launch Offer Live Now",
    endsAt: "2026-10-18T00:00:00.000Z",
    ctaText: "Shop Now",
    ctaHref: "/collections",
  },
  lookbook: {
    slides: [
      { id: "lookbook-1", image: "/images/products/product9.png", alt: "Model in blue denim standing against a dark gradient background", objectPosition: "center 16%" },
      { id: "lookbook-2", image: "/images/products/product10.png", alt: "Model in a denim jacket in a monochrome setting", objectPosition: "center 14%" },
      { id: "lookbook-3", image: "/images/products/product11.png", alt: "Model in a striped shirt holding a cup indoors", objectPosition: "center 20%" },
      { id: "lookbook-4", image: "/images/products/product12.png", alt: "Model in an all-black outfit seated on a chair", objectPosition: "center 22%" },
      { id: "lookbook-5", image: "/images/products/product13.png", alt: "Model in a light denim jacket and jeans against a bright backdrop", objectPosition: "center 18%" },
      { id: "lookbook-6", image: "/images/products/product14.png", alt: "Model wearing blue denim seated on a stool", objectPosition: "center 24%" },
      { id: "lookbook-7", image: "/images/products/product5-white.png", alt: "Model in denim seated beside greenery", objectPosition: "center 32%" },
      { id: "lookbook-8", image: "/images/products/product9.png", alt: "Model reclining in a denim look across stacked screens", objectPosition: "center 44%" },
    ],
  },
  edits: {
    heading: "Edits",
    tabs: [
      { label: "ALL", active: false },
      { label: "WOMEN", active: false },
      { label: "MEN", active: true },
    ],
    slides: [
      { id: "edit-1", image: "/images/products/product1.png", alt: "Model wearing a blue denim outfit", label: "Edit Name", href: "" },
      { id: "edit-2", image: "/images/products/product2.png", alt: "Model wearing a denim jacket in monochrome", label: "Edit Name", href: "" },
      { id: "edit-3", image: "/images/products/product3.png", alt: "Model seated in a black tailored look", label: "Edit Name", href: "" },
      { id: "edit-4", image: "/images/products/product4.png", alt: "Model wearing an all-black outfit", label: "Edit Name", href: "" },
      { id: "edit-5", image: "/images/products/product1.png", alt: "Model wearing a blue denim outfit", label: "Edit Name", href: "" },
      { id: "edit-6", image: "/images/products/product2.png", alt: "Model wearing a denim jacket in monochrome", label: "Edit Name", href: "" },
      { id: "edit-7", image: "/images/products/product3.png", alt: "Model seated in a black tailored look", label: "Edit Name", href: "" },
      { id: "edit-8", image: "/images/products/product4.png", alt: "Model wearing an all-black outfit", label: "Edit Name", href: "" },
    ],
  },
  contact: {
    eyebrow: "Contact us",
    titleLines: ["Let’s", "connect."],
    description:
      "Our client services team is available to assist you with orders, styling advice, and any questions about the collection.",
    phone: "+ 91 1800 123 4567",
    phoneHours: "Mon - Fri, 9 AM - 9 PM IST",
    email: "info@suos.in",
    emailResponse: "Response within 24 hours",
    chatLabel: "Available on site",
    chatHours: "Mon - Fri, 10 AM - 7 PM IST",
    faqs: [
      {
        question: "How long does delivery take?",
        answer:
          "Orders are typically dispatched within 1–2 business days. Delivery timelines are shown at checkout and vary by destination.",
      },
      {
        question: "What is the return policy?",
        answer:
          "Unworn items with original tags can be returned within 14 days of delivery. Please refer to our returns policy for full details.",
      },
      {
        question: "Do you offer alterations?",
        answer:
          "We do not currently offer alterations. Our client services team can help you select the right fit before you place an order.",
      },
      {
        question: "How do I track my order?",
        answer:
          "Once your order has shipped, we will email your tracking link. You can also find the latest status in your order confirmation.",
      },
    ],
  },
  footer: {
    careEmail: "info@suos.in",
    ordersPhone: "+91 000000000",
    timings: "Mon-Sat : 9AM - 8PM",
  },
  returnsPage: {
    title: "Place a refund/ exchange request",
    image: "/images/products/product1.png",
    conditions: [
      "No Returns/ Only Exchanges are acceptable for products purchased on sale",
      "Sizes in exchange are subject to availability. The difference in amount (if any) will be sent back as a redeemable gift card.",
      "Do not hand over the product to the pick-up executive without the pickup slip or SMS confirmation.",
      "Self-Ship if your PIN code is not in the serviceable area. (Docket slip required for free refund)",
    ],
  },
  sizeGuide: {
    title: "Size Guide",
    subtitle: "Find your perfect fit",
    images: [
      ...Array.from({ length: 7 }, (_, i) => `/size-charts/SU022026-27_TECHPACK_page_${i + 1}.png`),
      ...Array.from({ length: 8 }, (_, i) => `/size-charts/SU202026-27_TECHPACK_page_${i + 1}.png`),
    ],
  },
  privacyPolicy: {
    title: "Privacy Policy",
    metaTitle: "Privacy Policy | SUOS",
    metaDescription: "How SUOS collects, uses, protects, and manages personal information.",
    intro: [
      "At SUOS, we are committed to protecting your privacy and personal information.",
      "It is our policy to act in accordance with applicable laws and follow current best practices for online data protection. We strive to be responsible, transparent, and secure in the way we collect and use your data.",
    ],
    sections: [
      {
        id: "personal-information",
        title: "Use of Personal Information",
        navLabel: "Use of personal information",
        blocks: [
          p("SUOS does not sell, rent, or trade your personal information to third parties, including your name, address, email, or contact details."),
          p("If we believe there is something relevant or beneficial for you, such as updates, offers, or product launches, we will communicate directly with you using the contact details you have provided."),
          p("We do not link your personal data with third parties to create demographic profiles, and we do not intentionally collect unnecessary personal data."),
        ],
        subsections: [],
      },
      {
        id: "data-collection",
        title: "Data Collection Purpose",
        navLabel: "Data collection purpose",
        blocks: [
          p("We collect and process information for the following purposes:"),
          list(
            "Technical administration of the website",
            "Improving your browsing and shopping experience",
            "Order processing, customer support, and service communication",
            "Marketing and promotion of SUOS products (only where consent is provided)",
          ),
          p("If we intend to use your personal information for any purpose not outlined above, we will seek your prior consent."),
        ],
        subsections: [],
      },
      {
        id: "cookies",
        title: "Cookies & Website Data",
        navLabel: "Cookies and website data",
        blocks: [
          p("SUOS may use cookies and similar technologies to improve website functionality, performance, and user experience. These cookies do not store sensitive personal information."),
          p("You may manage or disable cookies through your browser settings."),
        ],
        subsections: [],
      },
      {
        id: "disclosure",
        title: "Disclosure of Information",
        navLabel: "Disclosure of information",
        blocks: [
          p("We reserve the right to share personal information where required:"),
          list(
            "To comply with legal or regulatory obligations",
            "To enforce our Terms & Conditions or other agreements",
            "To prevent fraud, security threats, or unlawful activity",
          ),
          p("This may include sharing information with relevant authorities or organizations for fraud prevention and credit risk reduction, where legally permitted."),
        ],
        subsections: [],
      },
      {
        id: "data-security",
        title: "Data Security",
        navLabel: "Data security",
        blocks: [
          p("While we take reasonable steps to safeguard your personal information using appropriate technical and organizational measures, no method of data transmission over the internet is completely secure."),
          p("By using our services, you acknowledge that any information shared with SUOS is done at your own risk."),
        ],
        subsections: [],
      },
      {
        id: "data-rights",
        title: "Access, Update & Removal of Data",
        navLabel: "Access, update and removal",
        blocks: [
          p("You may request to:"),
          list(
            "Update or correct your personal information",
            "Withdraw consent for marketing communications",
            "Be removed from our systems entirely",
          ),
          p("To do so, please contact us using the details provided on our website."),
        ],
        subsections: [],
      },
      {
        id: "fraud-awareness",
        title: "Fraud & Scam Awareness",
        navLabel: "Fraud and scam awareness",
        blocks: [
          p("SUOS will never contact customers to request:"),
          list(
            "Advance payments",
            "Additional charges after an order is placed",
            "OTPs, passwords, or sensitive banking details",
          ),
          p("Please remain cautious of fraudulent calls, messages, or phishing attempts claiming to represent SUOS."),
          p("If you encounter such activity, report it immediately to the National Cyber Crime Helpline at 1930 or file a complaint through the [National Cyber Crime Reporting Portal](https://cybercrime.gov.in/Webform/Helpline.aspx)."),
          p("After registering a complaint, you may also contact SUOS customer support with your reference number so we can assist you further."),
        ],
        subsections: [],
      },
    ],
  },
  termsPolicy: {
    title: "Terms & Conditions",
    metaTitle: "Terms & Conditions | SUOS",
    metaDescription: "Terms governing access to and use of the SUOS platform and services.",
    intro: [
      "These Terms & Conditions govern access to and use of the SUOS website, mobile platforms, and related services (the \"Platform\"). By accessing the Platform or placing an order, the user agrees to be bound by these Terms, the Privacy Policy, and the Return & Refund Policy.",
      "If the user does not agree to these Terms, use of the Platform must be discontinued.",
    ],
    sections: [
      { id: "eligibility", title: "1. Eligibility", navLabel: "1. Eligibility", subsections: [], blocks: [
        p("Use of the Platform is permitted only to individuals who are legally capable of entering into a binding contract under applicable law. Users below 18 years of age may use the Platform only under parental or legal guardian supervision."),
      ] },
      { id: "product-information", title: "2. Product Information", navLabel: "2. Product information", subsections: [], blocks: [
        p("All products offered on the Platform are subject to availability."),
        p("Product images are for representation purposes only. Minor variations in color, fabric texture, or fit may occur due to photography, lighting conditions, screen settings, or manufacturing processes."),
        p("SUOS reserves the right to modify product details, pricing, or availability without prior notice."),
      ] },
      { id: "pricing-payments", title: "3. Pricing & Payments", navLabel: "3. Pricing and payments", subsections: [], blocks: [
        p("All prices are displayed in Indian Rupees (INR), unless stated otherwise."),
        p("Payments must be completed at the time of purchase through authorized payment gateways. SUOS does not store credit card, debit card, UPI, or banking information."),
        p("Orders may be cancelled in the event of pricing errors, payment failures, or suspected fraudulent activity."),
      ] },
      { id: "orders-delivery", title: "4. Orders & Delivery", navLabel: "4. Orders and delivery", subsections: [], blocks: [
        p("Order confirmation does not constitute acceptance."),
        p("Once an order has been shipped, it cannot be cancelled. Delivery timelines provided are estimates and may vary due to logistics, force majeure events, or other external factors."),
        p("Risk and ownership of the product transfer to the customer upon successful delivery."),
      ] },
      { id: "returns-refunds", title: "5. Returns, Exchanges & Refunds", navLabel: "5. Returns, exchanges and refunds", subsections: [], blocks: [
        p("Returns or exchanges are accepted only within 7 days from the date of delivery."),
        p("Returned items must be unused, unwashed, undamaged, and returned with original tags and packaging intact. Certain products, including discounted or clearance items, may not be eligible for return."),
        p("Refunds, if approved, will be processed to the original payment method in accordance with the Return & Refund Policy."),
      ] },
      { id: "privacy-data", title: "6. Privacy & Data Protection", navLabel: "6. Privacy and data protection", subsections: [], blocks: [
        p("Use of the Platform is subject to the SUOS Privacy Policy. Personal information is collected, processed, and stored in accordance with applicable laws, including the Information Technology Act, 2000."),
      ] },
      { id: "user-conduct", title: "7. User Conduct", navLabel: "7. User conduct", subsections: [], blocks: [
        p("Users shall not:"),
        list(
          "Engage in fraudulent, unlawful, or abusive conduct",
          "Misuse promotions, discounts, or return policies",
          "Attempt unauthorized access to systems or data",
          "Interfere with the operation or security of the Platform",
        ),
        p("SUOS reserves the right to take appropriate action in case of violations."),
      ] },
      { id: "intellectual-property", title: "8. Intellectual Property", navLabel: "8. Intellectual property", subsections: [], blocks: [
        p("All content, including trademarks, logos, designs, images, text, and graphics, is the exclusive property of SUOS and may not be used without prior written permission."),
      ] },
      { id: "liability", title: "9. Limitation of Liability", navLabel: "9. Limitation of liability", subsections: [], blocks: [
        p("To the extent permitted by law, SUOS shall not be liable for indirect, incidental, or consequential damages. Total liability, if any, shall not exceed the amount paid for the product giving rise to the claim."),
        p("Products are provided on an \"as is\" and \"as available\" basis."),
      ] },
      { id: "governing-law", title: "10. Governing Law & Jurisdiction", navLabel: "10. Governing law and jurisdiction", subsections: [], blocks: [
        p("These Terms are governed by the laws of India. All disputes shall be subject to the exclusive jurisdiction of the courts located in Delhi, India."),
      ] },
      { id: "modifications", title: "11. Modifications", navLabel: "11. Modifications", subsections: [], blocks: [
        p("SUOS reserves the right to modify these Terms at any time. Continued use of the Platform constitutes acceptance of the revised Terms."),
      ] },
      { id: "contact", title: "12. Contact", navLabel: "12. Contact", subsections: [], blocks: [
        p("For queries or concerns, email SUOS at [support@suosindia.in](mailto:support@suosindia.in)."),
      ] },
    ],
  },
  shippingPolicy: {
    title: "Shipping, Returns & Exchange Policy",
    metaTitle: "Shipping, Returns & Exchange Policy | SUOS",
    metaDescription: "SUOS shipping, return, refund, and exchange terms.",
    intro: [],
    sections: [
      {
        id: "shipping-policy",
        title: "Shipping Policy",
        navLabel: "Shipping policy",
        subsections: [],
        blocks: [
          list(
            "A Cash on Delivery (COD) charge of ₹100 is applicable on COD orders below ₹3,000.",
            "Products are shipped from the warehouse within 4 working days from order confirmation.",
            "Orders are typically delivered within 10 working days from the date of shipment.",
            "Once shipped, the order tracking number will be shared via email or SMS.",
            "For international orders, customs duties or import taxes may be levied by the destination country at the time of delivery. Such charges are the responsibility of the customer.",
          ),
        ],
      },
      {
        id: "returns-policy",
        title: "Returns Policy",
        navLabel: "Returns policy",
        blocks: [
          list(
            "SUOS offers a 7-day return window from the date of delivery, applicable only to returnable products.",
            "Returned products must be unused, unworn, unwashed, and returned with original tags and packaging intact.",
            "International orders are not eligible for return.",
            "Items purchased during sale or clearance are non-returnable (exchange only, if applicable).",
          ),
        ],
        subsections: [
          {
            title: "Charges & Refunds",
            blocks: [
              list(
                "Shipping charges and COD charges are non-refundable.",
                "A non-refundable COD charge of ₹100 applies to all COD orders below ₹3,000.",
                "Once the product is picked up, refunds are initiated within 3 working days:",
                "Prepaid orders: Refund to original payment method",
                "COD orders: Refund processed via Razorpay link sent to the registered email ID",
              ),
            ],
          },
          {
            title: "Important Return Conditions",
            blocks: [
              list(
                "An unboxing video is mandatory for claims related to wrong product or missing items.",
                "Do not hand over the product without a valid pickup slip or SMS confirmation.",
                "Products must not be handed over if the package appears tampered.",
                "Do not share OTP with the delivery partner unless the product has been received.",
                "Post-wash issues will be considered only within 30 days from delivery.",
              ),
            ],
          },
          {
            title: "Non-Serviceable Pincode Returns",
            blocks: [
              list(
                "If reverse pickup is unavailable at the delivery location, the customer must self-ship the product.",
                "Courier reimbursement will be capped at ₹300.",
                "Customers are advised to ship via India Post (Speed Post).",
              ),
            ],
          },
        ],
      },
      {
        id: "exchange-policy",
        title: "Exchange Policy",
        navLabel: "Exchange policy",
        subsections: [],
        blocks: [
          list(
            "Exchanges are free of charge.",
            "Size exchanges are subject to availability.",
            "For exchanges involving a lower-priced item, the balance amount will be issued as a gift voucher.",
            "Only one exchange per order is permitted.",
            "Orders purchased during sale or offers are eligible only for exchange, not return.",
            "An unboxing video is mandatory for wrong product exchange requests.",
          ),
        ],
      },
      {
        id: "policy-support",
        title: "Contact & Support",
        navLabel: "Contact and support",
        subsections: [],
        blocks: [
          p("For shipping, return, or exchange-related queries, email customer support at [support@suosindia.in](mailto:support@suosindia.in)."),
        ],
      },
    ],
  },
}

/**
 * Converts a policy section's blocks to the plain-text format the dashboard
 * editor uses: paragraphs separated by blank lines, list items prefixed "- ".
 */
export function policyBlocksToText(blocks: PolicyBlock[]): string {
  return blocks
    .map((block) =>
      block.type === "paragraph" ? block.text : block.items.map((item) => `- ${item}`).join("\n"),
    )
    .join("\n\n")
}

export function policyTextToBlocks(text: string): PolicyBlock[] {
  const blocks: PolicyBlock[] = []
  const chunks = text.replace(/\r\n/g, "\n").split(/\n{2,}/)
  for (const chunk of chunks) {
    const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean)
    if (!lines.length) continue
    let items: string[] = []
    let paragraph: string[] = []
    const flushItems = () => {
      if (items.length) blocks.push({ type: "list", items })
      items = []
    }
    const flushParagraph = () => {
      if (paragraph.length) blocks.push({ type: "paragraph", text: paragraph.join(" ") })
      paragraph = []
    }
    for (const line of lines) {
      if (/^[-*•]\s+/.test(line)) {
        flushParagraph()
        items.push(line.replace(/^[-*•]\s+/, ""))
      } else {
        flushItems()
        paragraph.push(line)
      }
    }
    flushItems()
    flushParagraph()
  }
  return blocks
}
