export const seasonConfigs = [
  {
    id: "spring",
    slug: "spring",
    label: "Spring",
    title: "Spring Blossom",
    subtitle: "Blossom routes and fresh valleys.",
    highlight: "Bloom season in the north.",
    description:
      "Spring in Gilgit-Baltistan is known for blossom-covered orchards, fresh air, and scenic valley movement across Hunza, Nagar, and nearby routes. It is ideal for travelers who want color, culture, and comfortable daytime exploration before the summer rush begins.",
    terms: ["spring", "blossom", "flower", "april", "march", "may"],
    fallbackImage:
      "https://images.pexels.com/photos/8062469/pexels-photo-8062469.jpeg?cs=srgb&dl=pexels-amjadali-8062469.jpg&fm=jpg",
    activities: ["Blossom walks", "Village visits", "Photography stops", "Scenic day tours"],
    services: ["Private transport", "Hotel stays", "Guided route planning", "On-trip support"],
    bestTime: "March to May",
    destinations: ["Hunza", "Nagar", "Skardu"],
    weather: "Mild days, fresh mornings, and blooming valley weather.",
    idealFor: "Families, couples, and photographers.",
    seasonExperience:
      "Spring journeys are usually lighter in pace, with flexible daytime sightseeing, blossom-view stops, village walks, and scenic drives through orchard regions. The season works well for travelers who want color, culture, and easy exploration without the intensity of peak summer movement.",
    whyGo: [
      "See orchards and valley terraces in bloom",
      "Enjoy softer weather for day sightseeing",
      "Travel before peak summer rush",
    ],
    notes: [
      "Blossom timing can shift by region and altitude",
      "Hunza and Nagar usually peak later than lower valleys",
    ],
  },
  {
    id: "summer",
    slug: "summer",
    label: "Summer",
    title: "Summer Escape",
    subtitle: "Lakes, meadows, and cool air.",
    highlight: "Peak season mountain escapes.",
    description:
      "Summer opens up the classic high-altitude routes of Gilgit-Baltistan, making it the strongest season for lakes, meadows, panoramic drives, and long sightseeing days. It suits families, groups, and travelers who want access to the widest range of destinations.",
    terms: ["summer", "june", "july", "august"],
    fallbackImage:
      "https://images.pexels.com/photos/6182219/pexels-photo-6182219.jpeg?cs=srgb&dl=pexels-ashiq-ali-11436188-6182219.jpg&fm=jpg",
    activities: ["Lake visits", "Meadow excursions", "Road trips", "Family sightseeing"],
    services: ["Transport with fuel", "Comfort stays", "Breakfast", "Driver allowance"],
    bestTime: "June to August",
    destinations: ["Skardu", "Astore", "Hunza", "Deosai"],
    weather: "Cool mountain air with the best high-altitude access window.",
    idealFor: "Families, group tours, and first-time north travelers.",
    seasonExperience:
      "Summer allows the widest route coverage in Gilgit-Baltistan, so itineraries often include longer day plans, major lakes and meadow stops, and full-access road journeys. It is the best fit for travelers who want maximum sightseeing, stronger destination variety, and complete northern circuit planning.",
    whyGo: [
      "Most meadows, lakes, and passes are accessible",
      "Long daylight hours support bigger day plans",
      "Best season for scenic road journeys",
    ],
    notes: [
      "This is the busiest season, so routes should be planned early",
      "Popular regions may need advance hotel confirmation",
    ],
  },
  {
    id: "autumn",
    slug: "autumn",
    label: "Autumn",
    title: "Autumn Color",
    subtitle: "Golden valleys and heritage routes.",
    highlight: "Crisp air and fall colors.",
    description:
      "Autumn brings clear skies, golden foliage, and quieter roads across the northern valleys. This season is especially attractive for heritage-focused travel, scenic photography, and travelers who prefer a calmer rhythm after peak summer.",
    terms: ["autumn", "fall", "october", "november", "heritage"],
    fallbackImage:
      "https://images.pexels.com/photos/15817299/pexels-photo-15817299.jpeg?cs=srgb&dl=pexels-wasifmehmood997-15817299.jpg&fm=jpg",
    activities: ["Autumn sightseeing", "Heritage visits", "Photo walks", "Valley drives"],
    services: ["Route transport", "Hotel accommodation", "Flexible pacing", "Tour coordination"],
    bestTime: "October to November",
    destinations: ["Hunza", "Nagar", "Khaplu", "Shigar"],
    weather: "Cool, crisp conditions with clear skies and fall color.",
    idealFor: "Photographers, couples, and scenic road-trip travelers.",
    seasonExperience:
      "Autumn travel focuses on scenic drives, heritage-rich valleys, and photography-friendly viewpoints under clearer skies. The rhythm is calmer than summer, making it ideal for travelers who prefer quieter roads, slower exploration, and stronger visual landscapes.",
    whyGo: [
      "Golden trees transform the valleys",
      "Heritage routes feel calmer after summer",
      "Clear air improves long-range mountain views",
    ],
    notes: [
      "Late autumn nights can become quite cold",
      "Some higher seasonal services start reducing by November",
    ],
  },
  {
    id: "winter",
    slug: "winter",
    label: "Winter",
    title: "Winter Snow",
    subtitle: "Snow views and cozy stays.",
    highlight: "Cold season scenic breaks.",
    description:
      "Winter travel in Gilgit-Baltistan focuses on snow scenery, peaceful routes, and warm stays with a slower pace. It works best for travelers who want a scenic seasonal escape with flexible planning around weather and road conditions.",
    terms: ["winter", "snow", "december", "january", "february"],
    fallbackImage:
      "https://images.pexels.com/photos/29443418/pexels-photo-29443418.jpeg?cs=srgb&dl=pexels-asif-khan-779684638-29443418.jpg&fm=jpg",
    activities: ["Snow viewing", "Short scenic drives", "Winter photography", "Relaxed stays"],
    services: ["Heated stay options", "Private transport", "Flexible route planning", "Support assistance"],
    bestTime: "December to February",
    destinations: ["Skardu", "Hunza", "Nagar"],
    weather: "Cold mountain weather with snow views and shorter daylight.",
    idealFor: "Snow lovers, couples, and slower comfort-focused travel.",
    seasonExperience:
      "Winter travel is more selective and comfort-led, usually built around short scenic outings, warm stays, and flexible planning based on weather conditions. It suits travelers who want snow scenery, peaceful routes, and a more relaxed mountain experience rather than long-distance daily touring.",
    whyGo: [
      "Experience the north in a quieter season",
      "Enjoy snow scenery with relaxed pacing",
      "Perfect for cozy stays and short scenic outings",
    ],
    notes: [
      "Routes depend on snowfall and road conditions",
      "Flexible timing is important for winter travel plans",
    ],
  },
];

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

export const getSeasonDetails = (slug, tours = []) => {
  const season = seasonConfigs.find((item) => item.slug === slug) || seasonConfigs[0];
  const packages = tours.filter((tour) =>
    season.terms.some((term) => getSeasonSearchText(tour).includes(term)),
  );

  return {
    ...season,
    packages,
    image: season.fallbackImage,
    overview: `${season.title} focus on ${season.subtitle.toLowerCase()} These journeys are planned around the right weather window, smoother routes, and the most relevant places to visit in Gilgit-Baltistan.`,
  };
};
