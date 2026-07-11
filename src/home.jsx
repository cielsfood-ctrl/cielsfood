// CIELSFOOD — Home page

function HomePage({ navigate }) {
  const fav = window.restaurantById(window.FAVORITE_ID);
  const favReview = window.latestReviewFor(fav.id);

  // Latest review across all
  const latest = [...window.REVIEWS].sort((a, b) => b.date.localeCompare(a.date))[0];
  const latestRest = window.restaurantById(latest.restaurantId);

  const cats = [
  { id: "I", name: "Tastiness", sub: "Main category", blurb: "How delicious. The principal score." },
  { id: "II", name: "Specialness", sub: "Other category", blurb: "Distinctiveness, creativity, memory." },
  { id: "III", name: "Service", sub: "Other category", blurb: "Hospitality, attentiveness, warmth." },
  { id: "IV", name: "Environment", sub: "Other category", blurb: "Ambience, comfort, atmosphere." },
  { id: "V", name: "Value of Money", sub: "Other category", blurb: "Out of five £'s — does each penny feel well spent?" }];


  return (
    <main className="shell">
      <div className="band-dark band-dark--hero">
      <section className="hero">
        <div className="hero-meta">
          <span></span>
          <span></span>
          <span>{"\n"}</span>
        </div>
        <h1 className="h-display" style={{ fontSize: "70px" }}>
          Welcome to CIEL'S FOOD GUIDE
        </h1>
        <div className="hero-sub">
          <p className="lede" style={{ color: "rgb(250, 247, 240)" }}>The most honest take on what and where to eat


          </p>
        </div>
        <div>
          <button className="btn btn--ghost" onClick={() => navigate("restaurants")}>EXPLORE REVIEWS →</button>
        </div>
      </section>
      </div>

      {/* Latest + Favourite */}
      <div className="section-head section-head--after-hero">
        <div className="title">
          <span className="numeral"></span>
          <h2 className="h-section"></h2>
        </div>
        <span className="eyebrow">{"\n"}</span>
      </div>

      <section className="feature-grid">
        <article className="feature-main">
          <div className="feature-photo">
            <img src={latest.photos[0].src} alt={latest.photos[0].caption} />
          </div>
          <span className="eyebrow">Latest review · {window.formatDate(latest.date)}</span>
          <h3 className="h-card" style={{ marginTop: 8 }}>{latestRest.name}</h3>
          <div style={{ display: "flex", gap: 16, alignItems: "baseline", color: "var(--muted)", margin: "6px 0 18px", fontStyle: "italic" }}>
            <span>{latestRest.cuisine}</span>
            <span>·</span>
            <span>{latestRest.location}</span>
            <span>·</span>
            <span>{latestRest.michelin}</span>
          </div>
          <p className="body" style={{ maxWidth: "100%", width: "640.328px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{latest.body}</p>
          <div className="scores" style={{ marginTop: 24 }}>
            <div className="score-cell"><div className="score-label">Tastiness</div><div className="score-num">{latest.tastiness}<em>/10</em></div></div>
            <div className="score-cell"><div className="score-label">Specialness</div><div className="score-num">{latest.specialness}<em>/10</em></div></div>
            <div className="score-cell"><div className="score-label">Service</div><div className="score-num">{latest.service}<em>/10</em></div></div>
            <div className="score-cell"><div className="score-label">Value</div><div className="score-num"><PoundMark value={latest.value} /></div></div>
          </div>
          <div style={{ marginTop: 24 }}>
            <button className="btn btn--text" onClick={() => navigate("restaurant", { id: latestRest.id })}>
              Read the full review →
            </button>
          </div>
        </article>

        <article className="feature-side">
          <span className="eyebrow" style={{ fontSize: "18px" }}>Personal Favourite</span>
          <div className="feature-photo" style={{ marginTop: 12 }}>
            <img src={favReview.photos[0].src} alt={favReview.photos[0].caption} />
          </div>
          <h3 className="h-card">{fav.name}</h3>
          <div style={{ display: "flex", gap: 12, alignItems: "baseline", color: "var(--muted)", margin: "6px 0 14px", fontStyle: "italic" }}>
            <span>{fav.cuisine}</span><span>·</span><span>{fav.location}</span>
          </div>
          <p className="body" style={{ maxWidth: "100%", width: "446.656px" }}>
            The restaurant I keep returning to, telling friends about, and quietly hoping won't get too busy.
          </p>
          <div className="scores" style={{ marginTop: 18, gridTemplateColumns: "repeat(2, 1fr)" }}>
            <div className="score-cell"><div className="score-label">Tastiness</div><div className="score-num">{favReview.tastiness}<em>/10</em></div></div>
            <div className="score-cell"><div className="score-label">Value</div><div className="score-num"><PoundMark value={favReview.value} /></div></div>
          </div>
          <div style={{ marginTop: 18 }}>
            <button className="btn btn--text" onClick={() => navigate("restaurant", { id: fav.id })}>WHY IT STAYS THE FAVOURITE →

            </button>
          </div>
        </article>
      </section>

      {/* Categories — dark band */}
      <div className="band-dark">
      <div className="section-head">
        <div className="title">
          <span className="numeral"></span>
          <h2 className="h-section">Review Categories</h2>
        </div>
        <button className="btn btn--text" onClick={() => navigate("categories")}>READ THE FULL SYSTEM →

          </button>
      </div>

      <section className="cat-grid">
        {cats.map((c) =>
          <button key={c.id} className="cat-card" onClick={() => navigate("categories")}>
            <div className="numeral">{c.id}.</div>
            <h3>{c.name}</h3>
            <p>{c.blurb}</p>
          </button>
          )}
      </section>
      </div>

      {/* Recent index */}
      <div className="section-head">
        <div className="title">
          <span className="numeral"></span>
          <h2 className="h-section">Latest Reviews</h2>
        </div>
        <button className="btn btn--text" onClick={() => navigate("restaurants")}>
          SEE ALL RESTAURANTS →
        </button>
      </div>
      <RecentList navigate={navigate} />
    </main>);

}

function RecentList({ navigate }) {
  const recent = useMemo(() => {
    const byRest = {};
    window.REVIEWS.forEach((r) => {
      if (!byRest[r.restaurantId] || r.date > byRest[r.restaurantId].date) byRest[r.restaurantId] = r;
    });
    return Object.values(byRest).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  }, []);
  return (
    <section style={{ borderTop: "1px solid var(--ink)", borderBottom: "1px solid var(--ink)" }}>
      {recent.map((rv, i) => {
        const rest = window.restaurantById(rv.restaurantId);
        return (
          <article key={rv.id}
          className="recent-row"
          onClick={() => navigate("restaurant", { id: rest.id })}
          style={{ borderTop: i === 0 ? 0 : "1px solid var(--rule)" }}>
            <div className="eyebrow">{window.formatDate(rv.date)}</div>
            <div>
              <div style={{ fontSize: 24, lineHeight: 1.1 }}>{rest.name}</div>
              <div style={{ color: "var(--muted)", fontStyle: "italic", marginTop: 2 }}>{rest.cuisine} · {rest.location}</div>
            </div>
            <div className="recent-row-preview">{rv.body.slice(0, 110)}…</div>
            <div style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
              <Score value={rv.tastiness} />
              <PoundMark value={rv.value} />
            </div>
            <div className="row-hover-cta">READ THIS REVIEW →</div>
          </article>);

      })}
    </section>);

}

Object.assign(window, { HomePage });