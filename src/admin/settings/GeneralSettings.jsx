import { CheckCircle2, Clock3, Globe2, Mail, MapPin, Phone, Power, RefreshCw } from "lucide-react";

const setField = (settings, setSettings, key, value) => {
  setSettings({ ...settings, [key]: value });
};

const TextField = ({ label, value, onChange, type = "text", placeholder = "" }) => (
  <div className="space-y-2">
    <label className="px-1 text-[10px] font-black uppercase text-slate-400">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-900 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder = "", rows = 3 }) => (
  <div className="space-y-2">
    <label className="px-1 text-[10px] font-black uppercase text-slate-400">{label}</label>
    <textarea
      rows={rows}
      placeholder={placeholder}
      className="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-900 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Section = ({ icon: Icon, title, children }) => (
  <section className="space-y-5 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Icon size={18} />
      </div>
      <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">{title}</h3>
    </div>
    {children}
  </section>
);

const ToggleOption = ({ checked, title, description, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-blue-100 hover:bg-white"
  >
    <div>
      <p className="text-sm font-black text-slate-900">{title}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{description}</p>
    </div>
    <span className={`flex h-8 w-14 shrink-0 rounded-full p-1 transition ${checked ? "bg-rose-500" : "bg-slate-200"}`}>
      <span className={`h-6 w-6 rounded-full bg-white shadow transition ${checked ? "translate-x-6" : "translate-x-0"}`} />
    </span>
  </button>
);

const QuickAction = ({ icon: Icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-xs font-black text-slate-700 shadow-sm transition hover:border-blue-100 hover:text-blue-600"
  >
    <Icon size={15} />
    {label}
  </button>
);

const GeneralSettings = ({ settings, setSettings }) => {
  const supportEmail = settings.supportEmail || settings.siteEmail || "";
  const whatsappNumber = settings.whatsappNumber || settings.sitePhone || "";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <Section icon={Globe2} title="Website Details">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <TextField
            label="Site Title"
            value={settings.siteName}
            onChange={(value) => setField(settings, setSettings, "siteName", value)}
            placeholder="North Luxe Travels"
          />
          <TextField
            label="Site Tagline"
            value={settings.siteTagline}
            onChange={(value) => setField(settings, setSettings, "siteTagline", value)}
            placeholder="Premium tours across Gilgit-Baltistan."
          />
          <div className="space-y-2">
            <label className="px-1 text-[10px] font-black uppercase text-slate-400">Currency</label>
            <select
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-900 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50"
              value={settings.currency || "PKR"}
              onChange={(e) => setField(settings, setSettings, "currency", e.target.value)}
            >
              <option value="PKR">PKR - Pakistani Rupee</option>
              <option value="USD">USD - US Dollar</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>
        </div>
      </Section>

      <Section icon={Phone} title="Contact Details">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <TextField
            label="Business Email"
            type="email"
            value={settings.siteEmail}
            onChange={(value) => setField(settings, setSettings, "siteEmail", value)}
            placeholder="info@northluxetravels.com"
          />
          <TextField
            label="Support Email"
            type="email"
            value={settings.supportEmail}
            onChange={(value) => setField(settings, setSettings, "supportEmail", value)}
            placeholder="support@northluxetravels.com"
          />
          <TextField
            label="Hotline / Phone"
            value={settings.sitePhone}
            onChange={(value) => setField(settings, setSettings, "sitePhone", value)}
            placeholder="+92 300 1234567"
          />
          <TextField
            label="WhatsApp Number"
            value={settings.whatsappNumber}
            onChange={(value) => setField(settings, setSettings, "whatsappNumber", value)}
            placeholder="+92 300 1234567"
          />
          <TextField
            label="Business Hours"
            value={settings.businessHours}
            onChange={(value) => setField(settings, setSettings, "businessHours", value)}
            placeholder="Monday to Saturday, 9:00 AM to 7:00 PM"
          />
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          <QuickAction
            icon={Mail}
            label="Use business email for support"
            onClick={() => setField(settings, setSettings, "supportEmail", settings.siteEmail || "")}
          />
          <QuickAction
            icon={Phone}
            label="Use phone as WhatsApp"
            onClick={() => setField(settings, setSettings, "whatsappNumber", settings.sitePhone || "")}
          />
          <QuickAction
            icon={Clock3}
            label="Set default hours"
            onClick={() => setField(settings, setSettings, "businessHours", "Monday to Saturday, 9:00 AM to 7:00 PM")}
          />
        </div>
      </Section>

      <Section icon={MapPin} title="Location Details">
        <TextAreaField
          label="Physical Address"
          value={settings.address}
          onChange={(value) => setField(settings, setSettings, "address", value)}
          placeholder="Main Chowk Danyore, Gilgit-Baltistan"
        />
        <TextField
          label="Google Map URL"
          value={settings.googleMapUrl}
          onChange={(value) => setField(settings, setSettings, "googleMapUrl", value)}
          placeholder="https://www.google.com/maps?q=Skardu&output=embed"
        />
        <div className="flex flex-wrap gap-3">
          <QuickAction
            icon={MapPin}
            label="Build map from address"
            onClick={() => {
              const query = encodeURIComponent(settings.address || "Skardu, Gilgit-Baltistan");
              setField(settings, setSettings, "googleMapUrl", `https://www.google.com/maps?q=${query}&output=embed`);
            }}
          />
          <QuickAction
            icon={RefreshCw}
            label="Reset map"
            onClick={() => setField(settings, setSettings, "googleMapUrl", "https://www.google.com/maps?q=Skardu&output=embed")}
          />
        </div>
      </Section>

      <Section icon={Power} title="General Options">
        <ToggleOption
          checked={Boolean(settings.maintenanceMode)}
          title={settings.maintenanceMode ? "Maintenance mode is on" : "Maintenance mode is off"}
          description="When enabled, public users see the maintenance experience while admins can continue working."
          onChange={(value) => setField(settings, setSettings, "maintenanceMode", value)}
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-emerald-700">
              <CheckCircle2 size={16} />
              <p className="text-xs font-black uppercase">Public contact</p>
            </div>
            <p className="text-sm font-bold text-slate-800">{settings.sitePhone || "Phone not set"}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">{supportEmail || "Email not set"}</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-blue-700">
              <CheckCircle2 size={16} />
              <p className="text-xs font-black uppercase">WhatsApp contact</p>
            </div>
            <p className="text-sm font-bold text-slate-800">{whatsappNumber || "WhatsApp not set"}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Shown anywhere WhatsApp contact is used.</p>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default GeneralSettings;
