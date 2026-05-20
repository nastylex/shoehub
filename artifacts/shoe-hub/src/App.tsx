import { useState, useCallback } from "react";
import { Switch, Route } from "wouter";
import { StoreProvider } from "./context/StoreContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Features from "./components/Features";
import ShopSection from "./components/ShopSection";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";
import NewInSection from "./components/NewInSection";
import LookbookSection from "./components/LookbookSection";
import AboutSection from "./components/AboutSection";
import SizeGuideSection from "./components/SizeGuideSection";
import DeliverySection from "./components/DeliverySection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import AdminPage from "./pages/AdminPage";
import type { Product } from "./types";

function Storefront() {
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [shopFilter, setShopFilter] = useState<string | undefined>(undefined);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  function handleShopNewArrivals() {
    scrollTo("shopSection");
    setShopFilter("new");
    setTimeout(() => setShopFilter(undefined), 500);
  }

  return (
    <>
      <div className="bg-canvas" />
      <div className="bg-orb" />
      <div className="bg-orb" />
      <div className="bg-orb" />

      <Navbar onScrollTo={scrollTo} />
      <Hero onScrollTo={scrollTo} />
      <Marquee />
      <Features />
      <ShopSection onOpenProduct={setModalProduct} activeFilter={shopFilter} />
      <NewInSection onShopNewArrivals={handleShopNewArrivals} />
      <LookbookSection />
      <AboutSection />
      <SizeGuideSection />
      <DeliverySection />
      <ContactSection />
      <Footer onScrollTo={scrollTo} />

      <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} />
      <CartDrawer />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Switch>
        <Route path="/admin" component={AdminPage} />
        <Route component={Storefront} />
      </Switch>
    </StoreProvider>
  );
}
