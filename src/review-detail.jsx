// CIELSFOOD — Review detail page (per restaurant, with multi-review toggle and image slider)

function ReviewDetailPage({ restaurantId, navigate }) {
  const rest = window.restaurantById(restaurantId);
  if (!rest) {
    return (
      <main className="shell">
        <p style={{ padding: "80px 0" }}>Restaurant not found.{" "}
          <button className="btn--ghost btn" onClick={() => navigate("restaurants")}>Back to index →</button>
        </p>
      </main>);

  }
  const reviews = window.reviewsFor(rest.id);
  const [selectedId, setSelectedId] = useState(reviews[0].id);
  const review = reviews.find((r) => r.id === selectedId) || reviews[0];

  return (
    <main className="shell">
      <section className="detail-head">
        <div className="detail-meta">
          <button className="link" onClick={() => navigate("restaurants")} style={{ font: "inherit", letterSpacing: "0.22em" }}>← Back to Reviews</button>
          <span>{"\n"}</span>
          <span>{"\n"}</span>
          <span>{"\n"}</span>
        </div>
        <h1 className="h-display" style={{ maxWidth: "16ch" }}>{rest.name}</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "end", marginTop: 18 }}>
          <p className="kicker" style={{ margin: 0 }}>{rest.address}</p>
          {rest.website && rest.website !== "#" &&
          <a className="btn btn--accent" href={rest.website} target="_blank" rel="noreferrer">
              Visit website ↗
            </a>
          }
        </div>
      </section>

      {/* Review toggle: always shown, even with one review */}
      <div style={{ padding: "32px 0 0" }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Reviews</div>
        <div className="review-toggle">
          {reviews.map((rv, i) =>
          <button key={rv.id}
          className={selectedId === rv.id ? "active" : ""}
          onClick={() => setSelectedId(rv.id)}>
              {window.formatDate(rv.date)}{i === 0 ? " · Latest" : ""}
            </button>
          )}
        </div>
      </div>

      <section className="detail-grid">
        <div>
          <ImageSlider photos={review.photos} />

          <div className="body" style={{ marginTop: 32 }}>
            {review.body.split(/\n\n+/).map((para, i) =>
            <p key={i} style={{ fontFamily: "var(--serif)", color: "var(--ink-2)", width: "100%", fontSize: "14px", marginTop: i === 0 ? 0 : "1.8em" }}>
                {para}
              </p>
            )}
          </div>
        </div>

        <aside className="detail-side">
          <div className="eyebrow" style={{ fontSize: "14px" }}>At a glance</div>
          <div className="info-table">
            <div className="row"><span className="k">Cuisine</span><span className="v">{rest.cuisine}</span></div>
            <div className="row"><span className="k">Location</span><span className="v">{rest.location}</span></div>
            <div className="row"><span className="k">Michelin</span><span className="v">{rest.michelin}</span></div>
            <div className="row"><span className="k">Value</span><span className="v"><PoundMark value={review.value} /></span></div>
            <div className="row"><span className="k">Tastiness</span><span className="v"><Score value={review.tastiness} /></span></div>
          </div>

          <div className="eyebrow" style={{ marginTop: 36, marginBottom: 8, fontSize: "14px" }}>Categories</div>
          <div className="score-stack">
            {[
            ["Tastiness", review.tastiness],
            ["Specialness", review.specialness],
            ["Service", review.service],
            ["Environment", review.environment]].
            map(([k, v]) =>
            <div key={k} className="score-line">
                <span className="k">{k}</span>
                <span className="bar" style={{ "--w": `${v * 10}%` }} />
                <span className="v" style={{ fontSize: "14px" }}>{v}<em style={{ fontSize: "14px" }}>/10</em></span>
              </div>
            )}
          </div>

          <div className="eyebrow" style={{ marginTop: 36, marginBottom: 8, fontSize: "14px" }}>Location</div>
          <div className="mini-map" style={{ padding: 0, background: "var(--paper-2)" }}>
            <iframe
              title={`Map of ${rest.name}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(rest.address || rest.location)}&output=embed`}
              style={{ width: "100%", height: "100%", border: 0, display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen />
            <div className="addr" style={{ pointerEvents: "none" }}>
              <div className="city">{rest.location}</div>
              {rest.address}
            </div>
          </div>
        </aside>
      </section>

      <Footer />
    </main>);

}

function ImageSlider({ photos }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (paused || photos.length < 2) return;
    intervalRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % photos.length);
    }, 2500);
    return () => clearInterval(intervalRef.current);
  }, [paused, photos.length]);

  // Reset index if photos change (when toggling reviews)
  useEffect(() => {setIdx(0);}, [photos]);

  function go(d) {
    setIdx((i) => (i + d + photos.length) % photos.length);
    setPaused(true);
    setTimeout(() => setPaused(false), 8000);
  }

  return (
    <div>
      <div className="slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
        <div className="slider-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
          {photos.map((p, i) =>
          <div key={i} className="slider-slide">
              <img src={p.src} alt={p.caption} />
            </div>
          )}
        </div>
        {photos.length > 1 &&
        <>
            <button className="slider-arrow prev" onClick={() => go(-1)} aria-label="Previous">←</button>
            <button className="slider-arrow next" onClick={() => go(1)} aria-label="Next">→</button>
          </>
        }
      </div>
      <div className="slider-meta">
        <span className="slider-cap" style={{ padding: 0, fontSize: "13px", width: "100%", maxWidth: "500px", fontWeight: 400, fontStyle: "normal" }}>{photos[idx].caption}</span>
        <div className="slider-dots">
          {photos.map((_, i) =>
          <span key={i}
          className={`slider-dot ${i === idx ? "active" : ""}`}
          onClick={() => {setIdx(i);setPaused(true);setTimeout(() => setPaused(false), 8000);}} />
          )}
        </div>
      </div>
    </div>);

}

Object.assign(window, { ReviewDetailPage });