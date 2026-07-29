import "server-only"

import { cache } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { getAuth } from "@/lib/auth"
import { getPrisma } from "@/lib/server/db"

export const getCurrentUser = cache(async () => {
  const requestHeaders = await headers()
  const session = await getAuth().api.getSession({
    headers: requestHeaders,
  })

  if (!session?.user.id) {
    return null
  }

  return getPrisma().user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  })
})

export async function requireUser() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

export async function requireAdmin() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "ADMIN") {
    redirect("/")
  }

  return user
}

export async function assertAdmin() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  if (user.role !== "ADMIN") {
    throw new Error("Forbidden")
  }

  return user
}
