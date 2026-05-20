import { useStore } from "../context/StoreContext";

interface HeroProps {
  onScrollTo: (id: string) => void;
}

export default function Hero({ onScrollTo }: HeroProps) {
  const { products } = useStore();
  const heroImg = products.length > 0 ? products[0].img : "pic.jpg";
  const base = import.meta.env.BASE_URL || "/";

  return (
    <section className="hero">
      <div className="hero-text">
        <div className="hero-eyebrow">New Collection 2026</div>
        <h1 className="hero-title">Step Into<br /><em>Pure Elegance</em></h1>
        <p className="hero-sub">Discover our curated collection of luxury heels — crafted for the modern woman who moves through the world with confidence and grace.</p>
        <div className="hero-ctas">
          <button className="btn-primary" onClick={() => onScrollTo("shopSection")}>Shop Collection</button>
          <button className="btn-ghost" onClick={() => onScrollTo("lookbookSection")}>View Lookbook</button>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-glass-card">
          <img src={`${base}${heroImg}`} alt="The Shoe Hub - Premium Luxury Shoes Collection" />
        </div>
        <div className="hero-badge">
          <div className="hero-badge-label">Styles Available</div>
          <div className="hero-badge-val">16+</div>
        </div>
        <div className="floating-tag">✦ Get Now!!</div>
      </div>
    </section>
  );
}
