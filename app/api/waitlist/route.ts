import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { Resend } from "resend";
import { welcomeEmail } from "@/emails/welcome";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // check if already exists
    const existing = await prisma.waitlist.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({
        message: "You are already on the waitlist",
        alreadyExists: true,
      });
    }

    const waitlistUser = await prisma.waitlist.create({
      data: {
        email,
        name,
      },
    });

     // Send email
    await resend.emails.send({
      from: "EFT <onboarding@anshsoni55333.info>", // change later
      to: email,
      subject: "Welcome to the EFT",
      html: welcomeEmail(email),
    });

    return NextResponse.json({
      success: true,
      data: waitlistUser,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const users = await prisma.waitlist.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return Response.json(users);
}