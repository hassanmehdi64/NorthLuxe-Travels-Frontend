import { Link } from "react-router-dom";
import { Heart, MapPin, ShoppingBag, Star, Users } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { addToCart, isInCart, isInWishlist, toggleWishlist } from "../../features/commerce/storage";
import {
  buildDisplayItinerary,
  getTourPlaceName,
  getTourPlacesLabel,
  getTourPlanLabel,
} from "../tour-details/tourDetailsData";
import { formatCurrencyAmount } from "../../utils/currency";

const MotionArticle = motion.article;
const cardReveal = {
  hidden: { opacity: 0, y: 26, scale: 0.985 },
  visible: (delay) => ({
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
  if (directPercent > 0) return Math.round(directPercent);

  const originalPrice = parsePrice(tour?.originalPrice);
  const currentPrice = parsePrice(tour?.price);
  if (originalPrice > currentPrice && currentPrice > 0) {
    const percentOff = Math.round(
      ((originalPrice - currentPrice) / originalPrice) * 100,
    );
    if (percentOff > 0) return percentOff;
  }

  return 0;
};

const TourCard = ({ tour, index = 0 }) => {
  const toast = useToast();
  const seatsLeft = Number(tour?.availableSeats || 0);
  const isAvailable = seatsLeft > 0;
  const ratingText = tour?.rating ? Number(tour.rating).toFixed(1) : "New";
  const slugOrId = tour?.slug || tour?.id;
  const [wishlistVersion, setWishlistVersion] = useState(0);
  const savedInWishlist = wishlistVersion >= 0 && isInWishlist(tour?.id);
  const placeName = getTourPlaceName(tour);
  const displayTitle = tour?.title || "Scenic Escape";
  const seatLabel = getTourPlanLabel(tour);
  const totalDays = Number(tour?.durationDays || 0);
  const placesLabel = getTourPlacesLabel(tour, buildDisplayItinerary(tour));
  const cardDelay = Math.min(index * 0.08, 0.36);
  const discountPercent = getDiscountPercent(tour);
  const currentPrice = parsePrice(tour?.price);
  const showDiscountPriceBadge = discountPercent > 0 && currentPrice > 0;

  const handleWishlist = () => {
    const added = toggleWishlist(tour);
    setWishlistVersion((value) => value + 1);
    if (added)
      toast.success("Added to wishlist", `${tour?.title} is saved for later.`);
    else toast.info("Removed from wishlist", `${tour?.title} was removed.`);
  };

  const handleCart = () => {
    if (isInCart(tour?.id)) {
      toast.info("Already in cart", `${tour?.title} is already added.`);
      return;
    }
    addToCart(tour);
    toast.success("Added to cart", `${tour?.title} is ready for checkout.`);
  };

  return (
    <MotionArticle
      variants={cardReveal}
      custom={cardDelay}
      initial="hidden"
      whileInView="visible"
      whileHover={{
        y: -5,
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      }}
      viewport={{ once: true, amount: 0.2 }}
      className="group h-full flex flex-col rounded-2xl bg-theme-surface border border-theme shadow-[0_10px_20px_rgba(15,23,42,0.08)] hover:border-[var(--c-brand)] transition-[border-color,box-shadow] duration-500 hover:shadow-[0_18px_34px_rgba(15,23,42,0.14)] overflow-hidden will-change-transform">
      <div className="relative h-44 sm:h-48 overflow-hidden">
        <motion.img
          src={tour?.image}
          alt={tour?.title || "Tour image"}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.045 }}
          transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
        />

        {showDiscountPriceBadge ? (
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
            <motion.div
              animate={{
                boxShadow: [
                  "0 10px 22px rgba(249,115,22,0.28)",
                  "0 14px 30px rgba(244,63,94,0.42)",
                  "0 10px 22px rgba(249,115,22,0.28)",
                ],
                opacity: [1, 0.72, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="rounded-full border border-white/80 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 px-3 py-1.5 text-white">
              <div className="text-[9px] font-black uppercase tracking-[0.16em] leading-none">
                {discountPercent}% OFF
              </div>
              <div className="mt-1 text-[11px] font-black leading-none">
                {formatCurrencyAmount(currentPrice, tour?.currency)}
              </div>
            </motion.div>
          </motion.div>
        ) : null}

        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <div className="bg-theme-text/80 backdrop-blur-md text-white px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold">
            <Star
              size={10}
              className="fill-[var(--c-brand)] stroke-[var(--c-brand)]"
            />
            {ratingText}
          </div>
          {!isAvailable && (
            <div className="bg-red-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-[10px] font-bold uppercase">
              Full
            </div>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
          <span className="flex items-center gap-1 text-[var(--c-brand)] truncate max-w-[140px]">
            <MapPin size={11} className="opacity-70" />
            {placeName}
          </span>
          <span className="opacity-20">|</span>
          <span>{tour?.durationLabel || `${totalDays} Days`}</span>
          <span className="opacity-20">|</span>
          <span className="truncate">{placesLabel}</span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-theme leading-tight mb-4 line-clamp-2 min-h-[42px] group-hover:text-[var(--c-brand)] transition-colors duration-300">
          {displayTitle}
        </h3>

        <div className="mb-5 flex items-center justify-between gap-5 text-[11px] font-medium text-muted">
          <div className="flex items-center gap-1">
            <Users size={12} className="opacity-50" />
            <span>{seatLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-right">
            <MapPin size={12} className="opacity-50" />
            <span>{placesLabel}</span>
          </div>
          <div className="h-1 w-12 bg-theme-bg rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${isAvailable ? "bg-[var(--c-brand)]" : "bg-muted/30"}`}
              style={{ width: isAvailable ? "60%" : "100%" }}
            />
          </div>
        </div>

        <div className="mt-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleWishlist}
            className={`inline-flex items-center justify-center rounded-xl border px-2.5 sm:px-3 py-2.5 transition ${
              savedInWishlist
                ? "border-[var(--c-brand)] bg-[var(--c-brand)]/15 text-[var(--c-brand)]"
                : "border-theme text-theme hover:bg-theme-bg"
            }`}
            aria-label="Add to wishlist"
            title="Add to wishlist">
            <Heart
              size={14}
              className={savedInWishlist ? "fill-current" : ""}
            />
          </button>

          <button
            type="button"
            onClick={handleCart}
            className="inline-flex items-center justify-center rounded-xl border border-theme text-theme hover:bg-theme-bg px-2.5 sm:px-3 py-2.5 transition"
            aria-label="Add to cart"
            title="Add to cart">
            <ShoppingBag size={14} />
          </button>

          <Link
            to={`/tours/${slugOrId}`}
            className="flex-1 btn-brand text-[10px] sm:text-[11px] py-2.5 rounded-xl shadow-sm active:scale-95 font-bold uppercase tracking-wider flex justify-center items-center">
            Book Now
          </Link>
        </div>
      </div>
    </MotionArticle>
  );
};

export default TourCard;

