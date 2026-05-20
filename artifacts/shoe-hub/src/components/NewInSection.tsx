interface NewInSectionProps {
  onShopNewArrivals: () => void;
}

export default function NewInSection({ onShopNewArrivals }: NewInSectionProps) {
  return (
    <section className="page-section" id="newInSection">
      <span className="section-tag">Just Landed</span>
      <h2>New In <em>This Season</em></h2>
      <p className="lead">Six fresh silhouettes added to the collection this month — from the Crimson Lizard Pump to the Bordeaux Mary Jane. Limited pairs, so secure your size early.</p>
      <div className="glass-panel">
        <h3>What's New</h3>
        <ul>
          <li><strong>Crimson Lizard Pump</strong> — bold colour for boardroom power dressing.</li>
          <li><strong>Oxblood Mary Jane</strong> — double-buckle architectural detail.</li>
          <li><strong>Plum Buckle Kitten</strong> — soft suede, sharp silhouette.</li>
          <li><strong>Steel Blue Buckle</strong> — rose-gold hardware on matte leather.</li>
          <li><strong>Bordeaux Mary Jane</strong> — sculptural heel, ring-buckle straps.</li>
        </ul>
        <p style={{ marginTop: "14px" }}>
          <button className="btn-primary" onClick={onShopNewArrivals} style={{ textDecoration: "none" }}>Shop New Arrivals</button>
        </p>
      </div>
    </section>
  );
}
