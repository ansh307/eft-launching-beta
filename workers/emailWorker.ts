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

    console.log("📨 Sending newsletter to", emails.length, "users");

    for (const email of emails) {
      try {
        await resend.emails.send({
          from: "EFT <onboarding@anshsoni55333.info>",
          to: email,
          subject,
          html: content.replace("{{email}}", email),
        });

        console.log("✅ Sent to:", email);

        // rate limit safe
        await sleep(500);
      } catch (err) {
        console.error("❌ Failed:", email, err);
        await sleep(500);
      }
    }

    // mark as sent
    await prisma.newsletter.update({
      where: { id: newsletterId },
      data: { sentAt: new Date() },
    });

    console.log("🎉 Newsletter completed");
  },
  { connection }
);