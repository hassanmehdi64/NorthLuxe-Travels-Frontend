import React, { useState } from "react";
import { Save, Globe, Palette, Eye, Shield, CreditCard, Mail } from "lucide-react";
import GeneralSettings from "./GeneralSettings";
import AppearanceSettings from "./AppearanceSettings";
import SEOSettings from "./SEOSettings";
import SecuritySettings from "./SecuritySettings";
import BookingPricingSettings from "./BookingPricingSettings";
import EmailSettings from "./EmailSettings";
import { useSettings, useUpdateSettings } from "../../hooks/useCms";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../lib/apiError";

const pick = (source, keys) =>
  keys.reduce((payload, key) => {
    payload[key] = source?.[key];
    return payload;
  }, {});

const toAbsoluteAssetUrl = (value) => {
  const item = String(value || "").trim();
  if (!item) return "";
  if (/^(https?:|data:)/i.test(item)) return item;

  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "";

  if (!origin) return item;
  if (item.startsWith("/")) return `${origin}${item}`;
  if (item.startsWith("./")) return `${origin}/${item.slice(2)}`;
  return `${origin}/${item.replace(/^\/+/, "")}`;
};

const normalizeImageSettingsPayload = (payload) => ({
  ...payload,
  logoUrl: toAbsoluteAssetUrl(payload.logoUrl),
  faviconUrl: toAbsoluteAssetUrl(payload.faviconUrl),
  homeHeroImages: Array.isArray(payload.homeHeroImages)
    ? payload.homeHeroImages.map(toAbsoluteAssetUrl).filter(Boolean)
    : [],
  pageHeroImages: Object.fromEntries(
    Object.entries(payload.pageHeroImages || {}).map(([key, value]) => [key, toAbsoluteAssetUrl(value)]),
  ),
});

const buildSettingsPayload = (settings, activeTab) => {
  if (activeTab === "General") {
    return pick(settings, [
      "siteName",
      "siteTagline",
      "siteEmail",
      "supportEmail",
      "sitePhone",
      "whatsappNumber",
      "address",
      "businessHours",
      "googleMapUrl",
      "currency",
      "maintenanceMode",
    ]);
  }

  if (activeTab === "Appearance") {
    return normalizeImageSettingsPayload(pick(settings, [
      "logoUrl",
      "faviconUrl",
      "homeHeroImages",
      "pageHeroImages",
    ]));
  }

  if (activeTab === "Pricing") {
    return pick(settings, ["bookingPricing", "paymentConfig"]);
  }

  if (activeTab === "SEO") {
    return pick(settings, ["seoTitle", "seoDescription", "socialLinks"]);
  }

  return settings;
};

const mergeSettingsAfterSave = (previous, savedSettings, payload) => ({
  ...(previous || {}),
  ...(savedSettings || {}),
  ...(payload || {}),
  pageHeroImages: {
    ...(previous?.pageHeroImages || {}),
    ...(savedSettings?.pageHeroImages || {}),
    ...(payload?.pageHeroImages || {}),
  },
});

const SiteSettings = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [isSaving, setIsSaving] = useState(false);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const { data, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const toast = useToast();
  const [settings, setSettings] = useState(null);

  React.useEffect(() => {
    if (data && !hasLocalChanges && !isSaving) setSettings(data);
  }, [data, hasLocalChanges, isSaving]);

  const updateDraft = (nextSettingsOrUpdater) => {
    setHasLocalChanges(true);
    setSettings((current) =>
      typeof nextSettingsOrUpdater === "function" ? nextSettingsOrUpdater(current) : nextSettingsOrUpdater,
    );
  };

  const handleSave = () => {
    const payload = buildSettingsPayload(settings, activeTab);

    setIsSaving(true);
    updateSettings.mutate(payload, {
      onSuccess: (savedSettings) => {
        setSettings((previous) => mergeSettingsAfterSave(previous, savedSettings, payload));
        setHasLocalChanges(false);
        toast.success("Settings updated", `${activeTab} settings have been saved.`);
      },
      onError: (error) => {
        toast.error("Save failed", getApiErrorMessage(error, "Could not update settings."));
      },
      onSettled: () => {
        setIsSaving(false);
      },
    });
  };

  const tabs = [
    { id: "General", icon: <Globe size={18} />, label: "General" },
    { id: "Appearance", icon: <Palette size={18} />, label: "Branding" },
    { id: "Pricing", icon: <CreditCard size={18} />, label: "Payments & Pricing" },
    { id: "Email", icon: <Mail size={18} />, label: "Email" },
    { id: "SEO", icon: <Eye size={18} />, label: "SEO & Social" },
    { id: "Security", icon: <Shield size={18} />, label: "Security" },
  ];

  if (isLoading || !settings) {
    return <div className="text-slate-500">Loading settings...</div>;
  }

  return (
    <div className="max-w-6xl space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900 xl:text-3xl">
            Site Settings
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage branding, booking pricing, and customer payment setup.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-bold text-sm shadow-xl hover:bg-blue-600 transition-all disabled:opacity-50"
        >
          <Save size={18} /> {isSaving ? "Saving..." : `Save ${activeTab} Changes`}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-[1.5rem] font-bold text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-md border border-slate-100"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm min-h-[500px]">
          {activeTab === "General" && (
            <GeneralSettings settings={settings} setSettings={updateDraft} />
          )}
          {activeTab === "Appearance" && (
            <AppearanceSettings settings={settings} setSettings={updateDraft} />
          )}
          {activeTab === "Pricing" && (
            <BookingPricingSettings settings={settings} setSettings={updateDraft} />
          )}
          {activeTab === "Email" && <EmailSettings />}
          {activeTab === "SEO" && (
            <SEOSettings settings={settings} setSettings={updateDraft} />
          )}
          {activeTab === "Security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;
