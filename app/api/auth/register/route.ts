import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.password || !body?.name) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { name, email, password } = body as {
    name: string;
    email: string;
    password: string;
  };

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Senha deve ter ao menos 6 caracteres." },
      { status: 400 }
    );
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Este e-mail já está em uso." },
      { status: 409 }
    );
  }

  const hash = await bcrypt.hash(password, 12);
  await db.user.create({
    data: { name, email, password: hash, role: "CUSTOMER" },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
