// // /app/api/coupon/list/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { Prisma } from "@prisma/client"; // ✅ important

// export async function GET(req: NextRequest) {
//   try {
//     // 🔐 OPTIONAL: Protect this route (recommended)
//     /*
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== "ADMIN") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     */

//     const { searchParams } = new URL(req.url);

//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = parseInt(searchParams.get("limit") || "10");
//     const search = searchParams.get("search") || "";

//     const skip = (page - 1) * limit;

//     // ✅ Type-safe filter
//     const where: Prisma.CouponWhereInput = {
//       ...(search && {
//         code: {
//           contains: search,
//           mode: "insensitive",
//         },
//       }),
//     };

//     // 📦 Fetch data
//     const [coupons, total] = await Promise.all([
//       prisma.coupon.findMany({
//         where,
//         skip,
//         take: limit,
//         orderBy: { createdAt: "desc" },
//       }),
//       prisma.coupon.count({ where }),
//     ]);

//     return NextResponse.json({
//       success: true,
//       data: coupons,
//       pagination: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       { error: "Failed to fetch coupons" },
//       { status: 500 }
//     );
//   }
// }