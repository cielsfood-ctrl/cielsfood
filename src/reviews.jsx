// CIELSFOOD — Reviews page (List + Map view)

function ReviewsPage({ navigate }) {
  const [view, setView] = useState("list");
  const [cuisine, setCuisine] = useState("All");
  const [dish, setDish] = useState("All");
  const [city, setCity] = useState("All");
  const [michelin, setMichelin] = useState("All");
  const [minTasti, setMinTasti] = useState(0);
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState("date-desc");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const PER_PAGE = 10;

  const SORT_OPTIONS = [
    { value: "date-desc",     label: "Date (newest first)" },
    { value: "date-asc",      label: "Date (oldest first)" },
    { value: "name-asc",      label: "Restaurant name (A–Z)" },
    { value: "location-asc",  label: "Location (A–Z)" },
    { value: "value-desc",    label: "Value for money (best first)" },
    { value: "tastiness-desc",label: "Tastiness (highest first)" }
  ];

  const rows = useMemo(() => {
    return window.RESTAURANTS.
    map((r) => {
      const latest = window.latestReviewFor(r.id);
      return {
        ...r,
        tastiness: latest.tastiness,
        value: latest.value,
        latestDate: latest.date,
        latestId: latest.id
      };
    }).
    filter((r) => cuisine === "All" || r.cuisine === cuisine).
    filter((r) => dish === "All" || (r.dish || []).includes(dish)).
    filter((r) => city === "All" || r.location === city).
    filter((r) => michelin === "All" || r.michelin === michelin).
    filter((r) => r.tastiness >= minTasti).
    filter((r) => !search.trim() || (r.name + r.cuisine + r.location + (r.dish || []).join(" ")).toLowerCase().includes(search.toLowerCase())).
    sort((a, b) => {
      const [key, dirRaw] = sortMode.split("-");
      const dir = dirRaw === "asc" ? 1 : -1;
      if (key === "date")      return (a.latestDate < b.latestDate ? -1 : 1) * dir;
      if (key === "tastiness") return (a.tastiness - b.tastiness) * dir;
      if (key === "value")     return (a.value - b.value) * dir;
      // string keys: name, location
      return ((a[key] || "").toString().toLowerCase() < (b[key] || "").toString().toLowerCase() ? -1 : 1) * dir;
    });
  }, [cuisine, dish, city, michelin, minTasti, search, sortMode]);

  // Reset to page 1 whenever filters/sort change
  useEffect(() => { setPage(1); }, [cuisine, dish, city, michelin, minTasti, search, sortMode, view]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageRows = view === "list" ? rows.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE) : rows;
  const sortLabel = (SORT_OPTIONS.find((o) => o.value === sortMode) || {}).label || "";

  const cuisineOpts = ["All", ...Array.from(new Set(window.RESTAURANTS.map((r) => r.cuisine))).sort()];
  const dishOpts = ["All", ...Array.from(new Set(window.RESTAURANTS.flatMap((r) => r.dish || []))).sort()];
  const cityOpts = ["All", ...Array.from(new Set(window.RESTAURANTS.map((r) => r.location))).sort()];
  const michOpts = ["All", ...window.MICHELIN];

  return (
    <main className="shell">
      <section className="reviews-head">
        <div>
          <span className="eyebrow"></span>
          <h1 className="h-display" style={{ margin: "10px 0 8px", fontSize: "70px" }}>Restaurants</h1>
          <p className="kicker"></p>
        </div>
        <hr className="reviews-hr rule" />
        <div className="view-controls">
          <div className="view-switch" role="tablist">
            <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>List</button>
            <button className={view === "map" ? "active" : ""} onClick={() => setView("map")}>Map</button>
          </div>
          <button className="mob-filter-btn" onClick={() => setFiltersOpen(true)}>Filters</button>
        </div>
      </section>

      {/* Mobile: filter bottom sheet — portalled to <body> so it escapes the
          .shell stacking context (z-index:1) and layers above the nav/footer */}
      {filtersOpen && ReactDOM.createPortal(
        <div className="filter-sheet-overlay" onClick={() => setFiltersOpen(false)}>
          <div className="filter-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="filter-sheet-head">
              <span>Filters</span>
              <button className="filter-sheet-close" onClick={() => setFiltersOpen(false)}>✕</button>
            </div>
            <div className="filter-sheet-body">
              <div className="filter-group">
                <label>Search</label>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Restaurant, cuisine, location…" />
              </div>
              <div className="filter-group">
                <label>Cuisine</label>
                <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
                  {cuisineOpts.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <label>Dish</label>
                <select value={dish} onChange={(e) => setDish(e.target.value)}>
                  {dishOpts.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <label>Location</label>
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  {cityOpts.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <label>Michelin</label>
                <select value={michelin} onChange={(e) => setMichelin(e.target.value)}>
                  {michOpts.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <label>Min. Tastiness · {minTasti}</label>
                <input type="range" min="0" max="10" step="1" value={minTasti} onChange={(e) => setMinTasti(+e.target.value)} />
              </div>
              <div className="filter-group">
                <label>Sort by</label>
                <select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <button className="btn--ghost btn" onClick={() => {
                  setCuisine("All");setDish("All");setCity("All");setMichelin("All");setMinTasti(0);setSearch("");setSortMode("date-desc");
                }}>Reset filters</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <section className="filters">
        <div className="filter-group">
          <label>Search</label>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Restaurant, cuisine, location…" />
        </div>
        <div className="filter-group">
          <label>Cuisine</label>
          <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
            {cuisineOpts.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Dish</label>
          <select value={dish} onChange={(e) => setDish(e.target.value)}>
            {dishOpts.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Location</label>
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            {cityOpts.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Michelin</label>
          <select value={michelin} onChange={(e) => setMichelin(e.target.value)}>
            {michOpts.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="filter-group filter-group--tastiness">
          <label>Min. Tastiness · {minTasti}</label>
          <input type="range" min="0" max="10" step="1" value={minTasti} onChange={(e) => setMinTasti(+e.target.value)} />
        </div>
        <div className="filter-group">
          <label>Sort by</label>
          <select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <button className="filter-reset" onClick={() => {
          setCuisine("All");setDish("All");setCity("All");setMichelin("All");setMinTasti(0);setSearch("");setSortMode("date-desc");
        }}>Reset filters</button>
      </section>

      <div style={{ padding: "14px 0", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="eyebrow">
          {view === "list"
            ? `Showing ${rows.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1}\u2013${Math.min(safePage * PER_PAGE, rows.length)} of ${rows.length}`
            : `Showing ${rows.length} of ${window.RESTAURANTS.length}`}
        </span>
        <span className="eyebrow">Sorted by {sortLabel}</span>
      </div>

      {view === "list" ?
      <React.Fragment>
        <div className="reviews-table-wrap">
        <table className="reviews-table">
          <thead>
            <tr>
              <th>Restaurant</th>
              <th>Cuisine</th>
              <th>Location</th>
              <th>Tastiness</th>
              <th>Latest Review</th>
              <th>Michelin</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r) =>
          <tr key={r.id} className="row" onClick={() => navigate("restaurant", { id: r.id })}>
                <td className="name">{r.name}</td>
                <td style={{ fontStyle: "italic" }}>{r.cuisine}</td>
                <td>{r.location}</td>
                <td><Score value={r.tastiness} /></td>
                <td>{window.formatDate(r.latestDate)}</td>
                <td>{r.michelin}</td>
              </tr>
          )}
            {pageRows.length === 0 &&
              <tr><td colSpan={6} style={{ padding: "32px 10px", color: "var(--muted)", fontStyle: "italic" }}>No restaurants match these filters.</td></tr>
            }
          </tbody>
        </table>
        </div>
        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </React.Fragment> :

      <MapView rows={rows} navigate={navigate} />
      }

    </main>);

}

function MapView({ rows, navigate }) {
  // Mobile: no restaurant card shown until a pin is tapped. Desktop: default selection.
  const [active, setActive] = useState(() =>
    (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 880px)").matches) ? null : "r21"
  );
  const sel = rows.find((r) => r.id === active);
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const firstFitRef = useRef(true);
  const setActiveRef = useRef(setActive);
  setActiveRef.current = setActive;

  // Init Leaflet map once
  useEffect(() => {
    if (!containerRef.current || !window.L) return;
    const L = window.L;
    const map = L.map(containerRef.current, {
      zoomControl: true,
      worldCopyJump: true,
      attributionControl: true
    }).setView([51.5135, -0.1], 12);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 60);
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Sync markers + fit bounds when filtered rows change
  useEffect(() => {
    const map = mapRef.current;
    const L = window.L;
    if (!map || !L) return;
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    const valid = rows.filter((r) => r.lat != null && r.lng != null);
    valid.forEach((r) => {
      const icon = L.divIcon({
        className: "cf-pin-icon",
        html: `<div class="cf-pin"><svg class="cf-pin-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32"><path d="M12 0C5.373 0 0 5.373 0 12c0 8.5 12 20 12 20S24 20.5 24 12C24 5.373 18.627 0 12 0z"/><circle class="pin-ring" cx="12" cy="11" r="5"/><circle class="pin-dot" cx="12" cy="11" r="3"/></svg><div class="label">${r.name.replace(/</g, "&lt;")}</div></div>`,
        iconSize: [24, 32],
        iconAnchor: [12, 32]
      });
      const marker = L.marker([r.lat, r.lng], { icon, riseOnHover: true, title: r.name }).addTo(map);
      marker.on("click", () => setActiveRef.current(r.id));
      markersRef.current[r.id] = marker;
    });

    if (valid.length === 1) {
      map.flyTo([valid[0].lat, valid[0].lng], 14, { duration: 0.5 });
    } else if (valid.length > 1) {
      if (firstFitRef.current) {
        firstFitRef.current = false;
      } else {
        const bounds = L.latLngBounds(valid.map((r) => [r.lat, r.lng]));
        map.flyToBounds(bounds, { padding: [40, 40], maxZoom: 14, duration: 0.5 });
      }
    }
  }, [rows]);

  // Reflect active marker styling
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, m]) => {
      const el = m.getElement();
      if (!el) return;
      const inner = el.querySelector(".cf-pin");
      if (!inner) return;
      inner.classList.toggle("active", id === active);
    });
  }, [active, rows]);

  return (
    <div className="map-wrap">
      <div className="map-base" ref={containerRef} />
      {sel &&
      <div className="map-card">
          {/* Desktop layout */}
          <div className="map-card-full">
            <span className="eyebrow">{sel.location} · {sel.michelin}</span>
            <h4>{sel.name}</h4>
            <div className="meta">{sel.cuisine}</div>
            <div className="row"><span>Tastiness</span><span><Score value={sel.tastiness} /></span></div>
            <div className="row"><span>Value for Money</span><span><PoundMark value={sel.value} /></span></div>
            <div className="row"><span>Latest</span><span>{window.formatDate(sel.latestDate)}</span></div>
            <div style={{ marginTop: 16 }}>
              <button className="btn" onClick={() => navigate("restaurant", { id: sel.id })}>Open review →</button>
            </div>
          </div>
          {/* Mobile compact layout */}
          <div className="map-card-compact">
            <h4>{sel.name}</h4>
            <div className="mcc-sub">{sel.cuisine} · {sel.michelin}</div>
            <div className="mcc-stats">
              <span>Tastiness {sel.tastiness}/10</span>
              <span className="mcc-sep">|</span>
              <span>Value <PoundMark value={sel.value} /></span>
              <span className="mcc-sep">|</span>
              <span>{window.formatDate(sel.latestDate)}</span>
            </div>
            <button className="btn" onClick={() => navigate("restaurant", { id: sel.id })}>Open review →</button>
          </div>
        </div>
      }
    </div>);

}

Object.assign(window, { ReviewsPage });

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pag-btn"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page">
        ← Prev
      </button>
      <span className="pag-status">Page {page} of {totalPages}</span>
      <button
        className="pag-btn"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page">
        Next →
      </button>
    </nav>);
}