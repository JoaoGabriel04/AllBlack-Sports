import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: Ctx) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const product = await db.product.update({ where: { id }, data: body });
  return NextResponse.json(product);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const { id } = await params;
  await db.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
