export const displayCurrency = (currency) => {
  return "PKR";
};

export const formatCurrencyAmount = (amount, currency = "PKR") =>
  `${displayCurrency(currency)} ${Number(amount || 0).toLocaleString()}`;
