export default function SizeGuideSection() {
  return (
    <section className="page-section" id="sizeSection">
      <span className="section-tag">Fit</span>
      <h2>Size <em>Guide</em></h2>
      <p className="lead">Our heels follow standard European sizing. If you're between sizes, we generally recommend sizing up for pointed-toe styles and staying true-to-size for round-toe block heels.</p>
      <table className="size-table">
        <thead>
          <tr><th>EU</th><th>UK</th><th>US</th><th>Foot length (cm)</th></tr>
        </thead>
        <tbody>
          <tr><td>36</td><td>3</td><td>5.5</td><td>22.8</td></tr>
          <tr><td>37</td><td>4</td><td>6.5</td><td>23.5</td></tr>
          <tr><td>38</td><td>5</td><td>7.5</td><td>24.1</td></tr>
          <tr><td>39</td><td>6</td><td>8.5</td><td>24.8</td></tr>
          <tr><td>40</td><td>7</td><td>9.5</td><td>25.4</td></tr>
          <tr><td>41</td><td>8</td><td>10.5</td><td>26.0</td></tr>
          <tr><td>42</td><td>9</td><td>11.5</td><td>26.7</td></tr>
        </tbody>
      </table>
      <p>Unsure? Send a WhatsApp to <a style={{ color: "var(--accent)" }} href="https://wa.me/256701925626">us here</a> with your usual size and we'll recommend the right pair.</p>
    </section>
  );
}
