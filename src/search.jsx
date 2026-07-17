// CIELSFOOD — Global search results page

function SearchResultsPage({ query, navigate }) {
  const term = (query || "").toLowerCase().trim();

  const PAGES = [
    { id: "home",        label: "Home",        desc: "The home page of Ciel's Food Guide" },
    { id: "about",       label: "About",       desc: "About Ciel's Food Guide and the story behind it" },
    { id: "restaurants", label: "Restaurants", desc: "Browse all restaurant reviews" },
    { id: "categories",  label: "Categories",  desc: "Rating categories: Tastiness, Specialness, Service, Environment, Value for Money" }
  ];

  const pageMatches = !term ? [] : PAGES.filter(p =>
    (p.label + " " + p.desc).toLowerCase().includes(term)
  );

  const restMatches = !term ? [] : window.RESTAURANTS.filter(r => {
    const latest = window.latestReviewFor(r.id);
    return (r.name + " " + r.cuisine + " " + r.location + " " + (latest ? latest.body : ""))
      .toLowerCase().includes(term);
  });

  const total = pageMatches.length + restMatches.length;

  return (
    <main className="shell">
      <section style={{ padding: "56px 0 32px" }}>
        <div className="eyebrow">Search results</div>
        <h1 className="h-display" style={{ margin: "10px 0 0", fontSize: "clamp(32px, 6vw, 56px)" }}>
          "{query}"
        </h1>
        <div className="eyebrow" style={{ marginTop: 12 }}>
          {total === 0 ? "No results found" : `${total} result${total === 1 ? "" : "s"}`}
        </div>
        <hr className="rule" style={{ margin: "20px 0 0", maxWidth: "100%" }} />

        {pageMatches.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <div className="eyebrow" style={{ marginBottom: 4 }}>Pages</div>
            {pageMatches.map(p =>
              <article key={p.id}
                className="recent-row"
                style={{ borderTop: "1px solid var(--rule)", cursor: "pointer", padding: "18px 0", display: "grid", gridTemplateColumns: "1fr", gap: 4 }}
                onClick={() => navigate(p.id)}>
                <div style={{ fontSize: 22, fontFamily: "var(--serif)" }}>{p.label}</div>
                <div style={{ color: "var(--muted)", fontSize: 13, fontStyle: "italic" }}>{p.desc}</div>
              </article>
            )}
          </div>
        )}

        {restMatches.length > 0 && (
          <div style={{ marginTop: pageMatches.length > 0 ? 40 : 32 }}>
            <div className="eyebrow" style={{ marginBottom: 4 }}>
              Restaurants ({restMatches.length})
            </div>
            {restMatches.map(r => {
              const latest = window.latestReviewFor(r.id);
              return (
                <article key={r.id}
                  className="recent-row"
                  style={{ borderTop: "1px solid var(--rule)", cursor: "pointer", padding: "18px 0", display: "grid", gridTemplateColumns: "1fr auto", gap: "4px 24px", alignItems: "center" }}
                  onClick={() => navigate("restaurant", { id: r.id })}>
                  <div>
                    <div style={{ fontSize: 22, fontFamily: "var(--serif)" }}>{r.name}</div>
                    <div style={{ color: "var(--muted)", fontSize: 13, fontStyle: "italic", marginTop: 4 }}>
                      {r.cuisine} · {r.location} · {r.michelin}
                    </div>
                  </div>
                  <Score value={latest ? latest.tastiness : ""} />
                </article>
              );
            })}
          </div>
        )}

        {total === 0 && (
          <p style={{ paddingTop: 32, color: "var(--muted)", fontStyle: "italic" }}>
            Try a different search term, or{" "}
            <button className="link" style={{ font: "inherit", fontStyle: "italic" }} onClick={() => navigate("restaurants")}>
              browse all restaurants
            </button>.
          </p>
        )}
      </section>
    </main>
  );
}

Object.assign(window, { SearchResultsPage });
