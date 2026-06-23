import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const [totalOrders, totalRevenue, totalCustomers, totalProducts, pendingOrders] =
    await Promise.all([
      db.order.count(),
      db.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.product.count(),
      db.order.count({ where: { status: "PENDING" } }),
    ]);

  return NextResponse.json({
    totalOrders,
    totalRevenue: totalRevenue._sum.total ?? 0,
    totalCustomers,
    totalProducts,
    pendingOrders,
  });
}
