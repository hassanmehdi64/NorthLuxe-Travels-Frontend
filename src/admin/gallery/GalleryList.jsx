import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  status: "published",
  sortOrder: 0,
};

const GalleryList = () => {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(initialForm);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [openMenuId, setOpenMenuId] = useState("");
  const menuRef = useRef(null);
  const { data: galleryItems = [] } = useGallery();
  const createGallery = useCreateGalleryItem();
  const updateGallery = useUpdateGalleryItem();
  const deleteGallery = useDeleteGalleryItem();
  useEffect(() => {
    const next = searchParams.get("search") || "";
    setSearch((current) => (current === next ? current : next));
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (search.trim()) params.set("search", search.trim());
    else params.delete("search");
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [search, searchParams, setSearchParams]);

  const categories = ["All", ...new Set(galleryItems.map((item) => item.category).filter(Boolean))];
  const filteredItems = galleryItems.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesStatus = statusFilter === "All" || item.status === statusFilter.toLowerCase();
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [item.title, item.category, item.alt, item.status, item.url]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query);

    return matchesCategory && matchesStatus && matchesSearch;
  });

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
      status: form.status,
      sortOrder: Number(form.sortOrder || 0),
    };

    try {
      if (editingId) {
        await updateGallery.mutateAsync({ id: editingId, ...payload });
        toast.success("Updated", "Gallery item updated successfully.");
      } else {
        await createGallery.mutateAsync(payload);
        toast.success("Created", "Gallery item added successfully.");
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
      status: item.status || "published",
      sortOrder: Number(item.sortOrder || 0),
    });
    setIsFormOpen(true);
  };

  const deleteImage = (id) => {
    deleteGallery.mutate(id, {
      onSuccess: () => toast.success("Deleted", "Gallery item removed."),
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* --- HEADER --- */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="admin-page-title">
            Gallery Management
          </h1>
          <p className="admin-page-subtitle">
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
          className="admin-soft-button group inline-flex items-center gap-2 px-4 py-2"
        >
          <Plus size={16} /> {isFormOpen ? "Close Form" : "Add New"}
        </button>
      </div>

      {isFormOpen ? (
        <form
          onSubmit={addNewImage}
          className="admin-soft-form grid gap-3 p-4 md:grid-cols-3 md:p-5"
        >
          <label className="space-y-2">
            <span className="admin-soft-label">
              Title
            </span>
            <input
              className="w-full rounded-xl p-2.5 text-sm"
              placeholder="Skardu Valley"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            />
          </label>
          <label className="space-y-2">
            <span className="admin-soft-label">
              Category
            </span>
            <input
              list="gallery-category-options"
              className="w-full rounded-xl p-2.5 text-sm"
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              placeholder="Nature"
            />
          </label>
          <datalist id="gallery-category-options">
            {categories.filter((item) => item !== "All").map((item) => (
              <option key={item} value={item} />
            ))}
            <option value="Nature" />
            <option value="Hotels" />
            <option value="Adventure" />
          </datalist>
          <label className="space-y-2">
            <span className="admin-soft-label">
              Alt Text
            </span>
            <input
              className="w-full rounded-xl p-2.5 text-sm"
              placeholder="Alt description for accessibility"
              value={form.alt}
              onChange={(e) => setForm((prev) => ({ ...prev, alt: e.target.value }))}
            />
          </label>
          <label className="space-y-2">
            <span className="admin-soft-label">
              Status
            </span>
            <select
              className="w-full rounded-xl p-2.5 text-sm"
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
          <label className="md:col-span-3 space-y-2">
            <span className="admin-soft-label">
              Image URL *
            </span>
            <input
              className="w-full rounded-xl p-2.5 text-sm"
              type="url"
              placeholder="https://..."
              value={form.url}
              onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
              required
            />
          </label>
          <label className="space-y-2 md:col-span-3">
            <span className="admin-soft-label">
              Sort Order
            </span>
            <input
              className="w-full rounded-xl p-2.5 text-sm"
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: Number(e.target.value || 0) }))}
            />
          </label>
          <div className="md:col-span-3 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
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
              className="admin-soft-button-ghost px-3 py-2 text-[11px]"
            >
              Upload From Device
            </button>
            <p className="admin-soft-muted text-xs">
              {isReadingFile ? "Reading file..." : "Allowed: image files up to 2MB."}
            </p>
          </div>
          <div className="md:col-span-3 flex flex-wrap gap-2 pt-1">
            <button
              type="submit"
              className="admin-soft-button px-4 py-2"
            >
              {editingId ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="admin-soft-button-ghost px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {/* --- CATEGORY FILTER --- */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] transition-all ${
              activeCategory === cat
                ? "border-[var(--c-brand)] bg-[var(--c-brand)] text-white shadow-[0_10px_20px_rgba(32,183,122,0.18)]"
                : "bg-white/70 text-slate-500 border-white/35 hover:border-[rgba(32,183,122,0.24)]"
            }`}
          >
            {cat}
          </button>
        ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, category, or alt text..."
            className="w-full rounded-2xl border border-white/35 bg-white/70 px-4 py-2.5 text-sm shadow-[0_16px_34px_rgba(148,163,184,0.08)] backdrop-blur-xl sm:flex-1"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-2xl border border-white/35 bg-white/70 px-4 py-2.5 text-sm font-semibold shadow-[0_16px_34px_rgba(148,163,184,0.08)] backdrop-blur-xl"
          >
            <option value="All">All statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* --- GALLERY GRID --- */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`group admin-soft-panel relative overflow-visible rounded-[1.2rem] border border-white/55 bg-white/80 p-0 shadow-[0_14px_28px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(15,23,42,0.1)] ${
                openMenuId === item.id ? "z-50" : "z-10"
              }`}
            >
              <div className="overflow-hidden rounded-t-[1.2rem]">
                {/* Badge */}
                <div className="absolute left-3 top-3 z-20">
                  <span className="rounded-full border border-white/25 bg-white/92 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.22em] text-[var(--c-navy)] shadow-sm backdrop-blur-md">
                    {item.category}
                  </span>
                </div>
                <div className="absolute right-3 top-3 z-20">
                  <span className={`rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-[0.18em] shadow-sm ${
                    item.status === "published"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}>
                    {item.status}
                  </span>
                </div>

                <img
                  src={item.url}
                  alt={item.title}
                  className="aspect-[1.18/1] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>

              <div className="relative z-20 border-t border-slate-100/80 bg-white/96 px-3 py-2.5 backdrop-blur-xl">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[11px] font-black uppercase leading-tight tracking-tight text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[10px] font-semibold text-slate-400">
                      {`Order ${Number(item.sortOrder || 0)} | ${new Date(item.createdAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="relative shrink-0" ref={openMenuId === item.id ? menuRef : null}>
                    <button
                      onClick={() =>
                        setOpenMenuId((current) => (current === item.id ? "" : item.id))
                      }
                      className="admin-soft-icon-button !h-7 !w-7 !rounded-full !border-slate-200 !bg-white"
                    >
                      <MoreVertical size={14} />
                    </button>

                    {openMenuId === item.id ? (
                      <div className="absolute right-0 top-9 z-40 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_35px_rgba(15,23,42,0.12)]">
                        <button
                          onClick={() => {
                            startEdit(item);
                            setOpenMenuId("");
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-bold text-slate-600 transition-colors hover:bg-slate-50"
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            deleteImage(item.id);
                            setOpenMenuId("");
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-bold text-rose-600 transition-colors hover:bg-rose-50"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        {!filteredItems.length ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white/70 px-6 py-12 text-center text-sm font-semibold text-slate-500">
            No gallery items match the current filters.
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GalleryList;
