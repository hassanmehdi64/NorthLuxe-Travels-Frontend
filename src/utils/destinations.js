export const toDestinationSlug = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export const normalizeDestinationKey = (value = "") =>
  toDestinationSlug(value).replace(/-(valley|district|region|plateau)$/g, "");

export const mapContentDestination = (item) => ({
  id: item?.id || item?.slug,
  title: item?.title || "Destination",
  image: item?.image || item?.coverImage || "",
  description: item?.shortDescription || item?.description || "",
  href: `/destinations/${item?.slug}`,
  slug: item?.slug,
  sortOrder: item?.sortOrder || 0,
});

export const buildTourDestinationFallback = (tours = []) => {
  const byLocation = new Map();

  tours.forEach((tour) => {
    const location = String(tour?.location || "").trim();
    if (!location) return;

    const key = normalizeDestinationKey(location);
    if (byLocation.has(key)) return;

    byLocation.set(key, {
      id: tour?.id || key,
      title: location,
      image: tour?.image || "",
      description: tour?.shortDescription || tour?.title || "",
      href: `/destinations/${toDestinationSlug(location)}`,
      slug: toDestinationSlug(location),
      sortOrder: 999,
    });
  });

  return Array.from(byLocation.values());
};

export const resolveDestinationMatch = (items = [], rawSlug = "") => {
  const normalizedSlug = String(rawSlug || "").trim().toLowerCase();
  const normalizedKey = normalizeDestinationKey(normalizedSlug);

  return (
    items.find((item) => item?.slug === normalizedSlug) ||
    items.find((item) => normalizeDestinationKey(item?.slug || item?.title) === normalizedKey) ||
    null
  );
};
