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

    const newsletter = await prisma.newsletter.create({
      data: { subject, content },
    });

    const subscribers = await prisma.waitlist.findMany({
      where: { subscribed: true },
      select: { email: true },
    });

    const emails = subscribers.map((s) => s.email);

    // 🔥 Split into chunks of 20
    const chunkSize = 20;

    for (let i = 0; i < emails.length; i += chunkSize) {
      const chunk = emails.slice(i, i + chunkSize);

      await emailQueue.add(
        "send-newsletter",
        {
          subject,
          content,
          emails: chunk,
          newsletterId: newsletter.id,
        },
        {
          attempts: 3, // ✅ retry
          backoff: {
            type: "exponential",
            delay: 2000,
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Queued ${emails.length} emails 🚀`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}