import React, { useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  MoreVertical,
} from "lucide-react";
import {
  useCreateGalleryItem,
  useDeleteGalleryItem,
  useGallery,
  useUpdateGalleryItem,
} from "../../hooks/useCms";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../lib/apiError";

const initialForm = {
  title: "",
  url: "",
  category: "Nature",
  alt: "",
};

const GalleryList = () => {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(initialForm);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: galleryItems = [] } = useGallery();
  const createGallery = useCreateGalleryItem();
  const updateGallery = useUpdateGalleryItem();
  const deleteGallery = useDeleteGalleryItem();
  const categories = ["All", ...new Set(galleryItems.map((item) => item.category))];

  const resetForm = () => {
    setForm(initialForm);
    setEditingId("");
    setIsFormOpen(false);
  };

  const addNewImage = async (event) => {
    event.preventDefault();
    if (!form.url.trim()) return;

    const payload = {
      title: form.title.trim() || "Untitled",
      category: form.category,
      url: form.url.trim(),
      alt: form.alt.trim(),
    };

    try {
      if (editingId) {
        await updateGallery.mutateAsync({ id: editingId, ...payload });
        toast.success("Media updated", "Gallery item updated successfully.");
      } else {
        await createGallery.mutateAsync(payload);
        toast.success("Media created", "Gallery item added successfully.");
      }
      resetForm();
    } catch (error) {
      toast.error("Save failed", getApiErrorMessage(error, "Could not save gallery item."));
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      url: item.url || "",
      category: item.category || "Nature",
      alt: item.alt || "",
    });
    setIsFormOpen(true);
  };

  const deleteImage = (id) => {
    deleteGallery.mutate(id, {
      onSuccess: () => toast.success("Media deleted", "Gallery item removed."),
      onError: (error) =>
        toast.error("Delete failed", getApiErrorMessage(error, "Could not delete gallery item.")),
    });
  };

  const handleLocalFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      alert("Please select an image smaller than 2MB.");
      event.target.value = "";
      return;
    }

    setIsReadingFile(true);
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        url: typeof reader.result === "string" ? reader.result : prev.url,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
      }));
      setIsReadingFile(false);
      event.target.value = "";
    };
    reader.onerror = () => {
      setIsReadingFile(false);
      event.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className=" text-xl xl:3xl font-black text-slate-900 tracking-tighter uppercase">
            Gallery Management
          </h1>
          <p className="text-sm font-bold text-slate-400">
            Manage high-quality visuals for your landing page.
          </p>
        </div>

        <button
          onClick={() => {
            if (isFormOpen) {
              resetForm();
              return;
            }
            setEditingId("");
            setForm(initialForm);
            setIsFormOpen(true);
          }}
          className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
        >
          <Plus size={18} /> {isFormOpen ? "Close Form" : "Add New Media"}
        </button>
      </div>

      {isFormOpen ? (
        <form
          onSubmit={addNewImage}
          className="bg-white rounded-[2.5rem] border border-slate-100 p-6 grid md:grid-cols-3 gap-4"
        >
          <label className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
              Media Title
            </span>
            <input
              className="p-3 rounded-xl border border-slate-200 w-full"
              placeholder="Skardu Valley"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            />
          </label>
          <label className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
              Category
            </span>
            <select
              className="p-3 rounded-xl border border-slate-200 w-full"
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            >
              <option value="Nature">Nature</option>
              <option value="Hotels">Hotels</option>
              <option value="Adventure">Adventure</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
              Alt Text
            </span>
            <input
              className="p-3 rounded-xl border border-slate-200 w-full"
              placeholder="Alt description for accessibility"
              value={form.alt}
              onChange={(e) => setForm((prev) => ({ ...prev, alt: e.target.value }))}
            />
          </label>
          <label className="md:col-span-3 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
              Image URL *
            </span>
            <input
              className="p-3 rounded-xl border border-slate-200 w-full"
              type="url"
              placeholder="https://..."
              value={form.url}
              onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
              required
            />
          </label>
          <div className="md:col-span-3 flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLocalFileSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50"
            >
              Upload From Device
            </button>
            <p className="text-xs text-slate-500">
              {isReadingFile ? "Reading file..." : "Allowed: image files up to 2MB."}
            </p>
          </div>
          <div className="md:col-span-3 flex gap-3">
            <button
              type="submit"
              className="px-5 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm"
            >
              {editingId ? "Update Media" : "Create Media"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {/* --- CATEGORY FILTER --- */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              activeCategory === cat
                ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200"
                : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- GALLERY GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {galleryItems
          .filter(
            (item) =>
              activeCategory === "All" || item.category === activeCategory,
          )
          .map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              {/* Image Overlay Actions */}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                <button
                  onClick={() => startEdit(item)}
                  className="p-3 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-2xl backdrop-blur-md transition-all"
                >
                  <Edit3 size={20} />
                </button>
                <button
                  onClick={() => deleteImage(item.id)}
                  className="p-3 bg-rose-500/20 hover:bg-rose-500 text-white rounded-2xl backdrop-blur-md transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Badge */}
              <div className="absolute top-5 left-5 z-20">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md border border-white/20 rounded-lg text-[9px] font-black uppercase tracking-tighter text-slate-900">
                  {item.category}
                </span>
              </div>

              <img
                src={item.url}
                alt={item.title}
                className="aspect-square w-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />

              <div className="p-6 bg-white relative z-20">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400">
                      Added on {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="text-slate-300 hover:text-slate-900 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default GalleryList;
