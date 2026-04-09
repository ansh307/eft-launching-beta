// /app/api/coupon/apply/route.ts

import { NextRequest, NextResponse } from "next/server";
import { CouponService } from "@/services/coupon.service";

export async function POST(req: NextRequest) {
  try {
    const { code, userId, price } = await req.json();

    const coupon = await CouponService.validate(code, userId);
    const finalPrice = CouponService.apply(price, coupon);

    return NextResponse.json({
      success: true,
      discount: coupon.discountValue,
      finalPrice,
      couponId: coupon.id
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}