import Link from "next/link"
import type { ReactNode } from "react"

import {
  PolicyDocument,
  PolicyIntroduction,
  PolicyList,
  PolicySection,
  PolicySubsection,
} from "@/components/legal/PolicyDocument"
import type { PolicyBlock, PolicyContent } from "@/lib/site-content"

const LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|\/[^\s)]*)\)/g

/**
 * Renders editor text with inline markdown-style links, e.g.
 * `[support@suosindia.in](mailto:support@suosindia.in)`.
 */
export function renderInlineText(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  const pattern = new RegExp(LINK_PATTERN.source, "g")

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    const [, label, href] = match
    const external = href.startsWith("http")
    nodes.push(
      <Link
        key={`${match.index}-${href}`}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="text-black underline underline-offset-2"
      >
        {label}
      </Link>,
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

function PolicyBlocks({ blocks }: { blocks: PolicyBlock[] }) {
  return (
    <>
      {blocks.map((block, index) =>
        block.type === "paragraph" ? (
          <p key={index}>{renderInlineText(block.text)}</p>
        ) : (
          <PolicyList key={index}>
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{renderInlineText(item)}</li>
            ))}
          </PolicyList>
        ),
      )}
    </>
  )
}

export function PolicyRenderer({ policy, id }: { policy: PolicyContent; id?: string }) {
  const navigation = policy.sections.map((section) => ({
    href: `#${section.id}`,
    label: section.navLabel || section.title,
  }))

  return (
    <PolicyDocument id={id} title={policy.title} navigation={navigation}>
      {policy.intro.length ? (
        <PolicyIntroduction>
          {policy.intro.map((paragraph, index) => (
            <p key={index}>{renderInlineText(paragraph)}</p>
          ))}
        </PolicyIntroduction>
      ) : null}

      {policy.sections.map((section) => (
        <PolicySection key={section.id} id={section.id} title={section.title}>
          <PolicyBlocks blocks={section.blocks} />
          {section.subsections.map((subsection) => (
            <PolicySubsection key={subsection.title} title={subsection.title}>
              <PolicyBlocks blocks={subsection.blocks} />
            </PolicySubsection>
          ))}
        </PolicySection>
      ))}
    </PolicyDocument>
  )
}
