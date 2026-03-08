export const servicesData = [
  {
    id: "itinerary-planning",
    title: "Itinerary Planning",
    category: "Planning",
    image:
      "https://realpakistan.com.pk/wp-content/uploads/2025/06/hunza-sarena.jpg",
    shortDescription:
      "Custom route planning based on your dates, pace, comfort, and travel goals.",
    description:
      "We design day-by-day itineraries that match your travel window, group style, and experience level. The plan balances travel time, sightseeing, and rest to keep the trip smooth and practical. Each itinerary is optimized for realistic driving windows and seasonal conditions.",
    deliverables: [
      "Day-by-day route outline",
      "Time and distance planning",
      "Stop recommendations",
      "Backup plan suggestions",
    ],
  },
  {
    id: "hotel-booking-support",
    title: "Hotel Booking Support",
    category: "Stays",
    image:
      "https://realpakistan.com.pk/wp-content/uploads/2025/04/shangrila-resort.jpg",
    shortDescription:
      "Curated stay options aligned with budget, location preference, and comfort level.",
    description:
      "We shortlist and coordinate stays that match your category preference and route flow. This includes practical suggestions around check-in timing, location convenience, and room comfort. The objective is reliable accommodation quality without booking stress.",
    deliverables: [
      "Hotel category matching",
      "Location-based shortlists",
      "Check-in/out planning",
      "Support for upgrades",
    ],
  },
  {
    id: "transport-arrangement",
    title: "Transport Arrangement",
    category: "Mobility",
    image:
      "https://clickpakistan.org/wp-content/uploads/2023/11/Best-Things-to-do-in-Skardu.jpg",
    shortDescription:
      "Vehicle planning for private groups, families, and comfort-focused journeys.",
    description:
      "From SUVs to group vans, we help arrange transport based on group size, route terrain, and luggage needs. Plans are built around comfort and safety, with practical daily movement and stop strategy.",
    deliverables: [
      "Vehicle type recommendation",
      "Route-ready transport plan",
      "Group-size optimization",
      "Daily movement coordination",
    ],
  },
  {
    id: "on-ground-concierge",
    title: "On-Ground Concierge",
    category: "Support",
    image:
      "https://luxushunza.com/wp-content/uploads/Gojal_Restaurant-1.webp",
    shortDescription:
      "Active trip support for schedule updates, route adjustments, and local coordination.",
    description:
      "Our concierge support helps you during travel with timely coordination and issue handling. If weather or timing changes happen, we guide route and plan adjustments. The focus is a calm, hassle-free travel experience.",
    deliverables: [
      "Trip-time assistance",
      "Schedule adjustment support",
      "Local coordination help",
      "Escalation and issue handling",
    ],
  },
];

export const getServiceById = (id) => servicesData.find((item) => item.id === id);
