import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import FeaturePageHeader from "../../components/features/FeaturePageHeader";
import { addToCart, clearWishlist, getWishlist, removeFromWishlist } from "../../features/commerce/storage";
import { useToast } from "../../context/ToastContext";

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const sync = () => setItems(getWishlist());
    sync();
    window.addEventListener("ql-wishlist-updated", sync);
    return () => window.removeEventListener("ql-wishlist-updated", sync);
  }, []);

  const total = useMemo(() => items.reduce((sum, item) => sum + Number(item.price || 0), 0), [items]);

  const handleRemove = (id, title) => {
    removeFromWishlist(id);
    setItems(getWishlist());
    toast.info("Removed from wishlist", `${title} removed.`);
  };

  const handleMoveToCart = (item) => {
    addToCart(item);
    toast.success("Moved to cart", `${item.title} is now in your cart.`);
  };

  const handleClear = () => {
    clearWishlist();
    setItems([]);
    toast.info("Wishlist cleared", "All saved tours were removed.");
  };

  return (
    <section className="py-20 bg-theme-bg min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturePageHeader
          eyebrow="Saved Items"
          title="Your"
          highlight="Wishlist"
          description="Keep favorite tours here and move them to cart whenever you are ready."
        />

        {items.length ? (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-theme bg-theme-surface px-4 py-3">
              <p className="text-sm text-theme font-semibold">
                {items.length} saved tours | Total value:{" "}
                <span className="text-[var(--c-brand)] font-bold">
                  PKR {total.toLocaleString()}
                </span>
              </p>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-2 rounded-xl border border-theme px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-theme hover:bg-theme-bg transition"
              >
                <Trash2 size={14} />
                Clear
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {items.map((item) => (
                <article key={item.id} className="rounded-2xl border border-theme bg-theme-surface overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
                  <div className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--c-brand)]">
                      {item.location}
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-theme line-clamp-2">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {item.durationDays} days | {item.currency} {Number(item.price || 0).toLocaleString()}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleMoveToCart(item)}
                        className="flex-1 rounded-xl bg-[var(--c-brand)] px-3 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-theme"
                      >
                        Add to Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id, item.title)}
                        className="rounded-xl border border-theme px-3 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-theme hover:bg-theme-bg"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-theme bg-theme-surface py-16 text-center text-muted">
            <Heart size={20} className="mx-auto mb-3 text-[var(--c-brand)]" />
            No wishlist items yet. Save tours from cards to see them here.
            <div className="mt-4">
              <Link to="/tours" className="text-[var(--c-brand)] font-semibold hover:underline">
                Browse Tours
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WishlistPage;
