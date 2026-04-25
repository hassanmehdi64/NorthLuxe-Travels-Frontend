export const fallbackFaq = [
  { q: "Can this tour be customized?", a: "Yes. You can share your preferred route, comfort level, and pace during booking." },
  { q: "Is transport included in this package?", a: "Transport is included according to selected plan and confirmed itinerary." },
  { q: "How much advance payment is required?", a: "Advance requirements are shared during booking confirmation according to active policy." },
  { q: "What is the cancellation policy?", a: "Cancellation terms depend on booking date and vendor windows. Final policy is shared in confirmation." },
];

export const fallbackReviews = [];

export const normalizePlaceName = (location = "") =>
  String(location)
    .replace(/\b(valley|lake|lakes|district|region|plateau|meadows)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim() || "Northern Pakistan";

export const getTourPlaceName = (tour) => normalizePlaceName(tour?.location);

export const getTourPlanCount = (tour) => Number(tour?.availableSeats ?? tour?.capacity ?? 0);

export const getTourPlanLabel = (tour) => {
  const persons = getTourPlanCount(tour);
  return persons ? `${persons} ${persons === 1 ? "person" : "persons"} plan` : "Custom plan";
};

export const getTourMood = (tour) => {
  const searchText = [tour?.title, ...(Array.isArray(tour?.tags) ? tour.tags : [])].filter(Boolean).join(" ").toLowerCase();
  if (searchText.includes("summer")) return "Summer Tour";
  if (searchText.includes("winter")) return "Winter Tour";
  if (searchText.includes("spring")) return "Spring Tour";
  if (searchText.includes("autumn") || searchText.includes("fall")) return "Autumn Tour";
  if (searchText.includes("family")) return "Family Tour";
  if (searchText.includes("group")) return "Group Tour";
  if (searchText.includes("premium") || searchText.includes("luxury")) return "Premium Tour";
  if (searchText.includes("heritage") || searchText.includes("culture")) return "Heritage Tour";
  return "Scenic Tour";
};

const itineraryPlaceMap = {
  hunza: [["Islamabad", "Naran or Chilas"], ["Hunza arrival", "Karimabad bazaar"], ["Baltit Fort", "Altit Village"], ["Attabad Lake", "Passu Cones"], ["Duikar viewpoint", "Local markets"]],
  skardu: [["Skardu city arrival", "Shigar road"], ["Shangrila", "Upper Kachura"], ["Shigar Fort", "Blind Lake"], ["Katpana Desert", "Skardu bazaar"], ["Organic village stops", "Departure route"]],
  nagar: [["Nagar arrival", "Village terraces"], ["Hopar Glacier", "Viewpoint stops"], ["Rakaposhi-facing routes", "Local settlements"], ["Hunza crossover", "Karimabad"]],
  astore: [["Astore arrival", "Valley villages"], ["Rama Meadows", "Rama Lake"], ["Deosai approach", "Scenic stops"], ["Return valley route", "Departure transfer"]],
  fairy: [["Raikot bridge", "Tattu village"], ["Fairy Meadows camp", "View deck"], ["Beyal trail", "Forest track"], ["Camp sunrise", "Return transfer"]],
  khaplu: [["Khaplu arrival", "Old village lanes"], ["Khaplu Palace", "River viewpoints"], ["Chaqchan heritage surroundings", "Orchard walks"], ["Scenic drive", "Departure route"]],
  shigar: [["Shigar arrival", "Valley viewpoints"], ["Shigar Fort", "Traditional settlements"], ["River edge stops", "Boutique stay experience"], ["Return route", "Skardu transfer"]],
  deosai: [["Skardu or Astore arrival", "Route briefing"], ["Deosai plains", "Wildlife observation"], ["Sheosar Lake", "Photography points"], ["Plateau exit", "Return transfer"]],
};

const inferItineraryPlaces = (tour, dayIndex) => {
  const searchKey = [tour?.location, tour?.title].filter(Boolean).join(" ").toLowerCase();
  const matchedKey = Object.keys(itineraryPlaceMap).find((key) => searchKey.includes(key));
  const places = matchedKey ? itineraryPlaceMap[matchedKey][dayIndex] : null;
  if (places?.length) return places;
  if (dayIndex === 0) return [normalizePlaceName(tour?.location), "Arrival and local check-in"];
  if (dayIndex === 1) return ["Main sightseeing route", "Signature viewpoints"];
  if (dayIndex === 2) return ["Local exploration", "Cultural stop"];
  return ["Scenic transfer", "Departure route"];
};

const STOP_WORD_PATTERNS = [
  /^(pick from|pickup from|pick up from|travel to|continue to|drive to|visit|stop at|stopover at|arrival at|arrive at|depart for|departure for|head to|move to)\s+/i,
  /^(for|with|and)\s+/i,
];

const cleanAttractionLabel = (value = "") => {
  let cleaned = String(value || "")
    .replace(/[.]+$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  STOP_WORD_PATTERNS.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, "").trim();
  });

  cleaned = cleaned
    .replace(/\bfor check-?in\b/gi, "")
    .replace(/\bfor sunset\b/gi, "")
    .replace(/\bfor sightseeing\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (!cleaned) return "";
  if (cleaned.length < 3) return "";
  if (/^(arrival|departure|travel|pickup|pick|continue|drive|visit|stop)$/i.test(cleaned)) return "";

  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const extractAttractionPlaces = (description = "", fallback = []) => {
  const parsed = String(description || "")
    .split(/,| and /i)
    .map((entry) => cleanAttractionLabel(entry))
    .filter(Boolean);

  return parsed.length ? Array.from(new Set(parsed)).slice(0, 4) : fallback;
};

export const buildDisplayItinerary = (tour) => {
  const duration = Math.max(Number(tour?.durationDays || 0), 1);
  const source = Array.isArray(tour?.itinerary) ? tour.itinerary.filter(Boolean) : [];

  if (source.length) {
    return source.slice(0, duration).map((item, index) => {
      const description = String(item?.description || "").trim();
      const places = extractAttractionPlaces(description, inferItineraryPlaces(tour, index));
      return {
        day: item?.day || index + 1,
        title: item?.title || `Day ${index + 1} Route`,
        placesCovered: places.length ? places : inferItineraryPlaces(tour, index),
        bulletPoints: [
          `Places covered: ${(places.length ? places : inferItineraryPlaces(tour, index)).join(", ")}`,
          description || "Detailed route timing is shared before departure.",
        ],
      };
    });
  }

  return Array.from({ length: duration }, (_, index) => {
    const placesCovered = inferItineraryPlaces(tour, index);
    return {
      day: index + 1,
      title: `Day ${index + 1} Route`,
      placesCovered,
      bulletPoints: [
        `Places covered: ${placesCovered.join(", ")}`,
        `Travel flow includes ${placesCovered[0]} and ${placesCovered[1] || "planned sightseeing stops"}.`,
      ],
    };
  });
};

export const buildIncludedServices = (tour) => {
  const services = [];
  const durationDays = Number(tour?.durationDays || 0);
  const placeName = normalizePlaceName(tour?.location);
  const hotelCategories = Array.isArray(tour?.availableOptions?.hotelCategories)
    ? tour.availableOptions.hotelCategories.filter(Boolean)
    : [];
  const vehicleTypes = Array.isArray(tour?.availableOptions?.vehicleTypes)
    ? tour.availableOptions.vehicleTypes.filter(Boolean)
    : [];
  const displayItinerary = buildDisplayItinerary(tour);
  const itineraryTitles = displayItinerary
    .map((item) => String(item?.title || "").trim())
    .filter(Boolean)
    .slice(0, 2);

  if (durationDays > 0) {
    services.push(`${durationDays}-day route planning and on-trip coordination`);
  }

  if (vehicleTypes.length) {
    services.push(`Transport options for this tour: ${vehicleTypes.join(", ")}`);
  } else {
    services.push("Transport arranged according to route and group size");
  }

  if (hotelCategories.length) {
    services.push(`Stay categories available: ${hotelCategories.join(", ")}`);
  } else {
    services.push("Accommodation can be arranged on request");
  }

  services.push(`Driver allowance, fuel, and toll management for ${placeName}`);

  if (itineraryTitles.length) {
    services.push(`Structured sightseeing flow including ${itineraryTitles.join(" and ")}`);
  } else {
    services.push(`Sightseeing coordination across ${placeName}`);
  }

  return services;
};

export const buildVehicleDetails = (tour) => {
  const configuredVehicles = Array.isArray(tour?.availableOptions?.vehicleTypes)
    ? tour.availableOptions.vehicleTypes.filter(Boolean)
    : [];

  if (configuredVehicles.length) {
    return configuredVehicles;
  }

  const seats = Number(tour?.availableSeats ?? tour?.capacity ?? 0);
  if (seats >= 12) return ["Coaster / Saloon", "SUV support vehicle"];
  if (seats >= 6) return ["SUV / Prado", "Hiace / Grand Cabin"];
  if (seats >= 2) return ["Sedan / Corolla", "SUV upgrade on request"];
  return ["Transport arranged as per group size"];
};

export const buildPlacesCovered = (tour, itinerary) => {
  const places = new Set();
  itinerary.forEach((item) =>
    item.placesCovered
      .map((place) => cleanAttractionLabel(place))
      .filter(Boolean)
      .forEach((place) => places.add(place)),
  );
  if (tour?.location) places.add(normalizePlaceName(tour.location));
  if (Array.isArray(tour?.tags)) tour.tags.filter(Boolean).slice(0, 3).forEach((tag) => places.add(tag));
  return Array.from(places).slice(0, 8);
};

export const getTourPlacesLabel = (tour, itinerary) => {
  const places = buildPlacesCovered(tour, itinerary || buildDisplayItinerary(tour));
  return places.length ? `${places.length} places` : "Planned route";
};


const heroGalleryFallbacks = {
  fairy: [
    "https://images.squarespace-cdn.com/content/v1/5a815ad2e45a7c1f4ef40fb8/1533222115427-RM0925EGPCZMCCN8T01S/fairy-meadows-1920.jpg",
    "https://cdn.tripspoint.com/uploads/photos/8183/10-days-fairy-meadows-hunza-valley-pakistan_uJZ6j.jpeg",
    "https://tripako.com/wp-content/uploads/2020/12/Fairy-1-1-scaled.jpg",
  ],
  hunza: [
    "https://luxushunza.com/wp-content/uploads/Gojal_Restaurant-1.webp",
    "https://realpakistan.com.pk/wp-content/uploads/2025/06/hunza-sarena.jpg",
    "https://luxushunza.com/wp-content/uploads/slider/cache/da7922896e4ca1abc15bafab13c8151f/DSC_9668-HDR-1-scaled.jpg",
  ],
  skardu: [
    "https://visitgilgitbaltistan.gov.pk/storage/images/egawjw4TjQ4b8yD9iUHzkLxFwwxyce-metaQ2h1bmRhLXZhbGxleS0xMDI0eDY4My5qcGc%3D-.jpg",
    "https://visitgilgitbaltistan.gov.pk/storage/images/gTH9WHnKkooBD4lDCkJglPVSGG59Qm-metaQmFzaG8gVmFsbGV5IDIuSlBH-.jpg",
    "https://visitgilgitbaltistan.gov.pk/storage/images/EgzRNEiwXoQdYYriBJZ4pfaOqAZtEE-metaU2hhbmdyaWxhLF9Mb3dlcl9LYWNodXJhX0xha2UuanBn-.jpg",
    "https://visitgilgitbaltistan.gov.pk/storage/images/VYOw4S1I2iCdU3YoaagAMTAAGsKj97-metaU0FEUEFSQSBsYWtlIFNrYXJkdSwgUGFraXN0YW4gLSBDb3B5LmpwZw%3D%3D-.jpg",
  ],
  nagar: [
    "https://visitgilgitbaltistan.gov.pk/storage/images/amF3lOQaNWavgTlumgn9lgeW8FdoL1-metacmFrYXBvc2hpX3ZpZXdfcG9pbnRfcGFraXN0YW4uanBn-.jpg",
    "https://visitgilgitbaltistan.gov.pk/storage/images/UrfxjQ5cNIyBVoWo1q1WwTkegmiM8T-metaSGlzcGFyIEdsY2FjaWVyLkpQRw%3D%3D-.jpg",
    "https://visitgilgitbaltistan.gov.pk/storage/images/iAl0RLMGh7yzaKXYZLglObq4QzY09V-metaUnVzaCBMYWtlIDMuanBn-.jpg",
    "https://visitgilgitbaltistan.gov.pk/storage/images/XZna35rr13FxPXMijjw4yzlY09Nitq-metaa2FjaGVsaSBsYWtlLmpwZw%3D%3D-.jpg",
  ],
  deosai: [
    "https://clickpakistan.org/wp-content/uploads/2023/11/Best-Things-to-do-in-Skardu.jpg",
    "https://realpakistan.com.pk/wp-content/uploads/2025/04/shangrila-resort.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Shangrila_resort_skardu.jpg/1024px-Shangrila_resort_skardu.jpg",
  ],
};

export const getTourHeroImages = (tour) => {
  const configured = [tour?.image, ...(Array.isArray(tour?.gallery) ? tour.gallery : [])].filter(Boolean);
  if (configured.length > 1) return [...new Set(configured)];

  const searchKey = [tour?.location, tour?.title, ...(Array.isArray(tour?.tags) ? tour.tags : [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const matchedKey = Object.keys(heroGalleryFallbacks).find((key) => searchKey.includes(key));
  const fallback = matchedKey ? heroGalleryFallbacks[matchedKey] : [];
  return [...new Set([...configured, ...fallback])];
};
export const buildPackageOverview = (tour) => [
  { label: "Package Type", value: `${getTourMood(tour)} in ${normalizePlaceName(tour?.location)}` },
  { label: "Ideal Group", value: getTourPlanLabel(tour) },
  { label: "Travel Duration", value: tour?.durationLabel || `${tour?.durationDays || 0} Days` },
  { label: "Route Coverage", value: getTourPlacesLabel(tour) },
];

export const buildDetailedDescription = (tour) =>
  tour.description ||
  `${tour.title} takes you through ${tour.location || "Northern Pakistan"} with a structured day-by-day plan focused on scenic exploration, practical travel timing, and reliable support. The route is arranged to reduce fatigue, keep comfort consistent, and give meaningful stops for landscapes, culture, and local experiences. This package works well for travelers who want a clean balance of sightseeing, convenience, and predictable logistics throughout ${tour.durationLabel || `${tour.durationDays || 0} days`}.`;

const DEFAULT_TRANSPORT_NOTE =
  "Prices are for transport only. Hotels, meals, boating, entry tickets, jeep charges, and personal expenses are not included.";

export const buildCommonTourFacts = (settings) => {
  const bookingPricing = settings?.bookingPricing || {};
  const transportNote = String(bookingPricing.transportNote || "").trim() || DEFAULT_TRANSPORT_NOTE;
  const vehicleStartingPrices = Array.isArray(bookingPricing.vehicleTypes)
    ? bookingPricing.vehicleTypes
        .filter((item) => item?.active !== false && String(item?.label || item?.key || "").trim())
        .map((item) => ({
          label: String(item.label || item.key).trim(),
          dailyRate: Number(item.dailyRate || 0),
        }))
    : [];

  return {
    transportNote,
    vehicleStartingPrices,
  };
};

export const buildTourReviews = (tour) =>
  Array.isArray(tour?.reviewItems)
    ? tour.reviewItems
        .map((item, index) => ({
          id: `${tour?.id || tour?.slug || "tour"}-review-${index + 1}`,
          name: item?.name || "Guest",
          rating: Math.max(1, Math.min(5, Number(item?.rating || 5))),
          date: item?.date || "",
          tag: item?.tag || "Guest Review",
          comment: item?.comment || "",
        }))
        .filter((item) => item.name || item.comment)
    : [];
