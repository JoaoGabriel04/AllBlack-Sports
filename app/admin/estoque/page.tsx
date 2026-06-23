"use client";

import { useState, useEffect, useCallback } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
}

export default function AdminEstoque() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function updateStock(id: string, stock: number) {
    setUpdating(id);
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock }),
    });
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock } : p))
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
          Estoque
        </h1>
        <p className="text-mute text-sm mt-1">Controle de quantidade por produto</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-soft-cloud animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between bg-soft-cloud border border-hairline p-4 gap-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-ink text-sm font-medium truncate">{p.name}</p>
                <p className="text-mute text-xs">{p.category}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {p.stock === 0 && (
                  <span className="text-sale text-xs font-medium hidden sm:block">
                    Esgotado
                  </span>
                )}
                {p.stock > 0 && p.stock <= 5 && (
                  <span className="text-gold text-xs font-medium hidden sm:block">
                    Baixo
                  </span>
                )}

                <input
                  type="number"
                  min="0"
                  defaultValue={p.stock}
                  key={p.stock}
                  onBlur={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val !== p.stock) updateStock(p.id, val);
                  }}
                  disabled={updating === p.id}
                  className="w-20 h-9 bg-canvas border border-hairline rounded-lg px-3 text-ink text-sm text-center outline-none focus:border-gold transition-colors disabled:opacity-50"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
