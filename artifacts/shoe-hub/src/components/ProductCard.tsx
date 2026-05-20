import { useState } from "react";
import type { Product } from "../types";
import { formatPrice, SIZES } from "../utils";

interface ProductCardProps {
  product: Product;
  onOpen: (p: Product) => void;
  style?: React.CSSProperties;
}

export default function ProductCard({ product, onOpen, style }: ProductCardProps) {
  const [fav, setFav] = useState(false);
  const base = import.meta.env.BASE_URL || "/";

  return (
    <div className="product-card" style={style} onClick={() => onOpen(product)}>
      <div className="card-img-wrap">
        <img
          src={`${base}${product.img}`}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="280" height="260"><rect fill="%23c8a97e22" width="280" height="260"/><text x="140" y="130" font-size="13" fill="%23c8a97e" text-anchor="middle">Image not found</text></svg>`;
          }}
        />
        <div className="card-overlay">
          <button className="card-quick-buy" onClick={(e) => { e.stopPropagation(); onOpen(product); }}>
            Quick View
          </button>
        </div>
        {product.new && <div className="card-badge-new">New</div>}
        <button
          className={`card-fav${fav ? " active" : ""}`}
          onClick={(e) => { e.stopPropagation(); setFav(f => !f); }}
        >
          {fav ? "♥" : "♡"}
        </button>
      </div>
      <div className="card-body">
        <div className="card-category">{product.category}</div>
        <div className="card-name">{product.name}</div>
        <div className="card-desc">{product.desc}</div>
        <div className="card-footer">
          <div className="card-price">{formatPrice(product.price)}</div>
        </div>
        <div className="card-sizes">
          {SIZES.map(s => <div key={s} className="size-dot">{s}</div>)}
        </div>
      </div>
    </div>
  );
}
