import { loadStripe } from "@stripe/stripe-js";

export const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";
export const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;
