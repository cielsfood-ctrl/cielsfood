// CIELSFOOD — shared shell components: Nav, Layout, Footer, helpers (BUNDLE VERSION — uses window.__resources for assets)

const { useState, useEffect, useRef, useMemo } = React;

function Brand({ onClick }) {
  const src = (window.__resources && window.__resources.logo) ? window.__resources.logo : "logo.png";
  return (
    <div className="brand" onClick={onClick} role="button" aria-label="Home">
      <img src={src} alt="Ciel's Food Guide" className="brand-logo"/>
    </div>);
}

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

function Nav({ page, navigate, onNavSearch }) {
  const [open, setOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const links = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "restaurants", label: "Restaurants" },
    { id: "categories", label: "Categories" }];

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function go(id) { setOpen(false); navigate(id); }

  function handleSearch() {
    if (onNavSearch) onNavSearch(searchVal.trim());
  }

  return (
    <React.Fragment>
      <nav className="nav">
        <div className="shell">
          {/* Single row: Brand (left) + nav links (centre) + search (right) */}
          <div className="nav-top-bar">
            <Brand onClick={() => go("home")} />
            <div className="nav-links">
              {links.map((l) =>
                <button
                  key={l.id}
                  className="nav-link"
                  aria-current={page === l.id ? "page" : undefined}
                  onClick={() => go(l.id)}>
                  {l.label}
                </button>
              )}
            </div>
            <div className="nav-search-wrap">
              <input
                type="text"
                className="nav-search-input"
                placeholder="Search CieL's Guide"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              />
              <button className="nav-search-btn" onClick={handleSearch} aria-label="Search">
                <SearchIcon />
              </button>
            </div>
            <button
              className={"nav-burger" + (open ? " is-open" : "")}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          {/* Mobile search bar */}
          <div className="nav-search-mobile-bar">
            <input
              type="text"
              className="nav-search-mobile-input"
              placeholder="Search CieL's Guide"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
            />
            <button className="nav-search-mobile-btn" onClick={handleSearch} aria-label="Search">
              <SearchIcon />
            </button>
          </div>
        </div>
      </nav>

      <div className={"nav-overlay" + (open ? " is-open" : "")} aria-hidden={!open}>
        <div className="nav-overlay-inner">
          <div className="nav-overlay-top">
            <div className="nav-overlay-brand">
              <Brand onClick={() => go("home")} />
              <button className="nav-overlay-close" aria-label="Close menu" onClick={() => setOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
              </button>
            </div>
            <ul className="nav-overlay-links">
              {links.map((l, i) =>
                <li key={l.id} style={{ transitionDelay: open ? (60 + i * 60) + "ms" : "0ms" }}>
                  <button
                    className={"nav-overlay-link" + (page === l.id ? " is-active" : "")}
                    onClick={() => go(l.id)}>
                    <span className="nav-overlay-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="nav-overlay-label">{l.label}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
          <div className="nav-overlay-foot">
            <span>© CIELSFOOD</span>
            <span>instagram.com/cielsfood</span>
          </div>
        </div>
      </div>
    </React.Fragment>);
}

function Footer() {
  return (
    <footer className="foot-wrap">
      <div className="foot shell">
        <span>© cielsfood.com | Words, Photography and Website Development by Cherrie Leung</span>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <a href="mailto:cherrie@cielsfood.com" aria-label="Email" style={{ color: "inherit", display: "flex" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="28">
              <circle cx="256" cy="256" r="236" />
              <rect x="112" y="160" width="288" height="196" rx="8" />
              <polyline points="112,160 256,284 400,160" />
            </svg>
          </a>
          <a href="https://www.instagram.com/cielsfood" target="_blank" rel="noreferrer" aria-label="Instagram" style={{ color: "inherit", display: "flex" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="28">
              <circle cx="256" cy="256" r="236" />
              <rect x="148" y="148" width="216" height="216" rx="54" />
              <circle cx="256" cy="256" r="62" />
              <circle cx="340" cy="172" r="14" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>
      </div>
    </footer>);
}

function Score({ value, max = 10 }) {
  return (
    <span className="tasti">{value}<em>/{max}</em></span>);
}

function PoundMark({ value }) {
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em" }}>
      <span style={{ color: "var(--ink)" }}>{"£".repeat(value)}</span>
      <span style={{ color: "var(--rule-strong)" }}>{"£".repeat(Math.max(0, 5 - value))}</span>
    </span>);
}

Object.assign(window, { Nav, Footer, Brand, Score, PoundMark });
