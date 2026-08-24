"use client"

import { useState } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ContactSubjectSelect() {
  const [subject, setSubject] = useState("")

  return (
    <div className="border-b border-black/55 pb-3">
      <input type="hidden" name="subject" value={subject} />
      <Select value={subject} onValueChange={setSubject}>
        <SelectTrigger aria-label="Select subject" className="h-auto w-full border-0 bg-transparent px-0 py-0 text-sm uppercase text-black/55 shadow-none focus:ring-0">
          <SelectValue placeholder="SELECT SUBJECT" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="order">Order enquiry</SelectItem>
          <SelectItem value="styling">Styling advice</SelectItem>
          <SelectItem value="returns">Returns and exchanges</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
