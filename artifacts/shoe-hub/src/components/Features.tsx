const features = [
  { icon: "🚚", title: "Delivery", text: "Deliveries on all orders within Kampala & across Uganda." },
  { icon: "✨", title: "Premium Quality", text: "Crafted from the finest leathers with meticulous attention to every detail." },
  { icon: "🔄", title: "Easy Returns", text: "7-day hassle-free returns on all unworn items in original packaging." },
  { icon: "💬", title: "Expert Advice", text: "Our style consultants are ready to help you find the perfect pair." },
];

export default function Features() {
  return (
    <div className="features-strip">
      {features.map(f => (
        <div key={f.title} className="feature-card">
          <div className="feature-icon">{f.icon}</div>
          <div className="feature-title">{f.title}</div>
          <div className="feature-text">{f.text}</div>
        </div>
      ))}
    </div>
  );
}
