import { useStore } from "../context/StoreContext";

export default function LookbookSection() {
  const { products } = useStore();
  const base = import.meta.env.BASE_URL || "/";
  const ids = [1, 2, 4, 8, 12, 16, 25, 30];
  const lookbookItems = ids
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as typeof products;

  return (
    <section className="page-section" id="lookbookSection">
      <span className="section-tag">Editorial</span>
      <h2>The 2026 <em>Lookbook</em></h2>
      <p className="lead">A study in craftsmanship — texture, colour, and the quiet confidence of a perfectly weighted heel. Photographed in Kampala.</p>
      <div className="lookbook-grid">
        {lookbookItems.map(p => (
          <img
            key={p.id}
            src={`${base}${p.img}`}
            alt={p.name}
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ))}
      </div>
    </section>
  );
}
