// /app/api/admin/newsletter/test/route.ts

import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { subject, content, email } = await req.json();



  await resend.emails.send({
    from: "EFT <onboarding@anshsoni55333.info>",
    to: email,
    subject,
    html: content
  });

  return NextResponse.json({ success: true });
}