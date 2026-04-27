import { Link } from "react-router-dom";
import { Heart, MapPin, ShoppingBag, Star, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { useToast } from "../../context/ToastContext";
import {
  addToCart,
  isInCart,
  isInWishlist,
  toggleWishlist,
} from "../../features/commerce/storage";
import {
  buildDisplayItinerary,
  getTourPlaceName,
  getTourPlacesLabel,
  getTourPlanLabel,
} from "../tour-details/tourDetailsData";
import { formatCurrencyAmount } from "../../utils/currency";

const MotionArticle = motion.article;

const DEFAULT_TOUR_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

const cardReveal = {
  hidden: { opacity: 0, y: 26, scale: 0.985 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.72,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const parsePrice = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  const cleaned = String(value || "").replace(/[^\d.-]+/g, "");
  const parsed = Number(cleaned);

  return Number.isFinite(parsed) ? parsed : 0;
};

const getDiscountPercent = (tour) => {
  const directPercent = parsePrice(
    tour?.discountPercent ?? tour?.discount ?? tour?.salePercent ?? 0,
  );

  if (directPercent > 0) {
    return Math.round(directPercent);
  }

  const originalPrice = parsePrice(tour?.originalPrice);
  const currentPrice = parsePrice(tour?.price);

  if (originalPrice > currentPrice && currentPrice > 0) {
    const percentOff = Math.round(
      ((originalPrice - currentPrice) / originalPrice) * 100,
    );

    return percentOff > 0 ? percentOff : 0;
  }

  return 0;
};

const TourCard = ({ tour = {}, index = 0 }) => {
  const toast = useToast();
  const [wishlistVersion, setWishlistVersion] = useState(0);

  const {
    id,
    slug,
    title,
    image,
    currency,
    rating,
    price,
    availableSeats,
    durationDays,
    durationLabel,
  } = tour;

  const tourId = id || slug;
  const slugOrId = slug || id;

  const displayTitle = title || "Scenic Escape";
  const imageSrc = image || DEFAULT_TOUR_IMAGE;

  const itinerary = useMemo(() => buildDisplayItinerary(tour), [tour]);

  const placeName = getTourPlaceName(tour) || "Pakistan";
  const placesLabel = getTourPlacesLabel(tour, itinerary) || "Multiple places";
  const seatLabel = getTourPlanLabel(tour) || "Flexible plan";

  const totalDays = Number(durationDays || 0);
  const displayDuration =
    durationLabel || (totalDays > 0 ? `${totalDays} Days` : "Flexible");

  const seatCount = Number(availableSeats);
  const hasSeatInfo = Number.isFinite(seatCount);
  const isAvailable = !hasSeatInfo || seatCount > 0;

  const ratingNumber = Number(rating);
  const ratingText = Number.isFinite(ratingNumber)
    ? ratingNumber.toFixed(1)
    : "New";

  const cardDelay = Math.min(index * 0.08, 0.36);
  const discountPercent = getDiscountPercent(tour);
  const currentPrice = parsePrice(price);
  const showDiscountPriceBadge = discountPercent > 0 && currentPrice > 0;

  const savedInWishlist = tourId ? isInWishlist(tourId) : false;

  const handleWishlist = () => {
    if (!tourId) {
      toast.info("Tour unavailable", "This tour cannot be saved right now.");
      return;
    }

    const added = toggleWishlist(tour);
    setWishlistVersion((value) => value + 1);

    if (added) {
      toast.success("Added to wishlist", `${displayTitle} is saved for later.`);
    } else {
      toast.info("Removed from wishlist", `${displayTitle} was removed.`);
    }
  };

  const handleCart = () => {
    if (!tourId) {
      toast.info("Tour unavailable", "This tour cannot be added right now.");
      return;
    }

    if (!isAvailable) {
      toast.info("Tour is full", `${displayTitle} has no seats available.`);
      return;
    }

    if (isInCart(tourId)) {
      toast.info("Already in cart", `${displayTitle} is already added.`);
      return;
    }

    addToCart(tour);
    toast.success("Added to cart", `${displayTitle} is ready for checkout.`);
  };

  return (
    <MotionArticle
      variants={cardReveal}
      custom={cardDelay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-theme bg-theme-surface shadow-[0_10px_20px_rgba(15,23,42,0.08)] transition-[border-color,box-shadow] duration-500 will-change-transform hover:border-[var(--c-brand)] hover:shadow-[0_18px_34px_rgba(15,23,42,0.14)]">
      <div className="relative h-44 overflow-hidden sm:h-48">
        <motion.img
          src={imageSrc}
          alt={displayTitle}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.045 }}
          transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
        />

        {showDiscountPriceBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: -10, rotate: -8 }}
            whileInView={{ opacity: 1, scale: 1, y: 0, rotate: -6 }}
            whileHover={{ y: -2, rotate: -9, scale: 1.03 }}
            transition={{
              duration: 0.45,
              delay: cardDelay + 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true, amount: 0.6 }}
            className="absolute right-3 top-3 z-[2]">
            <div className="rounded-full border border-white/80 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 px-3 py-1.5 text-white shadow-[0_12px_26px_rgba(249,115,22,0.35)]">
              <div className="text-[9px] font-black uppercase leading-none tracking-[0.16em]">
                {discountPercent}% OFF
              </div>

              <div className="mt-1 text-[11px] font-black leading-none">
                {formatCurrencyAmount(currentPrice, currency)}
              </div>
            </div>
          </motion.div>
        )}

        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <div className="flex items-center gap-1 rounded-lg bg-theme-text/80 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md">
            <Star
              size={10}
              className="fill-[var(--c-brand)] stroke-[var(--c-brand)]"
            />
            {ratingText}
          </div>

          {!isAvailable && (
            <div className="rounded-lg bg-red-500/90 px-2 py-1 text-[10px] font-bold uppercase text-white backdrop-blur-sm">
              Full
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
          <span className="flex max-w-[140px] items-center gap-1 truncate text-[var(--c-brand)]">
            <MapPin size={11} className="shrink-0 opacity-70" />
            <span className="truncate">{placeName}</span>
          </span>

          <span className="min-w-0 truncate">{placesLabel}</span>
        </div>

        <h3 className="mb-4 min-h-[42px] text-sm font-bold leading-tight text-theme line-clamp-2 transition-colors duration-300 group-hover:text-[var(--c-brand)] sm:text-base">
          {displayTitle}
        </h3>

        <div className="mb-5 flex items-center justify-between gap-3 text-[11px] font-medium text-muted">
          <div className="flex min-w-0 items-center gap-1">
            <Users size={12} className="shrink-0 opacity-50" />
            <span className="truncate">{seatLabel}</span>
          </div>

          <div className="flex min-w-0 items-center gap-1.5 text-right">
            <MapPin size={12} className="shrink-0 opacity-50" />
            <span className="truncate">{placesLabel}</span>
          </div>
        </div>
        <div className="h-1 w-12 shrink-0 overflow-hidden rounded-full bg-theme-bg"></div>

        <div className="mt-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleWishlist}
            className="ql-btn-icon w-auto px-2.5 sm:px-3"
            data-active={savedInWishlist ? "true" : undefined}
            aria-label={
              savedInWishlist ? "Remove from wishlist" : "Add to wishlist"
            }
            title={
              savedInWishlist ? "Remove from wishlist" : "Add to wishlist"
            }>
            <Heart
              size={14}
              className={savedInWishlist ? "fill-current" : ""}
            />
          </button>

          <button
            type="button"
            onClick={handleCart}
            disabled={!isAvailable}
            className="ql-btn-icon w-auto px-2.5 sm:px-3"
            aria-label="Add to cart"
            title={isAvailable ? "Add to cart" : "Tour is full"}>
            <ShoppingBag size={14} />
          </button>

          <Link
            to={slugOrId ? `/tours/${slugOrId}` : "/tours"}
            className="ql-btn-primary flex flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider active:scale-95 sm:text-[11px]">
            Book Now
          </Link>
        </div>
      </div>
    </MotionArticle>
  );
};

export default TourCard;
