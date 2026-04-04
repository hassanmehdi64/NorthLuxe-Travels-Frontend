import { useMemo, useState } from "react";
import { Edit2, Plus, Trash2, Upload, X } from "lucide-react";
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
  { value: "season", label: "Seasonal Journeys" },
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
  galleryImages: "",
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
  weather: "",
  destinations: "",
  terms: "",
  heroSliderImages: "",
  activityHighlightsImages: "",
  status: "published",
  featured: false,
  sortOrder: 0,
};

const parseCommaList = (value) =>
  String(value || "")
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const toCommaList = (arr) => (Array.isArray(arr) ? arr.join(", ") : "");
const toLineList = (arr) => (Array.isArray(arr) ? arr.filter(Boolean).join("\n") : "");
const dedupeList = (items) => Array.from(new Set(items.filter(Boolean)));
const appendMediaItems = (currentValue, nextItems) => dedupeList([...parseCommaList(currentValue), ...nextItems]).join("\n");

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });

const ImageCollectionField = ({ label, value, onChange, placeholder, helperText }) => {
  const images = parseCommaList(value);

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      const uploaded = await Promise.all(files.map(readFileAsDataUrl));
      onChange(appendMediaItems(value, uploaded));
    } catch {
      // Keep manual URLs usable even if one file read fails.
    }

    event.target.value = "";
  };

  const removeImage = (target) => {
    onChange(images.filter((item) => item !== target).join("\n"));
  };

  return (
    <div className="md:col-span-2 space-y-2">
      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">{label}</span>
      <textarea
        className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        rows={3}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
          <Upload size={14} />
          Upload Images
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-300">{helperText}</p>
      </div>
      {images.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {images.map((image, index) => (
            <div key={`${image.slice(0, 24)}-${index}`} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <img src={image} alt={`${label} ${index + 1}`} className="h-28 w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(image)}
                className="absolute right-2 top-2 inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const buildPayloadByType = (type, form) => {
  const base = {
    type,
    slug: form.slug || undefined,
    status: form.status,
    sortOrder: Number(form.sortOrder || 0),
    featured: Boolean(form.featured),
  };

  if (type === "destination") {
    const gallery = parseCommaList(form.galleryImages);
    return {
      ...base,
      title: form.title,
      shortDescription: form.shortDescription,
      description: form.description,
      content: form.content,
      image: form.image || gallery[0] || "",
      gallery,
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
    const heroGallery = parseCommaList(form.heroSliderImages);
    const highlightGallery = parseCommaList(form.activityHighlightsImages);
    return {
      ...base,
      title: form.title,
      shortDescription: form.shortDescription,
      description: form.description,
      content: form.content,
      image: form.image || heroGallery[0] || highlightGallery[0] || "",
      gallery: heroGallery,
      location: form.location,
      duration: form.duration,
      level: form.level,
      includes: parseCommaList(form.includes),
      meta: {
        heroSliderImages: heroGallery,
        activityHighlightsImages: highlightGallery,
      },
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

  if (type === "season") {
    return {
      ...base,
      title: form.title,
      highlight: form.highlight,
      shortDescription: form.shortDescription,
      description: form.description,
      content: form.content,
      image: form.image,
      includes: parseCommaList(form.includes),
      deliverables: parseCommaList(form.deliverables),
      highlights: parseCommaList(form.highlights),
      features: parseCommaList(form.features),
      meta: {
        bestTime: form.bestTime,
        idealFor: form.idealFor,
        weather: form.weather,
        destinations: parseCommaList(form.destinations),
        terms: parseCommaList(form.terms),
      },
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
  season: "Season",
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
  const isSeason = activeType === "season";
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
      galleryImages: toLineList(item.gallery),
      highlights: toCommaList(item.highlights),
      features: toCommaList(item.features),
      includes: toCommaList(item.includes),
      deliverables: toCommaList(item.deliverables),
      bestTime: item.meta?.bestTime || "",
      idealFor: item.meta?.idealFor || "",
      weather: item.meta?.weather || "",
      destinations: toCommaList(item.meta?.destinations),
      terms: toCommaList(item.meta?.terms),
      heroSliderImages: toLineList(item.meta?.heroSliderImages || item.gallery),
      activityHighlightsImages: toLineList(item.meta?.activityHighlightsImages || item.gallery),
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
          <h1 className="text-xl xl:3xl font-black tracking-tighter text-slate-900 uppercase dark:text-slate-100">
            {fixedType ? `${typeText[activeType] || "Content"} Management` : "Content Management"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            {fixedType
              ? `Add, update, and manage ${String(typeText[activeType] || "content").toLowerCase()} entries for future site updates.`
              : "Update destinations, activities, services, seasonal journeys, careers, and support pages from one place."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setForm(initialForm);
            setIsFormOpen((v) => !v);
          }}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
        >
          <Plus size={16} />
          {isFormOpen ? "Close Form" : addLabel}
        </button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        {!fixedType ? (
          <select
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
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
          className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          placeholder="Search by title or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isFormOpen ? (
        <form
          onSubmit={onSubmit}
          className="grid gap-4 rounded-3xl border border-slate-100 bg-white p-6 md:grid-cols-2 dark:border-slate-700 dark:bg-slate-900"
        >
          {!isFaq ? (
            <label className="space-y-2">
              <span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Title *</span>
              <input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
            </label>
          ) : null}
          <label className="space-y-2">
            <span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Slug</span>
            <input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} />
          </label>

          {isCareer || isStaticPolicy ? (
            <>
              <label className="space-y-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Eyebrow</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.eyebrow} onChange={(e) => setForm((p) => ({ ...p, eyebrow: e.target.value }))} /></label>
              <label className="space-y-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Highlight</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.highlight} onChange={(e) => setForm((p) => ({ ...p, highlight: e.target.value }))} /></label>
            </>
          ) : null}

          {isDestination || isActivity || isService || isSeason || isCareer || isStaticPolicy ? (
            <label className="space-y-2 md:col-span-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Short Description</span><textarea className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" rows={2} value={form.shortDescription} onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))} /></label>
          ) : null}

          {isDestination || isActivity || isService || isSeason ? (
            <label className="space-y-2 md:col-span-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Description</span><textarea className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></label>
          ) : null}

          {isDestination || isSeason || isCareer || isStaticPolicy ? (
            <label className="space-y-2 md:col-span-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Main Content</span><textarea className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" rows={5} value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} /></label>
          ) : null}

          {isActivity ? (
            <label className="space-y-2 md:col-span-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Detailed Description</span><textarea className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" rows={5} placeholder="Add a fuller activity description for the details page." value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} /></label>
          ) : null}

          {isDestination || isActivity || isService || isSeason ? (
            <label className="space-y-2 md:col-span-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Cover Image URL</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} /></label>
          ) : null}

          {isDestination ? (
            <ImageCollectionField label="Gallery Images" value={form.galleryImages} onChange={(value) => setForm((p) => ({ ...p, galleryImages: value }))} placeholder="Add image URLs separated by commas or new lines" helperText="Paste image URLs or upload multiple destination images. The first one can be used as the main slider image." />
          ) : null}

          {isDestination || isActivity ? (
            <label className="space-y-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Location</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} /></label>
          ) : null}
          {isService ? (
            <label className="space-y-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Category</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} /></label>
          ) : null}

          {isSeason ? (
            <>
              <label className="space-y-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Best Time</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.bestTime} onChange={(e) => setForm((p) => ({ ...p, bestTime: e.target.value }))} /></label>
              <label className="space-y-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Ideal For</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.idealFor} onChange={(e) => setForm((p) => ({ ...p, idealFor: e.target.value }))} /></label>
              <label className="space-y-2 md:col-span-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Weather Feel</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.weather} onChange={(e) => setForm((p) => ({ ...p, weather: e.target.value }))} /></label>
              <label className="space-y-2 md:col-span-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Top Regions (comma separated)</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.destinations} onChange={(e) => setForm((p) => ({ ...p, destinations: e.target.value }))} /></label>
              <label className="space-y-2 md:col-span-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Season Tags (comma separated)</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" placeholder="spring, blossom, april" value={form.terms} onChange={(e) => setForm((p) => ({ ...p, terms: e.target.value }))} /></label>
            </>
          ) : null}

          {isActivity ? (
            <>
              <label className="space-y-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Duration</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} /></label>
              <label className="space-y-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Level</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.level} onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))} /></label>
              <ImageCollectionField label="Hero Slider Images" value={form.heroSliderImages} onChange={(value) => setForm((p) => ({ ...p, heroSliderImages: value }))} placeholder="Add image URLs separated by commas or new lines" helperText="Paste URLs or upload multiple hero images for the activity slider." />
              <ImageCollectionField label="Activity Highlights Images" value={form.activityHighlightsImages} onChange={(value) => setForm((p) => ({ ...p, activityHighlightsImages: value }))} placeholder="Add image URLs separated by commas or new lines" helperText="Paste URLs or upload multiple images for the activity highlights or gallery area." />
            </>
          ) : null}

          {isFaq ? (
            <>
              <label className="space-y-2 md:col-span-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Question</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.question} onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))} /></label>
              <label className="space-y-2 md:col-span-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Answer</span><textarea className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" rows={3} value={form.answer} onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))} /></label>
            </>
          ) : null}

          {isDestination ? (
            <>
              <label className="space-y-2 md:col-span-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Highlights (comma separated)</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.highlights} onChange={(e) => setForm((p) => ({ ...p, highlights: e.target.value }))} /></label>
              <label className="space-y-2 md:col-span-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Features (comma separated)</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.features} onChange={(e) => setForm((p) => ({ ...p, features: e.target.value }))} /></label>
              <label className="space-y-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Best Time</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.bestTime} onChange={(e) => setForm((p) => ({ ...p, bestTime: e.target.value }))} /></label>
              <label className="space-y-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Ideal For</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.idealFor} onChange={(e) => setForm((p) => ({ ...p, idealFor: e.target.value }))} /></label>
            </>
          ) : null}

          {isActivity || isSeason ? (
            <label className="space-y-2 md:col-span-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">{isSeason ? "Activities (comma separated)" : "Includes (comma separated)"}</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.includes} onChange={(e) => setForm((p) => ({ ...p, includes: e.target.value }))} /></label>
          ) : null}

          {isService || isSeason ? (
            <label className="space-y-2 md:col-span-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">{isSeason ? "Services (comma separated)" : "Deliverables (comma separated)"}</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.deliverables} onChange={(e) => setForm((p) => ({ ...p, deliverables: e.target.value }))} /></label>
          ) : null}

          {isSeason ? (
            <>
              <label className="space-y-2 md:col-span-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Why Go (comma separated)</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.highlights} onChange={(e) => setForm((p) => ({ ...p, highlights: e.target.value }))} /></label>
              <label className="space-y-2 md:col-span-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Planning Notes (comma separated)</span><input className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.features} onChange={(e) => setForm((p) => ({ ...p, features: e.target.value }))} /></label>
            </>
          ) : null}

          <label className="space-y-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Status</span><select className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}><option value="draft">Draft</option><option value="published">Published</option></select></label>
          <label className="space-y-2"><span className="text-[10px] font-black tracking-[0.14em] text-slate-500 uppercase">Sort Order</span><input type="number" className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" value={form.sortOrder} onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))} /></label>
          {isDestination || isActivity || isService ? (
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-200"><input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} />Featured</label>
          ) : null}

          <div className="flex gap-3 md:col-span-2">
            <button type="submit" className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white">{editing ? updateLabel : addLabel}</button>
            {editing ? (<button type="button" onClick={resetForm} className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700">Cancel</button>) : null}
          </div>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-900">
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
                  <td className="px-6 py-4"><p className="font-bold text-slate-900 dark:text-slate-100">{item.title}</p></td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-300">{item.slug}</td>
                  <td className="px-6 py-4 text-sm capitalize text-slate-600 dark:text-slate-200">{item.status}</td>
                  <td className="px-6 py-4"><div className="flex justify-end gap-2"><button onClick={() => openEdit(item)} className="cursor-pointer p-2 text-blue-600 hover:opacity-80"><Edit2 size={16} /></button><button onClick={() => removeItem(item.id)} className="cursor-pointer p-2 text-rose-600 hover:opacity-80"><Trash2 size={16} /></button></div></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="px-6 py-10 text-center font-semibold text-slate-400">No content entries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentManagement;
