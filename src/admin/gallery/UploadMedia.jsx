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
      <div className="admin-soft-dialog relative w-full max-w-md overflow-hidden p-5 animate-in fade-in zoom-in duration-200 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="admin-soft-heading text-xl font-black">Upload</h2>
          <button
            onClick={onClose}
            className="admin-soft-icon-button !h-8 !w-8"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Dropzone */}
          <div
            className={`relative flex flex-col items-center justify-center rounded-[1.25rem] border border-dashed p-5 transition-all ${url ? "border-[var(--c-brand)] bg-[var(--c-brand)]/6" : "border-slate-200 bg-slate-50 hover:border-[var(--c-brand)]/35"}`}
          >
            {url ? (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1rem]">
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
                  className="admin-soft-icon-button absolute right-2 top-2 !h-7 !w-7 !bg-rose-500 !text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="mb-3 rounded-2xl bg-white p-3 text-[var(--c-brand)] shadow-sm">
                  <Upload size={22} />
                </div>
                <p className="text-sm font-bold text-slate-700">Paste image URL below</p>
                <p className="mt-1 text-xs text-slate-400">Store CDN/public image URLs</p>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-4 w-full rounded-xl p-2.5 text-sm"
                />
              </>
            )}
          </div>
          <div>
            <label className="admin-soft-label mb-3 block px-1">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Hunza Valley"
              className="w-full rounded-xl p-2.5 text-xs font-bold"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="admin-soft-label mb-3 block px-1">
              Select Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Nature", "Hotels", "Adventure"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-xl border py-2 text-[10px] font-bold uppercase tracking-[0.14em] transition-all ${category === cat ? "border-[var(--c-brand)] bg-[var(--c-brand)] text-white shadow-[0_10px_20px_rgba(32,183,122,0.18)]" : "bg-white text-slate-500 border-slate-100 hover:border-[var(--c-brand)]/25"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="admin-soft-button-ghost flex-1 px-4 py-2 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!url}
              className="admin-soft-button flex-1 px-4 py-2 text-xs disabled:opacity-50 disabled:hover:translate-y-0"
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
