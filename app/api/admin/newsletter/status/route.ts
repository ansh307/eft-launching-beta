// /app/api/admin/newsletter/status/route.ts

import { emailQueue } from "@/lib/queue";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "anshsoni55333@gmail.com";

export async function GET() {

  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await currentUser();

  const loggeduseremail = user?.emailAddresses?.[0]?.emailAddress;

  if (loggeduseremail !== ADMIN_EMAIL) {
    return new Response("Forbidden", { status: 403 });
  }

  const jobs = await emailQueue.getJobs(["active", "waiting", "completed"]);

  const data = jobs.map((job) => ({
    id: job.id,
    progress: job.progress,
    status: job.finishedOn ? "completed" : "processing",
  }));

  return NextResponse.json(data);
}