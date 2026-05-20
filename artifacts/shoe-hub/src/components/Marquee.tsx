const words = ["Elegance", "Style", "Luxury", "Kampala", "Confidence", "Grace", "Fashion", "Craftsmanship"];
const doubled = [...words, ...words, ...words, ...words];

export default function Marquee() {
  return (
    <div className="marquee-strip">
      <div className="marquee-inner">
        {doubled.map((w, i) => (
          <span key={i}>
            {i > 0 && <span className="marquee-dot">✦</span>}
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}
