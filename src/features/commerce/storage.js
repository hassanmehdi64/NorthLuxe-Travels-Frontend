const KEYS = {
  wishlist: "ql_wishlist",
  cart: "ql_cart",
};

const EVENTS = {
  wishlist: "ql-wishlist-updated",
  cart: "ql-cart-updated",
};

const read = (key) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const emit = (eventName) => {
  window.dispatchEvent(new Event(eventName));
};

export const normalizeTourItem = (tour) => ({
  id: tour?.id,
  slug: tour?.slug || tour?.id,
  title: tour?.title || "Tour",
  image: tour?.image || "",
  location: tour?.location || "",
  durationDays: Number(tour?.durationDays || 0),
  price: Number(tour?.price || 0),
  currency: tour?.currency || "PKR",
  availableSeats: Number(tour?.availableSeats || 0),
});

export const getWishlist = () => read(KEYS.wishlist);
export const getCart = () => read(KEYS.cart);

export const isInWishlist = (id) => getWishlist().some((item) => String(item.id) === String(id));
export const isInCart = (id) => getCart().some((item) => String(item.id) === String(id));

export const addToWishlist = (tour) => {
  const item = normalizeTourItem(tour);
  const list = getWishlist();
  if (!list.some((entry) => String(entry.id) === String(item.id))) {
    write(KEYS.wishlist, [item, ...list]);
    emit(EVENTS.wishlist);
  }
};

export const removeFromWishlist = (id) => {
  write(
    KEYS.wishlist,
    getWishlist().filter((item) => String(item.id) !== String(id)),
  );
  emit(EVENTS.wishlist);
};

export const toggleWishlist = (tour) => {
  const exists = isInWishlist(tour?.id);
  if (exists) removeFromWishlist(tour?.id);
  else addToWishlist(tour);
  return !exists;
};

export const addToCart = (tour) => {
  const item = normalizeTourItem(tour);
  const list = getCart();
  if (!list.some((entry) => String(entry.id) === String(item.id))) {
    write(KEYS.cart, [item, ...list]);
    emit(EVENTS.cart);
  }
};

export const removeFromCart = (id) => {
  write(
    KEYS.cart,
    getCart().filter((item) => String(item.id) !== String(id)),
  );
  emit(EVENTS.cart);
};

export const clearWishlist = () => {
  write(KEYS.wishlist, []);
  emit(EVENTS.wishlist);
};

export const clearCart = () => {
  write(KEYS.cart, []);
  emit(EVENTS.cart);
};
