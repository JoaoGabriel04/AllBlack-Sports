"use client";

import { cn } from "@/lib/utils";

interface CatalogSidebarProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

const CATEGORIES = [
  { value: "", label: "Todos" },
  { value: "camisa-torcedor", label: "Camisa de Torcedor" },
  { value: "camisa-jogador", label: "Camisa de Jogador" },
  { value: "conjunto", label: "Conjunto Camisa + Bermuda" },
  { value: "kit-treino", label: "Kit Treino" },
];

export function CatalogSidebar({
  activeCategory,
  onCategoryChange,
}: CatalogSidebarProps) {
  return (
    <aside className="w-full lg:w-56 shrink-0 flex flex-col gap-6">
      <div>
        <p className="text-stone text-xs font-medium uppercase tracking-wider mb-3">
          Categoria
        </p>
        <div className="flex flex-wrap lg:flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={cn(
                "h-9 px-4 rounded-full text-sm font-medium transition-colors text-left whitespace-nowrap shrink-0",
                activeCategory === cat.value
                  ? "bg-gold text-on-primary"
                  : "bg-soft-cloud text-stone hover:text-ink hover:bg-surface-raised"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
