import React, { useState } from "react";
import { X, Upload, Image as ImageIcon, Check } from "lucide-react";

const UploadMedia = ({ isOpen, onClose, onUpload }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("Nature");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    onUpload({
      title: title || "Untitled",
      category,
      url,
    });

    setTitle("");
    setUrl("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-900">Upload Media</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dropzone */}
          <div
            className={`relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all ${url ? "border-secondary bg-secondary/5" : "border-slate-200 hover:border-slate-300 bg-slate-50"}`}
          >
            {url ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                <img
                  src={url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setUrl("");
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-full shadow-lg"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 mb-4">
                  <Upload size={32} />
                </div>
                <p className="text-sm font-bold text-slate-600">Paste image URL below</p>
                <p className="text-xs text-slate-400 mt-1">Store CDN/public image URLs</p>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-4 w-full p-3 rounded-xl border border-slate-200"
                />
              </>
            )}
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block px-1">
              Media Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Hunza Valley"
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block px-1">
              Select Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Nature", "Hotels", "Adventure"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-3 rounded-2xl text-xs font-bold transition-all border ${category === cat ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200" : "bg-white text-slate-500 border-slate-100 hover:border-slate-200"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!url}
              className="flex-1 py-4 rounded-2xl font-bold bg-secondary text-white shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
            >
              Start Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMedia;
