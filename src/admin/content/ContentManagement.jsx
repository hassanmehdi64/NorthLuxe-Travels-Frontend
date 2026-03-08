import { useMemo, useState } from "react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import {
  useAdminContentList,
  useCreateContent,
  useDeleteContent,
  useUpdateContent,
} from "../../hooks/useCms";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../lib/apiError";

const contentTypes = [
  { value: "destination", label: "Destinations" },
  { value: "activity", label: "Activities" },
  { value: "service", label: "Services" },
  { value: "career", label: "Career" },
  { value: "faq", label: "FAQs" },
  { value: "help-center", label: "Help Center" },
  { value: "privacy-policy", label: "Privacy Policy" },
  { value: "terms-of-service", label: "Terms of Service" },
];

const initialForm = {
  title: "",
  slug: "",
  eyebrow: "",
  highlight: "",
  shortDescription: "",
  description: "",
  content: "",
  image: "",
  location: "",
  category: "",
  duration: "",
  level: "",
  question: "",
  answer: "",
  highlights: "",
  features: "",
  includes: "",
  deliverables: "",
  bestTime: "",
  idealFor: "",
  status: "published",
  featured: false,
  sortOrder: 0,
};

const parseCommaList = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const toCommaList = (arr) => (Array.isArray(arr) ? arr.join(", ") : "");

const buildPayloadByType = (type, form) => {
  const base = {
    type,
    slug: form.slug || undefined,
    status: form.status,
    sortOrder: Number(form.sortOrder || 0),
    featured: Boolean(form.featured),
  };

  if (type === "destination") {
    return {
      ...base,
      title: form.title,
      shortDescription: form.shortDescription,
      content: form.content,
      image: form.image,
      location: form.location,
      highlights: parseCommaList(form.highlights),
      features: parseCommaList(form.features),
      meta: {
        bestTime: form.bestTime,
        idealFor: form.idealFor,
      },
    };
  }

  if (type === "activity") {
    return {
      ...base,
      title: form.title,
      shortDescription: form.shortDescription,
      description: form.description,
      image: form.image,
      location: form.location,
      duration: form.duration,
      level: form.level,
      includes: parseCommaList(form.includes),
    };
  }

  if (type === "service") {
    return {
      ...base,
      title: form.title,
      shortDescription: form.shortDescription,
      description: form.description,
      image: form.image,
      category: form.category,
      deliverables: parseCommaList(form.deliverables),
    };
  }

  if (type === "career") {
    return {
      ...base,
      title: form.title,
      eyebrow: form.eyebrow,
      highlight: form.highlight,
      shortDescription: form.shortDescription,
      content: form.content,
    };
  }

  if (type === "faq") {
    return {
      ...base,
      title: form.question?.trim() || form.title?.trim() || "FAQ",
      question: form.question,
      answer: form.answer,
      featured: false,
    };
  }

  return {
    ...base,
    title: form.title,
    eyebrow: form.eyebrow,
    highlight: form.highlight,
    shortDescription: form.shortDescription,
    content: form.content,
    featured: false,
  };
};

const typeText = {
  destination: "Destination",
  activity: "Activity",
  service: "Service",
  career: "Career",
  faq: "FAQ",
  "help-center": "Help Center",
  "privacy-policy": "Privacy Policy",
  "terms-of-service": "Terms of Service",
};

const ContentManagement = ({ fixedType = null }) => {
  const toast = useToast();
  const [selectedType, setSelectedType] = useState(fixedType || "destination");
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const activeType = fixedType || selectedType;

  const { data: items = [] } = useAdminContentList(activeType);
  const createContent = useCreateContent();
  const updateContent = useUpdateContent();
  const deleteContent = useDeleteContent();

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const q = search.toLowerCase();
        return (
          String(item.title || "").toLowerCase().includes(q) ||
          String(item.slug || "").toLowerCase().includes(q)
        );
      }),
    [items, search],
  );

  const resetForm = () => {
    setEditing(null);
    setForm(initialForm);
    setIsFormOpen(false);
  };

  const isDestination = activeType === "destination";
  const isActivity = activeType === "activity";
  const isService = activeType === "service";
  const isCareer = activeType === "career";
  const isFaq = activeType === "faq";
  const isStaticPolicy =
    activeType === "help-center" ||
    activeType === "privacy-policy" ||
    activeType === "terms-of-service";

  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = buildPayloadByType(activeType, form);

    try {
      if (editing) {
        await updateContent.mutateAsync({ id: editing.id, ...payload });
        toast.success(
          `${typeText[activeType] || "Content"} updated`,
          form.status === "published"
            ? "The item is updated on the public site."
            : "Saved as draft. It will not appear publicly until published.",
        );
      } else {
        await createContent.mutateAsync(payload);
        toast.success(
          `${typeText[activeType] || "Content"} created`,
          form.status === "published"
            ? "The item is now available on the public site."
            : "Saved as draft. It will not appear publicly until published.",
        );
      }
      resetForm();
    } catch (error) {
      toast.error("Save failed", getApiErrorMessage(error, "Could not save content."));
    }
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      ...initialForm,
      ...item,
      image: item.image || item.coverImage || "",
      highlights: toCommaList(item.highlights),
      features: toCommaList(item.features),
      includes: toCommaList(item.includes),
      deliverables: toCommaList(item.deliverables),
      bestTime: item.meta?.bestTime || "",
      idealFor: item.meta?.idealFor || "",
    });
    setIsFormOpen(true);
  };

  const removeItem = (id) => {
    if (!window.confirm("Delete this content entry?")) return;
    deleteContent.mutate(id, {
      onSuccess: () => toast.success("Content deleted", "The item has been removed."),
      onError: (error) =>
        toast.error("Delete failed", getApiErrorMessage(error, "Could not delete content.")),
    });
  };

  const addLabel = `Add ${typeText[activeType] || "Content"}`;
  const updateLabel = `Update ${typeText[activeType] || "Content"}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl xl:3xl font-black text-slate-900 tracking-tighter uppercase dark:text-slate-100">
            {fixedType ? `${typeText[activeType] || "Content"} Management` : "Content Management"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            {fixedType
              ? `Add, update, and manage ${String(typeText[activeType] || "content").toLowerCase()} entries for future site updates.`
              : "Update destinations, activities, services, careers, and support pages from one place."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setForm(initialForm);
            setIsFormOpen((v) => !v);
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold"
        >
          <Plus size={16} />
          {isFormOpen ? "Close Form" : addLabel}
        </button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        {!fixedType ? (
          <select
            className="px-4 py-3 rounded-2xl border border-slate-200 bg-white font-semibold text-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              resetForm();
            }}
          >
            {contentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        ) : null}
        <input
          className="px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-medium flex-1 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
          placeholder="Search by title or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isFormOpen ? (
        <form
          onSubmit={onSubmit}
          className="bg-white rounded-3xl border border-slate-100 p-6 grid md:grid-cols-2 gap-4 dark:bg-slate-900 dark:border-slate-700"
        >
          {!isFaq ? (
            <label className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Title *</span>
              <input
                className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                required
              />
            </label>
          ) : null}
          <label className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Slug</span>
            <input
              className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            />
          </label>

          {isCareer || isStaticPolicy ? (
            <>
              <label className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Eyebrow</span>
                <input
                  className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  value={form.eyebrow}
                  onChange={(e) => setForm((p) => ({ ...p, eyebrow: e.target.value }))}
                />
              </label>
              <label className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Highlight</span>
                <input
                  className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  value={form.highlight}
                  onChange={(e) => setForm((p) => ({ ...p, highlight: e.target.value }))}
                />
              </label>
            </>
          ) : null}

          {isDestination || isActivity || isService || isCareer || isStaticPolicy ? (
            <label className="md:col-span-2 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Short Description</span>
              <textarea
                className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                rows={2}
                value={form.shortDescription}
                onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))}
              />
            </label>
          ) : null}

          {isActivity || isService ? (
            <label className="md:col-span-2 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Description</span>
              <textarea
                className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
            </label>
          ) : null}

          {isDestination || isCareer || isStaticPolicy ? (
            <label className="md:col-span-2 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Main Content</span>
              <textarea
                className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                rows={5}
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              />
            </label>
          ) : null}

          {isDestination || isActivity || isService ? (
            <label className="md:col-span-2 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Image URL</span>
              <input
                className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                value={form.image}
                onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
              />
            </label>
          ) : null}

          {isDestination || isActivity ? (
            <label className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Location</span>
              <input
                className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              />
            </label>
          ) : null}
          {isService ? (
            <label className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Category</span>
              <input
                className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              />
            </label>
          ) : null}
          {isActivity ? (
            <>
              <label className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Duration</span>
                <input
                  className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  value={form.duration}
                  onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                />
              </label>
              <label className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Level</span>
                <input
                  className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  value={form.level}
                  onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))}
                />
              </label>
            </>
          ) : null}
          {isFaq ? (
            <>
              <label className="md:col-span-2 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Question</span>
                <input
                  className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  value={form.question}
                  onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
                />
              </label>
              <label className="md:col-span-2 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Answer</span>
                <textarea
                  className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  rows={3}
                  value={form.answer}
                  onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
                />
              </label>
            </>
          ) : null}

          {isDestination ? (
            <>
              <label className="md:col-span-2 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Highlights (comma separated)</span>
                <input
                  className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  value={form.highlights}
                  onChange={(e) => setForm((p) => ({ ...p, highlights: e.target.value }))}
                />
              </label>
              <label className="md:col-span-2 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Features (comma separated)</span>
                <input
                  className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  value={form.features}
                  onChange={(e) => setForm((p) => ({ ...p, features: e.target.value }))}
                />
              </label>
              <label className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Best Time</span>
                <input
                  className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  value={form.bestTime}
                  onChange={(e) => setForm((p) => ({ ...p, bestTime: e.target.value }))}
                />
              </label>
              <label className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Ideal For</span>
                <input
                  className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  value={form.idealFor}
                  onChange={(e) => setForm((p) => ({ ...p, idealFor: e.target.value }))}
                />
              </label>
            </>
          ) : null}

          {isActivity ? (
            <label className="md:col-span-2 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Includes (comma separated)</span>
              <input
                className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                value={form.includes}
                onChange={(e) => setForm((p) => ({ ...p, includes: e.target.value }))}
              />
            </label>
          ) : null}

          {isService ? (
            <label className="md:col-span-2 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Deliverables (comma separated)</span>
              <input
                className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                value={form.deliverables}
                onChange={(e) => setForm((p) => ({ ...p, deliverables: e.target.value }))}
              />
            </label>
          ) : null}

          <label className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Status</span>
            <select
              className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Sort Order</span>
            <input
              type="number"
              className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              value={form.sortOrder}
              onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))}
            />
          </label>
          {isDestination || isActivity || isService ? (
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-200">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
              />
              Featured
            </label>
          ) : null}

          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="px-5 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm">
              {editing ? updateLabel : addLabel}
            </button>
            {editing ? (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold text-sm"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      ) : null}

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden dark:bg-slate-900 dark:border-slate-700">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Title</th>
              <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Slug</th>
              <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Status</th>
              <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 dark:border-slate-700">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{item.title}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-300">{item.slug}</td>
                  <td className="px-6 py-4 capitalize text-sm text-slate-600 dark:text-slate-200">{item.status}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-2 text-blue-600">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => removeItem(item.id)} className="p-2 text-rose-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-400 font-semibold">
                  No content entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentManagement;
