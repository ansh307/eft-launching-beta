// /services/coupon.service.ts

import {prisma} from "@/lib/prisma";

export class CouponService {
  static async validate(code: string, userId: string) {
    const coupon = await prisma.coupon.findUnique({
      where: { code }
    });

    if (!coupon || !coupon.isActive) {
      throw new Error("Invalid coupon");
    }

    if (coupon.usedCount >= coupon.maxUses) {
      throw new Error("Coupon limit reached");
    }

    const used = await prisma.couponUsage.findUnique({
      where: {
        couponId_userId: {
          couponId: coupon.id,
          userId
        }
      }
    });

    if (used) {
      throw new Error("Already used");
    }

    return coupon;
  }

  static apply(price: number, coupon: any) {
    return price - (price * coupon.discountValue) / 100;
  }

  static async markUsed(couponId: string, userId: string) {
    await prisma.$transaction([
      prisma.couponUsage.create({
        data: { couponId, userId }
      }),
      prisma.coupon.update({
        where: { id: couponId },
        data: {
          usedCount: { increment: 1 }
        }
      })
    ]);
  }
}