import { useState } from "react";
import { useStore } from "../context/StoreContext";
import type { Product } from "../types";
import ProductCard from "./ProductCard";

const FILTERS = [
  { label: "All Styles", value: "all" },
  { label: "Classic Pumps", value: "pump" },
  { label: "Kitten Heels", value: "kitten" },
  { label: "Block Heels", value: "block" },
  { label: "Buckle Detail", value: "buckle" },
];

interface ShopSectionProps {
  onOpenProduct: (p: Product) => void;
  activeFilter?: string;
}

export default function ShopSection({ onOpenProduct, activeFilter: externalFilter }: ShopSectionProps) {
  const { products } = useStore();
  const [filter, setFilter] = useState("all");

  const activeTag = externalFilter || filter;

  const filtered = activeTag === "all" ? products : products.filter(p => p.tag === activeTag);

  return (
    <section id="shopSection">
      <div className="section-header">
        <span className="section-tag">Our Collection</span>
        <h2 className="section-title">Crafted to Perfection</h2>
        <p className="section-sub">Each pair is selected for its superior craftsmanship, elegance, and versatility — from boardroom to evening soirée.</p>
      </div>
      <div className="filter-bar">
        {FILTERS.map(f => (
          <button
            key={f.value}
            className={`filter-pill${activeTag === f.value ? " active" : ""}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="products-grid">
        {filtered.map((p, i) => (
          <ProductCard
            key={p.id}
            product={p}
            onOpen={onOpenProduct}
            style={{ animationDelay: `${i * 0.07}s` }}
          />
        ))}
      </div>
    </section>
  );
}
