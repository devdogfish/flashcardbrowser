import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export type AuthOk = { userId: string; error?: never }
export type AuthErr = { error: NextResponse; userId?: never }
export type AuthResult = AuthOk | AuthErr

/**
 * Require a valid Bearer API key. Returns { userId } on success or
 * { error: NextResponse } which the caller should return immediately.
 */
export async function authenticate(request: Request): Promise<AuthResult> {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: NextResponse.json({ error: "Missing or invalid Authorization header" }, { status: 401 }) }
  }

  const rawKey = authHeader.slice(7).trim()
  const apiKey = await prisma.apiKey.findUnique({
    where: { key: rawKey },
    select: { id: true, userId: true },
  })

  if (!apiKey) {
    return { error: NextResponse.json({ error: "Invalid API key" }, { status: 401 }) }
  }

  prisma.apiKey.update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } }).catch(() => {})

  return { userId: apiKey.userId }
}

/**
 * Try to authenticate via Bearer API key without failing if the header is
 * absent. Returns the userId if authenticated, null otherwise.
 */
export async function optionalAuthenticate(request: Request): Promise<string | null> {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) return null

  const rawKey = authHeader.slice(7).trim()
  const apiKey = await prisma.apiKey.findUnique({
    where: { key: rawKey },
    select: { id: true, userId: true },
  })
  if (!apiKey) return null

  prisma.apiKey.update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } }).catch(() => {})

  return apiKey.userId
}
