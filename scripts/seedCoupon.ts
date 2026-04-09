// scripts/seedCoupon.ts

import {prisma} from "@/lib/prisma";

async function main() {
  await prisma.coupon.create({
    data: {
      code: "LAUNCH50",
      discountType: "PERCENT",
      discountValue: 50,
      maxUses: 1000
    }
  });

  console.log("Coupon created");
}

main();