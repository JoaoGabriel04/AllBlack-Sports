"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buildWhatsAppUrl, buildCartMessage } from "@/lib/whatsapp";

export default function CarrinhoPage() {
  const { items, itemCount, total, removeItem, updateQty, clearCart } =
    useCart();
  const { data: session } = useSession();

  function handleCheckout() {
    const msg = buildCartMessage(
      items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
      total
    );
    const url = buildWhatsAppUrl(msg);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 min-h-screen bg-canvas">
        <div className="max-w-screen-lg mx-auto px-6">
          <h1
            className="text-ink uppercase leading-none mb-10"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
            }}
          >
            Carrinho
          </h1>

          {itemCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
              <p className="text-stone text-lg">Seu carrinho está vazio.</p>
              <Link
                href="/catalogo"
                className="inline-flex items-center h-12 px-8 rounded-full bg-ink text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Explorar catálogo
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Lista de itens */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-soft-cloud p-4"
                  >
                    {/* Imagem */}
                    <div className="relative w-20 h-20 shrink-0 bg-surface-raised overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-raised" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between gap-2 min-w-0">
                      <p className="text-ink text-sm font-semibold leading-snug truncate">
                        {item.name}
                      </p>
                      <p className="text-gold text-sm font-semibold">
                        R$ {item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Qty */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              item.qty > 1
                                ? updateQty(item.id, item.qty - 1)
                                : removeItem(item.id)
                            }
                            className="w-7 h-7 rounded-full bg-surface-raised flex items-center justify-center text-ink hover:bg-hairline transition-colors"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-ink text-sm w-4 text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="w-7 h-7 rounded-full bg-surface-raised flex items-center justify-center text-ink hover:bg-hairline transition-colors"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-mute hover:text-sale transition-colors"
                          aria-label="Remover item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={clearCart}
                  className="text-mute text-xs hover:text-sale transition-colors self-start"
                >
                  Limpar carrinho
                </button>
              </div>

              {/* Resumo */}
              <div className="bg-soft-cloud p-6 h-fit flex flex-col gap-5">
                <h2 className="text-ink text-sm font-semibold uppercase tracking-wider">
                  Resumo do pedido
                </h2>

                <div className="flex flex-col gap-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs text-mute">
                      <span className="truncate mr-2">
                        {item.qty}x {item.name}
                      </span>
                      <span className="shrink-0">
                        R$ {(item.price * item.qty).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-hairline pt-4 flex justify-between items-center">
                  <span className="text-stone text-sm">Total</span>
                  <span className="text-ink font-semibold">
                    R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {session ? (
                  <button
                    onClick={handleCheckout}
                    className="w-full h-12 rounded-full bg-gold text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2"
                  >
                    <WhatsAppIcon />
                    Finalizar via WhatsApp
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="text-mute text-xs text-center">
                      Faça login para finalizar o pedido
                    </p>
                    <Link
                      href="/login"
                      className="w-full h-12 rounded-full bg-ink text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
                    >
                      Entrar
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
