"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { CatalogSidebar } from "./CatalogSidebar";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  featured: boolean;
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");

  useEffect(() => {
    setLoading(true);
    const url = category
      ? `/api/products?category=${encodeURIComponent(category)}`
      : "/api/products";

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-screen-xl mx-auto px-6">
      <CatalogSidebar
        activeCategory={category}
        onCategoryChange={setCategory}
      />

      <div className="flex-1">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-soft-cloud animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <p className="text-mute text-sm">
              Nenhum produto encontrado nessa categoria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
