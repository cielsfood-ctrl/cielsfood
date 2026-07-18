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

  // SEO: inject Restaurant / Review / AggregateRating JSON-LD for this page
  useEffect(() => {
    const avg = reviews.reduce((s, r) => s + r.tastiness, 0) / reviews.length;
    const data = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": rest.name,
      "servesCuisine": rest.cuisine,
      "address": rest.address,
      "telephone": rest.phone || undefined,
      "url": rest.website && rest.website !== "#" ? rest.website : undefined,
      "image": reviews[0].photos && reviews[0].photos[0] ? reviews[0].photos[0].src : undefined,
      "geo": (rest.lat != null && rest.lng != null) ? {
        "@type": "GeoCoordinates", "latitude": rest.lat, "longitude": rest.lng
      } : undefined,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": Math.round(avg * 10) / 10,
        "bestRating": 10,
        "worstRating": 1,
        "reviewCount": reviews.length
      },
      "review": reviews.map((rv) => ({
        "@type": "Review",
        "author": { "@type": "Person", "name": "Cherrie Leung" },
        "publisher": { "@type": "Organization", "name": "CieL's Food Guide", "url": "https://www.cielsfood.com" },
        "datePublished": rv.date,
        "reviewBody": rv.body,
        "reviewRating": {
          "@type": "Rating", "ratingValue": rv.tastiness, "bestRating": 10, "worstRating": 1
        }
      }))
    };
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "restaurant-jsonld";
    el.textContent = JSON.stringify(data);
    document.head.appendChild(el);
    return () => { el.remove(); };
  }, [rest.id]);

  return (
    <main className="shell">
      <section className="detail-head">
        <div className="detail-meta">
          <button className="link" onClick={() => navigate("restaurants")} style={{ font: "inherit", letterSpacing: "0.22em" }}>← Back to Reviews</button>
          <span>{"\n"}</span>
          <span>{"\n"}</span>
          <span>{"\n"}</span>
        </div>
        <h1 className="h-display">{rest.name}</h1>
        <div className="detail-action-row">
          <a className="kicker"
             href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${rest.name} ${rest.address || rest.location}`)}`}
             target="_blank" rel="noreferrer"
             style={{ margin: 0, color: "inherit" }}>
            {rest.address}
          </a>
          {rest.phone &&
            <a className="detail-link detail-link--phone" href={`tel:${rest.phone}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span className="detail-link-label">{rest.phone}</span>
            </a>
          }
          {rest.website && rest.website !== "#" &&
            <a className="detail-link detail-link--site" href={rest.website} target="_blank" rel="noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              <span className="detail-link-label">Visit Website</span>
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
            <div className="row"><span className="k">Michelin</span><span className="v">{rest.michelin}</span></div>
            <div className="row"><span className="k">Value for Money</span><span className="v"><PoundMark value={review.value} /></span></div>
            <div className="row"><span className="k">Tastiness</span><span className="v"><Score value={review.tastiness} /></span></div>
          </div>

          <div className="eyebrow" style={{ marginTop: 36, marginBottom: 8, fontSize: "14px" }}>Other Categories</div>
          <div className="score-stack">
            {[
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