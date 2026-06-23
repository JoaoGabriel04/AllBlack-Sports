"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Star, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  featured: boolean;
}

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  images: "",
  category: "camisa-torcedor",
  stock: "0",
  featured: false,
};

const CATEGORIES = [
  { value: "camisa-torcedor", label: "Camisa de Torcedor" },
  { value: "camisa-jogador", label: "Camisa de Jogador" },
  { value: "conjunto", label: "Conjunto Camisa + Bermuda" },
  { value: "kit-treino", label: "Kit Treino" },
];

export default function AdminProdutos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

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

  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      images: p.images.join(", "),
      category: p.category,
      stock: String(p.stock),
      featured: p.featured,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      category: form.category,
      stock: parseInt(form.stock, 10),
      featured: form.featured,
    };

    const url = editing ? `/api/products/${editing.id}` : "/api/products";
    const method = editing ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    setModalOpen(false);
    fetchProducts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Confirma exclusão do produto?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-ink uppercase leading-none"
            style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem" }}
          >
            Produtos
          </h1>
          <p className="text-mute text-sm mt-1">{products.length} cadastrados</p>
        </div>
        <Button onClick={openNew} variant="gold" size="sm">
          <Plus size={14} className="mr-2" />
          Novo produto
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-soft-cloud animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-mute text-sm py-12 text-center">
          Nenhum produto cadastrado.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between bg-soft-cloud border border-hairline p-4 gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                {p.featured && (
                  <Star size={12} className="text-gold shrink-0" fill="#d4af37" />
                )}
                <div className="min-w-0">
                  <p className="text-ink text-sm font-medium truncate">{p.name}</p>
                  <p className="text-mute text-xs">{p.category} · Estoque: {p.stock}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-ink text-sm font-semibold hidden sm:block">
                  R$ {p.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
                <button
                  onClick={() => openEdit(p)}
                  className="text-mute hover:text-ink transition-colors"
                  aria-label="Editar"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-mute hover:text-sale transition-colors"
                  aria-label="Excluir"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-canvas/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-soft-cloud border border-hairline w-full max-w-lg flex flex-col gap-5 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-ink text-sm font-semibold uppercase tracking-wider">
                {editing ? "Editar produto" : "Novo produto"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-mute hover:text-ink"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <Field label="Nome">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-admin"
                  placeholder="Ex: Camisa Brasil Home 2026"
                />
              </Field>

              <Field label="Descrição">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-admin h-20 resize-none"
                  placeholder="Descrição do produto..."
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Preço (R$)">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="input-admin"
                    placeholder="89.90"
                  />
                </Field>
                <Field label="Estoque">
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="input-admin"
                    placeholder="0"
                  />
                </Field>
              </div>

              <Field label="Categoria">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="input-admin"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Imagens (URLs separadas por vírgula)">
                <input
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  className="input-admin"
                  placeholder="https://..."
                />
              </Field>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 accent-gold"
                />
                <span className="text-stone text-sm">Destacar na homepage</span>
              </label>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="gold"
                size="sm"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .input-admin {
          width: 100%;
          height: 2.75rem;
          background: var(--color-canvas);
          border: 1px solid var(--color-hairline);
          border-radius: 0.5rem;
          padding: 0 0.875rem;
          color: var(--color-ink);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .input-admin:focus {
          border-color: var(--color-gold);
        }
        textarea.input-admin {
          height: auto;
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          border-radius: 0.5rem;
        }
        select.input-admin {
          appearance: none;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-stone text-xs font-medium uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}
