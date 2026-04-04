const normalizeSpaces = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value == null || value === "") return [];
  return [value];
};

const ignoredQueryTokens = new Set(["valley", "city", "lake", "national", "park", "pass", "resort"]);

const tokenizeQuery = (value) =>
  normalizeSpaces(value)
    .split(" ")
    .filter((token) => token && !ignoredQueryTokens.has(token));

const monthNames = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const monthShortNames = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const getSeasonForMonth = (monthIndex) => {
  if ([11, 0, 1].includes(monthIndex)) return "winter";
  if ([2, 3, 4].includes(monthIndex)) return "spring";
  if ([5, 6, 7].includes(monthIndex)) return "summer";
  return "autumn";
};

export const normalizeSearchValue = (value) => normalizeSpaces(value);

export const getTourSearchText = (tour) => {
  const itineraryValues = Array.isArray(tour?.itinerary)
    ? tour.itinerary.flatMap((item) => [item?.title, item?.location, item?.place, item?.description])
    : [];

  const values = [
    tour?.title,
    tour?.location,
    tour?.shortDescription,
    tour?.description,
    tour?.category,
    tour?.travelStyle,
    tour?.bestSeason,
    tour?.season,
    tour?.durationLabel,
    tour?.durationDays ? `${tour.durationDays} days` : "",
    ...toList(tour?.tags),
    ...toList(tour?.themes),
    ...toList(tour?.highlights),
    ...toList(tour?.idealFor),
    ...itineraryValues,
  ];

  return normalizeSpaces(values.filter(Boolean).join(" "));
};

export const getDateSearchMeta = (rawDate) => {
  if (!rawDate) return { label: "", terms: [], season: "" };

  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) {
    return { label: String(rawDate), terms: [], season: "" };
  }

  const monthIndex = parsed.getMonth();
  const season = getSeasonForMonth(monthIndex);

  return {
    label: parsed.toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    season,
    terms: [monthNames[monthIndex], monthShortNames[monthIndex], season].filter(Boolean),
  };
};

const getTokenScore = (token, location, title) => {
  if (location.includes(token)) return 16;
  if (title.includes(token)) return 12;
  return 6;
};

export const getTourSearchScore = (tour, query = "", travelDate = "") => {
  const combined = getTourSearchText(tour);
  const location = normalizeSpaces(tour?.location);
  const title = normalizeSpaces(tour?.title);
  const normalizedQuery = normalizeSpaces(query);
  const queryTokens = tokenizeQuery(query);

  if (queryTokens.length && queryTokens.some((token) => !combined.includes(token))) {
    return { matchesQuery: false, matchesDate: false, score: 0 };
  }

  let score = 0;
  if (normalizedQuery) {
    if (location === normalizedQuery) score += 160;
    if (title === normalizedQuery) score += 140;
    if (location.startsWith(normalizedQuery)) score += 100;
    if (title.startsWith(normalizedQuery)) score += 90;
    if (location.includes(normalizedQuery)) score += 70;
    if (title.includes(normalizedQuery)) score += 60;
    if (combined.includes(normalizedQuery)) score += 30;
    queryTokens.forEach((token) => {
      score += getTokenScore(token, location, title);
    });
  }

  const dateMeta = getDateSearchMeta(travelDate);
  const matchesDate = !dateMeta.terms.length || dateMeta.terms.some((term) => combined.includes(term));
  if (matchesDate && dateMeta.terms.length) score += 24;

  return {
    matchesQuery: true,
    matchesDate,
    score,
  };
};

export const buildPlaceSuggestions = ({ tours = [], destinationItems = [], fallbackPlaces = [] }) => {
  const places = new Map();

  const addPlace = (rawLabel, source = "destination") => {
    const label = String(rawLabel || "").trim();
    const key = normalizeSpaces(label);
    if (!key) return;

    if (!places.has(key)) {
      places.set(key, {
        value: label,
        label,
        source,
        tourCount: 0,
      });
    }

    if (source === "tour") {
      places.get(key).tourCount += 1;
    }
  };

  tours.forEach((tour) => {
    addPlace(tour?.location, "tour");
  });

  destinationItems.forEach((item) => {
    addPlace(item?.title, "destination");
  });

  fallbackPlaces.forEach((place) => {
    addPlace(place, "destination");
  });

  return [...places.values()]
    .sort((a, b) => {
      if (b.tourCount !== a.tourCount) return b.tourCount - a.tourCount;
      return a.label.localeCompare(b.label);
    })
    .map((item) => ({
      ...item,
      subtitle: item.tourCount
        ? `${item.tourCount} ${item.tourCount === 1 ? "tour" : "tours"} available`
        : "Popular destination",
    }));
};

export const filterPlaceSuggestions = (suggestions = [], query = "", limit = 7) => {
  const normalizedQuery = normalizeSpaces(query);
  if (!normalizedQuery) return suggestions.slice(0, limit);

  const tokens = tokenizeQuery(query);

  return suggestions
    .filter((item) => {
      const haystack = normalizeSpaces(`${item.label} ${item.subtitle}`);
      return tokens.every((token) => haystack.includes(token));
    })
    .sort((a, b) => {
      const aLabel = normalizeSpaces(a.label);
      const bLabel = normalizeSpaces(b.label);
      const aStarts = aLabel.startsWith(normalizedQuery) ? 1 : 0;
      const bStarts = bLabel.startsWith(normalizedQuery) ? 1 : 0;
      if (bStarts !== aStarts) return bStarts - aStarts;
      if ((b.tourCount || 0) !== (a.tourCount || 0)) return (b.tourCount || 0) - (a.tourCount || 0);
      return a.label.localeCompare(b.label);
    })
    .slice(0, limit);
};

