export const fallbackFaq = [
  { q: "Can this tour be customized?", a: "Yes. You can share your preferred route, comfort level, and pace during booking." },
  { q: "Is transport included in this package?", a: "Transport is included according to selected plan and confirmed itinerary." },
  { q: "How much advance payment is required?", a: "Advance requirements are shared during booking confirmation according to active policy." },
  { q: "What is the cancellation policy?", a: "Cancellation terms depend on booking date and vendor windows. Final policy is shared in confirmation." },
];

export const fallbackReviews = [
  { id: 1, name: "Ayesha Khan", rating: 5, date: "Jan 2026", tag: "Family Trip", comment: "Very smooth coordination, reliable stays, and great route planning." },
  { id: 2, name: "Omar Ahmed", rating: 4, date: "Dec 2025", tag: "Friends Group", comment: "Clean itinerary and good support. Overall experience was excellent." },
  { id: 3, name: "Nida Fatima", rating: 5, date: "Nov 2025", tag: "Couple Tour", comment: "Loved the balance of comfort and exploration. Team stayed responsive." },
];

export const normalizePlaceName = (location = "") =>
  String(location)
    .replace(/\b(valley|lake|lakes|district|region|plateau|meadows)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim() || "Northern Pakistan";

export const getTourPlaceName = (tour) => normalizePlaceName(tour?.location);

export const getTourPlanCount = (tour) => Number(tour?.capacity || tour?.availableSeats || 0);

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

export const buildDisplayItinerary = (tour) => {
  const duration = Math.max(Number(tour?.durationDays || 0), 1);
  const source = Array.isArray(tour?.itinerary) ? tour.itinerary.filter(Boolean) : [];

  if (source.length) {
    return source.slice(0, duration).map((item, index) => {
      const description = String(item?.description || "").trim();
      const places = description ? description.split(/,| and /i).map((entry) => entry.trim()).filter(Boolean).slice(0, 4) : inferItineraryPlaces(tour, index);
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
  const services = [
    "Private transport across the route",
    "Hotel stays for the full tour duration",
    "Driver allowance, tolls, and fuel",
    "On-trip coordination and support",
  ];
  if (tour?.availableOptions?.vehicleTypes?.length) services.push(`Vehicle options: ${tour.availableOptions.vehicleTypes.join(", ")}`);
  if (tour?.availableOptions?.hotelCategories?.length) services.push(`Hotel categories: ${tour.availableOptions.hotelCategories.join(", ")}`);
  return services;
};

export const buildVehicleDetails = (tour) => {
  const configuredVehicles = Array.isArray(tour?.availableOptions?.vehicleTypes)
    ? tour.availableOptions.vehicleTypes.filter(Boolean)
    : [];

  if (configuredVehicles.length) {
    return configuredVehicles;
  }

  const seats = Number(tour?.capacity || tour?.availableSeats || 0);
  if (seats >= 12) return ["Coaster / Saloon", "SUV support vehicle"];
  if (seats >= 6) return ["SUV / Prado", "Hiace / Grand Cabin"];
  if (seats >= 2) return ["Sedan / Corolla", "SUV upgrade on request"];
  return ["Transport arranged as per group size"];
};

export const buildPlacesCovered = (tour, itinerary) => {
  const places = new Set();
  itinerary.forEach((item) => item.placesCovered.forEach((place) => places.add(place)));
  if (tour?.location) places.add(normalizePlaceName(tour.location));
  if (Array.isArray(tour?.tags)) tour.tags.filter(Boolean).slice(0, 3).forEach((tag) => places.add(tag));
  return Array.from(places).slice(0, 8);
};

export const getTourPlacesLabel = (tour, itinerary) => {
  const places = buildPlacesCovered(tour, itinerary || buildDisplayItinerary(tour));
  return places.length ? `${places.length} places` : "Planned route";
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
