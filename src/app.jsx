// CIELSFOOD — App entry: routing + tweaks panel + page mounting

const { useState: useS, useEffect: useE } = React;

function App() {
  // Clean-path router: /, /about, /categories, /restaurants,
  // /restaurant/:slug, /search/:term (GitHub Pages SPA — see 404.html).
  const parsePath = () => {
    const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
    if (!path) return { page: "home", seg: null };
    const [page, ...rest] = path.split("/");
    let seg = null;
    if (rest.length) {
      try { seg = decodeURIComponent(rest.join("/")); }
      catch (e) { seg = rest.join("/"); }
    }
    return { page, seg };
  };
  const [route, setRoute] = useS(parsePath());

  useE(() => {
    const onPop = () => setRoute(parsePath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function pathFor(page, params = {}) {
    if (page === "home") return "/";
    if (page === "restaurant" && params.id) return `/restaurant/${window.slugForRestaurant(params.id)}`;
    if (page === "search" && params.term) return `/search/${encodeURIComponent(params.term)}`;
    return `/${page}`;
  }

  function navigate(page, params = {}) {
    const path = pathFor(page, params);
    if (path !== window.location.pathname) {
      window.history.pushState({}, "", path);
    }
    setRoute(parsePath());
    window.scrollTo({ top: 0 });
  }

  function handleNavSearch(term) {
    if (term) navigate("search", { term });
  }

  // ---------- Tweaks ----------
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accent": "ink",
    "density": "spacious",
    "paper": "off"
  }/*EDITMODE-END*/;
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useE(() => {
    document.documentElement.setAttribute("data-accent", tweaks.accent);
    document.documentElement.setAttribute("data-density", tweaks.density);
    document.documentElement.setAttribute("data-paper", tweaks.paper);
  }, [tweaks]);

  let pageId = route.page;
  // Normalize unknown routes
  const known = ["home", "about", "categories", "restaurants", "restaurant", "search"];
  if (!known.includes(pageId)) pageId = "home";

  // Per-page document.title. Runs in an effect (a tick after any pushState) so
  // the browser tab reliably reflects it on both direct loads and in-app nav.
  useE(() => {
    const SITE = "CieL's Food Guide";
    let label;
    if (pageId === "about")            label = "About";
    else if (pageId === "restaurants") label = "Restaurants";
    else if (pageId === "categories")  label = "Categories";
    else if (pageId === "search")      label = "Search";
    else if (pageId === "restaurant") {
      const rest = window.restaurantBySlug(route.seg);
      label = rest ? `Review of ${rest.name}` : "Restaurants";
    }
    else label = "Home";
    document.title = `${label} - ${SITE}`;
  }, [pageId, route.seg]);

  let body;
  if (pageId === "home")            body = <HomePage navigate={navigate}/>;
  else if (pageId === "about")      body = <AboutPage navigate={navigate}/>;
  else if (pageId === "categories") body = <CategoriesPage/>;
  else if (pageId === "restaurants") body = <ReviewsPage navigate={navigate}/>;
  else if (pageId === "restaurant") {
    const rest = window.restaurantBySlug(route.seg);
    body = <ReviewDetailPage restaurantId={rest ? rest.id : route.seg} navigate={navigate}/>;
  }
  else if (pageId === "search")     body = <SearchResultsPage query={route.seg || ""} navigate={navigate}/>;

  const navPage = (pageId === "restaurant" || pageId === "search") ? "restaurants" : pageId;

  return (
    <>
      <Nav page={navPage} navigate={navigate} onNavSearch={handleNavSearch}/>
      {body}
      <Footer />

      <TweaksPanel>
        <TweakSection label="Accent colour"/>
        <TweakRadio
          label="Accent"
          value={tweaks.accent}
          onChange={v => setTweak("accent", v)}
          options={[
            { value: "ink",         label: "Ink" },
            { value: "olive",       label: "Olive" },
            { value: "terracotta",  label: "Terra" },
            { value: "burgundy",    label: "Wine" }
          ]}
        />
        <TweakSection label="Density"/>
        <TweakRadio
          label="Layout"
          value={tweaks.density}
          onChange={v => setTweak("density", v)}
          options={[
            { value: "spacious", label: "Spacious" },
            { value: "compact",  label: "Compact" }
          ]}
        />
        <TweakSection label="Paper"/>
        <TweakToggle
          label="Grain overlay"
          value={tweaks.paper === "on"}
          onChange={v => setTweak("paper", v ? "on" : "off")}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
