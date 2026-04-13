// /app/api/admin/newsletter/send/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ⏱️ helper delay
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

    const emails = subscribers.map((s) => s.email);

    // 3. Send emails ONE BY ONE (rate-limit safe)
    for (const email of emails) {
      try {
        await resend.emails.send({
          from: "EFT <onboarding@anshsoni55333.info>",
          to: email,
          subject,
          html: content.replace("{{email}}", email),
          headers: {
            "List-Unsubscribe": `<https://yourdomain.com/unsubscribe?email=${email}>`,
          },
        });

        console.log("Sent to:", email);

        // ✅ IMPORTANT: 500ms delay = ~2 req/sec
        await sleep(500);
      } catch (err) {
        console.error("Failed:", email, err);

        // optional: still wait to avoid burst
        await sleep(500);
      }
    }

    // 4. Mark as sent
    await prisma.newsletter.update({
      where: { id: newsletter.id },
      data: { sentAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}