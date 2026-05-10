// CIELSFOOD — Reviews page (List + Map view)

function ReviewsPage({ navigate }) {
  const [view, setView] = useState("list");
  const [cuisine, setCuisine] = useState("All");
  const [city, setCity] = useState("All");
  const [michelin, setMichelin] = useState("All");
  const [minTasti, setMinTasti] = useState(0);
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState("date-desc");
  const [page, setPage] = useState(1);
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
    filter((r) => city === "All" || r.location === city).
    filter((r) => michelin === "All" || r.michelin === michelin).
    filter((r) => r.tastiness >= minTasti).
    filter((r) => !search.trim() || (r.name + r.cuisine + r.location).toLowerCase().includes(search.toLowerCase())).
    sort((a, b) => {
      const [key, dirRaw] = sortMode.split("-");
      const dir = dirRaw === "asc" ? 1 : -1;
      if (key === "date")      return (a.latestDate < b.latestDate ? -1 : 1) * dir;
      if (key === "tastiness") return (a.tastiness - b.tastiness) * dir;
      if (key === "value")     return (a.value - b.value) * dir;
      // string keys: name, location
      return ((a[key] || "").toString().toLowerCase() < (b[key] || "").toString().toLowerCase() ? -1 : 1) * dir;
    });
  }, [cuisine, city, michelin, minTasti, search, sortMode]);

  // Reset to page 1 whenever filters/sort change
  useEffect(() => { setPage(1); }, [cuisine, city, michelin, minTasti, search, sortMode, view]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageRows = view === "list" ? rows.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE) : rows;
  const sortLabel = (SORT_OPTIONS.find((o) => o.value === sortMode) || {}).label || "";

  const cuisineOpts = ["All", ...Array.from(new Set(window.RESTAURANTS.map((r) => r.cuisine))).sort()];
  const cityOpts = ["All", ...Array.from(new Set(window.RESTAURANTS.map((r) => r.location))).sort()];
  const michOpts = ["All", ...window.MICHELIN];

  return (
    <main className="shell">
      <section className="reviews-head">
        <div>
          <span className="eyebrow"></span>
          <h1 className="h-display" style={{ margin: "10px 0 8px", fontSize: "70px" }}>Reviews</h1>
          <p className="kicker"></p>
        </div>
        <div className="view-switch" role="tablist">
          <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>List</button>
          <button className={view === "map" ? "active" : ""} onClick={() => setView("map")}>Map</button>
        </div>
      </section>

      <section className="filters">
        <div className="filter-group" style={{ minWidth: 200 }}>
          <label>Search</label>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Restaurant, cuisine, city…" />
        </div>
        <div className="filter-group">
          <label>Cuisine</label>
          <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
            {cuisineOpts.map((o) => <option key={o}>{o}</option>)}
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
        <div className="filter-group" style={{ minWidth: 220 }}>
          <label>Sort by</label>
          <select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="filter-group" style={{ minWidth: 140, alignSelf: "end" }}>
          <button className="btn--ghost btn" onClick={() => {
            setCuisine("All");setCity("All");setMichelin("All");setMinTasti(0);setSearch("");setSortMode("date-desc");
          }}>Reset filters</button>
        </div>
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
          <tr key={r.id} className="row" onClick={() => navigate("review", { id: r.id })}>
                <td className="name">{r.name}</td>
                <td style={{ fontStyle: "italic" }}>{r.cuisine}</td>
                <td>{r.location}</td>
                <td><Score value={r.tastiness} /></td>
                <td className="eyebrow" style={{ fontSize: 13 }}>{window.formatDate(r.latestDate)}</td>
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

      <Footer />
    </main>);

}

function MapView({ rows, navigate }) {
  const [active, setActive] = useState(rows[0]?.id || null);
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
        html: `<div class="cf-pin"><div class="stick"></div><div class="label">${r.name.replace(/</g, "&lt;")}</div></div>`,
        iconSize: [22, 28],
        iconAnchor: [11, 28]
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
          <span className="eyebrow">{sel.location} · {sel.michelin}</span>
          <h4>{sel.name}</h4>
          <div className="meta">{sel.cuisine}</div>
          <div className="row"><span>Tastiness</span><span><Score value={sel.tastiness} /></span></div>
          <div className="row"><span>Value</span><span><PoundMark value={sel.value} /></span></div>
          <div className="row"><span>Latest</span><span>{window.formatDate(sel.latestDate)}</span></div>
          <div style={{ marginTop: 16 }}>
            <button className="btn" onClick={() => navigate("review", { id: sel.id })}>Open review →</button>
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