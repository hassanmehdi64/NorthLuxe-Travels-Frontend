export const getSeasonSearchText = (tour) =>
  [
    tour?.title,
    tour?.location,
    tour?.shortDescription,
    ...(Array.isArray(tour?.tags) ? tour.tags : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const getSeasonPackages = (tours = []) =>
  seasonConfigs.map((season) => {
    const packages = tours
      .filter(Boolean)
      .filter((tour) =>
        season.terms.some((term) => getSeasonSearchText(tour).includes(term)),
      )
      .slice(0, 2);

    return {
      ...season,
      packages,
      image: season.fallbackImage,
    };
  });

const parseList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const toDynamicSeason = (item, tours = []) => {
  const terms = parseList(item?.meta?.terms).length
    ? parseList(item?.meta?.terms)
    : [item?.slug, item?.title].filter(Boolean).map((entry) => String(entry).toLowerCase());

  const packages = tours.filter((tour) =>
    terms.some((term) => getSeasonSearchText(tour).includes(String(term).toLowerCase())),
  );

  return {
    id: item.id || item.slug,
    slug: item.slug,
    label: item.title,
    title: item.title,
    subtitle: item.shortDescription || item.highlight || "",
    highlight: item.highlight || "",
    description: item.description || item.shortDescription || "",
    terms,
    fallbackImage: item.image || item.coverImage || "",
    image: item.image || item.coverImage || "",
    activities: item.includes || [],
    services: item.deliverables || [],
    bestTime: item.meta?.bestTime || "",
    destinations: parseList(item.meta?.destinations),
    weather: item.meta?.weather || "",
    idealFor: item.meta?.idealFor || "",
    seasonExperience: item.content || item.description || "",
    whyGo: item.highlights || [],
    notes: item.features || [],
    packages,
    overview:
      item.description ||
      `${item.title} journeys are planned around the strongest weather window, practical route flow, and the best seasonal stops across Gilgit-Baltistan.`,
  };
};

export const getDynamicSeasonPackages = (items = [], tours = []) =>
  items
    .filter((item) => item?.status !== "draft")
    .sort((a, b) => Number(a?.sortOrder || 0) - Number(b?.sortOrder || 0))
    .map((item) => toDynamicSeason(item, tours));
