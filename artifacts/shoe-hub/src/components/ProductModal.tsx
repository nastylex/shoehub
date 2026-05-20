import { useState, useEffect } from "react";
import type { Product } from "../types";
import { formatPrice, SIZES } from "../utils";
import { useStore } from "../context/StoreContext";
import { trackLove, trackCartAdd } from "../utils/tracking";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart, showToast } = useStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [wished, setWished] = useState(false);
  const base = import.meta.env.BASE_URL || "/";

  useEffect(() => {
    if (product) {
      setSelectedSize(null);
      setWished(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  function handleAdd() {
    if (!product) return;
    const sz = selectedSize || "38";
    addToCart(product, sz);
    trackCartAdd(product.id, product.name);
    showToast(`✓ ${product.name} (Size ${sz}) added`);
    onClose();
  }

  function handleWish() {
    if (!product) return;
    const next = !wished;
    setWished(next);
    if (next) trackLove(product.id, product.name);
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).id === "modalOverlay") onClose();
  }

  return (
    <div
      id="modalOverlay"
      className={`modal-overlay${product ? " open" : ""}`}
      onClick={handleOverlayClick}
    >
      {product && (
        <div className="modal">
          <div className="modal-img">
            <img
              src={`${base}${product.img}`}
              alt={product.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%23c8a97e22" width="400" height="400"/></svg>`;
              }}
            />
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="modal-body">
            <div className="modal-category">{product.category}</div>
            <h2 className="modal-title">{product.name}</h2>
            <div className="modal-price">{formatPrice(product.price)}</div>
            <p className="modal-desc">{product.desc}</p>
            <div className="modal-size-label">Select Size</div>
            <div className="modal-sizes">
              {SIZES.map(s => (
                <button
                  key={s}
                  className={`modal-size-btn${selectedSize === s ? " selected" : ""}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="modal-actions">
              <button className="modal-add-btn" onClick={handleAdd}>Add to Cart</button>
              <button
                className="modal-wish-btn"
                onClick={handleWish}
                style={{ color: wished ? "#ff6b8a" : undefined, borderColor: wished ? "#ff6b8a" : undefined }}
              >
                {wished ? "♥" : "♡"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
