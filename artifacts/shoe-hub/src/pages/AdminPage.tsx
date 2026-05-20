import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell
} from "recharts";
import type { Product } from "../types";
import { loadStats, type ProductStat } from "../utils/tracking";

const ADMIN_PASSWORD = "shoehub2026";
const LS_AUTH = "shoeHubAdminAuth";
const LS_PRODUCTS = "shoeHubProducts";

const CATEGORIES = ["Classic Pumps", "Kitten Heels", "Block Heels", "Buckle Heels", "Mary Jane"];
const TAGS = ["pump", "kitten", "block", "buckle", "mary"];

const ALL_IMAGES = [
  "1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","8.jpg","9.jpg","10.jpg",
  "11.jpg","12.jpg","13.jpg","14.jpg","15.jpg","16.jpg","17.jpg","18.jpg","19.jpg","20.jpg",
  "21.jpg","22.jpg","23.jpg","24.jpg","25.jpg","26.jpg","27.jpg","28.jpg","29.jpg",
  "pic.jpg","img_1779302508_5a251b97.png"
];

const EMPTY_FORM: Omit<Product, "id"> = {
  img: "1.jpg",
  name: "",
  category: "Classic Pumps",
  tag: "pump",
  desc: "",
  price: 150000,
  new: false,
};

function fmt(n: number) {
  return "UGX " + n.toLocaleString();
}

function saveProducts(products: Product[]) {
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(products));
}

function loadProducts(): Product[] | null {
  try {
    const raw = localStorage.getItem(LS_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return null;
}

/* ── Login screen ── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      localStorage.setItem(LS_AUTH, "1");
      onLogin();
    } else {
      setErr(true);
      setPw("");
    }
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="nav-logo" style={{ fontSize: "1.6rem", marginBottom: 8 }}>
          The Shoe Hub <span>ADMIN</span>
        </div>
        <p style={{ color: "var(--muted)", marginBottom: 28, fontSize: "0.9rem" }}>
          Enter your password to access the admin panel.
        </p>
        <form onSubmit={submit}>
          <input
            className="admin-input"
            type="password"
            placeholder="Password"
            value={pw}
            onChange={e => { setPw(e.target.value); setErr(false); }}
            autoFocus
          />
          {err && <p style={{ color: "#e55", fontSize: "0.85rem", margin: "6px 0 0" }}>Incorrect password.</p>}
          <button className="btn-primary" type="submit" style={{ width: "100%", marginTop: 16 }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Image picker modal ── */
function ImagePicker({ current, onSelect, onClose }: { current: string; onSelect: (img: string) => void; onClose: () => void }) {
  const base = import.meta.env.BASE_URL || "/";
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: "1.4rem" }}>Pick an image</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="admin-img-grid">
          {ALL_IMAGES.map(img => (
            <div
              key={img}
              className={`admin-img-thumb${img === current ? " selected" : ""}`}
              onClick={() => { onSelect(img); onClose(); }}
            >
              <img src={`${base}${img}`} alt={img} onError={e => { (e.target as HTMLImageElement).style.opacity = "0.3"; }} />
              <span>{img}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Product form ── */
function ProductForm({
  initial,
  existingIds,
  onSave,
  onCancel,
}: {
  initial: Product | null;
  existingIds: number[];
  onSave: (p: Product) => void;
  onCancel: () => void;
}) {
  const base = import.meta.env.BASE_URL || "/";
  const [form, setForm] = useState<Omit<Product, "id">>(initial ?? EMPTY_FORM);
  const [showPicker, setShowPicker] = useState(false);

  function set(field: keyof typeof form, value: unknown) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const id = initial?.id ?? Math.max(0, ...existingIds) + 1;
    onSave({ id, ...form });
  }

  return (
    <>
      <form className="admin-form" onSubmit={submit}>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", margin: "0 0 20px" }}>
          {initial ? "Edit Product" : "Add New Product"}
        </h3>

        {/* Image */}
        <div className="admin-form-row">
          <label>Image</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src={`${base}${form.img}`}
              alt={form.img}
              style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, background: "#eee" }}
              onError={e => { (e.target as HTMLImageElement).style.opacity = "0.3"; }}
            />
            <button type="button" className="admin-btn-outline" onClick={() => setShowPicker(true)}>
              Change image
            </button>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{form.img}</span>
          </div>
        </div>

        {/* Name */}
        <div className="admin-form-row">
          <label>Name *</label>
          <input className="admin-input" value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Crimson Lizard Pump" required />
        </div>

        {/* Category + Tag */}
        <div className="admin-form-2col">
          <div className="admin-form-row">
            <label>Category</label>
            <select className="admin-input" value={form.category} onChange={e => set("category", e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="admin-form-row">
            <label>Filter tag</label>
            <select className="admin-input" value={form.tag} onChange={e => set("tag", e.target.value)}>
              {TAGS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="admin-form-row">
          <label>Description</label>
          <textarea className="admin-input admin-textarea" value={form.desc} onChange={e => set("desc", e.target.value)} placeholder="Short product description..." rows={3} />
        </div>

        {/* Price + New */}
        <div className="admin-form-2col">
          <div className="admin-form-row">
            <label>Price (UGX)</label>
            <input className="admin-input" type="number" min={0} value={form.price} onChange={e => set("price", Number(e.target.value))} />
            <span style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 4 }}>{fmt(form.price)}</span>
          </div>
          <div className="admin-form-row" style={{ justifyContent: "center" }}>
            <label>New arrival</label>
            <label className="admin-toggle">
              <input type="checkbox" checked={form.new} onChange={e => set("new", e.target.checked)} />
              <span className="admin-toggle-slider" />
            </label>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button className="btn-primary" type="submit">Save product</button>
          <button className="admin-btn-outline" type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>

      {showPicker && (
        <ImagePicker
          current={form.img}
          onSelect={img => set("img", img)}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}

/* ── Custom tooltip ── */
function ChartTip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--glass-border)", borderRadius: 10, padding: "10px 14px", backdropFilter: "blur(12px)", fontSize: "0.82rem" }}>
      <div style={{ fontWeight: 600, marginBottom: 6, color: "var(--text-main)" }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
}

/* ── Analytics section ── */
function AnalyticsSection() {
  const [stats, setStats] = useState<ProductStat[]>([]);

  useEffect(() => {
    setStats(loadStats());
    const t = setInterval(() => setStats(loadStats()), 5000);
    return () => clearInterval(t);
  }, []);

  function clearStats() {
    localStorage.removeItem("productStats");
    setStats([]);
  }

  const top10 = stats.slice(0, 10);
  const totalViews = stats.reduce((a, s) => a + s.views, 0);
  const totalLikes = stats.reduce((a, s) => a + s.likes, 0);
  const totalLoves = stats.reduce((a, s) => a + s.loves, 0);
  const totalCarts = stats.reduce((a, s) => a + s.cartAdds, 0);

  const chartData = top10.map(s => ({
    name: s.name.length > 16 ? s.name.slice(0, 15) + "…" : s.name,
    Views: s.views,
    Liked: s.likes,
    Loved: s.loves,
    "In Cart": s.cartAdds,
  }));

  const COLORS = { Views: "#c8a97e", Liked: "#ff9eb5", Loved: "#e8456a", "In Cart": "#6dbfa7" };

  if (stats.length === 0) {
    return (
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", margin: "0 0 12px" }}>Analytics</h2>
        <div className="glass-panel" style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>📊</div>
          <div style={{ fontWeight: 500, marginBottom: 6 }}>No engagement data yet</div>
          <div style={{ fontSize: "0.85rem" }}>Data will appear here as customers browse and interact with products on the store.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", margin: 0 }}>Analytics</h2>
        <button className="admin-btn-outline" style={{ fontSize: "0.8rem" }} onClick={clearStats}>Clear data</button>
      </div>

      {/* Engagement totals */}
      <div className="admin-stats" style={{ marginBottom: 20 }}>
        <div className="admin-stat-card">
          <div className="admin-stat-val" style={{ color: "#c8a97e" }}>{totalViews}</div>
          <div className="admin-stat-label">👁 Product views</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-val" style={{ color: "#ff9eb5" }}>{totalLikes}</div>
          <div className="admin-stat-label">♡ Liked</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-val" style={{ color: "#e8456a" }}>{totalLoves}</div>
          <div className="admin-stat-label">♥ Loved (wishlisted)</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-val" style={{ color: "#6dbfa7" }}>{totalCarts}</div>
          <div className="admin-stat-label">🛒 Added to cart</div>
        </div>
      </div>

      {/* Views chart */}
      <div className="glass-panel" style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontWeight: 600, marginBottom: 16 }}>
          Most Viewed Products
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,169,126,0.15)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-sub)" }} angle={-30} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 11, fill: "var(--text-sub)" }} allowDecimals={false} />
            <Tooltip content={<ChartTip />} />
            <Bar dataKey="Views" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => <Cell key={i} fill={`rgba(200,169,126,${0.5 + (chartData.length - i) / chartData.length * 0.5})`} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Liked vs Loved vs Cart */}
      <div className="glass-panel">
        <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontWeight: 600, marginBottom: 16 }}>
          Liked ♡ · Loved ♥ · Added to Cart 🛒
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,169,126,0.15)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-sub)" }} angle={-30} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 11, fill: "var(--text-sub)" }} allowDecimals={false} />
            <Tooltip content={<ChartTip />} />
            <Legend wrapperStyle={{ fontSize: "0.82rem", paddingTop: 8 }} />
            <Bar dataKey="Liked" fill={COLORS["Liked"]} radius={[3, 3, 0, 0]} />
            <Bar dataKey="Loved" fill={COLORS["Loved"]} radius={[3, 3, 0, 0]} />
            <Bar dataKey="In Cart" fill={COLORS["In Cart"]} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ── Main admin page ── */
export default function AdminPage() {
  const [authed, setAuthed] = useState(!!localStorage.getItem(LS_AUTH));
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null | "new">(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const base = import.meta.env.BASE_URL || "/";

  useEffect(() => {
    if (!authed) return;
    const stored = loadProducts();
    if (stored) setProducts(stored);
  }, [authed]);

  function persist(updated: Product[]) {
    setProducts(updated);
    saveProducts(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleSave(product: Product) {
    const updated = products.find(p => p.id === product.id)
      ? products.map(p => p.id === product.id ? product : p)
      : [...products, product];
    persist(updated);
    setEditing(null);
  }

  function handleDelete(id: number) {
    persist(products.filter(p => p.id !== id));
    setConfirmDelete(null);
  }

  function logout() {
    localStorage.removeItem(LS_AUTH);
    setAuthed(false);
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const newCount = products.filter(p => p.new).length;

  return (
    <div className="admin-wrap">
      {/* Header */}
      <div className="admin-header">
        <div>
          <div className="nav-logo" style={{ fontSize: "1.4rem" }}>
            The Shoe Hub <span>ADMIN</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 2 }}>
            Product Management Panel
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href={base} className="admin-btn-outline" style={{ textDecoration: "none" }}>← View store</a>
          <button className="admin-btn-outline" onClick={logout}>Sign out</button>
        </div>
      </div>

      <div className="admin-content">
        {/* Stats row */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-val">{products.length}</div>
            <div className="admin-stat-label">Total products</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-val">{newCount}</div>
            <div className="admin-stat-label">New arrivals</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-val">
              {products.length ? fmt(Math.min(...products.map(p => p.price))) : "—"}
            </div>
            <div className="admin-stat-label">Lowest price</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-val">
              {products.length ? fmt(Math.max(...products.map(p => p.price))) : "—"}
            </div>
            <div className="admin-stat-label">Highest price</div>
          </div>
        </div>

        {/* Analytics */}
        <AnalyticsSection />

        {/* Add product */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", margin: 0 }}>
            Products {saved && <span style={{ fontSize: "0.85rem", color: "var(--accent)", fontFamily: "var(--font-sans)", fontWeight: 400 }}>✓ Saved</span>}
          </h2>
          <button className="btn-primary" onClick={() => setEditing("new")}>+ Add product</button>
        </div>

        {/* Add / edit form */}
        {editing !== null && (
          <div className="glass-panel" style={{ marginBottom: 24 }}>
            <ProductForm
              initial={editing === "new" ? null : editing}
              existingIds={products.map(p => p.id)}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
            />
          </div>
        )}

        {/* Product table */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>New</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={`${base}${p.img}`}
                      alt={p.name}
                      style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 6 }}
                      onError={e => { (e.target as HTMLImageElement).style.opacity = "0.3"; }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 2 }}>{p.desc?.slice(0, 60)}{p.desc?.length > 60 ? "…" : ""}</div>
                  </td>
                  <td>
                    <span className="admin-tag">{p.category}</span>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{fmt(p.price)}</td>
                  <td>
                    {p.new ? <span style={{ color: "var(--accent)", fontWeight: 600 }}>✓ New</span> : <span style={{ color: "var(--muted)" }}>—</span>}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="admin-btn-outline"
                        style={{ fontSize: "0.8rem", padding: "4px 10px" }}
                        onClick={() => { setEditing(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      >
                        Edit
                      </button>
                      {confirmDelete === p.id ? (
                        <>
                          <button
                            style={{ fontSize: "0.8rem", padding: "4px 10px", background: "#c0392b", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
                            onClick={() => handleDelete(p.id)}
                          >
                            Confirm
                          </button>
                          <button className="admin-btn-outline" style={{ fontSize: "0.8rem", padding: "4px 10px" }} onClick={() => setConfirmDelete(null)}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="admin-btn-outline"
                          style={{ fontSize: "0.8rem", padding: "4px 10px", borderColor: "#e55", color: "#e55" }}
                          onClick={() => setConfirmDelete(p.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>
                    No products yet. Click "Add product" to get started, or "Reset to defaults" to load the original catalogue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 16, fontSize: "0.8rem", color: "var(--muted)" }}>
          Changes are saved to your browser and the storefront picks them up automatically every 30 seconds.
        </div>
      </div>
    </div>
  );
}
