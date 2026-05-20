export default function ContactSection() {
  return (
    <section className="page-section" id="contactSection">
      <span className="section-tag">Get in Touch</span>
      <h2>Contact <em>Us</em></h2>
      <p className="lead">We'd love to help you find the right pair. Our style team typically replies within an hour during shop hours (Mon–Sat, 9am–10pm EAT).</p>
      <div className="contact-grid">
        <div className="contact-card">
          <div className="label">WhatsApp</div>
          <div className="val"><a href="https://wa.me/256701925626">+256 701 925 626</a></div>
        </div>
        <div className="contact-card">
          <div className="label">Email</div>
          <div className="val"><a href="mailto:jmsorgnd@gmail.com">.The Shoe Hub Mail.</a></div>
        </div>
        <div className="contact-card">
          <div className="label">Visit</div>
          <div className="val">Nabugabo Street, Papaz Plaza FF 39<br />Basement<br />Kampala, Uganda</div>
        </div>
        <div className="contact-card">
          <div className="label">Hours</div>
          <div className="val">Mon–Sat<br />9:00am — 10:00pm EAT</div>
        </div>
      </div>
    </section>
  );
}
