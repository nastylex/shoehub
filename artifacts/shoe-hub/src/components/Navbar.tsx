import { useState } from "react";
import { useStore } from "../context/StoreContext";

interface NavbarProps {
  onScrollTo: (id: string) => void;
}

export default function Navbar({ onScrollTo }: NavbarProps) {
  const { theme, setTheme, toggleCart, cartCount } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleNav(id: string) {
    setMenuOpen(false);
    onScrollTo(id);
  }

  return (
    <nav>
      <div className="nav-logo">
        The Shoe Hub
        <span>Uganda</span>
      </div>
      <div className={`nav-links${menuOpen ? " open" : ""}`} id="navLinks">
        <a onClick={() => handleNav("shopSection")}>Collection</a>
        <a onClick={() => handleNav("newInSection")}>New In</a>
        <a onClick={() => handleNav("lookbookSection")}>Lookbook</a>
        <a onClick={() => handleNav("aboutSection")}>About</a>
        <a onClick={() => handleNav("contactSection")}>Contact</a>
      </div>
      <button className="menu-toggle" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">☰</button>
      <div className="nav-right">
        <div className="theme-switcher">
          <button className={`theme-btn${theme === "white" ? " active" : ""}`} data-t="white" onClick={() => setTheme("white")} title="White" />
          <button className={`theme-btn${theme === "dark" ? " active" : ""}`} data-t="dark" onClick={() => setTheme("dark")} title="Dark" />
          <button className={`theme-btn${theme === "gaze" ? " active" : ""}`} data-t="gaze" onClick={() => setTheme("gaze")} title="Gaze" />
        </div>
        <button className="cart-btn" onClick={toggleCart}>
          <span>🛒</span>
          <span>Cart</span>
          <span className="cart-count">{cartCount}</span>
        </button>
      </div>
    </nav>
  );
}
