// /app/api/admin/newsletter/status/route.ts

import { emailQueue } from "@/lib/queue";
import { NextResponse } from "next/server";

export async function GET() {
  const jobs = await emailQueue.getJobs(["active", "waiting", "completed"]);

  const data = jobs.map((job) => ({
    id: job.id,
    progress: job.progress,
    status: job.finishedOn ? "completed" : "processing",
  }));

  return NextResponse.json(data);
}