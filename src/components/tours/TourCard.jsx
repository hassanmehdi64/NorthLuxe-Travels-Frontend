import { Link } from "react-router-dom";
import { Heart, MapPin, ShoppingBag, Star, Users } from "lucide-react";
import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { addToCart, isInCart, isInWishlist, toggleWishlist } from "../../features/commerce/storage";
import {
  buildDisplayItinerary,
  getTourPlaceName,
  getTourPlacesLabel,
  getTourPlanLabel,
} from "../tour-details/tourDetailsData";

const TourCard = ({ tour }) => {
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

  const handleWishlist = () => {
    const added = toggleWishlist(tour);
    setWishlistVersion((value) => value + 1);
    if (added) toast.success("Added to wishlist", `${tour?.title} is saved for later.`);
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
    <article className="group h-full flex flex-col rounded-2xl bg-theme-surface border border-theme shadow-[0_10px_20px_rgba(15,23,42,0.08)] hover:border-[var(--c-brand)] transition-all duration-500 hover:shadow-[0_18px_34px_rgba(15,23,42,0.14)] overflow-hidden">
      <div className="relative h-44 sm:h-48 overflow-hidden">
        <img
          src={tour?.image}
          alt={tour?.title || "Tour image"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <div className="bg-theme-text/80 backdrop-blur-md text-white px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold">
            <Star size={10} className="fill-[var(--c-brand)] stroke-[var(--c-brand)]" />
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

        <h3 className="text-sm sm:text-base font-bold text-theme leading-tight mb-4 line-clamp-2 min-h-[42px] group-hover:text-[var(--c-brand)] transition-colors">
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
            title="Add to wishlist"
          >
            <Heart size={14} className={savedInWishlist ? "fill-current" : ""} />
          </button>

          <button
            type="button"
            onClick={handleCart}
            className="inline-flex items-center justify-center rounded-xl border border-theme text-theme hover:bg-theme-bg px-2.5 sm:px-3 py-2.5 transition"
            aria-label="Add to cart"
            title="Add to cart"
          >
            <ShoppingBag size={14} />
          </button>

          <Link
            to={`/tours/${slugOrId}`}
            className="flex-1 btn-brand text-[10px] sm:text-[11px] py-2.5 rounded-xl shadow-sm active:scale-95 font-bold uppercase tracking-wider flex justify-center items-center"
          >
            Book Now
          </Link>
        </div>
      </div>
    </article>
  );
};

export default TourCard;
