
const GeneralSettings = ({ settings, setSettings }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 px-1">Site Title</label>
        <input 
          className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100" 
          value={settings.siteName}
          onChange={(e) => setSettings({...settings, siteName: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 px-1">Business Email</label>
        <input 
          className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100" 
          value={settings.siteEmail}
          onChange={(e) => setSettings({...settings, siteEmail: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 px-1">Hotline / WhatsApp</label>
        <input 
          className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100" 
          value={settings.sitePhone}
          onChange={(e) => setSettings({...settings, sitePhone: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 px-1">Currency</label>
        <select 
          className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
          value={settings.currency}
          onChange={(e) => setSettings({...settings, currency: e.target.value})}
        >
          <option value="PKR">PKR - Rupees</option>
          <option value="USD">USD - Dollars</option>
        </select>
      </div>
    </div>

    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-slate-400 px-1">Physical Address</label>
      <textarea 
        rows="2"
        className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100 resize-none" 
        value={settings.address}
        onChange={(e) => setSettings({...settings, address: e.target.value})}
      />
    </div>

    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
      <div>
        <h4 className="font-bold text-slate-900">Maintenance Mode</h4>
        <p className="text-xs text-slate-400">Lock the site for public users.</p>
      </div>
      <button 
        onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
        className={`w-14 h-8 rounded-full p-1 transition-all ${settings.maintenanceMode ? "bg-rose-500" : "bg-slate-200"}`}
      >
        <div className={`w-6 h-6 bg-white rounded-full shadow transition-all ${settings.maintenanceMode ? "translate-x-6" : "translate-x-0"}`} />
      </button>
    </div>
  </div>
);

export default GeneralSettings;