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
  { id: "r17", name: "Tutto",    cuisine: "Italian",         location: "Brighton", address: "20 Marlborough Place, Brighton, BN11UB, United Kingdom", website: "https://tutto-restaurant.co.uk/", michelin: "Guide", value: 4, mapX: 0.81, mapY: 0.43, lat: 50.826, lng: -0.1383 },
  { id: "r18", name: "Bridge Arms", cuisine: "Modern British", location: "Canterbury", address: "53 High Street, Canterbury, CT4 5LA, United Kingdom", website: "https://www.bridgearms.co.uk/", michelin: "1★", value: 4, mapX: 0.34, mapY: 0.34, lat: 51.24617, lng: 1.12558 },
  { id: "r19", name: "Bratislavský Meštiansky Pivovar", cuisine: "Slovak", location: "Bratislava", address: "Dunajská 2294/21, 811 08 Bratislava, Slovakia", website: "https://mestianskypivovar.sk/", michelin: "None", value: 4, mapX: 0.60, mapY: 0.38, lat: 48.14587, lng: 17.11792 }
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
  },

  // r18 Bridge Arms
  { id: "rv18a", restaurantId: "r18", date: "2026-02-07", tastiness: 8, specialness: 7, service: 8.5, environment: 8, value: 4,
    body: "Nestled in the historic village of Bridge, the Michelin-starred Bridge Arms is a beautifully restored 16th-century coaching inn that pairs its rustic charm with some of the most refined wood-fired cooking in Kent. The pub recently transitioned to new leadership under Elliot Hewitt and head chef David Gadd. As key members of the original award-winning team, the duo isn't looking to reinvent the wheel but steering the inn towards a more relaxed, family-focused atmosphere without letting the culinary standard slip an inch.\n\nWe began with a masterclass in bread: an Aged Parmesan focaccia and Irish soda bread served with a deeply savoury roast onion butter. The focaccia offered a salty, lacy crispness. In perfect contrast was the dense, nutty crumb of the soda bread. At £6, it was a mandatory investment. Following this were the Maldon oysters. They were reasonably fresh, and accompanied by the saline depth of the Manzanilla sherry that cut through the brine. The highlight of the starters was the Venison, Wild Boar, Pheasant suet pudding. This pub soul food was elevated to a rather artistic form — the venison filling was tender and gamey, encased in a flawlessly rendered crust, with a punch of fresh horseradish that gave a necessary lift. The sauce however was slightly over-seasoned, which overshadowed the pudding itself.\n\nFor mains, we took the staff's recommendation and ordered the Roast Chicken, which did not disappoint. It was a classic comfort. The skin was rendered to golden crisp while the meat remained remarkably succulent. It sat alongside a beef dripping rosti — an obvious structural marvel of shredded potato that was audibly crunchy. The Diane sauce was of extraordinary depth: eschewing the usual cream-heavy version, this was a glossy, mushroom-led reduction filled with umami. We also ordered the Grilled Miso Pork chop, which was very much in the inn's wood-fired ethos. The pork was very well handled, the fat rendered down thoroughly, the meat tender without a hint of greasiness. The miso glaze was caramelised into an enjoyable dark crust. The roasted sweet potatoes — which should rather be described as a purée — were perfectly velvety and smooth.\n\nFood was spectacular and portions were surprisingly generous. Our appetites were so well-filled that we couldn't quite find space for dessert, which was a rare turn of events. Service was exemplary, staff amicable, attentive and friendly. The environment was very comfy and spacious. A very worthy detour from our Canterbury tour.",
    photos: [
      { src: "https://res.cloudinary.com/ddpzamkoa/image/upload/v1779139357/8DC856C2-A29F-4AA3-A3FE-7640A8EE10EA_1_105_c_byjdll.jpg", caption: "Aged Parmesan focaccia and Irish Soda bread with roast onion butter (£6)" },
      { src: "https://res.cloudinary.com/ddpzamkoa/image/upload/v1779139357/FF4EFA14-AC1D-4DF3-8150-85C6097E96D7_1_105_c_kluapc.jpg", caption: "Maldon oysters, Manzanilla sherry & lemon (£7)" },
      { src: "https://res.cloudinary.com/ddpzamkoa/image/upload/v1779139357/79F009A8-1300-4F87-BF19-7C991581D193_1_105_c_zzx2gg.jpg", caption: "Venison, wild boar & Pheasant suet pudding, fresh horseradish (£13)" },
      { src: "https://res.cloudinary.com/ddpzamkoa/image/upload/v1779139357/0DD8D558-3AFB-45B2-9956-299570D350CB_1_105_c_kimts1.jpg", caption: "Roast chicken, beef dripping rosti, Diane sauce (£26)" },
      { src: "https://res.cloudinary.com/ddpzamkoa/image/upload/v1779139357/E387F8C1-68A6-41AD-B3FD-DE3E8A84BC94_1_105_c_lgx7jn.jpg", caption: "Grilled miso pork chop, roast sweet potato (£26)" },
      { src: "https://res.cloudinary.com/ddpzamkoa/image/upload/v1779142524/9DBF079A-3A69-40FC-B4A9-8FD712E4DF86_1_105_c_ha9iad.jpg", caption: "Walnut & salted caramel sour (£12)" }
    ]
  },

  // r19 Bratislavský Meštiansky Pivovar
  { id: "rv19a", restaurantId: "r19", date: "2026-05-14", tastiness: 6, specialness: 7, service: 6, environment: 7, value: 4,
    body: "Bratislavský Meštiansky Pivovar is a restaurant located near the Blue Church. Set inside a beer hall, the space carries an easy, lived-in warmth — vaulted ceilings, long wooden tables, and the low hum of a Friday crowd that clearly knows where to spend its evening.\n\nWe ordered two Slovak classics. Starting with the Szegedin Goulash (7/10), served with stewed sauerkraut and homemade dumplings with sour cream. The pork was tender and soft, and the cream sauce did well to balance the sauerkraut, which leaned on the sweeter, less pungent side — very much in line with my personal preference. The Houskový Knedlík dumplings were soft and moist, if unspectacular. A solid, enjoyable dish.\n\nThe Bryndzové halušky, another Slovak classic, was a more mixed dish (5/10). Small potato dumplings are served with Bryndza sheep's cheese and bacon, and it's the kind of dish that lives or dies on execution. Here, the dumplings had been boiled a touch too long, leaving them soggy where they should have had some chew. The Bryndza itself was pleasant but lacked the funky, assertive depth that makes the dish memorable. The bacon, meanwhile, had pushed past caramelised into burnt, tasting more of salt than of meat.\n\nService was welcoming, with staff keeping a brisk pace across a busy floor without leaving us feeling overlooked. Portions were extremely generous given the price point, with beers and spirits averaging around €4.50, hard to argue with. Bratislavský Meštiansky Pivovar is a friendly and unpretentious introduction to Slovak cooking, best visited with an appetite and a curiosity for Slovak dishes.",
    photos: [
      { src: "https://res.cloudinary.com/ddpzamkoa/image/upload/v1779058923/958DDBF1-0D6F-40D1-A060-A95DD5157072_l9sw57.jpg", caption: "Bryndzové halušky (€12.3)" },
      { src: "https://res.cloudinary.com/ddpzamkoa/image/upload/v1779058922/6A0E9508-D4C0-4607-A96B-1FBF197161AB_kjtxb3.jpg", caption: "Szegedin goulash (€11.8)" },
      { src: "https://res.cloudinary.com/ddpzamkoa/image/upload/v1779058922/86D1FA41-8EF4-4032-9B6E-AFE39E135F20_dnpolp.jpg", caption: "Bratislavský Bubák 12 (€3.5) & Spirits (€4.5)" },
      { src: "https://res.cloudinary.com/ddpzamkoa/image/upload/v1779058923/1972F454-1A0C-40E8-90D3-3598534235D7_faasuj.jpg", caption: "Entrance" }
    ]
  },

  // r16 St. JOHN
  { id: "rv16b", restaurantId: "r16", date: "2025-09-15", tastiness: 6, specialness: 5, service: 3, environment: 5, value: 2,
    body: "St. John is a short walk from Smithfield Market, famous for its rustic nose-to-tail cooking. The restaurant is set in a converted Victorian smokehouse with austere aesthetics. The menu changes daily, posted online only a few hours before service.\nThe meal began with the bone marrow and parsley salad (6/10), the entrée St. John is most associated with. The marrow was everything it should be - fatty, creamy, genuinely beefy, and spreadable onto toast with ease. The problem was the toast itself. Half of it had been grilled to the point of being extremely hard to bite into, which stopped the dish in its tracks. For a signature, it felt careless. The grilled lamb heart was the best thing we ate (6.5/10). Properly charred outside, tender through the middle, with a deep, clean meatiness that needed nothing else on the plate.\nThe brill with leek and tartare sauce (5/10) had the bones of a good dish. The fish itself was tender with a pleasant firmness, and the leek provided a quiet, gentle sweetness alongside it. But the tartare sauce was far too citrus-forward, and rather than lifting the fish it just drowned out whatever delicacy the brill had to offer. A lighter hand would have gone a long way. The duck (5/10) was the most forgettable plate of the night. Most of the meat came out touch, which takes some doing for a braised duck leg takes. The sauce compounded things by swinging too sweet, leaving the dish without any real anchor.\nService was a disappointment. The restaurant was predictably busy, but our waiter seemed genuinely disengaged and uncertain about the dishes, or simply unbothered about explaining them, and visibly more interested in the conversation at the neighbouring table than our own.\nSt. John carries enormous culinary credibility, and the ingredients on the night were clearly good. But good ingredients and a famous philosophy only go so far when the execution is patchy and the service is indifferent. For the price and the reputation, we left underwhelmed with their execution. The overall experience was mediocre and nothing memorable.",
    photos: [
      { src: "https://res.cloudinary.com/ddpzamkoa/image/upload/v1779225781/EA8F6992-76E0-45B0-9523-87E798FE8AC1_1_105_c_eijeav.jpg", caption: "Roast Bone Marrow and Parsley Salad (£16.5) & Grilled Lamb Heart, Cucumber and Anchovy (£14.2)" },
      { src: "https://res.cloudinary.com/ddpzamkoa/image/upload/v1779225781/C0FC0DC9-4177-43DE-B5AC-D0D9C072ECCC_1_105_c_lpdtbq.jpg", caption: "Brill, Leek and Tartare Sauce (£32)" },
      { src: "https://res.cloudinary.com/ddpzamkoa/image/upload/v1779225780/7C684140-F47D-4DCE-A077-9F77C9391FB8_1_105_c_vimfrl.jpg", caption: "Braised Duck leg, Carrot and Green Sauce (£27)" },
      { src: "https://res.cloudinary.com/ddpzamkoa/image/upload/v1779225782/E9F0031A-E0A7-4208-B3C7-E90CAA4C47D0_1_102_a_mij2mn.jpg", caption: "Rice Pudding (£9.8)" }
    ]
  },

  // r16 St. JOHN
  { id: "rv16c", restaurantId: "r16", date: "2025-09-15", tastiness: 6, specialness: 5, service: 3, environment: 5, value: 2,
    body: "St. John is a short walk from Smithfield Market, famous for its rustic nose-to-tail cooking. The restaurant is set in a converted Victorian smokehouse with austere aesthetics. The menu changes daily, posted online only a few hours before service.\nThe meal began with the bone marrow and parsley salad (6/10), the entrée St. John is most associated with. The marrow was everything it should be - fatty, creamy, genuinely beefy, and spreadable onto toast with ease. The problem was the toast itself. Half of it had been grilled to the point of being extremely hard to bite into, which stopped the dish in its tracks. For a signature, it felt careless. The grilled lamb heart was the best thing we ate (6.5/10). Properly charred outside, tender through the middle, with a deep, clean meatiness that needed nothing else on the plate.\nThe brill with leek and tartare sauce (5/10) had the bones of a good dish. The fish itself was tender with a pleasant firmness, and the leek provided a quiet, gentle sweetness alongside it. But the tartare sauce was far too citrus-forward, and rather than lifting the fish it just drowned out whatever delicacy the brill had to offer. A lighter hand would have gone a long way. The duck (5/10) was the most forgettable plate of the night. Most of the meat came out touch, which takes some doing for a braised duck leg takes. The sauce compounded things by swinging too sweet, leaving the dish without any real anchor.\nService was a disappointment. The restaurant was predictably busy, but our waiter seemed genuinely disengaged and uncertain about the dishes, or simply unbothered about explaining them, and visibly more interested in the conversation at the neighbouring table than our own.\nSt. John carries enormous culinary credibility, and the ingredients on the night were clearly good. But good ingredients and a famous philosophy only go so far when the execution is patchy and the service is indifferent. For the price and the reputation, we left underwhelmed with their execution. The overall experience was mediocre and nothing memorable.",
    photos: [
      { src: "https://res.cloudinary.com/ddpzamkoa/image/upload/v1779225781/EA8F6992-76E0-45B0-9523-87E798FE8AC1_1_105_c_eijeav.jpg", caption: "Roast Bone Marrow and Parsley Salad (£16.5) & Grilled Lamb Heart, Cucumber and Anchovy (£14.2)" },
      { src: "https://res.cloudinary.com/ddpzamkoa/image/upload/v1779225781/C0FC0DC9-4177-43DE-B5AC-D0D9C072ECCC_1_105_c_lpdtbq.jpg", caption: "Brill, Leek and Tartare Sauce (£32)" },
      { src: "https://res.cloudinary.com/ddpzamkoa/image/upload/v1779225780/7C684140-F47D-4DCE-A077-9F77C9391FB8_1_105_c_vimfrl.jpg", caption: "Braised Duck leg, Carrot and Green Sauce (£27)" },
      { src: "https://res.cloudinary.com/ddpzamkoa/image/upload/v1779225782/E9F0031A-E0A7-4208-B3C7-E90CAA4C47D0_1_102_a_mij2mn.jpg", caption: "Rice Pudding (£9.8)" }
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
