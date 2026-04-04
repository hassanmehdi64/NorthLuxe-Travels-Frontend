export const SUPPORTED_PAYMENT_METHODS = [
  {
    key: "visa_card",
    label: "Debit Card",
    mode: "card",
    supportsPlan: true,
    defaultReferenceLabel: "",
  },
  {
    key: "easypaisa",
    label: "EasyPaisa",
    mode: "manual",
    supportsPlan: true,
    defaultReferenceLabel: "Transaction ID",
  },
  {
    key: "jazzcash",
    label: "JazzCash",
    mode: "manual",
    supportsPlan: true,
    defaultReferenceLabel: "Transaction ID",
  },
  {
    key: "bank_transfer",
    label: "Bank Transfer",
    mode: "manual",
    supportsPlan: true,
    defaultReferenceLabel: "Transfer Reference",
  },
  {
    key: "pay_on_arrival",
    label: "Pay on Arrival",
    mode: "arrival",
    supportsPlan: false,
    defaultReferenceLabel: "",
  },
];

export const FALLBACK_PAYMENT_METHODS = SUPPORTED_PAYMENT_METHODS.map((item, index) => ({
  key: item.key,
  label: item.label,
  active: index < 4 || item.key === "pay_on_arrival",
  accountKey: "",
  referenceLabel: item.defaultReferenceLabel,
  instructions: "",
}));

export const FALLBACK_RECEIVING_ACCOUNTS = [];

const methodMetaMap = Object.fromEntries(
  SUPPORTED_PAYMENT_METHODS.map((item) => [item.key, item]),
);

export const getPaymentMethodMeta = (key) =>
  methodMetaMap[key] || {
    key,
    label: key,
    mode: "manual",
    supportsPlan: true,
    defaultReferenceLabel: "Transaction Reference",
  };

export const ensurePaymentConfig = (settings = {}) => {
  const paymentConfig = settings.paymentConfig || {};
  const configuredMethods = Array.isArray(paymentConfig.methods) ? paymentConfig.methods : [];
  const configuredMethodMap = Object.fromEntries(
    configuredMethods
      .filter((item) => item?.key)
      .map((item) => [item.key, item]),
  );

  const methods = SUPPORTED_PAYMENT_METHODS.map((method) => {
    const configured = configuredMethodMap[method.key] || {};
    const legacyLabels = ["Visa / Card", "Debit / Credit Card"];
    return {
      key: method.key,
      label: configured.label && !legacyLabels.includes(configured.label) ? configured.label : method.label,
      active: configured.active !== false,
      accountKey: configured.accountKey || "",
      referenceLabel: configured.referenceLabel || method.defaultReferenceLabel,
      instructions: configured.instructions || "",
      mode: method.mode,
      supportsPlan: method.supportsPlan,
    };
  });

  const accounts = (Array.isArray(paymentConfig.accounts) ? paymentConfig.accounts : FALLBACK_RECEIVING_ACCOUNTS)
    .filter(Boolean)
    .map((item, index) => ({
      key: item.key || `account_${index + 1}`,
      label: item.label || `Account ${index + 1}`,
      accountTitle: item.accountTitle || "",
      accountNumber: item.accountNumber || "",
      bankName: item.bankName || "",
      contactNumber: item.contactNumber || "",
      iban: item.iban || "",
      branchCode: item.branchCode || "",
      swiftCode: item.swiftCode || "",
      beneficiaryAddress: item.beneficiaryAddress || "",
      instructions: item.instructions || "",
      active: item.active !== false,
    }));

  return {
    allowManualVerification: paymentConfig.allowManualVerification !== false,
    requireVerifiedPaymentForCard: paymentConfig.requireVerifiedPaymentForCard !== false,
    methods,
    accounts,
  };
};

export const getActivePaymentMethods = (settings = {}) =>
  ensurePaymentConfig(settings).methods.filter((item) => item.active !== false);

export const getReceivingAccountByKey = (settingsOrAccounts, accountKey) => {
  const accounts = Array.isArray(settingsOrAccounts)
    ? settingsOrAccounts
    : ensurePaymentConfig(settingsOrAccounts).accounts;

  return accounts.find((item) => item.key === accountKey && item.active !== false) || null;
};
