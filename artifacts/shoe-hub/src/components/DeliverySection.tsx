export default function DeliverySection() {
  return (
    <section className="page-section" id="deliverySection">
      <span className="section-tag">Logistics</span>
      <h2>Delivery & <em>Returns</em></h2>
      <div className="glass-panel">
        <h3>Delivery</h3>
        <ul>
          <li><strong>Within Kampala:</strong> Free same-day or next-day delivery on orders above UGX 150,000.</li>
          <li><strong>Across Uganda:</strong> 1–3 business days via trusted courier partners. Fees calculated at checkout.</li>
          <li><strong>East Africa:</strong> 4–7 business days. Contact us for a shipping quote.</li>
        </ul>
      </div>
      <div className="glass-panel">
        <h3>Returns & Exchanges</h3>
        <ul>
          <li>7-day hassle-free returns on all unworn items in original packaging.</li>
          <li>Exchanges for size or colour are free within Kampala.</li>
          <li>Sale items are final unless faulty.</li>
        </ul>
        <p style={{ marginTop: "10px" }}>
          To start a return, message us on WhatsApp at{" "}
          <a style={{ color: "var(--accent)" }} href="https://wa.me/256701925626">+256 701 925 626</a> with your order details.
        </p>
      </div>
    </section>
  );
}
