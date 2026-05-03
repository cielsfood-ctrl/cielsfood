// CIELSFOOD — About page

function AboutPage({ navigate }) {
  return (
    <main className="shell">
      <section className="about-grid">
        <div>
          <div className="portrait">
            <img src={window.photoPlaceholder("PORTRAIT", 22)} alt="Portrait" style={{ height: "560.094px" }} />
          </div>
          <div className="about-cap"></div>
        </div>

        <div className="about-body body">
          <h1 className="h-display" style={{ margin: "10px 0 22px", fontSize: "70px" }}>About</h1>
          <hr className="rule" style={{ margin: "0 0 28px", maxWidth: "100%", width: "552.953px" }} />
          <p className="first-letter">I decided to create my own restaurant guide after struggling to find honest restaurant reviews, combining this with my passion for journaling. My food journey is captured by my phone or my Sony ZV-1 II camera.</p>
          <p>
            Having grown up in Hong Kong and now being based in London, I've been fortunate to
            experience an incredible variety of global cuisines. My travels have taken me from Japan
            to France and beyond, with each journey deepening my love for exploring local food
            cultures. You can{" "}
            <a className="link" href="#/categories" onClick={(e) => {e.preventDefault();navigate("categories");}}>learn more about my rating categories</a>.
          </p>
          <p>
            Join me on{" "}
            <a className="link" href="https://www.instagram.com/cielsfood/" target="_blank" rel="noreferrer">
              @cielsfood
            </a>{" "}for more concise and frequent reviews. If you have any recommendations or thoughts about this guide, I'd love to hear from you directly through email.
          </p>
        </div>
      </section>
      <Footer />
    </main>);

}

Object.assign(window, { AboutPage });