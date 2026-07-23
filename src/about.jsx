// CIELSFOOD — About page

function AboutPage({ navigate }) {
  return (
    <main className="shell">
      <section className="about-grid">
        <div className="about-body body">
          <h1 className="h-display" style={{ margin: "10px 0 20px", fontSize: "70px" }}>About</h1>
          <hr className="rule" style={{ margin: "0 0 28px", maxWidth: "100%" }} />
          <p className="first-letter">
            Welcome to CieL's Food Guide. My name is Cherrie 'CieL' Leung, and I am an
            independent food critic who decided to create my own food guide after struggling
            to find honest restaurant reviews. Every review follows a consistent framework and
            you can read more about my rating categories{" "}
            <a className="link" href="/categories" onClick={(e) => {e.preventDefault();navigate("categories");}}>here</a>.
            {" "}Increasingly, I'm also drawn to the people behind the plate: understanding a
            chef's journey, their ideals and what they're trying to say through their food. My
            food journey is captured by my phone or my Sony ZV-1 II camera.
          </p>
          <p>
            Having grown up in Hong Kong and now based in London, I've been fortunate to
            experience an incredible breadth of global cuisine. Both cities offer extraordinary
            depth, including some of the world's finest Michelin-starred establishments, and
            I've spent years getting properly acquainted with what each has to offer. My travels
            have taken me further still, from Japan to France and beyond, and I always try to eat
            properly and understand the local cuisine wherever I am. Each journey has deepened my
            appreciation for food, and I'm genuinely glad to share the best of what I've found
            with you.
          </p>
          <p>
            Join me on{" "}
            <a className="link" href="https://www.instagram.com/cielsfood/" target="_blank" rel="noreferrer">
              @cielsfood
            </a>{" "}for shorter reviews between full write-ups. If there's a restaurant that you'd
            like to see reviewed, or simply have thoughts on the guide, I'd love to hear from you
            directly by <a className="link" href="mailto:cherrie@cielsfood.com">email</a>. For chefs
            and restaurants interested in a feature, or a deeper profile of their story, you are
            welcome to reach out the same way.
          </p>
        </div>
      </section>
    </main>);

}

Object.assign(window, { AboutPage });