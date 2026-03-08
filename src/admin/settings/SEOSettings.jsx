import React from "react";
import { Share2 } from "lucide-react";

const SEOSettings = ({ settings, setSettings }) => {
  return (
    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
            Meta Title
          </label>
          <input
            type="text"
            value={settings.seoTitle}
            onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
            className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-100"
          />
          <p className="text-[10px] text-slate-400 font-medium px-1">
            Ideal length: 50-60 characters
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
            Meta Description
          </label>
          <textarea
            rows="3"
            className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-100 resize-none"
            value={settings.seoDescription}
            onChange={(e) =>
              setSettings({ ...settings, seoDescription: e.target.value })
            }
          ></textarea>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-50 space-y-6">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Share2 size={18} className="text-blue-500" /> Social Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["facebook", "instagram", "whatsapp", "twitter"].map((platform) => (
            <div key={platform} className="relative">
              <input
                type="text"
                placeholder={`${platform} URL`}
                value={settings.socialLinks?.[platform] || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: {
                      ...settings.socialLinks,
                      [platform]: e.target.value,
                    },
                  })
                }
                className="w-full p-4 pl-12 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 focus:ring-blue-100"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                {platform.charAt(0)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SEOSettings;
