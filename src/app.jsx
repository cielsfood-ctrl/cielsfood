// CIELSFOOD — App entry: routing + tweaks panel + page mounting

const { useState: useS, useEffect: useE } = React;

function App() {
  // hash-based router: #/home, #/about, #/categories, #/reviews, #/review/r02
  const parseHash = () => {
    const h = (window.location.hash || "#/home").replace(/^#\/?/, "");
    const [page, ...rest] = h.split("/");
    return { page: page || "home", id: rest[0] || null };
  };
  const [route, setRoute] = useS(parseHash());

  useE(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function navigate(page, params = {}) {
    if (page === "review" && params.id) window.location.hash = `#/review/${params.id}`;
    else window.location.hash = `#/${page}`;
    window.scrollTo({ top: 0 });
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
  const known = ["home", "about", "categories", "reviews", "review"];
  if (!known.includes(pageId)) pageId = "home";

  let body;
  if (pageId === "home")       body = <HomePage navigate={navigate}/>;
  else if (pageId === "about") body = <AboutPage navigate={navigate}/>;
  else if (pageId === "categories") body = <CategoriesPage/>;
  else if (pageId === "reviews")    body = <ReviewsPage navigate={navigate}/>;
  else if (pageId === "review")     body = <ReviewDetailPage restaurantId={route.id} navigate={navigate}/>;

  const navPage = pageId === "review" ? "reviews" : pageId;

  return (
    <>
      <Nav page={navPage} navigate={navigate}/>
      {body}

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
