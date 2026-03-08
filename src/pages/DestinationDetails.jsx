import { Link, useParams } from "react-router-dom";
import { ChevronRight, MoveUpRight } from "lucide-react";
import { usePublicContentItem, usePublicTours } from "../hooks/useCms";

const toSlug = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const destinationContent = {
  hunza: {
    overview:
      "Hunza is one of the most iconic valleys in Gilgit-Baltistan, known for dramatic mountain views, historic forts, orchards, and a calm travel rhythm. It is ideal for travelers seeking a balanced journey with culture, scenery, and comfortable road access.",
    history: `Hunza has a deep historical identity as one of the most prominent mountain states in the northern belt, positioned along old Silk Route movement paths. Over centuries, the valley developed around fortified settlements, terraced agriculture, and tightly connected communities that adapted to seasonal mountain life. Baltit and Altit Forts still reflect how power, defense, and social structure were organized in this landscape.

As trade routes evolved and modern road links improved, Hunza gradually shifted from a strategic mountain polity to a globally recognized travel destination. Despite growing tourism, the valley continues to preserve local architecture, orchard traditions, and community-led hospitality, which gives visitors a strong sense of living history rather than a purely commercial tourist stop.`,
    highlights: ["Baltit Fort", "Altit heritage village", "Attabad Lake", "Passu Cones"],
    features: ["Easy sightseeing loops", "Premium valley stays", "Local food and craft markets", "Strong road connectivity"],
    bestTime: "April to October",
    idealFor: "Families, couples, culture-focused and scenic travelers",
  },
  skardu: {
    overview:
      "Skardu is the gateway to high-altitude landscapes, alpine lakes, and desert-meets-mountain scenery. It offers a strong mix of soft adventure and premium leisure with accessible viewpoints and nature-driven routes.",
    history: `Skardu has long been the historic center of Baltistan, where valley settlements, forts, and trade movement shaped local society over many generations. Its location made it important for administrative control and route coordination across surrounding highland communities. Traditional neighborhoods and heritage structures still carry traces of this political and cultural significance.

With time, Skardu became both a gateway for major mountain expeditions and a central district for regional tourism. The transformation brought roads, services, and broader visitor access, but the area still preserves its older cultural rhythm through local crafts, historic sites, and community customs rooted in Baltistani heritage.`,
    highlights: ["Shigar Fort", "Shangrila", "Upper Kachura Lake", "Katpana Cold Desert"],
    features: ["Wide valley panoramas", "Short and long day routes", "Strong photography spots", "Comfortable mixed-pace itineraries"],
    bestTime: "May to September",
    idealFor: "Adventure starters, photographers, and luxury nature travelers",
  },
  "fairy-meadows": {
    overview:
      "Fairy Meadows offers one of the most memorable mountain-front landscapes in Pakistan, with Nanga Parbat views, pine forests, and immersive overnight experiences. It is best for travelers who want raw scenery with curated support.",
    history: `Fairy Meadows was historically part of seasonal mountain movement used by shepherd families and local route guides traveling toward higher pastures. Before modern trekking culture, the region was known primarily to nearby communities who navigated these forests and ridgelines through traditional knowledge passed down across generations.

In recent decades, the area gained international recognition as one of the iconic viewpoints for Nanga Parbat. Even with rising popularity, the place has retained its raw alpine character, where simple camps, forest trails, and local guiding traditions continue to define the experience more than heavy built-up tourism.`,
    highlights: ["Nanga Parbat view deck", "Forest trail camps", "Sunrise ridge points", "Stargazing nights"],
    features: ["High-scenic trekking base", "Compact overnight plans", "Adventure + comfort mix", "Strong visual storytelling spots"],
    bestTime: "June to September",
    idealFor: "Trekking lovers, nature-focused groups, and adventure photographers",
  },
  astore: {
    overview:
      "Astore is a serene mountain district known for green valleys, river plains, and easy access to high-altitude routes toward Deosai. It is ideal for travelers who want quieter landscapes, open meadows, and less-crowded scenic drives.",
    history: `Astore developed as a historic valley corridor connecting nearby mountain regions through seasonal routes used for grazing, trade, and community movement. The district's village structure reflects a long-standing relationship with rivers, pasture cycles, and localized farming systems adapted to short summers and long winters.

Over time, Astore became known as a quieter alternative to busier northern circuits, especially due to its access toward Rama and Deosai approaches. Its historical identity remains closely tied to pastoral culture, village cooperation, and a slower travel rhythm that still feels rooted in traditional mountain life.`,
    highlights: ["Rama Meadows", "Rama Lake", "Astore Valley villages", "Deosai access routes"],
    features: ["Less-crowded routes", "Soft-adventure landscapes", "Family-friendly valley stays", "Strong summer scenery"],
    bestTime: "May to October",
    idealFor: "Nature-focused families, road-trip groups, and relaxed explorers",
  },
  diamer: {
    overview:
      "Diamer offers dramatic mountain terrain, historic settlements, and gateway routes toward Fairy Meadows and Nanga Parbat viewpoints. The region is suited for travelers who enjoy rugged scenery with guided planning.",
    history: `Diamer has historically functioned as a major transit belt along upper Indus movement corridors, where caravans, traders, and communities crossed between valleys. Its geography encouraged route-based settlement growth, with communities closely linked to river systems, mountain passages, and practical roadside exchange.

As road networks expanded, Diamer became increasingly important as an access zone for northern tourism, especially for routes leading toward Fairy Meadows and adjacent high mountain areas. Even today, the district carries a strong frontier character shaped by mobility, local resilience, and river-valley livelihoods.`,
    highlights: ["Chilas viewpoints", "Fairy Meadows access", "Nanga Parbat gateway", "Indus-side landscapes"],
    features: ["Adventure gateway routes", "High mountain panoramas", "Cultural roadside stops", "Flexible drive-based itineraries"],
    bestTime: "May to September",
    idealFor: "Adventure travelers, trekkers, and mountain photographers",
  },
  gilgit: {
    overview:
      "Gilgit is the administrative and travel hub of the north, offering riverfront views, bazaars, and strategic connectivity to Hunza, Skardu, and Ghizer. It works well as both a stay destination and route base.",
    history: `Gilgit has historically stood at a key crossroads between regional mountain states, acting as a strategic junction for trade and political movement. Its position connected routes heading toward Hunza, Baltistan, Chitral-side belts, and beyond, making it one of the most influential urban centers in the north.

Through different administrative eras, Gilgit evolved into a civic and service hub while retaining historical layers visible in its old quarters, local markets, and surrounding heritage zones. Today, it balances modern transit energy with long-standing cultural memory that reflects its role in regional mountain history.`,
    highlights: ["Kargah Buddha", "Gilgit Riverfront", "City bazaars", "Historic local neighborhoods"],
    features: ["Central connectivity", "Comfortable city stays", "Multi-route trip planning", "Local food and craft access"],
    bestTime: "April to October",
    idealFor: "Transit travelers, culture explorers, and mixed-pace itineraries",
  },
  khaplu: {
    overview:
      "Khaplu is a heritage-rich destination in Baltistan known for palace architecture, orchards, and peaceful village life along the Shyok corridor. It is perfect for travelers seeking culture with calm mountain scenery.",
    history: `Khaplu emerged as an important historical seat in Baltistan, where governance, settlement planning, and cultural life developed around palace and village institutions. The area's built heritage, especially around Khaplu Palace and historic neighborhoods, reflects centuries of social order and architectural adaptation.

The region later transitioned from a political center to a cultural travel destination, yet it has preserved a strong sense of place through local traditions, craft practices, and river-valley community life. Khaplu's historical continuity is still visible in the way heritage spaces remain part of everyday life.`,
    highlights: ["Khaplu Palace", "Old village lanes", "Shyok River views", "Chaqchan heritage surroundings"],
    features: ["Heritage-focused stay", "Quiet premium atmosphere", "Strong cultural storytelling", "Scenic village walks"],
    bestTime: "May to October",
    idealFor: "Couples, heritage travelers, and slow-travel itineraries",
  },
  shigar: {
    overview:
      "Shigar combines heritage architecture with wide valley landscapes and comfortable boutique stays. It offers a refined travel experience for visitors wanting history, scenery, and relaxed pacing in one destination.",
    history: `Shigar developed as a vital valley settlement in Baltistan with strong links to fort-based authority, agricultural communities, and inter-valley travel routes. Its historical footprint can be seen in settlement clusters, water-channel systems, and preserved architecture that supported long-term mountain habitation.

As heritage conservation and tourism initiatives expanded, Shigar gained renewed recognition for its cultural depth and restored fort complex. The valley now represents a successful blend of history and hospitality, where old structures are actively integrated into contemporary travel experiences.`,
    highlights: ["Shigar Fort", "River valley viewpoints", "Traditional settlements", "Mountain-backed orchards"],
    features: ["Boutique heritage stays", "Easy valley exploration", "Balanced comfort and culture", "Photography-friendly settings"],
    bestTime: "May to October",
    idealFor: "Luxury seekers, culture travelers, and short scenic escapes",
  },
  ghizer: {
    overview:
      "Ghizer is known for broad valleys, alpine lakes, and turquoise river corridors stretching toward the western mountain belt. The district is ideal for scenic drives, nature retreats, and low-density tourism.",
    history: `Ghizer's history is shaped by wide valleys and frontier routes that connected upper settlements through seasonal migration and regional exchange. Communities in this district built their livelihoods around rivers, highland pastures, and cooperative systems that supported life in changing mountain conditions.

Over time, Ghizer remained less urbanized than other northern hubs, which helped preserve its pastoral and ecological character. Its historical identity continues to be tied to nature-based living, local oral traditions, and low-density settlement patterns across scenic valley belts.`,
    highlights: ["Phander Valley", "Khalti Lake", "Gupis landscapes", "River corridor viewpoints"],
    features: ["Open valley scenery", "Calm travel environment", "Great fishing and nature zones", "Road-trip friendly routes"],
    bestTime: "May to September",
    idealFor: "Nature lovers, photographers, and peaceful long-route travelers",
  },
  nagar: {
    overview:
      "Nagar features high mountain vistas, glacier viewpoints, and village terraces opposite Hunza's iconic peaks. It offers less-crowded scenic travel with strong visual landscapes and cultural depth.",
    history: `Nagar has a distinct historical identity as a former princely state with strategic positioning along major mountain viewsheds and approach routes. Its legacy includes local governance systems, village fortification patterns, and cultural traditions that developed in close relationship with glaciers and terraced land.

With modern connectivity, Nagar became more accessible to visitors, yet it has retained a comparatively authentic social and landscape character. Historical continuity in the area is reflected through community memory, traditional settlement forms, and strong ties to alpine agriculture.`,
    highlights: ["Hopar Glacier viewpoints", "Nagar Khas landscapes", "Village terrace routes", "Rakaposhi-facing scenes"],
    features: ["Less-crowded alternatives", "High-altitude visual routes", "Authentic village experiences", "Strong day-tour potential"],
    bestTime: "May to October",
    idealFor: "Scenic explorers, repeat visitors, and route photographers",
  },
  deosai: {
    overview:
      "Deosai is a high-altitude plateau famous for wide grasslands, wildflower fields, and dramatic skies at over 4,000 meters. It is a signature summer destination for raw nature and open wilderness experiences.",
    history: `Deosai has long been part of seasonal mountain movement, especially for grazing and summer passage by surrounding communities. Due to its altitude and climate, the plateau was historically used only during limited months, which shaped its identity as a remote and powerful highland landscape.

In the modern era, Deosai gained protected status as a national park and became a landmark destination for eco-tourism and conservation-led travel. Its history now combines traditional seasonal use with contemporary environmental stewardship, making it one of the most culturally and ecologically significant plateaus in the region.`,
    highlights: ["Sheosar Lake", "Open alpine plains", "Wildlife observation zones", "Panoramic highland drives"],
    features: ["National park setting", "Distinct summer ecosystem", "Unique high-altitude terrain", "Strong camping and day-trip options"],
    bestTime: "July to September",
    idealFor: "Adventure groups, wildlife enthusiasts, and landscape photographers",
  },
};

const buildDefaultDestinationContent = (slug = "") => {
  const name = slug.replace(/-/g, " ").trim() || "this destination";
  const titleName = name.charAt(0).toUpperCase() + name.slice(1);
  return {
    overview:
      `${titleName} offers a balanced mix of mountain scenery, cultural touchpoints, and practical travel routes. It is well-suited for travelers who want guided comfort, meaningful local experiences, and flexible day plans.`,
    history: `${titleName} has evolved through historic mountain movement, local settlement traditions, and regional exchange routes. Communities in this area developed resilient social systems shaped by climate, terrain, and seasonal livelihoods, and many of those cultural patterns remain visible in local architecture, food, and everyday life.

In recent years, improved access has brought more travelers and tourism services, but the deeper identity of ${titleName} still comes from its long-standing relationship with mountain landscapes and community-based heritage. This balance of history and contemporary travel makes it a meaningful destination beyond sightseeing.`,
    highlights: ["Scenic viewpoints", "Historic locations", "Nature-driven routes", "Local culture"],
    features: ["Flexible itineraries", "Verified support", "Comfort planning", "Transparent pricing"],
    bestTime: "May to October",
    idealFor: "Scenic and comfort-focused travel groups",
  };
};

const getDestinationContent = (slug) => {
  if (!slug) return buildDefaultDestinationContent();
  if (destinationContent[slug]) return destinationContent[slug];
  const aliasMap = [
    ["hunza", "hunza"],
    ["skardu", "skardu"],
    ["fairy", "fairy-meadows"],
    ["meadows", "fairy-meadows"],
    ["astore", "astore"],
    ["diamer", "diamer"],
    ["gilgit", "gilgit"],
    ["khaplu", "khaplu"],
    ["shigar", "shigar"],
    ["ghizer", "ghizer"],
    ["nagar", "nagar"],
    ["deosai", "deosai"],
  ];

  const matchedAlias = aliasMap.find(([alias]) => slug.includes(alias));
  if (matchedAlias) return destinationContent[matchedAlias[1]];
  return buildDefaultDestinationContent(slug);
};

const DestinationDetails = () => {
  const { slug } = useParams();
  const { data: tours = [] } = usePublicTours();
  const normalizedSlug = (slug || "").toLowerCase().trim();
  const { data: backendDestination } = usePublicContentItem("destination", normalizedSlug);

  const destinationName = backendDestination?.title || (slug || "destination").replace(/-/g, " ").trim();

  const matchedTours = tours.filter(
    (tour) => toSlug(tour.location || "") === normalizedSlug,
  );
  const defaultContent = getDestinationContent(normalizedSlug);
  const content = backendDestination
    ? {
      overview:
          backendDestination.shortDescription ||
          backendDestination.description ||
          defaultContent.overview,
      history: backendDestination.content || backendDestination.meta?.history || defaultContent.history,
      highlights: backendDestination.highlights?.length ? backendDestination.highlights : defaultContent.highlights,
      features: backendDestination.features?.length ? backendDestination.features : defaultContent.features,
      bestTime: backendDestination.meta?.bestTime || defaultContent.bestTime,
      idealFor: backendDestination.meta?.idealFor || defaultContent.idealFor,
    }
    : defaultContent;
  const historyParagraphs = String(content?.history || "")
    .split("\n\n")
    .map((item) => item.trim())
    .filter(Boolean);

  const heroImage =
    backendDestination?.image ||
    backendDestination?.coverImage ||
    matchedTours[0]?.image ||
    "https://gilgitbaltistan.gov.pk/public/images/river-5688258_1920.jpg";

  return (
    <section className="bg-theme-bg py-10 md:py-12 min-h-[60vh]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 space-y-6">
        <div className="rounded-2xl overflow-hidden border border-theme bg-theme-surface">
          <div className="relative h-[220px] sm:h-[280px] lg:h-[320px]">
            <img src={heroImage} alt={destinationName} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
            <div className="absolute inset-0 p-5 sm:p-7 lg:p-9 flex flex-col justify-end">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--c-brand)]">
                Destination Overview
              </p>
              <h1 className="mt-2 text-2xl sm:text-4xl font-bold text-white tracking-tight capitalize">
                {destinationName}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-white/85 max-w-2xl">
                Explore curated trips, practical itineraries, and verified travel experiences in{" "}
                {destinationName}.
              </p>
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-theme bg-theme-surface p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-theme">Detailed Overview</h2>
          <p className="mt-3 text-sm md:text-base text-muted leading-relaxed">
            {content?.overview ||
              `${destinationName} is a premium northern destination known for scenic routes, comfortable stays, and practical trip planning support.`}
          </p>
          <h3 className="mt-5 text-sm font-black uppercase tracking-[0.14em] text-theme">History & Background</h3>
          <div className="mt-2 space-y-3">
            {historyParagraphs.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 40)}-${index}`} className="text-sm md:text-base text-muted leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <section className="rounded-2xl border border-theme bg-[#eef9f5] dark:bg-theme-surface p-4 md:p-5 transition-all duration-200 hover:border-[var(--c-brand)]/35 hover:shadow-[0_8px_20px_rgba(2,132,199,0.08)]">
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-theme">Top Highlights</h3>
            <ul className="mt-3 space-y-2">
              {(content?.highlights || ["Scenic viewpoints", "Historic locations", "Nature-driven routes", "Local culture"]).map((item) => (
                <li key={item} className="text-sm text-muted">- {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-theme bg-[#eef5fb] dark:bg-theme-surface p-4 md:p-5 transition-all duration-200 hover:border-[var(--c-brand)]/35 hover:shadow-[0_8px_20px_rgba(2,132,199,0.08)]">
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-theme">Destination Features</h3>
            <ul className="mt-3 space-y-2">
              {(content?.features || ["Flexible itineraries", "Verified support", "Comfort planning", "Transparent pricing"]).map((item) => (
                <li key={item} className="text-sm text-muted">- {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-theme bg-[#eef5fb] dark:bg-theme-surface p-4 md:p-5 transition-all duration-200 hover:border-[var(--c-brand)]/35 hover:shadow-[0_8px_20px_rgba(2,132,199,0.08)]">
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-theme">Travel Notes</h3>
            <div className="mt-3 space-y-2.5">
              <p className="text-sm text-muted">
                <span className="font-semibold text-theme">Best Time:</span> {content?.bestTime || "May to October"}
              </p>
              <p className="text-sm text-muted">
                <span className="font-semibold text-theme">Ideal For:</span> {content?.idealFor || "Scenic and comfort-focused travel groups"}
              </p>
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-theme bg-theme-surface p-4 md:p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg md:text-xl font-bold text-theme">Available Tours</h2>
            <Link
              to="/tours"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-theme hover:text-[var(--c-brand)]"
            >
              Browse all tours
              <MoveUpRight size={13} />
            </Link>
          </div>

          {matchedTours.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {matchedTours.map((tour) => (
                <article
                  key={tour.id}
                  className="rounded-xl border border-theme bg-theme-bg overflow-hidden"
                >
                  <div className="flex">
                    {tour.image ? (
                      <img src={tour.image} alt={tour.title} className="w-28 h-24 object-cover shrink-0" />
                    ) : null}
                    <div className="p-3 space-y-1.5 min-w-0">
                    <h3 className="text-sm font-bold text-theme line-clamp-1">{tour.title}</h3>
                    <p className="text-sm text-muted line-clamp-2">
                      {tour.shortDescription || "Premium trip plan with local coordination and verified stays."}
                    </p>
                    <Link
                      to={`/tours/${tour.slug}`}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-theme hover:text-[var(--c-brand)]"
                    >
                      View Tour
                      <ChevronRight size={13} />
                    </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-theme bg-theme-bg py-12 px-6 text-center text-muted">
              No tours found for this destination.
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default DestinationDetails;
