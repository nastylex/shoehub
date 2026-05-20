interface FooterProps {
  onScrollTo: (id: string) => void;
}

export default function Footer({ onScrollTo }: FooterProps) {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="nav-logo" style={{ fontSize: "1.8rem", marginBottom: "16px" }}>
            The Shoe Hub<span>UGANDA</span>
          </div>
          <p className="footer-desc">Uganda's premier destination for luxury women's footwear. Where elegance meets African craftsmanship.</p>
        </div>
        <div>
          <div className="footer-col-title">Shop</div>
          <div className="footer-links">
            <a onClick={() => onScrollTo("newInSection")}>New Arrivals</a>
            <a onClick={() => onScrollTo("shopSection")}>Classic Pumps</a>
            <a onClick={() => onScrollTo("shopSection")}>Kitten Heels</a>
            <a onClick={() => onScrollTo("shopSection")}>Block Heels</a>
          </div>
        </div>
        <div>
          <div className="footer-col-title">Help</div>
          <div className="footer-links">
            <a onClick={() => onScrollTo("sizeSection")}>Size Guide</a>
            <a onClick={() => onScrollTo("deliverySection")}>Returns</a>
            <a onClick={() => onScrollTo("deliverySection")}>Delivery</a>
            <a onClick={() => onScrollTo("contactSection")}>Contact</a>
          </div>
        </div>
        <div>
          <div className="footer-col-title">Connect</div>
          <div className="footer-links">
            <a href="https://instagram.com/shoehub_ug" target="_blank" rel="noopener">Instagram</a>
            <a href="https://wa.me/256701925626" target="_blank" rel="noopener">WhatsApp</a>
            <a href="https://facebook.com/#" target="_blank" rel="noopener">Facebook</a>
            <a href="mailto:jmsorgnd@gmail.com">.The Shoe Hub Mail.</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">© 2026 The Shoe Hub ·</div>
        <div className="footer-copy">Kampala, Uganda 🇺🇬</div>
        <div className="nav-logo" style={{ fontSize: "1rem" }}><span>Designed By AirSPACEx</span></div>
      </div>
    </footer>
  );
}
