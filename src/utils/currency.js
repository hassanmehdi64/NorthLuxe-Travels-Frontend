export const CURRENCY_OPTIONS = [
  { value: "PKR", label: "PKR - Pakistani Rupee" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "EUR", label: "EUR - Euro" },
];

export const displayCurrency = (currency) => {
  const normalized = String(currency || "").trim().toUpperCase();
  return CURRENCY_OPTIONS.find((item) => item.value === normalized)?.value || "PKR";
};

export const formatCurrencyAmount = (amount, currency = "PKR") =>
  `${displayCurrency(currency)} ${Number(amount || 0).toLocaleString()}`;
