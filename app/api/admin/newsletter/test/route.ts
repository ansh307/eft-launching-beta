// /app/api/admin/newsletter/test/route.ts

import { Resend } from "resend";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "anshsoni55333@gmail.com";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { subject, content, email } = await req.json();

 const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await currentUser();

  const loggeduseremail = user?.emailAddresses?.[0]?.emailAddress;

  if (loggeduseremail !== ADMIN_EMAIL) {
    return new Response("Forbidden", { status: 403 });
  }


  await resend.emails.send({
    from: "EFT <onboarding@anshsoni55333.info>",
    to: email,
    subject,
    html: content
  });

  return NextResponse.json({ success: true });
}