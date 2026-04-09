// /api/webhook/payment

import { CouponService } from "@/services/coupon.service";

export async function POST(req: Request) {
  const body = await req.json();

  const { couponId, userId, paymentStatus } = body;

  if (paymentStatus === "SUCCESS") {
    await CouponService.markUsed(couponId, userId);

    // also create trading account here
  }

  return new Response("ok");
}