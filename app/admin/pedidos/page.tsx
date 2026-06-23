"use client";

import { useState, useEffect, useCallback } from "react";

interface OrderItem {
  id: string;
  qty: number;
  price: number;
  product: { name: string };
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  user: { name: string | null; email: string };
  items: OrderItem[];
}

const STATUSES = [
  { value: "PENDING", label: "Aguardando" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELLED", label: "Cancelado" },
];

const STATUS_COLOR: Record<string, string> = {
  PENDING: "text-stone",
  CONFIRMED: "text-gold",
  SHIPPED: "text-blue-400",
  DELIVERED: "text-success",
  CANCELLED: "text-sale",
};

export default function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    setUpdating(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          className="text-ink uppercase leading-none"
          style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem" }}
        >
          Pedidos
        </h1>
        <p className="text-mute text-sm mt-1">{orders.length} pedidos no sistema</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-soft-cloud animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-mute text-sm py-12 text-center">Nenhum pedido ainda.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-soft-cloud border border-hairline p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-ink text-sm font-medium">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-mute text-xs">
                    {order.user.name ?? order.user.email} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                  <div className="flex flex-col gap-0.5 mt-2">
                    {order.items.map((item) => (
                      <p key={item.id} className="text-stone text-xs">
                        {item.qty}x {item.product.name}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="text-ink text-sm font-semibold">
                    R$ {order.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <select
                    value={order.status}
                    disabled={updating === order.id}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`bg-canvas border border-hairline rounded-lg px-3 h-8 text-xs outline-none focus:border-gold transition-colors disabled:opacity-50 ${STATUS_COLOR[order.status] ?? "text-mute"}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
