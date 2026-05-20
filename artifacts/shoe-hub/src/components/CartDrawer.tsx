import { useState, useRef } from "react";
import { useStore } from "../context/StoreContext";
import { formatPrice, WA_NUMBER, ORDER_EMAIL } from "../utils";

export default function CartDrawer() {
  const { cart, cartOpen, toggleCart, removeFromCart, changeQty, cartTotal, showToast } = useStore();
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMethod, setConfirmMethod] = useState<"whatsapp" | "email" | null>(null);
  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const base = import.meta.env.BASE_URL || "/";

  function buildOrderSummary() {
    if (cart.length === 0) return null;
    const lines: string[] = [];
    lines.push("*The Shoe Hub — New Order*");
    lines.push("The Shoe Hub - Uganda");
    lines.push("────────────────");
    cart.forEach((i, idx) => {
      lines.push(`${idx + 1}. ${i.name}`);
      lines.push(`   Size ${i.size} · Qty ${i.qty} · ${formatPrice(i.price * i.qty)}`);
    });
    lines.push("────────────────");
    lines.push(`*Total:* ${formatPrice(cartTotal)}`);
    lines.push("");
    if (custName) lines.push(`Customer: ${custName}`);
    if (custPhone) lines.push(`Phone: ${custPhone}`);
    lines.push(`Date: ${new Date().toLocaleString()}`);
    lines.push("");
    lines.push("Please confirm availability and delivery details. Thank you!");
    return lines.join("\n");
  }

  function openConfirm(method: "whatsapp" | "email") {
    if (cart.length === 0) { showToast("Your cart is empty"); return; }
    setConfirmMethod(method);
    setConfirmSuccess(false);
    setConfirmOpen(true);
  }

  function doCheckout() {
    const msg = buildOrderSummary();
    if (!msg) return;
    setConfirmSuccess(true);
    setTimeout(() => {
      setConfirmOpen(false);
      if (confirmMethod === "whatsapp") {
        window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
        showToast("✓ Opening WhatsApp…");
      } else {
        window.location.href = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent("New Order — The Shoe Hub")}&body=${encodeURIComponent(msg)}`;
        showToast("✓ Opening email…");
      }
    }, 1400);
  }

  return (
    <>
      <div className={`cart-drawer${cartOpen ? " open" : ""}`}>
        <div className="cart-header">
          <div className="cart-title">Your Cart</div>
          <button className="cart-close" onClick={toggleCart}>✕</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">👠</div>
              <div className="cart-empty-text">Your cart is empty</div>
            </div>
          ) : (
            cart.map(i => (
              <div key={`${i.id}-${i.size}`} className="cart-item">
                <img
                  className="cart-item-img"
                  src={`${base}${i.img}`}
                  alt={i.name}
                  onError={(e) => { (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect fill="%23c8a97e22" width="64" height="64"/></svg>`; }}
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{i.name}</div>
                  <div className="cart-item-size">Size {i.size}</div>
                  <div className="cart-item-price">{formatPrice(i.price * i.qty)}</div>
                  <div className="cart-qty">
                    <button onClick={() => changeQty(i.id, i.size, -1)}>−</button>
                    <span style={{ fontSize: ".8rem", color: "var(--text-sub)" }}>Qty {i.qty}</span>
                    <button onClick={() => changeQty(i.id, i.size, 1)}>+</button>
                  </div>
                </div>
                <button className="cart-item-rm" onClick={() => removeFromCart(i.id, i.size)}>✕</button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <div className="cart-total-label">Total</div>
              <div className="cart-total-val">{formatPrice(cartTotal)}</div>
            </div>
            <input className="cart-input" placeholder="Your name (optional)" value={custName} onChange={e => setCustName(e.target.value)} />
            <input className="cart-input" placeholder="Your phone (optional)" value={custPhone} onChange={e => setCustPhone(e.target.value)} />
            <button className="checkout-btn wa" onClick={() => openConfirm("whatsapp")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              Send via WhatsApp
            </button>
            <button className="checkout-btn email" onClick={() => openConfirm("email")}>✉ Send via Email</button>
          </div>
        )}
      </div>

      {/* Order confirmation popup */}
      <div
        className={`confirm-overlay${confirmOpen ? " open" : ""}`}
        onClick={(e) => { if ((e.target as HTMLElement).classList.contains("confirm-overlay")) setConfirmOpen(false); }}
      >
        <div className="confirm-box">
          {!confirmSuccess ? (
            <>
              <div className="confirm-icon">🛍️</div>
              <div className="confirm-title">Confirm Your Order</div>
              <div className="confirm-sub">
                Review your order — we'll send it through {confirmMethod === "whatsapp" ? "WhatsApp" : "Email"}.
              </div>
              <div className="confirm-items">
                {cart.map(i => (
                  <div key={`${i.id}-${i.size}`} className="confirm-item">
                    <img
                      className="confirm-item-img"
                      src={`${base}${i.img}`}
                      alt={i.name}
                      onError={(e) => { (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="46" height="46"><rect fill="%23c8a97e22" width="46" height="46"/></svg>`; }}
                    />
                    <div>
                      <div className="confirm-item-name">{i.name}</div>
                      <div className="confirm-item-meta">Size {i.size} · Qty {i.qty}</div>
                    </div>
                    <div className="confirm-item-price">{formatPrice(i.price * i.qty)}</div>
                  </div>
                ))}
              </div>
              <div className="confirm-total">
                <span className="confirm-total-label">Total</span>
                <span className="confirm-total-val">{formatPrice(cartTotal)}</span>
              </div>
              <div className="confirm-actions">
                <button className="confirm-btn-cancel" onClick={() => setConfirmOpen(false)}>Cancel</button>
                <button className="confirm-btn-ok" onClick={doCheckout}>Yes, Place Order</button>
              </div>
            </>
          ) : (
            <div className="confirm-success">
              <span className="confirm-success-icon">✓</span>
              <div className="confirm-success-text">Order confirmed! Opening your message…</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
