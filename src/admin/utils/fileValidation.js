export const validateImageFile = (file, { maxBytes = 2 * 1024 * 1024 } = {}) => {
  if (!file) {
    return "No file selected.";
  }

  if (!String(file.type || "").startsWith("image/")) {
    return "Only image files are allowed.";
  }

  if (file.size > maxBytes) {
    return "Image size must be 2MB or smaller.";
  }

  return "";
};
