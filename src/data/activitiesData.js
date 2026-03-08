export const activitiesData = [
  {
    id: "hiking",
    title: "Hiking Trails",
    location: "Hunza & Skardu",
    duration: "Half Day to 2 Days",
    level: "Beginner to Intermediate",
    image:
      "https://realpakistan.com.pk/wp-content/uploads/2025/06/hunza-sarena.jpg",
    shortDescription:
      "Guided hiking experiences across scenic valley routes with flexible pace and support.",
    description:
      "Our hiking activities are designed for travelers who want immersive views without extreme technical difficulty. Routes are selected based on season, weather, and your comfort level. You can choose short scenic trails or longer half-day routes. Every plan includes route guidance, check-in support, and timing aligned with daylight and local conditions.",
    includes: [
      "Local route guidance",
      "Flexible pace planning",
      "Basic safety briefing",
      "Time-managed trail schedule",
    ],
    gallery: [
      "https://luxushunza.com/wp-content/uploads/slider/cache/da7922896e4ca1abc15bafab13c8151f/DSC_9668-HDR-1-scaled.jpg",
      "https://tripako.com/wp-content/uploads/2020/12/Fairy-1-1-scaled.jpg",
      "https://www.jasminetours.com/wp-content/uploads/2023/12/naltar-valleysummit_637109694169120178-1.jpg",
      "https://res.cloudinary.com/www-travelpakistani-com/image/upload/v1670002655/Roundu_Valley_pakistan.jpg",
    ],
  },
  {
    id: "trekking",
    title: "Mountain Trekking",
    location: "Fairy Meadows & Beyond",
    duration: "2 to 5 Days",
    level: "Intermediate",
    image:
      "https://images.squarespace-cdn.com/content/v1/5a815ad2e45a7c1f4ef40fb8/1533222115427-RM0925EGPCZMCCN8T01S/fairy-meadows-1920.jpg",
    shortDescription:
      "Multi-day trekking with route planning, rest points, and on-ground coordination.",
    description:
      "This trekking format is built for travelers looking for deeper mountain exposure and stronger adventure value. The itinerary is structured around realistic trekking hours, altitude comfort, and recovery windows. We coordinate checkpoints and rest stops to keep the experience safe, practical, and memorable.",
    includes: [
      "Pre-planned trek route",
      "Daily check-in coordination",
      "Rest/overnight planning",
      "Support on key trail segments",
    ],
    gallery: [
      "https://cdn.tripspoint.com/uploads/photos/8183/10-days-fairy-meadows-hunza-valley-pakistan_uJZ6j.jpeg",
      "https://tripako.com/wp-content/uploads/2020/12/Fairy-1-1-scaled.jpg",
      "https://clickpakistan.org/wp-content/uploads/2023/11/Best-Things-to-do-in-Skardu.jpg",
      "https://res.cloudinary.com/www-travelpakistani-com/image/upload/v1670002655/Roundu_Valley_pakistan.jpg",
    ],
  },
  {
    id: "camping",
    title: "Lakeside Camping",
    location: "Deosai & Upper Valleys",
    duration: "1 to 2 Nights",
    level: "Easy",
    image:
      "https://clickpakistan.org/wp-content/uploads/2023/11/Best-Things-to-do-in-Skardu.jpg",
    shortDescription:
      "Comfort-focused camping with curated locations, timing, and weather-aware planning.",
    description:
      "Our camping experiences focus on scenery and comfort. Camp spots are selected for access, safety, and overall atmosphere. The plan includes sunset/sunrise windows, meal timing recommendations, and support to maintain a smooth overnight experience for couples, friends, and families.",
    includes: [
      "Camp location planning",
      "Night stay coordination",
      "Comfort-first activity flow",
      "Weather and timing support",
    ],
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Shangrila_resort_skardu.jpg/1024px-Shangrila_resort_skardu.jpg",
      "https://realpakistan.com.pk/wp-content/uploads/2025/04/shangrila-resort.jpg",
      "https://www.jasminetours.com/wp-content/uploads/2023/12/naltar-valleysummit_637109694169120178-1.jpg",
      "https://luxushunza.com/wp-content/uploads/Gojal_Restaurant-1.webp",
    ],
  },
  {
    id: "culture",
    title: "Cultural Walks",
    location: "Old Towns & Heritage Spots",
    duration: "Half Day",
    level: "Easy",
    image:
      "https://res.cloudinary.com/www-travelpakistani-com/image/upload/v1670002655/Roundu_Valley_pakistan.jpg",
    shortDescription:
      "Explore local culture, markets, and heritage areas with a guided contextual experience.",
    description:
      "Cultural walks are ideal for travelers interested in local lifestyle and history. We design these sessions around walkable routes that include selected points of interest, local markets, and heritage zones. The pace is relaxed and suitable for mixed groups.",
    includes: [
      "Local area orientation",
      "Heritage route suggestions",
      "Flexible session timing",
      "Family-friendly flow",
    ],
    gallery: [
      "https://realpakistan.com.pk/wp-content/uploads/2025/06/hunza-sarena.jpg",
      "https://luxushunza.com/wp-content/uploads/slider/cache/da7922896e4ca1abc15bafab13c8151f/DSC_9668-HDR-1-scaled.jpg",
      "https://clickpakistan.org/wp-content/uploads/2023/11/Best-Things-to-do-in-Skardu.jpg",
      "https://cdn.tripspoint.com/uploads/photos/8183/10-days-fairy-meadows-hunza-valley-pakistan_uJZ6j.jpeg",
    ],
  },
];

export const getActivityById = (id) => activitiesData.find((item) => item.id === id);
