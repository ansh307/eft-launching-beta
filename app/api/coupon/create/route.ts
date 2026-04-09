// /app/api/coupon/create/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      code,
      discountType,
      discountValue,
      maxUses,
    } = body;

    // 🧠 Basic Validation
    if (!code || !discountType || !discountValue || !maxUses) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔒 Prevent duplicate coupon
    const existing = await prisma.coupon.findUnique({
      where: { code },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Coupon already exists" },
        { status: 400 }
      );
    }

    // ✅ Create Coupon
    const coupon = await prisma.coupon.create({
      data: {
        code,
        discountType, // "PERCENT" or "FLAT"
        discountValue,
        maxUses,
    
      },
    });

    return NextResponse.json({
      success: true,
      coupon,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}