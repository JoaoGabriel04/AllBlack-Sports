import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ShoppingBag, Users, Package, DollarSign, Clock } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  const [totalOrders, revenueAgg, totalCustomers, totalProducts, pendingOrders] =
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

  const totalRevenue = revenueAgg._sum.total ?? 0;

  const stats = [
    {
      label: "Pedidos totais",
      value: totalOrders,
      icon: ShoppingBag,
      format: "number",
    },
    {
      label: "Receita total",
      value: totalRevenue,
      icon: DollarSign,
      format: "currency",
    },
    {
      label: "Clientes",
      value: totalCustomers,
      icon: Users,
      format: "number",
    },
    {
      label: "Produtos cadastrados",
      value: totalProducts,
      icon: Package,
      format: "number",
    },
    {
      label: "Pedidos pendentes",
      value: pendingOrders,
      icon: Clock,
      format: "number",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1
          className="text-ink uppercase leading-none"
          style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem" }}
        >
          Dashboard
        </h1>
        <p className="text-mute text-sm mt-1">Visão geral da AllBlack Sports</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map(({ label, value, icon: Icon, format }) => (
          <div
            key={label}
            className="bg-soft-cloud border border-hairline p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-mute text-xs font-medium uppercase tracking-wider">
                {label}
              </p>
              <Icon size={16} className="text-gold" />
            </div>
            <p
              className="text-ink leading-none"
              style={{ fontFamily: "var(--font-display)", fontSize: "2rem" }}
            >
              {format === "currency"
                ? `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                : value.toLocaleString("pt-BR")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
