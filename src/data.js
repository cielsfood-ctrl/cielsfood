// Sample data for CIELSFOOD
// Two databases: restaurants and reviews. Reviews are linked to restaurants by restaurantId.

const CUISINES = [
  "Cantonese", "Sichuan", "Japanese", "Sushi", "Ramen", "Korean",
  "Thai", "Vietnamese", "Indian", "French", "Italian", "Spanish",
  "British", "Modern European", "Middle Eastern", "Mexican", "American", "Fusion"
];

const CITIES = [
  "London", "Paris", "Tokyo", "Hong Kong", "New York",
  "Lisbon", "Copenhagen", "Bangkok", "Seoul", "Barcelona"
];

const MICHELIN = ["None", "Guide", "Bib Gourmand", "1★", "2★", "3★"];

// mapX/mapY are normalized 0–1 for the static placeholder map; lat/lng are real coordinates for Leaflet.
const RESTAURANTS = [
  { id: "r12", name: "BELLY",   cuisine: "Modern Filipino", location: "London",  address: "157 Kentish Town Road, London, NW1 8PD, United Kingdom", website: "https://bellylondon.com",         michelin: "Guide", value: 4, mapX: 0.18, mapY: 0.36, lat: 51.547,  lng: -0.1428 },
  { id: "r16", name: "St. JOHN", cuisine: "British",        location: "London",  address: "26 St John St, EC1M 4AY",                                website: "https://stjohnrestaurant.com",   michelin: "1★",   value: 4, mapX: 0.30, mapY: 0.32, lat: 51.523,  lng: -0.1031 },
  { id: "r17", name: "Tutto",    cuisine: "Italian",         location: "Brighton", address: "20 Marlborough Place, Brighton, BN11UB, United Kingdom", website: "https://tutto-restaurant.co.uk/", michelin: "Guide", value: 4, mapX: 0.81, mapY: 0.43, lat: 50.826, lng: -0.1383 }
];

// Photo placeholder helper — striped SVG with caption.
const photoPlaceholder = (caption, hue = 28) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'>
      <defs>
        <pattern id='p' width='14' height='14' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'>
          <rect width='14' height='14' fill='hsl(${hue},18%,88%)'/>
          <line x1='0' y1='0' x2='0' y2='14' stroke='hsl(${hue},14%,80%)' stroke-width='6'/>
        </pattern>
      </defs>
      <rect width='800' height='600' fill='url(#p)'/>
      <text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle'
            font-family='ui-monospace, Menlo, monospace' font-size='18'
            fill='hsl(${hue},20%,40%)' letter-spacing='2'>${caption}</text>
    </svg>`
  )}`;

// Reviews — each restaurant gets 1–3 dated reviews.
// Tastiness/Specialness/Service/Environment 1–10.
const REVIEWS = [
  // r12 BELLY
  { id: "rv12a", restaurantId: "r12", date: "2025-09-19", tastiness: 6.5, specialness: 7, service: 7, environment: 6, value: 4,
    body: "BELLY is the latest venture from the Maginhawa Group, conceptualised by Chef Omar Shah, who is renowned for running Mamasons and Ramo. The food and drink offerings are kept lean, with each curated on its own concise page. The menu mixed classic French cooking with a touch of Filipino twist, with a focused drink selection of cocktails, mocktails and draft beer.\n\n\nWe started with the smoked trout kinilaw, submerged in a coconut, lime, and coriander sauce. (Kinilaw, which literally translates to ‘eaten raw,’ relies on a sharp, bright cure of vinegar, ginger, and chillies to preserve the freshness of the fish). By swapping the usual raw, snappy fish for smoked trout, the 'just-cured' electricity of traditional kinilaw was traded for a deeper, richer weight. The coconut and lime did a great job pulling it back to that familiar Filipino profile, finished with a nice herbal lift from the coriander. Next was the cured scallops 'Bicol Express', a riff on the name rather than the heavy, slow-cooked classic (Bicol Express is traditionally a Filipino dish of pork simmered in coconut milk, shrimp paste, and chillies). The traditional punch of shrimp paste was swapped for a more subtle, savoury depth that sat just beneath the rich coconut and creeping heat of the chilli. It allowed the natural flavour of the scallops to take the lead, rather than being overwhelmed by the usual intensity of the stew. I had been expecting the freshness of both the trout and scallops to lead in both dishes, but it was lacking and rather lost. Our final starter was the Tempura Cod Pandesal, served like a playful slider with American cheese and an ikura tartar sauce. The concept was fun, but the execution was serious. The cod stayed crispy against the soft, pillowy sweetness of the pandesal, while the ikura in the tartar provided sharp, salty pops that kept the American cheese from being too heavy. It was a clever bit of cooking that felt like a treat; I would rate this dish alone a 9/10.\n\nFor mains, we had the wagyu picanha first. The wagyu picanha was tender and well-seared. The bistek sauce on the side, which was dark, savoury, and a little sweet, went well with the beef. However, the shallot was overly caramelised. (Bistek is the Filipino version of beef steak, typically thinly sliced, marinated in soy sauce and calamansi, then pan-fried and served with onions). While it was an enjoyable plate of food, it didn't quite hit the exceptional heights the 'Wagyu' label usually promises. Following that was the Seafood ‘Caldereta’, a lighter, coastal spin on the traditional goat stew. (Caldereta is a classic Filipino tomato-based stew, traditionally made with goat meat or beef and thickened with liver spread for a rich, savoury depth). The clams, mussels, and squid were served in a light roasted tomato and red pepper sauce, with a silky prawn head aioli that added a deep, salty hint of savouriness. The heavy sauce did not overpower the seafood; however, similar to the starters, the seafood itself was not very fresh and was therefore lacking in flavour. On the side, we had some pandan jasmine rice on the side, which lacked any hint of pandan. We also had the calamansi team, which was basically a zesty, gingery iced tea. The calamansi gave it a sharp kick that worked well with the black tea, though the rosemary was more of a faint background note than a lead flavour. We ended the night with the ube tiramisu. It’s distinct ube sweetness, and the Marker’s Mark soak gave it a boozy backbone. The blueberry compote added a nice bit of tartness, cutting through the cream. The tiramisu looked heavy but was actually quite light. We all had the calamansi iced tea for drinks. It had a distinct and fresh calamansi zing, bright and just a little bitter. The cold brewing left the mouth-drying tannin behind, giving us a relatively light sensation.\n\nWe visited on a Friday evening and the small bistro was pretty occupied, suspecting that no table would have been available without a reservation. Service was friendly, and the staff were engaged and attentive. BELLY was a rather mixed bag, with great Filipino-French fusion inspiration and flavour exploration, held back by the quality of the ingredients alone.",
    photos: [
      { src: window.__resources["belly-photo-0"], caption: "Ube tiramisu, Maker's Mark — Tres Leche, Blueberry Compote (£11)" },
      { src: window.__resources["belly-photo-1"], caption: "Calamansi Iced Tea, Rosemary, Cold Black Brew Tea, Ginger Ale (£6)" },
      { src: window.__resources["belly-photo-2"], caption: "Smoked Trout Kinilaw, Coconut milk, Lime, Coriander (£11)" },
      { src: window.__resources["belly-photo-3"], caption: "Cured Scallops 'Bicol Express', Coconut cream, Chilli (£15)" },
      { src: window.__resources["belly-photo-4"], caption: "Tempura Cod Pandesal, American cheese, Ikura Tartar (£8)" },
      { src: window.__resources["belly-photo-5"], caption: "Wagyu Picanha, Bistek Sauce, Braised shallots (£33)" },
      { src: window.__resources["belly-photo-6"], caption: "Interior" }
    ]
  },

  // r16 St. JOHN
  { id: "rv16a", restaurantId: "r16", date: "2026-04-18", tastiness: 9, specialness: 9, service: 9, environment: 9, value: 4,
    body: "Bone marrow and parsley salad is a benchmark dish, and the white room is one of London's great spaces. Still essential.",
    photos: [
      { src: photoPlaceholder("BONE MARROW · PARSLEY", 28), caption: "Bone marrow with parsley salad." },
      { src: photoPlaceholder("WHITE ROOM", 12), caption: "The dining room — pure white." }
    ]
  },

  // r17 Tutto
  { id: "rv17b", restaurantId: "r17", date: "2026-04-05", tastiness: 6, specialness: 6, service: 8, environment: 7, value: 4,
    body: "A return visit to Tutto. The fritto misto led the table — light, crisp, and properly seasoned, with the lemon and chilli mayo doing exactly what it should. The pappardelle with wild fennel and sausage ragu bianco was the comfort dish of the night: silky pasta, a bright herbal lift cutting through the cream. The lamb special on polenta was generous and well-cooked, though the salsa verde leaned a touch sharp. Grilled hake with puttanesca was the most restrained plate, the fish cleanly handled, the sauce a little quieter than I'd hoped.\n\n\nIt's still a pleasant room and the service is genuinely warm, but this visit didn't quite have the spark of the last. Solid rather than thrilling.",
    photos: [
      { src: window.__resources["tutto-apr-0"], caption: "Fritto Misto di Mare (£16)" },
      { src: window.__resources["tutto-apr-1"], caption: "Pappardelle, wild fennel & sausage ragu bianco (£15)" },
      { src: window.__resources["tutto-apr-2"], caption: "Special - Lamb & Polenta (£26)" },
      { src: window.__resources["tutto-apr-3"], caption: "Grilled Hake, puttanesca sauce (£20)" }
    ]
  },
  { id: "rv17a", restaurantId: "r17", date: "2025-09-20", tastiness: 8, specialness: 6, service: 8, environment: 7, value: 4,
    body: "Stepping into Tutto, you're instantly embraced by a warm amber glow. Set within a former banking hall, the space blends features with Deco elegance and a touch of Italian grandeur. Tutto's seasonal menu offers an exquisite blend of rustic Italian classics with refined, modern flair.\n\n\nWe started with a delicate beef carpaccio layered with porcini dressing, pine nuts, and rocket. This was followed by wood-fired king prawns, perfectly grilled and glazed in punchy garlic and chilli butter. The crispy calamari, paired with samphire and a fragrant bergamot mayonnaise, brought a satisfying crunch with a citrus lift.\n\n\nFor mains, the spaghetti vongole impressed with fresh clams, al dente pasta, and a sauce that balanced lightness with depth. The roasted cod puttanesca was lifted by basil and garlic butter, and the chicken Milanese stood out for its crisp, golden coating and rich caper butter.\n\n\nIf there was one drawback, it was a tendency towards heavily salting. Still, the execution and flavour combinations shone through. Minor seasoning aside, Tutto delivered a confident, comforting slice of Italian dining in the heart of the city.",
    photos: [
      { src: window.__resources["tutto-sep-0"], caption: "Beef carpaccio, porcini dressing, rocket, pine nut, parmesan (£12.5)" },
      { src: window.__resources["tutto-sep-1"], caption: "Wood-fried king prawns, chilli & garlic butter (£13)" },
      { src: window.__resources["tutto-sep-2"], caption: "Crispy-fried calamari, samphire, bergamot mayonnaise pasta (£11.5)" },
      { src: window.__resources["tutto-sep-3"], caption: "Spaghetti vongole, clams, cherry tomato, garlic, white wine (£19)" },
      { src: window.__resources["tutto-sep-4"], caption: "Roasted cod puttanesca, basil & garlic butter (£20)" },
      { src: window.__resources["tutto-sep-5"], caption: "Chicken Milanese, caper butter, parmesan, sage (£20)" }
    ]
  }
];

// Personal favourite — featured on the home page.
const FAVORITE_ID = "r16"; // St. JOHN

// Helpers
function reviewsFor(restaurantId) {
  return REVIEWS
    .filter(r => r.restaurantId === restaurantId)
    .sort((a, b) => b.date.localeCompare(a.date));
}
function latestReviewFor(restaurantId) {
  return reviewsFor(restaurantId)[0];
}
function restaurantById(id) {
  return RESTAURANTS.find(r => r.id === id);
}
function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  const day = d.getDate();
  const suffix = (day % 10 === 1 && day !== 11) ? "st"
                : (day % 10 === 2 && day !== 12) ? "nd"
                : (day % 10 === 3 && day !== 13) ? "rd" : "th";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${day}${suffix} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
function poundString(n) {
  return "£".repeat(n) + "·".repeat(Math.max(0, 5 - n));
}

Object.assign(window, {
  CUISINES, CITIES, MICHELIN, RESTAURANTS, REVIEWS, FAVORITE_ID,
  reviewsFor, latestReviewFor, restaurantById, formatDate, poundString,
  photoPlaceholder
});
