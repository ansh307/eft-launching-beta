// /app/api/unsubscribe/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  await prisma.waitlist.update({
    where: { email },
    data: { subscribed: false },
  });

  return NextResponse.json({ success: true });
}