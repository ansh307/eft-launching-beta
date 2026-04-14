// /workers/emailWorker.ts

import { Worker } from "bullmq";
import IORedis from "ioredis";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});
const resend = new Resend(process.env.RESEND_API_KEY);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

new Worker(
  "newsletter",
  async (job) => {
    const { subject, content, emails, newsletterId } = job.data;

    let sentCount = 0;

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];

      try {
        await resend.emails.send({
          from: "EFT <onboarding@anshsoni55333.info>",
          to: email,
          subject,
          html: content.replace("{{email}}", email),
        });

        sentCount++;
        console.log("✅ Sent:", email);
      } catch (err) {
        console.error("❌ Failed:", email, err);
      }

      // ✅ progress update
      await job.updateProgress(Math.round((i / emails.length) * 100));

      // ✅ rate limit safe
      await sleep(500);
    }

    // Optional: track partial success
    await prisma.newsletter.update({
      where: { id: newsletterId },
      data: {
        sentAt: new Date(),
      },
    });

    return { sentCount };
  },
  {
    connection,
    concurrency: 1, // IMPORTANT (rate limit safety)
  }
);