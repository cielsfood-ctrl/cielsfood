// CIELSFOOD — Categories (rating system)

function CategoriesPage() {
  const cats = [
  {
    id: "I", name: "Tastiness", kind: "Main Category",
    desc: "A score for how delicious the food is, from 1 to 10.",
    low: "Catastrophically repulsive food that the restaurant should be embarrassed by.",
    high: "Culinary perfection; the very pinnacle of flavour and technique."
  },
  {
    id: "II", name: "Specialness", kind: "Other Category",
    desc: "Reflecting how distinctive or memorable the experience is, taking into account creativity and execution, from 1 to 10.",
    low: "Entirely forgettable; nothing sets it apart from countless others.",
    high: "Remarkably distinctive; a truly memorable experience that stands out long after the meal."
  },
  {
    id: "III", name: "Service", kind: "Other Category",
    desc: "Quality of hospitality and attentiveness throughout the meal, from 1 to 10.",
    low: "Dismissive or disorganised service that detracts from the entire experience.",
    high: "Exceptionally warm, professional, and seamless service that makes you feel genuinely looked after."
  },
  {
    id: "IV", name: "Environment", kind: "Other Category",
    desc: "Ambience, comfort, and overall atmosphere of the space, from 1 to 10.",
    low: "Uninviting, uncomfortable, or poorly maintained surroundings.",
    high: "A welcoming atmosphere that perfectly complements the dining experience."
  }];


  return (
    <main className="shell">
      <section className="cat-page-head">
        <span className="eyebrow"></span>
        <h1 className="h-display" style={{ margin: "10px 0 20px", fontSize: "70px" }}>Categories</h1>
        <hr className="rule" style={{ margin: "0 0 22px", border: 0, borderTop: "1px solid var(--ink)", maxWidth: "100%" }} />
        <p className="lede" style={{ fontStyle: "normal", color: "var(--ink-2)", maxWidth: "100%", fontSize: "18px", lineHeight: 1.65 }}>
          Every review is biased, and mine is no exception. To provide a clearer picture of how I
          rate each restaurant, the following outlines the categories behind my scoring system.
          Personally, I am not especially particular about categories beyond tastiness, but I've
          included them for reference.
        </p>
      </section>

      <section className="cat-list">
        {cats.map((c) =>
        <article key={c.id} className="cat-row">
            <div className="numeral">{c.id}.</div>
            <div>
              <h3>{c.name}</h3>
              <div className="meta">{c.kind}</div>
              <p style={{ marginTop: 14, color: "var(--ink-2)", maxWidth: "40ch" }}>{c.desc}</p>
            </div>
            <div className="scale">
              <div className="scale-row">
                <span className="mark">1/10</span>
                <p>{c.low}</p>
              </div>
              <div className="scale-row">
                <span className="mark">10/10</span>
                <p>{c.high}</p>
              </div>
            </div>
          </article>
        )}

        <article className="cat-row" style={{ borderTop: "1px solid var(--rule)" }}>
          <div className="numeral">V.</div>
          <div>
            <h3>Value of Money</h3>
            <div className="meta">Out of five £'s</div>
            <p style={{ marginTop: 14, color: "var(--ink-2)", maxWidth: "40ch" }}>
              How well the overall experience justifies the price, rated from one to five £'s.
            </p>
          </div>
          <div className="scale">
            <div className="scale-row">
              <span className="mark">£</span>
              <p>Poor value; overpriced for the quality or experience offered.</p>
            </div>
            <div className="scale-row">
              <span className="mark">£££££</span>
              <p>Exceptional value; every penny feels well spent for the quality, service, and experience delivered.</p>
            </div>
          </div>
        </article>
      </section>

      <Footer />
    </main>);

}

Object.assign(window, { CategoriesPage });