import { redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Aguardando",
  CONFIRMED: "Confirmado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [orders, vouchers, deliveredCount] = await Promise.all([
    db.order.findMany({
      where: { userId: session.user.id },
      include: { items: { include: { product: { select: { name: true, images: true } } } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    db.voucher.findMany({
      where: { userId: session.user.id, used: false },
      orderBy: { createdAt: "desc" },
    }),
    db.order.count({ where: { userId: session.user.id, status: "DELIVERED" } }),
  ]);

  const loyaltyProgress = deliveredCount % 10;
  const nextVoucherAt = 10 - loyaltyProgress;

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 min-h-screen bg-canvas">
        <div className="max-w-screen-lg mx-auto px-6 flex flex-col gap-10">
          {/* Cabeçalho de perfil */}
          <div className="flex items-center gap-5">
            <div className="relative w-16 h-16 rounded-full bg-soft-cloud overflow-hidden shrink-0">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? "Usuário"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-mute text-xl font-bold">
                  {(session.user.name ?? session.user.email ?? "U")[0].toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-ink font-semibold">{session.user.name ?? "Usuário"}</p>
              <p className="text-mute text-sm">{session.user.email}</p>
            </div>
          </div>

          {/* Fidelidade */}
          <div className="bg-soft-cloud p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-ink text-sm font-semibold uppercase tracking-wider">
                Programa de Fidelidade
              </h2>
              {vouchers.length > 0 && (
                <span className="text-gold text-xs font-medium">
                  {vouchers.length} voucher{vouchers.length > 1 ? "s" : ""} disponível
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-mute">
                <span>{loyaltyProgress} pedidos entregues</span>
                <span>Próximo voucher em {nextVoucherAt} pedido{nextVoucherAt !== 1 ? "s" : ""}</span>
              </div>
              <div className="h-1.5 bg-surface-raised rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-500"
                  style={{ width: `${(loyaltyProgress / 10) * 100}%` }}
                />
              </div>
            </div>

            {vouchers.length > 0 && (
              <div className="flex flex-col gap-2 pt-2">
                {vouchers.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between bg-canvas border border-gold/30 p-4"
                  >
                    <div>
                      <p className="text-gold text-sm font-semibold">
                        R$ {v.value.toFixed(2)} de desconto
                      </p>
                      <p className="text-mute text-xs">
                        Mencione no WhatsApp ao finalizar o pedido
                      </p>
                    </div>
                    <span className="text-gold text-xs font-medium bg-gold/10 px-3 py-1 rounded-full">
                      Disponível
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pedidos */}
          <div className="flex flex-col gap-4">
            <h2 className="text-ink text-sm font-semibold uppercase tracking-wider">
              Meus Pedidos
            </h2>

            {orders.length === 0 ? (
              <p className="text-mute text-sm py-8 text-center">
                Você ainda não fez nenhum pedido.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {orders.map((order) => (
                  <div key={order.id} className="bg-soft-cloud p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="text-mute text-xs">
                        Pedido {order.id.slice(-8).toUpperCase()} ·{" "}
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="flex flex-col gap-1">
                      {order.items.map((item) => (
                        <p key={item.id} className="text-stone text-xs">
                          {item.qty}x {item.product.name}
                        </p>
                      ))}
                    </div>

                    <p className="text-ink text-sm font-semibold">
                      R$ {order.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "text-stone bg-stone/10",
    CONFIRMED: "text-gold bg-gold/10",
    SHIPPED: "text-blue-400 bg-blue-400/10",
    DELIVERED: "text-success bg-success/10",
    CANCELLED: "text-sale bg-sale/10",
  };

  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${colors[status] ?? "text-mute bg-mute/10"}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
