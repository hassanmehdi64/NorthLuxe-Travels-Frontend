import { Link } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import FeaturePageHeader from "../../components/features/FeaturePageHeader";
import { clearCart, getCart, removeFromCart } from "../../features/commerce/storage";
import { useToast } from "../../context/ToastContext";

const CartPage = () => {
  const [items, setItems] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const sync = () => setItems(getCart());
    sync();
    window.addEventListener("ql-cart-updated", sync);
    return () => window.removeEventListener("ql-cart-updated", sync);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price || 0), 0),
    [items],
  );

  const handleRemove = (id, title) => {
    removeFromCart(id);
    setItems(getCart());
    toast.info("Removed from cart", `${title} removed.`);
  };

  const handleClear = () => {
    clearCart();
    setItems([]);
    toast.info("Cart cleared", "All items were removed.");
  };

  return (
    <section className="py-20 bg-theme-bg min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturePageHeader
          eyebrow="Checkout Queue"
          title="Your"
          highlight="Cart"
          description="Review selected tours before continuing to booking and final confirmation."
        />

        {items.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <article key={item.id} className="rounded-2xl border border-theme bg-theme-surface p-4 flex gap-4">
                  <img src={item.image} alt={item.title} className="h-24 w-32 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--c-brand)]">
                      {item.location}
                    </p>
                    <h3 className="text-base font-bold text-theme line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-muted mt-1">
                      {item.durationDays} days | {item.currency} {Number(item.price || 0).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id, item.title)}
                    className="self-start rounded-xl border border-theme px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-theme hover:bg-theme-bg"
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>

            <aside className="rounded-2xl border border-theme bg-theme-surface p-5 h-fit">
              <h3 className="text-lg font-bold text-theme">Order Summary</h3>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Items</span>
                  <span>{items.length}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>PKR {subtotal.toLocaleString()}</span>
                </div>
              </div>
              <div className="my-4 border-t border-theme" />
              <div className="flex justify-between font-bold text-theme">
                <span>Total</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>
              <Link
                to="/book"
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[var(--c-brand)] px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-theme"
              >
                Proceed to Booking
              </Link>
              <button
                type="button"
                onClick={handleClear}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-theme px-4 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-theme hover:bg-theme-bg"
              >
                <Trash2 size={14} />
                Clear Cart
              </button>
            </aside>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-theme bg-theme-surface py-16 text-center text-muted">
            <ShoppingBag size={20} className="mx-auto mb-3 text-[var(--c-brand)]" />
            Your cart is empty. Add tours from cards to continue.
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

export default CartPage;
