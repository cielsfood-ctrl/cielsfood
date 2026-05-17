// CIELSFOOD — shared shell components: Nav, Layout, Footer, helpers (BUNDLE VERSION — uses window.__resources for assets)

const { useState, useEffect, useRef, useMemo } = React;

function Brand({ onClick }) {
  const src = (window.__resources && window.__resources.logo) ? window.__resources.logo : "logo.png";
  return (
    <div className="brand" onClick={onClick} role="button" aria-label="Home">
      <img src={src} alt="Ciel's Food Guide" className="brand-logo"/>
    </div>);
}

function Nav({ page, navigate }) {
  const [open, setOpen] = useState(false);
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

  return (
    <React.Fragment>
      <nav className="nav">
        <div className="shell">
          <div className="nav-row">
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
          <div className="nav-thin">
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      <div className={"nav-overlay" + (open ? " is-open" : "")} aria-hidden={!open}>
        <div className="nav-overlay-inner">
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
        <span>© CIELSFOOD</span>
        <span>instagram.com/cielsfood</span>
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
