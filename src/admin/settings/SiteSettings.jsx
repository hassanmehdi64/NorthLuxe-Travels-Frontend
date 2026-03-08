import React, { useState } from "react";
import { Save, Globe, Palette, Eye, Shield, Phone } from "lucide-react";
import GeneralSettings from "./GeneralSettings";
import AppearanceSettings from "./AppearanceSettings";
import SEOSettings from "./SEOSettings";
import SecuritySettings from "./SecuritySettings";
import BookingPricingSettings from "./BookingPricingSettings";
import { useSettings, useUpdateSettings } from "../../hooks/useCms";

const SiteSettings = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [isSaving, setIsSaving] = useState(false);
  const { data, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [settings, setSettings] = useState(null);

  React.useEffect(() => {
    if (data) setSettings(data);
  }, [data]);

  const handleSave = () => {
    setIsSaving(true);
    updateSettings.mutate(settings, {
      onSettled: () => {
      setIsSaving(false);
      },
    });
  };

  const tabs = [
    { id: "General", icon: <Globe size={18} />, label: "General" },
    { id: "Appearance", icon: <Palette size={18} />, label: "Branding" },
    { id: "Pricing", icon: <Phone size={18} />, label: "Booking Pricing" },
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
          <h1 className=" text-xl xl:3xl font-black text-slate-900 tracking-tighter uppercase">
            Site Settings
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage your brand identity and platform core.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-bold text-sm shadow-xl hover:bg-blue-600 transition-all disabled:opacity-50"
        >
          <Save size={18} /> {isSaving ? "Saving..." : "Save All Changes"}
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
            <GeneralSettings settings={settings} setSettings={setSettings} />
          )}
          {activeTab === "Appearance" && (
            <AppearanceSettings settings={settings} setSettings={setSettings} />
          )}
          {activeTab === "Pricing" && (
            <BookingPricingSettings settings={settings} setSettings={setSettings} />
          )}
          {activeTab === "SEO" && (
            <SEOSettings settings={settings} setSettings={setSettings} />
          )}
          {activeTab === "Security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;
