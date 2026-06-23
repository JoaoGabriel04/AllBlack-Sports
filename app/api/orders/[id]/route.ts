import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkAndGrantVoucher } from "@/lib/loyalty";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Ctx) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await request.json();

  const order = await db.order.update({
    where: { id },
    data: { status },
  });

  if (status === "DELIVERED") {
    await checkAndGrantVoucher(order.userId);
  }

  return NextResponse.json(order);
}
