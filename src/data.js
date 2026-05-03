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

// 20 restaurants with multiple reviews each.
// Coordinates are normalized 0–1 for the placeholder map (x = lng-ish, y = lat-ish).
const RESTAURANTS = [
  { id: "r01", name: "Brutto",                 cuisine: "Italian",          location: "London",     address: "35–37 Greenhill Rents, EC1M 6BN", website: "https://brutto.co.uk",      michelin: "Bib Gourmand", value: 2, mapX: 0.30, mapY: 0.32 },
  { id: "r02", name: "Mountain",               cuisine: "Modern European",  location: "London",     address: "16–18 Beak St, W1F 9RD",          website: "https://mountainbeakstreet.com", michelin: "1★",      value: 4, mapX: 0.28, mapY: 0.30 },
  { id: "r03", name: "Sushi Kanesaka",         cuisine: "Sushi",            location: "Tokyo",      address: "8-10-3 Ginza, Chuo City",         website: "https://sushi-kanesaka.com",     michelin: "2★",      value: 5, mapX: 0.78, mapY: 0.36 },
  { id: "r04", name: "Le Servan",              cuisine: "French",           location: "Paris",      address: "32 Rue Saint-Maur, 75011",        website: "https://leservan.com",            michelin: "Guide",   value: 3, mapX: 0.34, mapY: 0.34 },
  { id: "r05", name: "Tim Ho Wan",             cuisine: "Cantonese",        location: "Hong Kong",  address: "Shop 12A, Olympian City 2",       website: "https://timhowan.com",            michelin: "1★",      value: 1, mapX: 0.82, mapY: 0.42 },
  { id: "r06", name: "Sabor",                  cuisine: "Spanish",          location: "London",     address: "35–37 Heddon St, W1B 4BR",        website: "https://saborrestaurants.co.uk", michelin: "1★",      value: 4, mapX: 0.29, mapY: 0.31 },
  { id: "r07", name: "Akoko",                  cuisine: "Fusion",           location: "London",     address: "21 Berners St, W1T 3LP",          website: "https://akoko.co.uk",             michelin: "1★",      value: 4, mapX: 0.30, mapY: 0.30 },
  { id: "r08", name: "Sungold",                cuisine: "Korean",           location: "London",     address: "Borough Yards, SE1 9AG",          website: "#",                               michelin: "None",    value: 2, mapX: 0.31, mapY: 0.33 },
  { id: "r09", name: "Bouchon Racine",         cuisine: "French",           location: "London",     address: "66 Cowcross St, EC1M 6BP",        website: "https://bouchonracine.com",       michelin: "Bib Gourmand", value: 3, mapX: 0.30, mapY: 0.31 },
  { id: "r10", name: "Tsuta",                  cuisine: "Ramen",            location: "Tokyo",      address: "1-14-1 Sugamo, Toshima",          website: "https://tsuta.com",               michelin: "Guide",   value: 2, mapX: 0.79, mapY: 0.35 },
  { id: "r11", name: "Mosquito",               cuisine: "Vietnamese",       location: "Paris",      address: "8 Rue Saint-Marc, 75002",         website: "#",                               michelin: "Bib Gourmand", value: 2, mapX: 0.34, mapY: 0.33 },
  { id: "r12", name: "BELLY",                  cuisine: "Modern Filipino",  location: "London",     address: "157 Kentish Town Road, London, NW1 8PD, United Kingdom", website: "https://bellylondon.com",         michelin: "Guide",      value: 4, mapX: 0.18, mapY: 0.36 },
  { id: "r13", name: "Lung King Heen",         cuisine: "Cantonese",        location: "Hong Kong",  address: "Four Seasons, 8 Finance St",      website: "#",                               michelin: "3★",      value: 5, mapX: 0.82, mapY: 0.41 },
  { id: "r14", name: "Trullo",                 cuisine: "Italian",          location: "London",     address: "300–302 St Paul's Rd, N1 2LH",    website: "https://trullorestaurant.com",   michelin: "None",    value: 3, mapX: 0.29, mapY: 0.28 },
  { id: "r15", name: "Den",                    cuisine: "Japanese",         location: "Tokyo",      address: "2-3-18 Jingumae, Shibuya",        website: "#",                               michelin: "2★",      value: 5, mapX: 0.78, mapY: 0.37 },
  { id: "r16", name: "St. JOHN",               cuisine: "British",          location: "London",     address: "26 St John St, EC1M 4AY",         website: "https://stjohnrestaurant.com",   michelin: "1★",      value: 4, mapX: 0.30, mapY: 0.32 },
  { id: "r17", name: "Tutto",                  cuisine: "Italian",          location: "Brighton",   address: "20 Marlborough Place, Brighton, BN11UB, United Kingdom", website: "https://yardbirdrestaurant.com", michelin: "Guide",   value: 4, mapX: 0.81, mapY: 0.43 },
  { id: "r18", name: "Chez Alain Miam Miam",   cuisine: "French",           location: "Paris",      address: "26 Rue Charlot, 75003",           website: "#",                               michelin: "None",    value: 1, mapX: 0.34, mapY: 0.34 },
  { id: "r19", name: "Som Saa",                cuisine: "Thai",             location: "London",     address: "43A Commercial St, E1 6BD",       website: "https://somsaa.com",              michelin: "Bib Gourmand", value: 3, mapX: 0.31, mapY: 0.30 },
  { id: "r20", name: "Hoppers",                cuisine: "Indian",           location: "London",     address: "49 Frith St, W1D 4SG",            website: "https://hopperslondon.com",      michelin: "Bib Gourmand", value: 2, mapX: 0.29, mapY: 0.31 }
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
  // r01 Brutto
  { id: "rv01a", restaurantId: "r01", date: "2026-04-12", tastiness: 8, specialness: 7, service: 8, environment: 9, value: 2,
    body: "A perpetually thunderous trattoria in Clerkenwell. The bistecca was charred with the kind of conviction you can only get from real fire, and the bone marrow on toast disappeared quicker than the Negronis. The room hums.",
    photos: [
      { src: photoPlaceholder("BISTECCA · BRUTTO", 18), caption: "Bistecca, just off the grill — pink, salty, fragrant." },
      { src: photoPlaceholder("BONE MARROW · TOAST", 28), caption: "Marrow on toast with parsley salad." },
      { src: photoPlaceholder("DINING ROOM", 22), caption: "The dining room around 8pm." }
    ]
  },
  { id: "rv01b", restaurantId: "r01", date: "2025-11-03", tastiness: 7, specialness: 6, service: 7, environment: 9, value: 2,
    body: "Returned for the lasagne. Less remarkable than the steak but the room was as cheerful as ever; we lingered well past midnight.",
    photos: [
      { src: photoPlaceholder("LASAGNE", 14), caption: "Lasagne — comforting, generous." },
      { src: photoPlaceholder("AMARO POUR", 32), caption: "End-of-meal amaro." }
    ]
  },

  // r02 Mountain
  { id: "rv02a", restaurantId: "r02", date: "2026-03-28", tastiness: 9, specialness: 9, service: 8, environment: 8, value: 4,
    body: "Lopriore has built something rare on Beak Street. Hearth-driven Iberian-inflected cooking that feels both rustic and incredibly precise. The blue prawn rice is the dish I keep dreaming about.",
    photos: [
      { src: photoPlaceholder("BLUE PRAWN RICE", 24), caption: "Blue prawn rice — smoky, deeply oceanic." },
      { src: photoPlaceholder("HEARTH", 16), caption: "The open hearth, the heart of the room." },
      { src: photoPlaceholder("HONEY TART", 38), caption: "Honey tart, cream, and an espresso." }
    ]
  },

  // r03 Sushi Kanesaka
  { id: "rv03a", restaurantId: "r03", date: "2026-02-19", tastiness: 10, specialness: 10, service: 10, environment: 9, value: 5,
    body: "A near-religious experience at the counter. The shari is warmer than I expected — body temperature — and every neta seemed to choose its own moment. Otoro sealed it.",
    photos: [
      { src: photoPlaceholder("OTORO NIGIRI", 20), caption: "Otoro — fat melting on contact." },
      { src: photoPlaceholder("SHARI BUILD", 32), caption: "Forming the shari, body temperature." },
      { src: photoPlaceholder("COUNTER", 12), caption: "Eight seats. Total quiet." }
    ]
  },

  // r04 Le Servan
  { id: "rv04a", restaurantId: "r04", date: "2026-01-15", tastiness: 8, specialness: 7, service: 7, environment: 8, value: 3,
    body: "The Levha sisters' bistro lives up to its reputation. Leeks vinaigrette and a duck confit that nearly forced me to reconsider where I was born.",
    photos: [
      { src: photoPlaceholder("LEEKS VINAIGRETTE", 76), caption: "Leeks vinaigrette, the canonical version." },
      { src: photoPlaceholder("DUCK CONFIT", 24), caption: "Duck confit, crackling skin." }
    ]
  },

  // r05 Tim Ho Wan
  { id: "rv05a", restaurantId: "r05", date: "2026-04-02", tastiness: 8, specialness: 6, service: 6, environment: 5, value: 1,
    body: "Came back home and went straight here. The baked BBQ pork buns are still the benchmark — sweet, glossy, and pulling apart with disrespectful ease.",
    photos: [
      { src: photoPlaceholder("BBQ PORK BUNS", 28), caption: "The famous baked char siu buns." },
      { src: photoPlaceholder("HAR GAU", 60), caption: "Har gau, translucent skins." }
    ]
  },

  // r06 Sabor
  { id: "rv06a", restaurantId: "r06", date: "2026-03-09", tastiness: 9, specialness: 8, service: 8, environment: 8, value: 4,
    body: "The Galician octopus and the suckling pig made this a top-three Sabor visit for me. Counter seats earn their keep; you watch each pintxo built in real time.",
    photos: [
      { src: photoPlaceholder("PULPO A FEIRA", 18), caption: "Pulpo a feira, paprika, oil." },
      { src: photoPlaceholder("COCHINILLO", 22), caption: "Suckling pig, glassy skin." },
      { src: photoPlaceholder("COUNTER VIEW", 30), caption: "From the counter, mid-service." }
    ]
  },

  // r07 Akoko
  { id: "rv07a", restaurantId: "r07", date: "2026-02-04", tastiness: 9, specialness: 10, service: 9, environment: 9, value: 4,
    body: "West African flavours rendered with extraordinary refinement. The jollof course has more layers than I had vocabulary for. One of the most distinct meals I've had this year.",
    photos: [
      { src: photoPlaceholder("JOLLOF COURSE", 16), caption: "Jollof, smoked deeply." },
      { src: photoPlaceholder("EFO RIRO", 110), caption: "Efo riro, vivid greens." }
    ]
  },

  // r08 Sungold
  { id: "rv08a", restaurantId: "r08", date: "2026-04-22", tastiness: 7, specialness: 7, service: 7, environment: 7, value: 2,
    body: "Korean barbecue under the railway arches. The galbi was the standout, and the banchan rotation kept me happy between flips.",
    photos: [
      { src: photoPlaceholder("GALBI", 22), caption: "Galbi, charring nicely." },
      { src: photoPlaceholder("BANCHAN", 86), caption: "The banchan spread." }
    ]
  },

  // r09 Bouchon Racine
  { id: "rv09a", restaurantId: "r09", date: "2026-03-15", tastiness: 9, specialness: 8, service: 9, environment: 9, value: 3,
    body: "Ate above a pub and felt transported. Pithivier was the headliner, but everything sang. A new favourite for cold London evenings.",
    photos: [
      { src: photoPlaceholder("PITHIVIER", 28), caption: "Pithivier, cross-section." },
      { src: photoPlaceholder("ABOVE THE PUB", 18), caption: "The room, above the pub." }
    ]
  },

  // r10 Tsuta
  { id: "rv10a", restaurantId: "r10", date: "2026-01-28", tastiness: 9, specialness: 9, service: 7, environment: 6, value: 2,
    body: "Truffle shoyu ramen worth queuing in the rain for. The broth carries you, then the truffle oil arrives like punctuation.",
    photos: [
      { src: photoPlaceholder("TRUFFLE SHOYU", 22), caption: "Truffle shoyu — first slurp." }
    ]
  },

  // r11 Mosquito
  { id: "rv11a", restaurantId: "r11", date: "2026-03-21", tastiness: 8, specialness: 8, service: 7, environment: 7, value: 2,
    body: "Vietnamese small plates in the 2nd. Bo la lot was deeply herby and properly smoky.",
    photos: [
      { src: photoPlaceholder("BO LA LOT", 80), caption: "Bo la lot — leaves, smoke." }
    ]
  },

  // r12 BELLY
  { id: "rv12a", restaurantId: "r12", date: "2025-09-19", tastiness: 6.5, specialness: 7, service: 7, environment: 6, value: 4,
    body: "BELLY is the latest venture from the Maginhawa Group, conceptualised by Chef Omar Shah, who is renowned for running Mamasons and Ramo. The food and drink offerings are kept lean, with each curated on its own concise page. The menu mixed classic French cooking with a touch of Filipino twist, with a focused drink selection of cocktails, mocktails and draft beer.\n\n\nWe started with the smoked trout kinilaw, submerged in a coconut, lime, and coriander sauce. (Kinilaw, which literally translates to \u2018eaten raw,\u2019 relies on a sharp, bright cure of vinegar, ginger, and chillies to preserve the freshness of the fish). By swapping the usual raw, snappy fish for smoked trout, the 'just-cured' electricity of traditional kinilaw was traded for a deeper, richer weight. The coconut and lime did a great job pulling it back to that familiar Filipino profile, finished with a nice herbal lift from the coriander. Next was the cured scallops 'Bicol Express', a riff on the name rather than the heavy, slow-cooked classic (Bicol Express is traditionally a Filipino dish of pork simmered in coconut milk, shrimp paste, and chillies). The traditional punch of shrimp paste was swapped for a more subtle, savoury depth that sat just beneath the rich coconut and creeping heat of the chilli. It allowed the natural flavour of the scallops to take the lead, rather than being overwhelmed by the usual intensity of the stew. I had been expecting the freshness of both the trout and scallops to lead in both dishes, but it was lacking and rather lost. Our final starter was the Tempura Cod Pandesal, served like a playful slider with American cheese and an ikura tartar sauce. The concept was fun, but the execution was serious. The cod stayed crispy against the soft, pillowy sweetness of the pandesal, while the ikura in the tartar provided sharp, salty pops that kept the American cheese from being too heavy. It was a clever bit of cooking that felt like a treat; I would rate this dish alone a 9/10.\n\nFor mains, we had the wagyu picanha first. The wagyu picanha was tender and well-seared. The bistek sauce on the side, which was dark, savoury, and a little sweet, went well with the beef. However, the shallot was overly caramelised. (Bistek is the Filipino version of beef steak, typically thinly sliced, marinated in soy sauce and calamansi, then pan-fried and served with onions). While it was an enjoyable plate of food, it didn't quite hit the exceptional heights the 'Wagyu' label usually promises. Following that was the Seafood \u2018Caldereta\u2019, a lighter, coastal spin on the traditional goat stew. (Caldereta is a classic Filipino tomato-based stew, traditionally made with goat meat or beef and thickened with liver spread for a rich, savoury depth). The clams, mussels, and squid were served in a light roasted tomato and red pepper sauce, with a silky prawn head aioli that added a deep, salty hint of savouriness. The heavy sauce did not overpower the seafood; however, similar to the starters, the seafood itself was not very fresh and was therefore lacking in flavour. On the side, we had some pandan jasmine rice on the side, which lacked any hint of pandan. We also had the calamansi team, which was basically a zesty, gingery iced tea. The calamansi gave it a sharp kick that worked well with the black tea, though the rosemary was more of a faint background note than a lead flavour. We ended the night with the ube tiramisu. It\u2019s distinct ube sweetness, and the Marker\u2019s Mark soak gave it a boozy backbone. The blueberry compote added a nice bit of tartness, cutting through the cream. The tiramisu looked heavy but was actually quite light. We all had the calamansi iced tea for drinks. It had a distinct and fresh calamansi zing, bright and just a little bitter. The cold brewing left the mouth-drying tannin behind, giving us a relatively light sensation.\n\nWe visited on a Friday evening and the small bistro was pretty occupied, suspecting that no table would have been available without a reservation. Service was friendly, and the staff were engaged and attentive. BELLY was a rather mixed bag, with great Filipino-French fusion inspiration and flavour exploration, held back by the quality of the ingredients alone.",
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

  // r13 Lung King Heen
  { id: "rv13a", restaurantId: "r13", date: "2026-04-05", tastiness: 10, specialness: 9, service: 10, environment: 10, value: 5,
    body: "Three stars and the city through the windows. The roasted suckling pig and BBQ pork were nearly perfect; service treats you like royalty.",
    photos: [
      { src: photoPlaceholder("SUCKLING PIG", 18), caption: "Suckling pig, lacquered." },
      { src: photoPlaceholder("HARBOUR VIEW", 200), caption: "Victoria Harbour from the table." },
      { src: photoPlaceholder("BBQ PORK", 24), caption: "Char siu, jewel-glossy." }
    ]
  },

  // r14 Trullo
  { id: "rv14a", restaurantId: "r14", date: "2026-02-22", tastiness: 8, specialness: 7, service: 8, environment: 8, value: 3,
    body: "The pappardelle with eight-hour shin ragu remains a thing of structural beauty. House special with reason.",
    photos: [
      { src: photoPlaceholder("PAPPARDELLE · RAGU", 22), caption: "Pappardelle, eight-hour ragu." }
    ]
  },

  // r15 Den
  { id: "rv15a", restaurantId: "r15", date: "2026-03-30", tastiness: 10, specialness: 10, service: 10, environment: 9, value: 5,
    body: "Zaiyu Hasegawa's playful kaiseki. The DFC (Dentucky Fried Chicken) is a wink that delivers; the monaka course landed perfectly.",
    photos: [
      { src: photoPlaceholder("DFC", 20), caption: "DFC — a wink and a delight." },
      { src: photoPlaceholder("MONAKA COURSE", 26), caption: "Monaka, seasonal filling." }
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

  // r17 Yardbird
  { id: "rv17a", restaurantId: "r17", date: "2025-09-20", tastiness: 8, specialness: 6, service: 8, environment: 7, value: 4,
    body: "Stepping into Tutto, you’re instantly embraced by a warm amber glow. Set within a former banking hall, the space blends features with Deco elegance and a touch of Italian grandeur. Tutto's seasonal menu offers an exquisite blend of rustic Italian classics with refined, modern flair.\n\n\nWe started with a delicate beef carpaccio layered with porcini dressing, pine nuts, and rocket. This was followed by wood-fired king prawns, perfectly grilled and glazed in punchy garlic and chilli butter. The crispy calamari, paired with samphire and a fragrant bergamot mayonnaise, brought a satisfying crunch with a citrus lift.\n\n\nFor mains, the spaghetti vongole impressed with fresh clams, al dente pasta, and a sauce that balanced lightness with depth. The roasted cod puttanesca was lifted by basil and garlic butter, and the chicken Milanese stood out for its crisp, golden coating and rich caper butter.\n\n\nIf there was one drawback, it was a tendency towards heavily salting. Still, the execution and flavour combinations shone through. Minor seasoning aside, Tutto delivered a confident, comforting slice of Italian dining in the heart of the city.",
    photos: [
      { src: photoPlaceholder("YAKITORI · TSUKUNE", 22), caption: "Tsukune, raw yolk." }
    ]
  },

  // r18 Chez Alain Miam Miam
  { id: "rv18a", restaurantId: "r18", date: "2026-02-12", tastiness: 7, specialness: 6, service: 6, environment: 5, value: 1,
    body: "A Marais counter sandwich. Cheese, ham, butter, baguette — restraint is the lesson.",
    photos: [
      { src: photoPlaceholder("MARAIS SANDWICH", 38), caption: "The sandwich, mid-bite." }
    ]
  },

  // r19 Som Saa
  { id: "rv19a", restaurantId: "r19", date: "2026-03-04", tastiness: 9, specialness: 8, service: 8, environment: 8, value: 3,
    body: "The deep-fried sea bass with three-flavour sauce ruined other Thai food for me for several weeks.",
    photos: [
      { src: photoPlaceholder("SEA BASS · 3-FLAVOUR", 24), caption: "Whole sea bass, three-flavour sauce." }
    ]
  },

  // r20 Hoppers
  { id: "rv20a", restaurantId: "r20", date: "2026-04-25", tastiness: 8, specialness: 7, service: 7, environment: 7, value: 2,
    body: "Bone-marrow varuval and a lacy hopper to mop it. A reliable Soho love letter.",
    photos: [
      { src: photoPlaceholder("HOPPER · VARUVAL", 28), caption: "Hopper with bone-marrow varuval." }
    ]
  }
];

// Personal favourite — featured on the home page.
const FAVORITE_ID = "r02"; // Mountain

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
