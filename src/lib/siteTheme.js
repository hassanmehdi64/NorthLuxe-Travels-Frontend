export const defaultPageHeroImages = {
  tours: "https://gilgitbaltistan.gov.pk/public/images/river-5688258_1920.jpg",
  about: "https://www.travelertrails.com/wp-content/uploads/2022/11/Gilgit-Baltistan-4.jpg",
  blog: "https://res.cloudinary.com/www-travelpakistani-com/image/upload/v1670002655/Roundu_Valley_pakistan.jpg",
  contact: "https://gilgitbaltistan.gov.pk/public/images/river-5688258_1920.jpg",
};

export const defaultHomeHeroImages = [
  "/gb.jpg",
  "https://res.cloudinary.com/www-travelpakistani-com/image/upload/v1670002655/Roundu_Valley_pakistan.jpg",
  "https://realpakistan.com.pk/wp-content/uploads/2025/04/shangrila-resort.jpg",
  "https://luxushunza.com/wp-content/uploads/slider/cache/da7922896e4ca1abc15bafab13c8151f/DSC_9668-HDR-1-scaled.jpg",
];

export const defaultHeroColors = {
  overlay: "rgba(0, 0, 0, 0.45)",
  start: "rgba(7, 19, 38, 0.9)",
  middle: "rgba(7, 19, 38, 0.6)",
  end: "rgba(7, 19, 38, 0.2)",
  homeStart: "rgba(5, 8, 12, 0.24)",
  homeEnd: "rgba(5, 8, 12, 0.56)",
};

export const defaultNavbarColors = {
  main: "#1F7630",
  scrolled: "#1F7630",
  mobile: "#1F7630",
  text: "#ffffff",
  mutedText: "rgba(255, 255, 255, 0.9)",
  activeText: "#FF8F05",
};

export const defaultFooterColors = {
  background: "#1F7630",
  text: "#ffffff",
  mutedText: "rgba(255, 255, 255, 0.78)",
  accentText: "#13DDB4",
};

export const getPageHeroImage = (settings, page, fallback) =>
  settings?.pageHeroImages?.[page] || fallback || defaultPageHeroImages[page] || "";

export const getHomeHeroImages = (settings) => {
  const items = Array.isArray(settings?.homeHeroImages) ? settings.homeHeroImages.filter(Boolean) : [];
  return items.length ? items : defaultHomeHeroImages;
};

export const getHeroColors = (settings) => ({
  ...defaultHeroColors,
  ...(settings?.heroColors || {}),
});

export const getNavbarColors = (settings) => ({
  ...defaultNavbarColors,
  ...(settings?.navbarColors || {}),
  text: settings?.navbarTextColor || defaultNavbarColors.text,
  mutedText: settings?.navbarMutedTextColor || defaultNavbarColors.mutedText,
  activeText: settings?.navbarActiveTextColor || defaultNavbarColors.activeText,
});

export const getFooterColors = (settings) => ({
  ...defaultFooterColors,
  ...(settings?.footerColors || {}),
});
