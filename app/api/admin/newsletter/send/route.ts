// /app/api/admin/newsletter/send/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { emailQueue } from "@/lib/queue";

export async function POST(req: Request) {
  try {
    const { subject, content } = await req.json();

    if (!subject || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1. Save newsletter
    const newsletter = await prisma.newsletter.create({
      data: { subject, content },
    });

    // 2. Get subscribers
    const subscribers = await prisma.waitlist.findMany({
      where: { subscribed: true },
      select: { email: true },
    });

    // 3. Add to queue (NOT sending here)
    await emailQueue.add("send-newsletter", {
      subject,
      content,
      emails: subscribers.map((s) => s.email),
      newsletterId: newsletter.id,
    });

    return NextResponse.json({
      success: true,
      message: "Newsletter queued 🚀",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}