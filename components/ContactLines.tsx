import { contactLineHref, type ContactLine } from "@/lib/contact-lines"
import { cn } from "@/lib/utils"

/** One contact line: "Label: value", linked for email / phone / WhatsApp. */
export function ContactLineItem({ line, className }: { line: ContactLine; className?: string }) {
  const href = contactLineHref(line)
  const label = line.label.trim() || (line.type === "whatsapp" ? "WhatsApp" : "")
  const value = href ? (
    <a
      href={href}
      target={line.type === "whatsapp" ? "_blank" : undefined}
      rel={line.type === "whatsapp" ? "noopener noreferrer" : undefined}
      className="underline-offset-4 hover:underline"
    >
      {line.value}
    </a>
  ) : (
    line.value
  )

  return (
    <p className={cn(line.type === "email" && "break-all", className)}>
      {label ? `${label}: ` : null}
      {value}
    </p>
  )
}
