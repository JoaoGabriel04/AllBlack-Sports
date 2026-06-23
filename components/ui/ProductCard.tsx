"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { Badge } from "@/components/ui/Badge";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  featured?: boolean;
}

export function ProductCard({
  id,
  name,
  price,
  images,
  category,
  stock,
}: ProductCardProps) {
  const { addItem } = useCart();

  const categoryLabel: Record<string, string> = {
    "camisa-torcedor": "Camisa de Torcedor",
    "camisa-jogador": "Camisa de Jogador",
    conjunto: "Conjunto Camisa + Bermuda",
    "kit-treino": "Kit Treino",
  };

  function handleAddToCart() {
    addItem({
      id,
      name,
      price,
      qty: 1,
      image: images[0] ?? "",
    });
  }

  return (
    <div className="group relative bg-soft-cloud transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(212,175,55,0.15)]">
      {/* Imagem */}
      <div className="relative aspect-square overflow-hidden bg-surface-raised">
        {images[0] ? (
          <Image
            src={images[0]}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-mute text-sm">
            Sem imagem
          </div>
        )}

        {stock === 0 && (
          <div className="absolute inset-0 bg-canvas/70 flex items-center justify-center">
            <span className="text-stone text-sm font-medium">Esgotado</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1">
        <p className="text-mute text-xs">{categoryLabel[category] ?? category}</p>
        <p className="text-ink text-sm font-semibold leading-snug line-clamp-2">
          {name}
        </p>

        <div className="flex items-center justify-between mt-2">
          <span className="text-ink font-semibold">
            R${" "}
            {price.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            aria-label={`Adicionar ${name} ao carrinho`}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-ink text-on-primary hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            <ShoppingCart size={16} />
          </button>
        </div>

        {stock > 0 && stock <= 5 && (
          <Badge variant="sale" className="self-start mt-1">
            Últimas {stock} unidades
          </Badge>
        )}
      </div>
    </div>
  );
}
