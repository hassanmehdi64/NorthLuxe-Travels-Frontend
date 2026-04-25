import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Edit2, Plus, Printer, Trash2, X, Map as MapIcon, ListTodo, Upload } from "lucide-react";
import { useAdminTours, useCreateTour, useDeleteTour, useSettings, useUpdateTour, useUpdateBooking } from "../../hooks/useCms";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../lib/apiError";

const initialForm = {
  title: "",
  location: "",
  durationDays: 5,
  durationLabel: "",
  price: 0,
  discountPercent: 0,
  currency: "PKR",
  image: "",
  shortDescription: "",
  description: "",
  status: "draft",
  featured: false,
  availableSeats: 20,
  hotelCategoryKeys: "",
  vehicleTypeKeys: [],
  itinerary: [{ day: 1, title: "", description: "" }],
  reviewItems: [{ name: "", rating: 5, date: "", tag: "", comment: "" }],
};

const normalizeKeyList = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const mergeUniqueKeys = (...lists) => Array.from(new Set(lists.flatMap((list) => normalizeKeyList(list))));
const normalizeReviewItems = (items) => {
  if (!Array.isArray(items) || !items.length) return initialForm.reviewItems;
  return items.map((item) => ({
    name: String(item?.name || ""),
    rating: Math.max(1, Math.min(5, Number(item?.rating || 5))),
    date: String(item?.date || ""),
    tag: String(item?.tag || ""),
    comment: String(item?.comment || ""),
  }));
};
const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });

const labelClassName = "text-[11px] font-black uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200";
const inputClassName = "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100/70 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/10";
const textareaClassName = `${inputClassName} resize-y`;
const sectionClassName = "h-full rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:border-slate-700 dark:bg-slate-900";
const primaryButtonClassName = "inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100";
const secondaryButtonClassName = "inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700";
const subtleButtonClassName = "inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800";
const sectionToggleButtonClassName = "flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:bg-slate-800";
const segmentedButtonBaseClassName = "rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] transition";
const inlineIconButtonClassName = "inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-200";
const compactInputClassName = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100";

const isRecentlyAdded = (value) => {
  if (!value) return false;
  const created = new Date(value).getTime();
  if (Number.isNaN(created)) return false;
  const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
  return Date.now() - created <= threeDaysMs;
};

const TourManagement = () => {
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: tours = [] } = useAdminTours();
  const { data: settings = {} } = useSettings();
  const createTour = useCreateTour();
  const updateTour = useUpdateTour();
  const deleteTour = useDeleteTour();
  const updateBooking = useUpdateBooking();

  const [editing, setEditing] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [sourceBookingId, setSourceBookingId] = useState("");
  const [sourceBookingCode, setSourceBookingCode] = useState("");
  const [tourAction, setTourAction] = useState({ type: "", tour: null });
  const [isItineraryOpen, setIsItineraryOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [customVehicleInput, setCustomVehicleInput] = useState("");
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
  const vehicleDropdownRef = useRef(null);

  useEffect(() => {
    const prefill = location.state?.prefill;
    const nextBookingId = location.state?.sourceBookingId || "";
    const nextBookingCode = location.state?.sourceBookingCode || "";
    if (!prefill) return;

    setEditing(null);
    setSourceBookingId(nextBookingId);
    setSourceBookingCode(nextBookingCode);
    setIsFormOpen(true);
    setIsItineraryOpen(false);
    setIsAvailabilityOpen(false);
    setIsReviewsOpen(false);
    setForm({
      ...initialForm,
      ...prefill,
      hotelCategoryKeys: prefill.hotelCategoryKeys || "",
      vehicleTypeKeys: normalizeKeyList(prefill.vehicleTypeKeys),
      itinerary: Array.isArray(prefill.itinerary) && prefill.itinerary.length
        ? prefill.itinerary.map((item, index) => ({
            day: Number(item?.day || index + 1),
            title: item?.title || "",
            description: item?.description || "",
          }))
        : initialForm.itinerary,
      reviewItems: normalizeReviewItems(prefill.reviewItems),
    });
  }, [location.state]);

  useEffect(() => {
    if (!isVehicleDropdownOpen) return;
    const handleOutside = (event) => {
      if (!vehicleDropdownRef.current?.contains(event.target)) {
        setIsVehicleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isVehicleDropdownOpen]);

  const sortedTours = useMemo(
    () =>
      [...tours].sort((a, b) => {
        const aTime = new Date(a?.createdAt || 0).getTime();
        const bTime = new Date(b?.createdAt || 0).getTime();
        return bTime - aTime;
      }),
    [tours],
  );

  const configuredVehicleOptions = useMemo(
    () =>
      (settings?.bookingPricing?.vehicleTypes || [])
        .filter((item) => item?.active !== false && String(item?.key || "").trim())
        .map((item) => ({
          key: String(item.key).trim(),
          label: String(item.label || item.key).trim(),
        })),
    [settings],
  );

  const vehicleOptions = useMemo(() => {
    const selectedKeys = normalizeKeyList(form.vehicleTypeKeys);
    const optionMap = new Map(configuredVehicleOptions.map((item) => [item.key, item]));

    selectedKeys.forEach((key) => {
      if (!optionMap.has(key)) optionMap.set(key, { key, label: key });
    });

    return Array.from(optionMap.values());
  }, [configuredVehicleOptions, form.vehicleTypeKeys]);

  const addVehicleOption = () => {
    const nextVehicle = String(customVehicleInput || "").trim();
    if (!nextVehicle) return;
    setForm((prev) => ({
      ...prev,
      vehicleTypeKeys: mergeUniqueKeys(prev.vehicleTypeKeys, [nextVehicle]),
    }));
    setCustomVehicleInput("");
    setIsVehicleDropdownOpen(false);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const uploaded = await readFileAsDataUrl(file);
      setForm((prev) => ({ ...prev, image: uploaded }));
    } catch {
      toast.error("Upload failed", "Could not read the selected image.");
    }

    event.target.value = "";
  };

  const printTourPdf = (tour) => {
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>${tour.title} - Tour PDF</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #2B2B2B; }
            h1 { margin-bottom: 8px; }
            .meta { margin: 18px 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
            .card { border: 1px solid #e2e8f0; border-radius: 16px; padding: 14px; }
            img { width: 100%; max-height: 340px; object-fit: cover; border-radius: 18px; margin: 18px 0; }
            .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: #64748b; }
            .value { font-size: 16px; font-weight: 700; margin-top: 6px; }
            p { line-height: 1.65; }
          </style>
        </head>
        <body>
          <h1>${tour.title}</h1>
          <p>${tour.shortDescription || "Custom designed tour package."}</p>
          ${tour.image ? `<img src="${tour.image}" alt="${tour.title}" />` : ""}
          <div class="meta">
            <div class="card"><div class="label">Location</div><div class="value">${tour.location || "-"}</div></div>
            <div class="card"><div class="label">Duration</div><div class="value">${tour.durationLabel || `${tour.durationDays} Days`}</div></div>
            <div class="card"><div class="label">Price</div><div class="value">${tour.currency} ${tour.price}</div></div>
            <div class="card"><div class="label">Seats</div><div class="value">${tour.availableSeats || "-"}</div></div>
          </div>
          <div class="card">
            <div class="label">Summary</div>
            <p>${tour.shortDescription || "No summary added yet."}</p>
          </div>
          ${Array.isArray(tour.itinerary) && tour.itinerary.length
            ? `<div class="card" style="margin-top: 16px;"><div class="label">Itinerary</div>${tour.itinerary
                .map(
                  (item) => `<div style="margin-top: 14px;"><p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#20b77a;">Day ${item.day || ""}${item.title ? ` - ${item.title}` : ""}</p><p style="margin:0;line-height:1.7;">${item.description || "No details added."}</p></div>`,
                )
                .join("")}</div>`
            : ""}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 350);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const discountPercentValue = Number(form.discountPercent);
    const syncedSeats = Math.max(0, Number(form.availableSeats || 0));
    const payload = {
      ...form,
      capacity: syncedSeats,
      availableSeats: syncedSeats,
      discountPercent: Number.isFinite(discountPercentValue)
        ? Math.max(0, Math.min(95, discountPercentValue))
        : 0,
      itinerary: form.itinerary
        .map((item, index) => ({
          day: index + 1,
          title: String(item?.title || "").trim(),
          description: String(item?.description || "").trim(),
        }))
        .filter((item) => item.title || item.description),
      reviewItems: form.reviewItems
        .map((item) => ({
          name: String(item?.name || "").trim(),
          rating: Math.max(1, Math.min(5, Number(item?.rating || 5))),
          date: String(item?.date || "").trim(),
          tag: String(item?.tag || "").trim(),
          comment: String(item?.comment || "").trim(),
        }))
        .filter((item) => item.name || item.comment || item.tag || item.date),
      availableOptions: {
        hotelCategories: form.hotelCategoryKeys
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        vehicleTypes: normalizeKeyList(form.vehicleTypeKeys),
      },
    };

    try {
      if (editing) {
        await updateTour.mutateAsync({ id: editing.id, ...payload });
        toast.success(
          "Tour updated",
          form.status === "published"
            ? "The tour is updated on the public site."
            : "Saved as draft. It will not appear publicly until published.",
        );
      } else {
        const createdTour = await createTour.mutateAsync(payload);
        if (sourceBookingId) {
          await updateBooking.mutateAsync({ id: sourceBookingId, designedTour: createdTour.id });
        }
        toast.success(
          sourceBookingId ? "Itinerary created" : "Tour created",
          form.status === "published"
            ? "The tour is now available on the public site."
            : "Saved as draft. It will not appear publicly until published.",
        );
        if (sourceBookingId) {
          navigate(`/admin/bookings/${sourceBookingId}`, {
            replace: true,
            state: { createdTourId: createdTour.id, createdFromQuery: true },
          });
          return;
        }
      }
      setEditing(null);
      setIsFormOpen(false);
      setForm(initialForm);
      setSourceBookingId("");
      setSourceBookingCode("");
      setIsItineraryOpen(false);
      closeTourAction();
    } catch (error) {
      toast.error("Save failed", getApiErrorMessage(error, "Could not save tour."));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTour.mutateAsync(id);
      toast.success("Tour deleted", "The tour has been removed.");
    } catch (error) {
      toast.error("Delete failed", getApiErrorMessage(error, "Could not delete tour."));
    }
  };

  const closeTourAction = () => setTourAction({ type: "", tour: null });
  const selectedVehicleKeys = normalizeKeyList(form.vehicleTypeKeys);
  const selectedVehicleSummary = selectedVehicleKeys.length
    ? selectedVehicleKeys
        .map((key) => vehicleOptions.find((item) => item.key === key)?.label || key)
        .join(", ")
    : "Select vehicles";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl xl:3xl font-black text-slate-900 tracking-tighter uppercase dark:text-slate-100">
            Tour Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">Manage all package details shown on website.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setSourceBookingId("");
            setSourceBookingCode("");
            setForm(initialForm);
            setCustomVehicleInput("");
            setIsItineraryOpen(false);
            setIsAvailabilityOpen(false);
            setIsReviewsOpen(false);
            setIsVehicleDropdownOpen(false);
            setIsFormOpen((value) => !value);
          }}
          className={primaryButtonClassName}
        >
          <Plus size={16} />
          {isFormOpen ? "Close Form" : "Add New Tour"}
        </button>
      </div>

      {sourceBookingId ? (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4 text-sm text-sky-900">
          Creating an itinerary for custom request <strong>{sourceBookingCode || sourceBookingId}</strong>. After save, it will link back to the request automatically.
        </div>
      ) : null}

      {isFormOpen ? (
        <form onSubmit={onSubmit} className="space-y-5 rounded-[2rem] border border-slate-200 bg-slate-50 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-950 sm:p-5 lg:p-6">
          <div className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--c-brand)]">
                {editing ? "Editing Tour" : sourceBookingId ? "Custom Request Tour" : "New Tour"}
              </p>
              <h2 className="mt-1 text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">
                {editing ? form.title || "Update tour package" : "Create tour package"}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                Keep the essentials tight, then add itinerary and vehicle options below.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${form.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {form.status}
              </span>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${form.featured ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200"}`}>
                {form.featured ? "Featured" : "Regular"}
              </span>
            </div>
          </div>

          <div className="grid items-stretch gap-4 xl:grid-cols-[1.35fr_0.95fr]">
            <section className={sectionClassName}>
              <div className="mb-5 border-b border-slate-200 pb-3 dark:border-slate-700">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--c-brand)]">Basics</p>
                <h3 className="mt-1 text-base font-black text-slate-900 dark:text-slate-100">Tour Identity</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Main information visitors notice first.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className={labelClassName}>Title *</span>
                  <input className={inputClassName} placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
                </label>
                <label className="space-y-2">
                  <span className={labelClassName}>Location *</span>
                  <input className={inputClassName} placeholder="Location" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} required />
                </label>
                <label className="space-y-2">
                  <span className={labelClassName}>Duration Days *</span>
                  <input className={inputClassName} type="number" placeholder="Duration Days" value={form.durationDays} onChange={(e) => setForm((p) => ({ ...p, durationDays: Number(e.target.value) }))} required />
                </label>
                <label className="space-y-2">
                  <span className={labelClassName}>Duration Label</span>
                  <input className={inputClassName} placeholder="e.g. 7 Days / 6 Nights" value={form.durationLabel} onChange={(e) => setForm((p) => ({ ...p, durationLabel: e.target.value }))} />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className={labelClassName}>Image URL *</span>
                  <div className="space-y-3">
                    <input className={inputClassName} placeholder="Image URL" value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} required />
                    <div className="flex flex-wrap items-center gap-3">
                      <label className={subtleButtonClassName}>
                        <Upload size={14} />
                        Upload Image
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                      <p className="text-xs text-slate-500 dark:text-slate-300">Paste a URL or upload a cover image.</p>
                    </div>
                    {form.image ? (
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                        <img src={form.image} alt="Tour cover preview" className="h-40 w-full object-cover" />
                      </div>
                    ) : null}
                  </div>
                </label>
              </div>
            </section>

            <section className={sectionClassName}>
              <div className="mb-5 border-b border-slate-200 pb-3 dark:border-slate-700">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--c-brand)]">Pricing</p>
                <h3 className="mt-1 text-base font-black text-slate-900 dark:text-slate-100">Sellable Details</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Commercial details and publishing controls.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className={labelClassName}>Price *</span>
                  <input className={inputClassName} type="number" placeholder="Price" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} required />
                </label>
                <label className="space-y-2">
                  <span className={labelClassName}>Currency</span>
                  <select className={inputClassName} value={form.currency || "PKR"} onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}>
                    <option value="PKR">PKR - Pakistani Rupees</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className={labelClassName}>Discount %</span>
                  <input className={inputClassName} type="number" min="0" max="95" placeholder="e.g. 15" value={form.discountPercent} onChange={(e) => setForm((p) => ({ ...p, discountPercent: Math.max(0, Math.min(95, Number(e.target.value || 0))) }))} />
                </label>
                <label className="space-y-2">
                  <span className={labelClassName}>Available Seats</span>
                  <input className={inputClassName} type="number" placeholder="Seats" value={form.availableSeats} onChange={(e) => setForm((p) => ({ ...p, availableSeats: Number(e.target.value) }))} />
                </label>
                <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">Publishing</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,180px)_1fr] md:items-end">
                    <label className="space-y-2 min-w-[180px]">
                      <span className={labelClassName}>Status</span>
                      <select className={inputClassName} value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </label>
                    <div className="space-y-2">
                      <span className={labelClassName}>Feature Handling</span>
                      <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-slate-700 dark:bg-slate-900">
                        <button
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, featured: false }))}
                          className={`${segmentedButtonBaseClassName} ${!form.featured ? "bg-slate-900 text-white shadow-[0_8px_18px_rgba(15,23,42,0.18)] dark:bg-white dark:text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                        >
                          Regular
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, featured: true }))}
                          className={`${segmentedButtonBaseClassName} ${form.featured ? "bg-slate-900 text-white shadow-[0_8px_18px_rgba(15,23,42,0.18)] dark:bg-white dark:text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                        >
                          Featured
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className={sectionClassName}>
            <div className="mb-5 border-b border-slate-200 pb-3 dark:border-slate-700">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--c-brand)]">Story</p>
              <h3 className="mt-1 text-base font-black text-slate-900 dark:text-slate-100">Descriptions</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Short summary and full package detail.</p>
            </div>
            <div className="grid gap-4">
              <label className="space-y-2">
                <span className={labelClassName}>Short Description</span>
                <textarea className={textareaClassName} rows={3} placeholder="Short description" value={form.shortDescription} onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))} />
              </label>
              <label className="space-y-2">
                <span className={labelClassName}>Detailed Description</span>
                <textarea rows={5} className={textareaClassName} placeholder="Tour overview, highlights, inclusions, and important notes" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
              </label>
            </div>
          </section>

          <div className={`${sectionClassName} overflow-hidden`}>
            <button
              type="button"
              onClick={() => setIsReviewsOpen((value) => !value)}
              className={sectionToggleButtonClassName}
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--c-brand)]">Guest Feedback</p>
                <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">Tour Reviews</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">Add reviews for this specific tour.</p>
              </div>
              <ChevronDown
                size={16}
                className={`text-slate-500 transition-transform duration-200 ${isReviewsOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isReviewsOpen ? (
              <div className="space-y-3 px-1 pb-1 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-300">These reviews appear on this tour's details page.</p>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        reviewItems: [...prev.reviewItems, { name: "", rating: 5, date: "", tag: "", comment: "" }],
                      }))
                    }
                    className={subtleButtonClassName}
                  >
                    <Plus size={13} />
                    Add Review
                  </button>
                </div>

                <div className="space-y-3">
                  {form.reviewItems.map((item, index) => (
                    <div key={`tour-review-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-200">
                          Review {index + 1}
                        </div>
                        {form.reviewItems.length > 1 ? (
                          <button
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                reviewItems: prev.reviewItems.filter((_, reviewIndex) => reviewIndex !== index),
                              }))
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200"
                          >
                            <X size={12} />
                            Remove
                          </button>
                        ) : null}
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <label className="space-y-2">
                          <span className={labelClassName}>Guest Name</span>
                          <input
                            className={compactInputClassName}
                            value={item.name}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                reviewItems: prev.reviewItems.map((entry, reviewIndex) =>
                                  reviewIndex === index ? { ...entry, name: e.target.value } : entry,
                                ),
                              }))
                            }
                          />
                        </label>
                        <label className="space-y-2">
                          <span className={labelClassName}>Trip Tag</span>
                          <input
                            className={compactInputClassName}
                            placeholder="Family Trip"
                            value={item.tag}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                reviewItems: prev.reviewItems.map((entry, reviewIndex) =>
                                  reviewIndex === index ? { ...entry, tag: e.target.value } : entry,
                                ),
                              }))
                            }
                          />
                        </label>
                        <label className="space-y-2">
                          <span className={labelClassName}>Date Label</span>
                          <input
                            className={compactInputClassName}
                            placeholder="Apr 2026"
                            value={item.date}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                reviewItems: prev.reviewItems.map((entry, reviewIndex) =>
                                  reviewIndex === index ? { ...entry, date: e.target.value } : entry,
                                ),
                              }))
                            }
                          />
                        </label>
                        <label className="space-y-2">
                          <span className={labelClassName}>Rating</span>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            className={compactInputClassName}
                            value={item.rating}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                reviewItems: prev.reviewItems.map((entry, reviewIndex) =>
                                  reviewIndex === index ? { ...entry, rating: Math.max(1, Math.min(5, Number(e.target.value || 5))) } : entry,
                                ),
                              }))
                            }
                          />
                        </label>
                        <label className="space-y-2 md:col-span-2">
                          <span className={labelClassName}>Review Comment</span>
                          <textarea
                            rows={3}
                            className={`${compactInputClassName} resize-y`}
                            value={item.comment}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                reviewItems: prev.reviewItems.map((entry, reviewIndex) =>
                                  reviewIndex === index ? { ...entry, comment: e.target.value } : entry,
                                ),
                              }))
                            }
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid items-start gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className={`${sectionClassName} overflow-hidden`}>
                <button
                  type="button"
                  onClick={() => setIsItineraryOpen((value) => !value)}
                  className={sectionToggleButtonClassName}
                >
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--c-brand)]">Standard Tour Itinerary</p>
                    <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">Day-wise Itinerary</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">Break the journey into clear day blocks.</p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-slate-500 transition-transform duration-200 ${isItineraryOpen ? "rotate-180" : ""}`}
                  />
                </button>

            {isItineraryOpen ? (
              <div className="px-1 pb-1 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-300">Add each day briefly and keep the plan easy to scan.</p>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        itinerary: [...p.itinerary, { day: p.itinerary.length + 1, title: "", description: "" }],
                      }))
                    }
                    className={`${subtleButtonClassName} border-sky-200 text-sky-700 hover:bg-sky-50`}
                  >
                    <Plus size={13} />
                    Add Day
                  </button>
                </div>

                <div className="mt-3 space-y-2.5">
                  {form.itinerary.map((item, index) => (
                    <div key={`tour-itinerary-${index}`} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                          <ListTodo size={14} className="text-[var(--c-brand)]" />
                          {`Day ${index + 1}`}
                        </div>
                        {form.itinerary.length > 1 ? (
                          <button
                            type="button"
                            onClick={() =>
                              setForm((p) => ({
                                ...p,
                                itinerary: p.itinerary
                                  .filter((_, itineraryIndex) => itineraryIndex !== index)
                                  .map((entry, entryIndex) => ({ ...entry, day: entryIndex + 1 })),
                              }))
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200"
                          >
                            <X size={12} />
                            Remove
                          </button>
                        ) : null}
                      </div>
                      <div className="grid gap-2 md:grid-cols-[220px_minmax(0,1fr)]">
                        <input
                          className={inputClassName}
                          placeholder="Day title"
                          value={item.title}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              itinerary: p.itinerary.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, title: e.target.value } : entry,
                              ),
                            }))
                          }
                        />
                        <textarea
                          rows={3}
                          className={textareaClassName}
                          placeholder="Short day plan"
                          value={item.description}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              itinerary: p.itinerary.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, description: e.target.value } : entry,
                              ),
                            }))
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
              </div>
            </div>

            <div className="space-y-4">
              <section className={`${sectionClassName} overflow-hidden`}>
                <button
                  type="button"
                  onClick={() => setIsAvailabilityOpen((value) => !value)}
                  className={sectionToggleButtonClassName}
                >
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--c-brand)]">Availability</p>
                    <h3 className="mt-1 text-base font-black text-slate-900 dark:text-slate-100">Hotels & Vehicles</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">Choose what booking options this tour should allow.</p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-slate-500 transition-transform duration-200 ${isAvailabilityOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isAvailabilityOpen ? (
                  <div className="space-y-4 px-1 pb-1 pt-4">
                    <label className="space-y-2">
                      <span className={labelClassName}>Allowed Hotel Category Keys</span>
                      <input className={inputClassName} placeholder="comma separated e.g. 3_star,4_star" value={form.hotelCategoryKeys} onChange={(e) => setForm((p) => ({ ...p, hotelCategoryKeys: e.target.value }))} />
                    </label>
                    <label className="block space-y-2">
                      <span className={labelClassName}>Allowed Vehicle Type Keys</span>
                      <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
              <div className="relative" ref={vehicleDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsVehicleDropdownOpen((value) => !value)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-emerald-300 bg-white px-3.5 py-2.5 text-left text-sm text-slate-700 transition hover:bg-emerald-50 dark:border-emerald-700/60 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  <span className="truncate">{selectedVehicleSummary}</span>
                  <ChevronDown
                    size={14}
                    className={`shrink-0 text-slate-500 transition-transform ${isVehicleDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isVehicleDropdownOpen ? (
                  <div className="absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-2xl border border-emerald-300 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.14)] dark:border-emerald-700/60 dark:bg-slate-900">
                    <div className="max-h-56 overflow-y-auto p-2">
                      {configuredVehicleOptions.length ? configuredVehicleOptions.map((item) => {
                        const isSelected = selectedVehicleKeys.includes(item.key);
                        return (
                          <label
                            key={item.key}
                            className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                          >
                            <input
                              type="checkbox"
                              className="ql-check"
                              checked={isSelected}
                              onChange={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  vehicleTypeKeys: isSelected
                                    ? normalizeKeyList(prev.vehicleTypeKeys).filter((key) => key !== item.key)
                                    : mergeUniqueKeys(prev.vehicleTypeKeys, [item.key]),
                                }))
                              }
                            />
                            <span className="truncate">{item.label}</span>
                          </label>
                        );
                      }) : (
                        <p className="px-3 py-2 text-xs text-slate-500 dark:text-slate-300">No saved vehicle options yet.</p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <input
                  className={`min-w-0 flex-1 ${compactInputClassName}`}
                  placeholder="Custom vehicle"
                  value={customVehicleInput}
                  onChange={(e) => setCustomVehicleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addVehicleOption();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addVehicleOption}
                  className="shrink-0 inline-flex items-center justify-center rounded-lg bg-slate-900 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  Add
                </button>
              </div>
              {normalizeKeyList(form.vehicleTypeKeys).length ? (
                <div className="flex flex-wrap gap-2">
                  {normalizeKeyList(form.vehicleTypeKeys).map((key) => {
                    const matched = vehicleOptions.find((item) => item.key === key);
                    return (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      >
                        {matched?.label || key}
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              vehicleTypeKeys: normalizeKeyList(prev.vehicleTypeKeys).filter((item) => item !== key),
                            }))
                          }
                          className={inlineIconButtonClassName}
                          aria-label={`Remove ${key}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              ) : null}
              <p className="text-[11px] text-slate-500 dark:text-slate-300">
                {configuredVehicleOptions.length
                  ? "Use the dropdown to select multiple vehicles. You can also add a custom vehicle below."
                  : "No vehicle options found in Admin Settings > Pricing > Vehicles yet. You can still add custom vehicles for this tour."}
              </p>
                      </div>
                    </label>
                  </div>
                ) : null}
              </section>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/70 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Save as draft to review later, or publish when the package is ready for the website.
            </p>
            <div className="flex gap-3">
              <button type="submit" className={primaryButtonClassName}>
                {editing ? "Update Tour" : sourceBookingId ? "Create Itinerary" : "Create Tour"}
              </button>
            {editing && (
              <button type="button" onClick={() => { setEditing(null); setForm(initialForm); setCustomVehicleInput(""); setIsFormOpen(false); setSourceBookingId(""); setSourceBookingCode(""); setIsAvailabilityOpen(false); setIsReviewsOpen(false); setIsVehicleDropdownOpen(false); }} className={secondaryButtonClassName}>
                Cancel
              </button>
            )}
            </div>
          </div>
        </form>
      ) : null}

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden dark:bg-slate-900 dark:border-slate-700">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Tour</th>
              <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Price</th>
              <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Seats</th>
              <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Status</th>
              <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTours.map((tour) => {
              const isNew = isRecentlyAdded(tour?.createdAt);
              return (
                <tr key={tour.id} className={`border-t border-slate-100 ${isNew ? "bg-blue-50/40" : ""}`}>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 inline-flex items-center gap-2">
                      {tour.title}
                      {isNew ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-blue-100 text-blue-700">
                          New
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-slate-400">{tour.location}</p>
                  </td>
                  <td className="px-6 py-4 font-bold">
                    <div className="flex items-center gap-2">
                      <span>{tour.currency} {tour.price}</span>
                      {Number(tour.discountPercent || 0) > 0 ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-amber-700">
                          {tour.discountPercent}% Off
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4">{tour.availableSeats}</td>
                  <td className="px-6 py-4 capitalize">{tour.status}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setTourAction({ type: "print", tour })}
                        className="p-2 text-slate-600"
                      >
                        <Printer size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(tour);
                          setIsFormOpen(true);
                          setSourceBookingId("");
                          setSourceBookingCode("");
                          setCustomVehicleInput("");
                          setIsItineraryOpen(false);
                          setIsAvailabilityOpen(false);
                          setIsReviewsOpen(false);
                          setIsVehicleDropdownOpen(false);
                          setForm({
                            ...initialForm,
                            ...tour,
                            image: tour.image,
                            hotelCategoryKeys: tour.availableOptions?.hotelCategories?.join(", ") || "",
                            vehicleTypeKeys: normalizeKeyList(tour.availableOptions?.vehicleTypes),
                            itinerary: Array.isArray(tour.itinerary) && tour.itinerary.length
                              ? tour.itinerary.map((item, index) => ({
                                  day: Number(item?.day || index + 1),
                                  title: item?.title || "",
                                  description: item?.description || "",
                                }))
                              : initialForm.itinerary,
                            reviewItems: normalizeReviewItems(tour.reviewItems),
                          });
                        }}
                        className="p-2 text-blue-600"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button type="button" onClick={() => setTourAction({ type: "delete", tour })} className="p-2 text-rose-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {tourAction.tour ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm" onClick={closeTourAction} />
          <div className="relative w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--c-brand)]">Tour Action</p>
                <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-slate-100">
                  {tourAction.type === "delete" ? "Delete Tour" : "Print Tour Plan"}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                  {tourAction.type === "delete"
                    ? `This will remove ${tourAction.tour.title} from the tour list.`
                    : `Open a print-ready version of ${tourAction.tour.title}.`}
                </p>
              </div>
              <button type="button" onClick={closeTourAction} className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={16} />
              </button>
            </div>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                <MapIcon size={16} className="text-[var(--c-brand)]" />
                {tourAction.tour.title}
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{tourAction.tour.location || "No location added"}</p>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={closeTourAction} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (tourAction.type === "print") {
                    printTourPdf(tourAction.tour);
                    closeTourAction();
                    return;
                  }
                  await handleDelete(tourAction.tour.id);
                  closeTourAction();
                }}
                className={`rounded-2xl px-5 py-3 text-sm font-bold text-white ${tourAction.type === "delete" ? "bg-rose-600 hover:bg-rose-700" : "bg-slate-900 hover:bg-slate-800"}`}
              >
                {tourAction.type === "delete" ? "Delete Now" : "Open Print View"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TourManagement;
