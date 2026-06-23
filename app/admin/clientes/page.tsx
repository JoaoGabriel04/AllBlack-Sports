import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function AdminClientes() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  const clients = await db.user.findMany({
    where: { role: "CUSTOMER" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          className="text-ink uppercase leading-none"
          style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem" }}
        >
          Clientes
        </h1>
        <p className="text-mute text-sm mt-1">{clients.length} clientes cadastrados</p>
      </div>

      <div className="flex flex-col gap-2">
        {clients.length === 0 ? (
          <p className="text-mute text-sm py-12 text-center">Nenhum cliente ainda.</p>
        ) : (
          clients.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between bg-soft-cloud border border-hairline p-4"
            >
              <div>
                <p className="text-ink text-sm font-medium">{c.name ?? "—"}</p>
                <p className="text-mute text-xs">{c.email}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-ink text-sm">{c._count.orders} pedidos</p>
                <p className="text-mute text-xs">
                  Desde {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
