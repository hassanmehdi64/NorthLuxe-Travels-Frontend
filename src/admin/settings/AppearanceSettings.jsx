import React from "react";
import { Upload, ImageIcon } from "lucide-react";

const AppearanceSettings = ({ settings, setSettings }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Logo Upload */}
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase text-slate-400 px-1">
          Site Logo
        </label>
        <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
          <Upload size={24} className="mx-auto text-slate-300 mb-2" />
          <p className="text-xs font-bold text-slate-500">
            Click to upload PNG
          </p>
        </div>
      </div>

      {/* Favicon Upload */}
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase text-slate-400 px-1">
          Favicon
        </label>
        <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
          <ImageIcon size={24} className="mx-auto text-slate-300 mb-2" />
          <p className="text-xs font-bold text-slate-500">Upload 32x32px</p>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <label className="text-[10px] font-black uppercase text-slate-400 px-1">
        Primary Brand Color
      </label>
      <div className="flex items-center gap-6">
        <input
          type="color"
          className="w-16 h-16 rounded-2xl cursor-pointer border-none bg-transparent"
          value={settings.primaryColor}
          onChange={(e) =>
            setSettings({ ...settings, primaryColor: e.target.value })
          }
        />
        <div className="bg-slate-50 px-6 py-4 rounded-2xl font-mono font-bold text-slate-600">
          {settings.primaryColor.toUpperCase()}
        </div>
      </div>
    </div>
  </div>
);

export default AppearanceSettings;
