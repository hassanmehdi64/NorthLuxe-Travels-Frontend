import React from "react";
import { ChevronDown, ImageIcon, Palette } from "lucide-react";

const setField = (settings, setSettings, key, value) => {
  setSettings({ ...settings, [key]: value });
};

const setGroupField = (settings, setSettings, group, key, value) => {
  setSettings({
    ...settings,
    [group]: {
      ...(settings[group] || {}),
      [key]: value,
    },
  });
};

const Section = ({ title, icon: Icon, open, onToggle, children }) => (
  <div className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-sm">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-slate-50/80"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-500">
          <Icon size={18} />
        </span>
        <div>
          <p className="text-sm font-bold text-slate-900">{title}</p>
          <p className="text-xs text-slate-400">{open ? "Click to hide" : "Click to edit"}</p>
        </div>
      </div>
      <ChevronDown
        size={18}
        className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      />
    </button>
    {open ? <div className="border-t border-slate-100 px-5 py-5">{children}</div> : null}
  </div>
);

const AppearanceSettings = ({ settings, setSettings }) => {
  const [openSection, setOpenSection] = React.useState("hero-images");

  const toggleSection = (key) => {
    setOpenSection((current) => (current === key ? "" : key));
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
      <Section
        title="Logo And Favicon"
        icon={ImageIcon}
        open={openSection === "brand-files"}
        onToggle={() => toggleSection("brand-files")}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 px-1">Logo URL</label>
            <input
              className="w-full rounded-2xl bg-slate-50 p-4 font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
              value={settings.logoUrl || ""}
              onChange={(e) => setField(settings, setSettings, "logoUrl", e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 px-1">Favicon URL</label>
            <input
              className="w-full rounded-2xl bg-slate-50 p-4 font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
              value={settings.faviconUrl || ""}
              onChange={(e) => setField(settings, setSettings, "faviconUrl", e.target.value)}
              placeholder="https://example.com/favicon.png"
            />
          </div>
        </div>
      </Section>

      <Section
        title="Primary Brand Color"
        icon={Palette}
        open={openSection === "brand-color"}
        onToggle={() => toggleSection("brand-color")}
      >
        <div className="flex items-center gap-6">
          <input
            type="color"
            className="h-16 w-16 cursor-pointer rounded-2xl border-none bg-transparent"
            value={settings.primaryColor}
            onChange={(e) => setField(settings, setSettings, "primaryColor", e.target.value)}
          />
          <div className="rounded-2xl bg-slate-50 px-6 py-4 font-mono font-bold text-slate-600">
            {settings.primaryColor.toUpperCase()}
          </div>
        </div>
      </Section>

      <Section
        title="Hero Images"
        icon={ImageIcon}
        open={openSection === "hero-images"}
        onToggle={() => toggleSection("hero-images")}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 px-1">Home Hero Slider Images</label>
            <textarea
              rows="5"
              className="w-full resize-none rounded-2xl bg-slate-50 p-4 font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
              value={(settings.homeHeroImages || []).join("\n")}
              onChange={(e) =>
                setField(
                  settings,
                  setSettings,
                  "homeHeroImages",
                  e.target.value.split("\n").map((item) => item.trim()).filter(Boolean),
                )
              }
              placeholder="One image URL per line"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              ["tours", "Tours Hero Image"],
              ["about", "About Hero Image"],
              ["blog", "Blog Hero Image"],
              ["contact", "Contact Hero Image"],
            ].map(([key, label]) => (
              <div key={key} className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 px-1">{label}</label>
                <input
                  className="w-full rounded-2xl bg-slate-50 p-4 font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                  value={settings.pageHeroImages?.[key] || ""}
                  onChange={(e) => setGroupField(settings, setSettings, "pageHeroImages", key, e.target.value)}
                  placeholder="https://example.com/hero.jpg"
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section
        title="Hero Colors"
        icon={Palette}
        open={openSection === "hero-colors"}
        onToggle={() => toggleSection("hero-colors")}
      >
        <div className="grid grid-cols-1 gap-4">
          {[
            ["overlay", "Hero Dark Layer"],
            ["start", "Hero Gradient Start"],
            ["middle", "Hero Gradient Middle"],
            ["end", "Hero Gradient End"],
            ["homeStart", "Home Slider Overlay Start"],
            ["homeEnd", "Home Slider Overlay End"],
          ].map(([key, label]) => (
            <div key={key} className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 px-1">{label}</label>
              <input
                className="w-full rounded-2xl bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                value={settings.heroColors?.[key] || ""}
                onChange={(e) => setGroupField(settings, setSettings, "heroColors", key, e.target.value)}
                placeholder="rgba(7, 19, 38, 0.9)"
              />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Navbar Colors"
        icon={Palette}
        open={openSection === "navbar-colors"}
        onToggle={() => toggleSection("navbar-colors")}
      >
        <div className="grid grid-cols-1 gap-4">
          {[
            ["main", "Navbar Default"],
            ["scrolled", "Navbar Scrolled"],
            ["mobile", "Navbar Mobile Drawer"],
          ].map(([key, label]) => (
            <div key={key} className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 px-1">{label}</label>
              <input
                className="w-full rounded-2xl bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                value={settings.navbarColors?.[key] || ""}
                onChange={(e) => setGroupField(settings, setSettings, "navbarColors", key, e.target.value)}
                placeholder="rgba(9, 20, 41, 0.88)"
              />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default AppearanceSettings;
