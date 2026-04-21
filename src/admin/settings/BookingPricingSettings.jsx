import { useEffect, useRef, useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import {
  SUPPORTED_PAYMENT_METHODS,
  ensurePaymentConfig,
} from "../../components/booking/paymentConfig";

const ensurePricingShape = (settings) => {
  const bookingPricing = settings.bookingPricing || {};
  return {
    dailyBaseFee: bookingPricing.dailyBaseFee ?? 0,
    perGuestDailyFee: bookingPricing.perGuestDailyFee ?? 0,
    mealsDailyRate: bookingPricing.mealsDailyRate ?? 0,
    insuranceRate: bookingPricing.insuranceRate ?? 0,
    airportTransferRate: bookingPricing.airportTransferRate ?? 0,
    hotelCategories: Array.isArray(bookingPricing.hotelCategories)
      ? bookingPricing.hotelCategories
      : [],
    vehicleTypes: Array.isArray(bookingPricing.vehicleTypes)
      ? bookingPricing.vehicleTypes
      : [],
  };
};

const numberInput = (value) => Number(value || 0);

const getManualMethodLinkState = (paymentConfig, method) => {
  if (method.mode !== "manual") {
    return { status: "not_required", account: null };
  }

  if (!method.accountKey) {
    return { status: "missing", account: null };
  }

  const matchedAccount = paymentConfig.accounts.find((item) => item.key === method.accountKey) || null;
  if (!matchedAccount) {
    return { status: "missing", account: null };
  }

  if (matchedAccount.active === false) {
    return { status: "inactive", account: matchedAccount };
  }

  return { status: "active", account: matchedAccount };
};

const createEmptyAccount = (index) => ({
  key: `account_${index + 1}`,
  label: `Account ${index + 1}`,
  accountTitle: "",
  accountNumber: "",
  bankName: "",
  contactNumber: "",
  iban: "",
  branchCode: "",
  swiftCode: "",
  beneficiaryAddress: "",
  instructions: "",
  active: true,
});

const getAccountCompletion = (account) => {
  const trackedFields = [
    account.label,
    account.accountTitle,
    account.accountNumber,
    account.bankName,
    account.contactNumber,
    account.branchCode,
    account.iban,
    account.instructions,
  ];

  return {
    completed: trackedFields.filter((value) => String(value || "").trim()).length,
    total: trackedFields.length,
  };
};

const SETTINGS_TABS = [
  { key: "methods", label: "Payments" },
  { key: "pricing", label: "Pricing" },
  { key: "hotels", label: "Hotels" },
  { key: "vehicles", label: "Vehicles" },
];

const ACCOUNT_DETAIL_TABS = [
  { key: "basic", label: "Basic" },
  { key: "extra", label: "Extra" },
  { key: "notes", label: "Notes" },
];

const SECTION_META = {
  methods: {
    title: "Payments",
    text: "Manage payment methods and receiving accounts.",
  },
  pricing: {
    title: "Pricing",
    text: "Update booking charges and core rate values.",
  },
  hotels: {
    title: "Hotels",
    text: "Edit hotel categories and their daily rates.",
  },
  vehicles: {
    title: "Vehicles",
    text: "Edit vehicle types and their daily rates.",
  },
};

const BookingPricingSettings = ({ settings, setSettings }) => {
  const pricing = ensurePricingShape(settings);
  const paymentConfig = ensurePaymentConfig(settings);
  const activeMethods = paymentConfig.methods.filter((item) => item.active !== false);
  const activeAccounts = paymentConfig.accounts.filter((item) => item.active !== false);
  const linkedManualMethods = activeMethods.filter(
    (item) => getManualMethodLinkState(paymentConfig, item).status === "active",
  );
  const unlinkedManualMethods = activeMethods.filter(
    (item) => item.mode === "manual" && getManualMethodLinkState(paymentConfig, item).status !== "active",
  );

  const [activeSettingsTab, setActiveSettingsTab] = useState("methods");
  const [selectedMethodKey, setSelectedMethodKey] = useState("");
  const [selectedAccountKey, setSelectedAccountKey] = useState("");
  const [activeAccountTab, setActiveAccountTab] = useState("basic");
  const [isMethodEditorOpen, setIsMethodEditorOpen] = useState(false);
  const [isAccountEditorOpen, setIsAccountEditorOpen] = useState(false);
  const methodEditorRef = useRef(null);
  const accountEditorRef = useRef(null);

  useEffect(() => {
    if (!paymentConfig.methods.length) {
      if (selectedMethodKey) setSelectedMethodKey("");
      return;
    }

    if (!paymentConfig.methods.some((item) => item.key === selectedMethodKey)) {
      setSelectedMethodKey(paymentConfig.methods[0].key);
    }
  }, [paymentConfig.methods, selectedMethodKey]);

  useEffect(() => {
    if (!paymentConfig.accounts.length) {
      if (selectedAccountKey) setSelectedAccountKey("");
      return;
    }

    if (!paymentConfig.accounts.some((item) => item.key === selectedAccountKey)) {
      setSelectedAccountKey(paymentConfig.accounts[0].key);
    }
  }, [paymentConfig.accounts, selectedAccountKey]);

  useEffect(() => {
    setActiveAccountTab("basic");
  }, [selectedAccountKey, isAccountEditorOpen]);

  useEffect(() => {
    if (!selectedMethodKey || !isMethodEditorOpen || !methodEditorRef.current) return;
    methodEditorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedMethodKey, isMethodEditorOpen]);

  useEffect(() => {
    if (!selectedAccountKey || !isAccountEditorOpen || !accountEditorRef.current) return;
    accountEditorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedAccountKey, isAccountEditorOpen]);

  const selectedAccountIndex = paymentConfig.accounts.findIndex((item) => item.key === selectedAccountKey);
  const selectedAccount = selectedAccountIndex >= 0 ? paymentConfig.accounts[selectedAccountIndex] : null;
  const selectedAccountLinkedMethods = selectedAccount
    ? paymentConfig.methods.filter((item) => item.accountKey === selectedAccount.key)
    : [];
  const selectedAccountCompletion = selectedAccount
    ? getAccountCompletion(selectedAccount)
    : { completed: 0, total: 0 };
  const selectedMethod = paymentConfig.methods.find((item) => item.key === selectedMethodKey) || null;
  const selectedMethodLinkState = selectedMethod
    ? getManualMethodLinkState(paymentConfig, selectedMethod)
    : { status: "not_required", account: null };

  const setPricingState = (updater) =>
    setSettings((prev) => {
      const currentPricing = ensurePricingShape(prev);
      return {
        ...prev,
        bookingPricing: updater(currentPricing),
      };
    });

  const updatePricing = (next) =>
    setPricingState((current) => ({
      ...current,
      ...next,
    }));

  const setPaymentConfigState = (updater) =>
    setSettings((prev) => {
      const currentPaymentConfig = ensurePaymentConfig(prev);
      return {
        ...prev,
        paymentConfig: updater(currentPaymentConfig),
      };
    });

  const updatePaymentConfig = (next) =>
    setPaymentConfigState((current) => ({
      ...current,
      ...next,
    }));

  const updateOption = (key, index, patch) =>
    setPricingState((current) => {
      const list = [...current[key]];
      list[index] = { ...list[index], ...patch };
      return {
        ...current,
        [key]: list,
      };
    });

  const addOption = (key, labelPrefix) =>
    setPricingState((current) => {
      const list = [...current[key]];
      list.push({
        key: `${labelPrefix}_${list.length + 1}`,
        label: `${labelPrefix} ${list.length + 1}`,
        dailyRate: 0,
        active: true,
      });
      return {
        ...current,
        [key]: list,
      };
    });

  const removeOption = (key, index) =>
    setPricingState((current) => {
      const list = [...current[key]];
      list.splice(index, 1);
      return {
        ...current,
        [key]: list,
      };
    });

  const updateMethod = (methodKey, patch) =>
    setPaymentConfigState((current) => ({
      ...current,
      methods: current.methods.map((item) =>
        item.key === methodKey ? { ...item, ...patch } : item,
      ),
    }));

  const updateAccount = (index, patch) =>
    setPaymentConfigState((current) => {
      const accounts = [...current.accounts];
      const currentAccount = accounts[index];
      if (!currentAccount) return current;

      const previousKey = currentAccount.key;
      const nextAccount = { ...currentAccount, ...patch };
      accounts[index] = nextAccount;

      const methods =
        patch.key !== undefined && previousKey !== nextAccount.key
          ? current.methods.map((item) =>
              item.accountKey === previousKey
                ? { ...item, accountKey: nextAccount.key }
                : item,
            )
          : current.methods;

      return {
        ...current,
        accounts,
        methods,
      };
    });
  const addAccount = () => {
    const nextKey = `account_${paymentConfig.accounts.length + 1}`;
    setPaymentConfigState((current) => ({
      ...current,
      accounts: [...current.accounts, createEmptyAccount(current.accounts.length)],
    }));
    setSelectedAccountKey(nextKey);
    setIsAccountEditorOpen(true);
    setActiveSettingsTab("methods");
  };

  const openMethodEditor = (methodKey) => {
    setSelectedMethodKey(methodKey);
    setIsMethodEditorOpen(true);
  };

  const openAccountEditor = (accountKey) => {
    setSelectedAccountKey(accountKey);
    setIsAccountEditorOpen(true);
  };
  const removeAccount = (index) => {
    const nextAccounts = paymentConfig.accounts.filter((_, itemIndex) => itemIndex !== index);
    const nextSelectedKey = nextAccounts[index]?.key || nextAccounts[index - 1]?.key || "";

    setPaymentConfigState((current) => {
      const accounts = [...current.accounts];
      const [removedAccount] = accounts.splice(index, 1);
      const methods = removedAccount?.key
        ? current.methods.map((item) =>
            item.accountKey === removedAccount.key ? { ...item, accountKey: "" } : item,
          )
        : current.methods;

      return {
        ...current,
        accounts,
        methods,
      };
    });

    setSelectedAccountKey(nextSelectedKey);
    setIsAccountEditorOpen(Boolean(nextSelectedKey));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(198,162,75,0.08))] px-4 py-4 md:px-5 md:py-4 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Payment Setup</p>
            <h2 className="text-lg font-black tracking-tight text-slate-950">Booking payments and account details</h2>
            <p className="text-sm text-slate-600">A smaller overview so you can focus on the tables below.</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            {[
              { label: "Methods", value: activeMethods.length },
              { label: "Details", value: activeAccounts.length },
              { label: "Linked", value: linkedManualMethods.length },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/80 bg-white/90 px-4 py-3 text-center shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
                <p className="mt-1 text-xl font-black tracking-tight text-slate-950">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-xl border px-4 py-3 text-sm ${unlinkedManualMethods.length ? "border-amber-200 bg-amber-50/90 text-amber-800" : "border-emerald-200 bg-emerald-50/90 text-emerald-700"}`}>
          {unlinkedManualMethods.length ? (
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <p className="font-medium">Manual methods still need account setup.</p>
              <div className="flex flex-wrap gap-2">
                {unlinkedManualMethods.map((item) => {
                  const linkState = getManualMethodLinkState(paymentConfig, item);
                  return (
                    <span key={item.key} className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-100">
                      {item.label} {linkState.status === "inactive" ? "(inactive)" : "(not linked)"}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="font-medium">All active manual payment methods are connected to an active account.</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {SETTINGS_TABS.map((tab) => (
          <div key={tab.key} className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() =>
                setActiveSettingsTab((current) => (current === tab.key ? "" : tab.key))
              }
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-slate-50/80"
            >
              <div>
                <p className="text-sm font-bold text-slate-900">{SECTION_META[tab.key]?.title || tab.label}</p>
                <p className="mt-1 text-xs text-slate-400">{SECTION_META[tab.key]?.text || ""}</p>
              </div>
              <ChevronDown
                size={18}
                className={`text-slate-400 transition-transform duration-200 ${
                  activeSettingsTab === tab.key ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        ))}
      </div>

                              {activeSettingsTab === "methods" ? (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <input
                type="checkbox"
                checked={paymentConfig.allowManualVerification !== false}
                onChange={(e) => updatePaymentConfig({ allowManualVerification: e.target.checked })}
              />
              Allow manual payment verification
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <input
                type="checkbox"
                checked={paymentConfig.requireVerifiedPaymentForCard !== false}
                onChange={(e) => updatePaymentConfig({ requireVerifiedPaymentForCard: e.target.checked })}
              />
              Require verified card payment before booking confirmation
            </label>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Payment Methods</h3>
                <p className="mt-1 text-xs font-medium text-slate-500">Everything is shown in a simple list. Use edit to update any method later.</p>
              </div>
            </div>

            <div className="hidden md:grid md:grid-cols-[minmax(0,1.3fr)_170px_minmax(0,1fr)_110px_90px] gap-4 border-b border-slate-100 px-5 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              <span>Method</span>
              <span>Type</span>
              <span>Setup</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-slate-100">
              {paymentConfig.methods.map((method) => {
                const linkState = getManualMethodLinkState(paymentConfig, method);
                const typeLabel = method.mode === "card" ? "Debit Card" : method.mode === "arrival" ? "Arrival" : "Manual Transfer";
                const setupLabel = method.mode === "manual"
                  ? linkState.status === "active"
                    ? linkState.account?.label || "Linked account"
                    : linkState.status === "inactive"
                      ? "Inactive account"
                      : "No linked account"
                  : method.mode === "card"
                    ? "Stripe"
                    : "No account needed";

                return (
                  <div key={method.key} className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(0,1.3fr)_170px_minmax(0,1fr)_110px_90px] md:items-center">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.08em] text-slate-900">{method.label}</p>
                      <p className="mt-1 text-xs text-slate-500">{method.referenceLabel || method.instructions || "No extra note"}</p>
                    </div>
                    <div className="text-sm font-semibold text-slate-700">{typeLabel}</div>
                    <div className="text-sm text-slate-600">{setupLabel}</div>
                    <div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${method.active !== false ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {method.active !== false ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => openMethodEditor(method.key)}
                        className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedMethod && isMethodEditorOpen ? (
            <div ref={methodEditorRef} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 space-y-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Edit Method</p>
                  <h4 className="mt-2 text-xl font-black tracking-tight text-slate-950">{selectedMethod.label}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedMethod.active !== false}
                      onChange={(e) => updateMethod(selectedMethod.key, { active: e.target.checked })}
                    />
                    Active
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsMethodEditorOpen(false)}
                    className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 md:col-span-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 px-1">Display Label</span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                    value={selectedMethod.label}
                    onChange={(e) => updateMethod(selectedMethod.key, { label: e.target.value })}
                  />
                </label>

                {selectedMethod.mode === "manual" ? (
                  <>
                    <label className="space-y-2">
                      <span className="text-[10px] font-black uppercase text-slate-400 px-1">Account</span>
                      <select
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                        value={selectedMethod.accountKey || ""}
                        onChange={(e) => updateMethod(selectedMethod.key, { accountKey: e.target.value })}
                      >
                        <option value="">No linked account</option>
                        {paymentConfig.accounts.map((account) => (
                          <option key={account.key} value={account.key}>
                            {account.label}{account.active === false ? " (inactive)" : ""}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-2">
                      <span className="text-[10px] font-black uppercase text-slate-400 px-1">Reference Label</span>
                      <input
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                        value={selectedMethod.referenceLabel || ""}
                        onChange={(e) => updateMethod(selectedMethod.key, { referenceLabel: e.target.value })}
                      />
                    </label>
                  </>
                ) : null}

                <label className="space-y-2 md:col-span-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 px-1">Customer Note</span>
                  <textarea
                    className="w-full min-h-[110px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                    value={selectedMethod.instructions || ""}
                    placeholder="Optional note shown to the customer for this payment method."
                    onChange={(e) => updateMethod(selectedMethod.key, { instructions: e.target.value })}
                  />
                </label>
              </div>
            </div>
          ) : null}

          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Payment Details</h3>
                <p className="mt-1 text-xs font-medium text-slate-500">Add or edit account details in the same list view.</p>
              </div>
              <button
                type="button"
                onClick={addAccount}
                className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold inline-flex items-center gap-2 text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-200 hover:text-slate-900"
              >
                <Plus size={14} /> Add Details
              </button>
            </div>

            {paymentConfig.accounts.length ? (
              <>
                <div className="hidden md:grid md:grid-cols-[minmax(0,1.1fr)_170px_minmax(0,1fr)_120px_90px_90px] gap-4 border-b border-slate-100 px-5 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  <span>Name</span>
                  <span>Bank / Wallet</span>
                  <span>Account Number</span>
                  <span>Methods</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {paymentConfig.accounts.map((account, index) => {
                    const linkedMethods = paymentConfig.methods.filter((item) => item.accountKey === account.key);

                    return (
                      <div key={`${account.key}-${index}`} className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(0,1.1fr)_170px_minmax(0,1fr)_120px_90px_90px] md:items-center">
                        <div>
                          <p className="text-sm font-black uppercase tracking-[0.08em] text-slate-900">{account.label || `Account ${index + 1}`}</p>
                          <p className="mt-1 text-xs text-slate-500">{account.accountTitle || "No title yet"}</p>
                        </div>
                        <div className="text-sm font-semibold text-slate-700">{account.bankName || "Not added"}</div>
                        <div className="text-sm text-slate-600 break-words">{account.accountNumber || "Not added"}</div>
                        <div className="text-sm text-slate-600">{linkedMethods.length}</div>
                        <div>
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${account.active !== false ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                            {account.active !== false ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => openAccountEditor(account.key)}
                            className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="px-5 py-8 text-sm text-slate-500">No payment details added yet. Use Add Details to create one.</div>
            )}
          </div>

          {selectedAccount && isAccountEditorOpen ? (
            <div ref={accountEditorRef} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 space-y-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Edit Details</p>
                  <h4 className="mt-2 text-xl font-black tracking-tight text-slate-950">{selectedAccount.label || "Payment Details"}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                    {selectedAccount.active !== false ? "Active" : "Inactive"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAccountEditorOpen(false)}
                    className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 px-1">Label</span>
                  <input
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                    value={selectedAccount.label}
                    onChange={(e) => updateAccount(selectedAccountIndex, { label: e.target.value })}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 px-1">Account Title</span>
                  <input
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                    value={selectedAccount.accountTitle || ""}
                    onChange={(e) => updateAccount(selectedAccountIndex, { accountTitle: e.target.value })}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 px-1">Account Number</span>
                  <input
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                    value={selectedAccount.accountNumber || ""}
                    onChange={(e) => updateAccount(selectedAccountIndex, { accountNumber: e.target.value })}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 px-1">Bank / Wallet</span>
                  <input
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                    value={selectedAccount.bankName || ""}
                    onChange={(e) => updateAccount(selectedAccountIndex, { bankName: e.target.value })}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 px-1">Contact Number</span>
                  <input
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                    value={selectedAccount.contactNumber || ""}
                    onChange={(e) => updateAccount(selectedAccountIndex, { contactNumber: e.target.value })}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 px-1">Branch / Wallet ID</span>
                  <input
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                    value={selectedAccount.branchCode || ""}
                    onChange={(e) => updateAccount(selectedAccountIndex, { branchCode: e.target.value })}
                  />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 px-1">Instructions</span>
                  <textarea
                    className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                    value={selectedAccount.instructions || ""}
                    onChange={(e) => updateAccount(selectedAccountIndex, { instructions: e.target.value })}
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedAccount.active !== false}
                    onChange={(e) => updateAccount(selectedAccountIndex, { active: e.target.checked })}
                  />
                  Keep active
                </label>
                <button
                  type="button"
                  onClick={() => removeAccount(selectedAccountIndex)}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-2 text-sm font-bold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-50"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

            {activeSettingsTab === "pricing" ? (
        <div className="space-y-5">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Pricing</h3>
              <p className="mt-1 text-xs font-medium text-slate-500">Set the main booking charges in one clean table.</p>
            </div>

            <div className="hidden md:grid md:grid-cols-[220px_minmax(0,1fr)_180px] gap-4 border-b border-slate-100 px-5 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              <span>Charge</span>
              <span>Description</span>
              <span>Rate</span>
            </div>

            <div className="divide-y divide-slate-100">
              {[
                {
                  key: "dailyBaseFee",
                  label: "Daily Base Fee",
                  description: "Base daily amount for the booking before add-ons.",
                  value: pricing.dailyBaseFee,
                },
                {
                  key: "perGuestDailyFee",
                  label: "Per Guest Daily Fee",
                  description: "Extra daily amount charged for each guest.",
                  value: pricing.perGuestDailyFee,
                },
                {
                  key: "mealsDailyRate",
                  label: "Meals Daily Rate",
                  description: "Daily meal charge added when meals are selected.",
                  value: pricing.mealsDailyRate,
                },
                {
                  key: "insuranceRate",
                  label: "Insurance (Per Guest)",
                  description: "Insurance amount charged per guest.",
                  value: pricing.insuranceRate,
                },
                {
                  key: "airportTransferRate",
                  label: "Airport Transfer Rate",
                  description: "One-time transfer charge added to the booking.",
                  value: pricing.airportTransferRate,
                },
              ].map((item) => (
                <div key={item.key} className="grid gap-3 px-5 py-4 md:grid-cols-[220px_minmax(0,1fr)_180px] md:items-center">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.08em] text-slate-900">{item.label}</p>
                  </div>
                  <div className="text-sm text-slate-600">{item.description}</div>
                  <div>
                    <input
                      type="number"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                      value={item.value}
                      onChange={(e) => updatePricing({ [item.key]: numberInput(e.target.value) })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

            {activeSettingsTab === "hotels" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Hotel Categories</h3>
              <p className="mt-1 text-xs font-medium text-slate-500">Manage hotel options in a labeled table.</p>
            </div>
            <button type="button" onClick={() => addOption("hotelCategories", "hotel")} className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold inline-flex items-center gap-2 text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-200 hover:text-slate-900">
              <Plus size={14} /> Add Hotel
            </button>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
            <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_160px_110px_90px] gap-4 border-b border-slate-100 px-5 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              <span>Key</span>
              <span>Label</span>
              <span>Daily Rate</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-slate-100">
              {pricing.hotelCategories.map((item, index) => (
                <div key={`${item.key}-${index}`} className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_160px_110px_90px] md:items-center">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 md:hidden">Key</span>
                    <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-100" value={item.key} onChange={(e) => updateOption("hotelCategories", index, { key: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 md:hidden">Label</span>
                    <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-100" value={item.label} onChange={(e) => updateOption("hotelCategories", index, { label: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 md:hidden">Daily Rate</span>
                    <input type="number" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-100" value={item.dailyRate} onChange={(e) => updateOption("hotelCategories", index, { dailyRate: numberInput(e.target.value) })} />
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input type="checkbox" checked={item.active !== false} onChange={(e) => updateOption("hotelCategories", index, { active: e.target.checked })} />
                    Active
                  </label>
                  <button type="button" onClick={() => removeOption("hotelCategories", index)} className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-50">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

            {activeSettingsTab === "vehicles" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Vehicle Types</h3>
              <p className="mt-1 text-xs font-medium text-slate-500">Manage vehicle options in a labeled table.</p>
            </div>
            <button type="button" onClick={() => addOption("vehicleTypes", "vehicle")} className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold inline-flex items-center gap-2 text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-200 hover:text-slate-900">
              <Plus size={14} /> Add Vehicle
            </button>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
            <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_160px_110px_90px] gap-4 border-b border-slate-100 px-5 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              <span>Key</span>
              <span>Label</span>
              <span>Daily Rate</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-slate-100">
              {pricing.vehicleTypes.map((item, index) => (
                <div key={`${item.key}-${index}`} className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_160px_110px_90px] md:items-center">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 md:hidden">Key</span>
                    <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-100" value={item.key} onChange={(e) => updateOption("vehicleTypes", index, { key: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 md:hidden">Label</span>
                    <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-100" value={item.label} onChange={(e) => updateOption("vehicleTypes", index, { label: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 md:hidden">Daily Rate</span>
                    <input type="number" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-100" value={item.dailyRate} onChange={(e) => updateOption("vehicleTypes", index, { dailyRate: numberInput(e.target.value) })} />
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input type="checkbox" checked={item.active !== false} onChange={(e) => updateOption("vehicleTypes", index, { active: e.target.checked })} />
                    Active
                  </label>
                  <button type="button" onClick={() => removeOption("vehicleTypes", index)} className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-50">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BookingPricingSettings;















