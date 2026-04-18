import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { applySuggestion } from "@/lib/merge-suggestion";

// Vercel cron calls this every hour (see vercel.json).
// Any PENDING suggestion past its mergeAt with fewer than 3 flags gets merged.

const FLAG_THRESHOLD = 3;

export async function GET(request: Request) {
  // Protect against non-Vercel callers in production
  const authHeader = request.headers.get("authorization");
  if (
    process.env.NODE_ENV === "production" &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const due = await prisma.cardSuggestion.findMany({
    where: { status: "PENDING", mergeAt: { lte: now } },
    include: { _count: { select: { flags: true } } },
  });

  const toMerge = due.filter((s) => s._count.flags < FLAG_THRESHOLD);
  const toReject = due.filter((s) => s._count.flags >= FLAG_THRESHOLD);

  // Reject flagged suggestions
  if (toReject.length > 0) {
    await prisma.cardSuggestion.updateMany({
      where: { id: { in: toReject.map((s) => s.id) } },
      data: { status: "REJECTED" },
    });
  }

  // Merge approved suggestions
  for (const suggestion of toMerge) {
    await prisma.$transaction((tx) => applySuggestion(tx, suggestion));
  }

  return NextResponse.json({
    merged: toMerge.length,
    rejected: toReject.length,
  });
}
