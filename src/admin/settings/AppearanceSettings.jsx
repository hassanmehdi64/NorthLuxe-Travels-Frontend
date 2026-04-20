import React from "react";
import { ChevronDown, ImageIcon, Palette, Upload, X } from "lucide-react";

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

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });

const splitLines = (value) =>
  String(value || "")
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const appendUnique = (items, nextItems) => Array.from(new Set([...items, ...nextItems].filter(Boolean)));

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

const ImagePreview = ({ src, label, onRemove }) => {
  if (!src) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
      <img src={src} alt={label} className="h-28 w-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
        aria-label={`Remove ${label}`}
      >
        <X size={15} />
      </button>
    </div>
  );
};

const SingleImageField = ({ label, value, onChange, placeholder }) => {
  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const uploaded = await readFileAsDataUrl(file);
    onChange(uploaded);
    event.target.value = "";
  };

  return (
    <div className="space-y-3">
      <label className="px-1 text-[10px] font-black uppercase text-slate-400">{label}</label>
      <input
        className="w-full rounded-2xl bg-slate-50 p-4 font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-xs font-black text-slate-700 shadow-sm transition hover:border-blue-100 hover:text-blue-600">
          <Upload size={15} />
          Upload Image
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      </div>
      <ImagePreview src={value} label={label} onRemove={() => onChange("")} />
    </div>
  );
};

const ImageListField = ({ label, value, onChange, placeholder }) => {
  const images = Array.isArray(value) ? value.filter(Boolean) : splitLines(value);

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const uploaded = await Promise.all(files.map(readFileAsDataUrl));
    onChange(appendUnique(images, uploaded));
    event.target.value = "";
  };

  const removeImage = (target) => {
    onChange(images.filter((item) => item !== target));
  };

  return (
    <div className="space-y-3">
      <label className="px-1 text-[10px] font-black uppercase text-slate-400">{label}</label>
      <textarea
        rows="5"
        className="w-full resize-none rounded-2xl bg-slate-50 p-4 font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
        value={images.join("\n")}
        onChange={(e) => onChange(splitLines(e.target.value))}
        placeholder={placeholder}
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-xs font-black text-slate-700 shadow-sm transition hover:border-blue-100 hover:text-blue-600">
          <Upload size={15} />
          Upload Images
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
        </label>
        <p className="text-xs font-semibold text-slate-400">Use image URLs or upload files from your device.</p>
      </div>
      {images.length ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {images.map((image, index) => (
            <ImagePreview
              key={`${image.slice(0, 30)}-${index}`}
              src={image}
              label={`${label} ${index + 1}`}
              onRemove={() => removeImage(image)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

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
          <SingleImageField
            label="Logo"
            value={settings.logoUrl || ""}
            onChange={(value) => setField(settings, setSettings, "logoUrl", value)}
            placeholder="https://example.com/logo.png or /logo.png"
          />
          <SingleImageField
            label="Favicon"
            value={settings.faviconUrl || ""}
            onChange={(value) => setField(settings, setSettings, "faviconUrl", value)}
            placeholder="https://example.com/favicon.png or /favicon.png"
          />
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
          <ImageListField
            label="Home Hero Slider Images"
            value={settings.homeHeroImages || []}
            onChange={(value) => setField(settings, setSettings, "homeHeroImages", value)}
            placeholder="One image URL per line"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              ["tours", "Tours Hero Image"],
              ["about", "About Hero Image"],
              ["blog", "Blog Hero Image"],
              ["contact", "Contact Hero Image"],
            ].map(([key, label]) => (
              <SingleImageField
                key={key}
                label={label}
                value={settings.pageHeroImages?.[key] || ""}
                onChange={(value) => setGroupField(settings, setSettings, "pageHeroImages", key, value)}
                placeholder="https://example.com/hero.jpg or /hero.jpg"
              />
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
            ["navbarTextColor", "Navbar Text"],
            ["navbarMutedTextColor", "Navbar Muted Text"],
            ["navbarActiveTextColor", "Navbar Active Text"],
          ].map(([key, label]) => (
            <div key={key} className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 px-1">{label}</label>
              <div className="flex gap-3">
                <input
                  className="w-full rounded-2xl bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                  value={key.startsWith("navbar") ? settings[key] || "" : settings.navbarColors?.[key] || ""}
                  onChange={(e) =>
                    key.startsWith("navbar")
                      ? setField(settings, setSettings, key, e.target.value)
                      : setGroupField(settings, setSettings, "navbarColors", key, e.target.value)
                  }
                  placeholder={key.startsWith("navbar") ? "#ffffff" : "#1F7630"}
                />
                <input
                  type="color"
                  className="h-14 w-16 shrink-0 cursor-pointer rounded-2xl border border-slate-100 bg-slate-50 p-1"
                  value={
                    /^#[0-9a-f]{6}$/i.test((key.startsWith("navbar") ? settings[key] : settings.navbarColors?.[key]) || "")
                      ? key.startsWith("navbar") ? settings[key] : settings.navbarColors[key]
                      : "#ffffff"
                  }
                  onChange={(e) =>
                    key.startsWith("navbar")
                      ? setField(settings, setSettings, key, e.target.value)
                      : setGroupField(settings, setSettings, "navbarColors", key, e.target.value)
                  }
                  title={`Pick ${label}`}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Footer Colors"
        icon={Palette}
        open={openSection === "footer-colors"}
        onToggle={() => toggleSection("footer-colors")}
      >
        <div className="grid grid-cols-1 gap-4">
          {[
            ["background", "Footer Background"],
            ["text", "Footer Text"],
            ["mutedText", "Footer Muted Text"],
            ["accentText", "Footer Accent Text"],
          ].map(([key, label]) => (
            <div key={key} className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 px-1">{label}</label>
              <div className="flex gap-3">
                <input
                  className="w-full rounded-2xl bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                  value={settings.footerColors?.[key] || ""}
                  onChange={(e) => setGroupField(settings, setSettings, "footerColors", key, e.target.value)}
                  placeholder={key === "background" ? "#1F7630" : "#ffffff"}
                />
                <input
                  type="color"
                  className="h-14 w-16 shrink-0 cursor-pointer rounded-2xl border border-slate-100 bg-slate-50 p-1"
                  value={
                    /^#[0-9a-f]{6}$/i.test(settings.footerColors?.[key] || "")
                      ? settings.footerColors[key]
                      : "#ffffff"
                  }
                  onChange={(e) => setGroupField(settings, setSettings, "footerColors", key, e.target.value)}
                  title={`Pick ${label}`}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default AppearanceSettings;
