import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  const category = searchParams.get("category");

  const products = await db.product.findMany({
    where: {
      ...(featured === "true" ? { featured: true } : {}),
      ...(category ? { category } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const body = await request.json();
  const product = await db.product.create({ data: body });
  return NextResponse.json(product, { status: 201 });
}
