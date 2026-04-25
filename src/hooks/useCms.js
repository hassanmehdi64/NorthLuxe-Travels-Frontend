import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, unwrap } from "../lib/apiClient";
import fallbackTours from "../components/popular-tours/toursData";
import { displayCurrency } from "../utils/currency";

const PUBLIC_TOURS_CACHE_KEY = "northluxe-public-tours-cache";

const toSlug = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeFallbackTour = (tour, index) => {
  const parsedPrice = Number(String(tour?.price || "").replace(/[^\d.]/g, "")) || 0;
  const durationDaysMatch = String(tour?.duration || "").match(/\d+/);
  const durationDays = Number(durationDaysMatch?.[0] || 0);
  const seatCount = Number(tour?.availableSeats ?? tour?.capacity ?? 0);

  return {
    id: String(tour?.id || index + 1),
    title: tour?.title || "Tour",
    slug: toSlug(tour?.title || `tour-${index + 1}`),
    location: tour?.location || "",
    durationDays,
    durationLabel: tour?.duration || (durationDays ? `${durationDays} Days` : ""),
    price: parsedPrice,
    currency: "PKR",
    image: tour?.image || "",
    gallery: [],
    shortDescription: "",
    description: "",
    capacity: seatCount,
    availableSeats: seatCount,
    featured: true,
    status: "published",
    rating: 4.8,
    reviews: 0,
    reviewItems: [],
    tags: [],
    itinerary: [],
    availableOptions: { hotelCategories: [], vehicleTypes: [] },
  };
};

const getFallbackPublicTours = () => fallbackTours.map(normalizeFallbackTour);

const getCachedPublicTours = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PUBLIC_TOURS_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const setCachedPublicTours = (items) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PUBLIC_TOURS_CACHE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage failures and keep network data in memory.
  }
};

const mergePublicTours = (networkItems = [], cachedItems = []) => {
  const cachedById = new Map(cachedItems.map((item) => [String(item?.id || ""), item]));

  return networkItems.map((item) => {
    const cachedItem = cachedById.get(String(item?.id || ""));
    const mergedItem = cachedItem ? { ...item, ...cachedItem } : item;
    return { ...mergedItem, currency: displayCurrency(mergedItem?.currency) };
  });
};

const keys = {
  toursPublic: ["tours", "public"],
  toursAdmin: ["tours", "admin"],
  blogsPublic: ["blogs", "public"],
  blogPublic: (slug) => ["blogs", "public", slug],
  blogsAdmin: ["blogs", "admin"],
  blogAdmin: (id) => ["blogs", "admin", id],
  tourPublic: (slug) => ["tours", "public", slug],
  testimonialsPublic: ["testimonials", "public"],
  testimonialsAdmin: ["testimonials", "admin"],
  bookings: ["bookings"],
  booking: (id) => ["bookings", id],
  users: ["users"],
  contacts: ["contacts"],
  galleryPublic: ["gallery", "public"],
  galleryAdmin: ["gallery", "admin"],
  settingsPublic: ["settings", "public"],
  settingsAdmin: ["settings", "admin"],
  emailStatus: ["settings", "email", "status"],
  contentPublic: (type) => ["content", "public", type],
  contentPublicItem: (type, slug) => ["content", "public", type, slug],
  contentAdmin: (type) => ["content", "admin", type],
  notifications: ["notifications"],
  dashboard: ["dashboard", "overview"],
  paymentSession: (sessionId) => ["payments", "session", sessionId],
};

export const usePublicTours = () =>
  useQuery({
    queryKey: keys.toursPublic,
    queryFn: async () => {
      try {
        const items = await apiClient.get("/tours/public").then(unwrap).then((d) => d.items || []);
        if (Array.isArray(items) && items.length) {
          const cachedItems = getCachedPublicTours();
          const mergedItems = mergePublicTours(items, cachedItems);
          setCachedPublicTours(mergedItems);
          return mergedItems;
        }

        const cachedItems = getCachedPublicTours();
        return cachedItems.length
          ? cachedItems.map((item) => ({ ...item, currency: displayCurrency(item?.currency) }))
          : getFallbackPublicTours();
      } catch {
        const cachedItems = getCachedPublicTours();
        return cachedItems.length
          ? cachedItems.map((item) => ({ ...item, currency: displayCurrency(item?.currency) }))
          : getFallbackPublicTours();
      }
    },
  });

export const usePublicTour = (slug) =>
  useQuery({
    queryKey: keys.tourPublic(slug),
    queryFn: () =>
      apiClient
        .get(`/tours/${slug}/public`)
        .then(unwrap)
        .then((d) => ({ ...d.item, currency: displayCurrency(d.item?.currency) })),
    enabled: Boolean(slug),
  });

export const usePublicTestimonials = () =>
  useQuery({
    queryKey: keys.testimonialsPublic,
    queryFn: () => apiClient.get("/testimonials/public").then(unwrap).then((d) => d.items),
  });

export const useAdminTestimonials = () =>
  useQuery({
    queryKey: keys.testimonialsAdmin,
    queryFn: () => apiClient.get("/testimonials").then(unwrap).then((d) => d.items),
  });

export const useCreateTestimonial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) =>
      apiClient.post("/testimonials", payload).then(unwrap).then((d) => d.item),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.testimonialsAdmin });
      qc.invalidateQueries({ queryKey: keys.testimonialsPublic });
    },
  });
};

export const useUpdateTestimonial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      apiClient.patch(`/testimonials/${id}`, payload).then(unwrap).then((d) => d.item),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.testimonialsAdmin });
      qc.invalidateQueries({ queryKey: keys.testimonialsPublic });
    },
  });
};

export const useDeleteTestimonial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.delete(`/testimonials/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.testimonialsAdmin });
      qc.invalidateQueries({ queryKey: keys.testimonialsPublic });
    },
  });
};

export const useAdminTours = () =>
  useQuery({
    queryKey: keys.toursAdmin,
    queryFn: () => apiClient.get("/tours").then(unwrap).then((d) => d.items),
  });

export const useCreateTour = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => apiClient.post("/tours", payload).then(unwrap).then((d) => d.item),
    onSuccess: (createdItem) => {
      const cachedItems = getCachedPublicTours();
      setCachedPublicTours([createdItem, ...cachedItems.filter((item) => item.id !== createdItem.id)]);
      qc.invalidateQueries({ queryKey: keys.toursAdmin });
      qc.invalidateQueries({ queryKey: keys.toursPublic });
      qc.invalidateQueries({ queryKey: keys.dashboard });
    },
  });
};

export const useUpdateTour = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      apiClient.patch(`/tours/${id}`, payload).then(unwrap).then((d) => d.item),
    onSuccess: (updatedItem) => {
      const cachedItems = getCachedPublicTours();
      setCachedPublicTours(
        cachedItems.length
          ? cachedItems.map((item) => (item.id === updatedItem.id ? { ...item, ...updatedItem } : item))
          : [updatedItem],
      );
      qc.invalidateQueries({ queryKey: keys.toursAdmin });
      qc.invalidateQueries({ queryKey: keys.toursPublic });
      qc.invalidateQueries({ queryKey: keys.dashboard });
    },
  });
};

export const useDeleteTour = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.delete(`/tours/${id}`),
    onSuccess: (_result, id) => {
      const cachedItems = getCachedPublicTours();
      if (cachedItems.length) {
        setCachedPublicTours(cachedItems.filter((item) => item.id !== id));
      }
      qc.invalidateQueries({ queryKey: keys.toursAdmin });
      qc.invalidateQueries({ queryKey: keys.toursPublic });
      qc.invalidateQueries({ queryKey: keys.dashboard });
    },
  });
};

export const usePublicBlogs = () =>
  useQuery({
    queryKey: keys.blogsPublic,
    queryFn: () => apiClient.get("/blogs/public").then(unwrap).then((d) => d.items),
  });

export const usePublicBlog = (slug) =>
  useQuery({
    queryKey: keys.blogPublic(slug),
    queryFn: () => apiClient.get(`/blogs/${slug}/public`).then(unwrap).then((d) => d.item),
    enabled: Boolean(slug),
  });

export const useAdminBlogs = () =>
  useQuery({
    queryKey: keys.blogsAdmin,
    queryFn: () => apiClient.get("/blogs").then(unwrap).then((d) => d.items),
  });

export const useAdminBlog = (id) =>
  useQuery({
    queryKey: keys.blogAdmin(id),
    queryFn: () => apiClient.get(`/blogs/id/${id}`).then(unwrap).then((d) => d.item),
    enabled: Boolean(id),
  });

export const useCreateBlog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => apiClient.post("/blogs", payload).then(unwrap).then((d) => d.item),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.blogsAdmin });
      qc.invalidateQueries({ queryKey: keys.blogsPublic });
    },
  });
};

export const useUpdateBlog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      apiClient.patch(`/blogs/${id}`, payload).then(unwrap).then((d) => d.item),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.blogsAdmin });
      qc.invalidateQueries({ queryKey: keys.blogsPublic });
    },
  });
};

export const useDeleteBlog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.delete(`/blogs/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.blogsAdmin });
      qc.invalidateQueries({ queryKey: keys.blogsPublic });
    },
  });
};

export const useBookings = (enabled = true) =>
  useQuery({
    queryKey: keys.bookings,
    queryFn: () => apiClient.get("/bookings").then(unwrap).then((d) => d.items),
    enabled,
    refetchInterval: enabled ? 15000 : false,
    refetchOnWindowFocus: true,
  });

export const useBooking = (id) =>
  useQuery({
    queryKey: keys.booking(id),
    queryFn: () => apiClient.get(`/bookings/${id}`).then(unwrap).then((d) => d.item),
    enabled: Boolean(id),
  });

export const useCreatePublicBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) =>
      apiClient.post("/bookings/public", payload).then(unwrap).then((d) => d.item),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.bookings });
      qc.invalidateQueries({ queryKey: keys.dashboard });
      qc.invalidateQueries({ queryKey: keys.notifications });
    },
  });
};

export const usePublicBookingQuote = () =>
  useMutation({
    mutationFn: (payload) => apiClient.post("/bookings/quote/public", payload).then(unwrap),
  });

export const useCreateCheckoutSession = () =>
  useMutation({
    mutationFn: (payload) => apiClient.post("/payments/checkout-session", payload).then(unwrap),
  });

export const usePaymentSession = (sessionId, enabled = true) =>
  useQuery({
    queryKey: keys.paymentSession(sessionId || "unknown"),
    queryFn: () => apiClient.get(`/payments/session/${sessionId}`).then(unwrap),
    enabled: Boolean(sessionId) && enabled,
    refetchInterval: (query) => (query.state.data?.booking?.paymentVerified ? false : 3000),
  });

export const useCreatePaymentIntent = () =>
  useMutation({
    mutationFn: (payload) => apiClient.post("/payments/intent", payload).then(unwrap),
  });

export const useCreateJazzCashSession = () =>
  useMutation({
    mutationFn: (payload) => apiClient.post("/payments/jazzcash/session", payload).then(unwrap),
  });

export const useVerifyPaymentIntent = () =>
  useMutation({
    mutationFn: (payload) => apiClient.post("/payments/verify-intent", payload).then(unwrap),
  });

export const useConfirmBookingPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => apiClient.post("/payments/confirm", payload).then(unwrap),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: keys.bookings });
      qc.invalidateQueries({ queryKey: keys.booking(result?.bookingId) });
      qc.invalidateQueries({ queryKey: keys.dashboard });
      qc.invalidateQueries({ queryKey: keys.notifications });
    },
  });
};

export const useUpdateBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      apiClient.patch(`/bookings/${id}`, payload).then(unwrap).then((d) => d.item),
    onSuccess: (item) => {
      qc.setQueryData(keys.booking(item.id), item);
      qc.setQueryData(keys.bookings, (current) =>
        Array.isArray(current)
          ? current.map((entry) => (entry.id === item.id ? item : entry))
          : current,
      );
      qc.invalidateQueries({ queryKey: keys.bookings });
      qc.invalidateQueries({ queryKey: keys.booking(item.id) });
      qc.invalidateQueries({ queryKey: keys.dashboard });
      qc.invalidateQueries({ queryKey: keys.notifications });
    },
  });
};

export const useDeleteBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.delete(`/bookings/${id}`),
    onSuccess: (_result, id) => {
      qc.setQueryData(keys.bookings, (current) =>
        Array.isArray(current) ? current.filter((entry) => entry.id !== id) : current,
      );
      qc.invalidateQueries({ queryKey: keys.bookings });
      qc.invalidateQueries({ queryKey: keys.booking(id) });
      qc.invalidateQueries({ queryKey: keys.dashboard });
      qc.invalidateQueries({ queryKey: keys.notifications });
    },
  });
};

export const useGallery = (isPublic = false) =>
  useQuery({
    queryKey: isPublic ? keys.galleryPublic : keys.galleryAdmin,
    queryFn: () =>
      apiClient.get(isPublic ? "/gallery/public" : "/gallery").then(unwrap).then((d) => d.items),
  });

export const useCreateGalleryItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => apiClient.post("/gallery", payload).then(unwrap).then((d) => d.item),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.galleryAdmin });
      qc.invalidateQueries({ queryKey: keys.galleryPublic });
    },
  });
};

export const useUpdateGalleryItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      apiClient.patch(`/gallery/${id}`, payload).then(unwrap).then((d) => d.item),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.galleryAdmin });
      qc.invalidateQueries({ queryKey: keys.galleryPublic });
    },
  });
};

export const useDeleteGalleryItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.delete(`/gallery/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.galleryAdmin });
      qc.invalidateQueries({ queryKey: keys.galleryPublic });
    },
  });
};

export const usePublicContentList = (type) =>
  useQuery({
    queryKey: keys.contentPublic(type || "all"),
    queryFn: () =>
      apiClient
        .get("/content/public", { params: { type } })
        .then(unwrap)
        .then((d) => d.items),
    enabled: Boolean(type),
  });

export const usePublicContentItem = (type, slug) =>
  useQuery({
    queryKey: keys.contentPublicItem(type || "all", slug),
    queryFn: () =>
      apiClient
        .get(`/content/${slug}/public`, { params: { type } })
        .then(unwrap)
        .then((d) => d.item),
    enabled: Boolean(type && slug),
    retry: false,
  });

export const useAdminContentList = (type) =>
  useQuery({
    queryKey: keys.contentAdmin(type || "all"),
    queryFn: () =>
      apiClient
        .get("/content", { params: type ? { type } : undefined })
        .then(unwrap)
        .then((d) => d.items),
  });

export const useCreateContent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => apiClient.post("/content", payload).then(unwrap).then((d) => d.item),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content"] });
    },
  });
};

export const useUpdateContent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      apiClient.patch(`/content/${id}`, payload).then(unwrap).then((d) => d.item),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content"] });
    },
  });
};

export const useDeleteContent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.delete(`/content/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content"] });
    },
  });
};

export const useUsers = (enabled = true) =>
  useQuery({
    queryKey: keys.users,
    queryFn: () => apiClient.get("/users").then(unwrap).then((d) => d.items),
    enabled,
  });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => apiClient.post("/users", payload).then(unwrap).then((d) => d.item),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.users }),
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      apiClient.patch(`/users/${id}`, payload).then(unwrap).then((d) => d.item),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.users }),
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.delete(`/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.users }),
  });
};

export const useContacts = (enabled = true) =>
  useQuery({
    queryKey: keys.contacts,
    queryFn: () => apiClient.get("/contacts").then(unwrap).then((d) => d.items),
    enabled,
  });

export const useCreateContact = () =>
  useMutation({
    mutationFn: (payload) => apiClient.post("/contacts/public", payload).then(unwrap).then((d) => d.item),
  });

export const useUpdateContact = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      apiClient.patch(`/contacts/${id}`, payload).then(unwrap).then((d) => d.item),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.contacts }),
  });
};

export const useReplyContact = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, message }) =>
      apiClient.post(`/contacts/${id}/reply`, { message }).then(unwrap).then((d) => d.item),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.contacts }),
  });
};

export const useDeleteContact = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.delete(`/contacts/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.contacts }),
  });
};

export const useSettings = (isPublic = false) =>
  useQuery({
    queryKey: isPublic ? keys.settingsPublic : keys.settingsAdmin,
    queryFn: () =>
      apiClient.get(isPublic ? "/settings/public" : "/settings").then(unwrap).then((d) => d.item),
  });

export const useUpdateSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => apiClient.patch("/settings", payload).then(unwrap).then((d) => d.item),
    onSuccess: (item, payload) => {
      const mergeSettings = (current = {}) => ({
        ...current,
        ...item,
        ...payload,
        pageHeroImages: {
          ...(current.pageHeroImages || {}),
          ...(item?.pageHeroImages || {}),
          ...(payload?.pageHeroImages || {}),
        },
      });

      qc.setQueryData(keys.settingsAdmin, mergeSettings);
      qc.setQueryData(keys.settingsPublic, mergeSettings);
    },
  });
};

export const useEmailStatus = () =>
  useQuery({
    queryKey: keys.emailStatus,
    queryFn: () => apiClient.get("/settings/email/status").then(unwrap).then((d) => d.item),
  });

export const useVerifyEmailTransport = () =>
  useMutation({
    mutationFn: () => apiClient.post("/settings/email/verify").then(unwrap),
  });

export const useSendTestEmail = () =>
  useMutation({
    mutationFn: (payload) => apiClient.post("/settings/email/test", payload).then(unwrap),
  });

export const useNotifications = (enabled = true) =>
  useQuery({
    queryKey: keys.notifications,
    queryFn: () => apiClient.get("/notifications").then(unwrap).then((d) => d.items),
    enabled,
    refetchInterval: enabled ? 10000 : false,
    refetchOnWindowFocus: true,
  });

export const useUpdateNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      apiClient.patch(`/notifications/${id}`, payload).then(unwrap).then((d) => d.item),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.notifications }),
  });
};

export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.patch("/notifications", { markAllRead: true }).then(unwrap),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.notifications }),
  });
};

export const useDeleteNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.delete(`/notifications/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.notifications }),
  });
};

export const useDashboardOverview = (enabled = true) =>
  useQuery({
    queryKey: keys.dashboard,
    queryFn: () => apiClient.get("/dashboard/overview").then(unwrap),
    enabled,
  });





