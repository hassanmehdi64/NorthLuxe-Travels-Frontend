import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Edit2, Plus, Printer, Trash2, X, Map, ListTodo } from "lucide-react";
import { useAdminTours, useCreateTour, useDeleteTour, useUpdateTour, useUpdateBooking } from "../../hooks/useCms";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../lib/apiError";

const initialForm = {
  title: "",
  location: "",
  durationDays: 5,
  durationLabel: "",
  price: 0,
  currency: "USD",
  image: "",
  shortDescription: "",
  description: "",
  status: "draft",
  featured: false,
  availableSeats: 20,
  hotelCategoryKeys: "",
  vehicleTypeKeys: "",
  itinerary: [{ day: 1, title: "", description: "" }],
};

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

  useEffect(() => {
    const prefill = location.state?.prefill;
    const nextBookingId = location.state?.sourceBookingId || "";
    const nextBookingCode = location.state?.sourceBookingCode || "";
    if (!prefill) return;

    setEditing(null);
    setSourceBookingId(nextBookingId);
    setSourceBookingCode(nextBookingCode);
    setIsFormOpen(true);
    setForm({
      ...initialForm,
      ...prefill,
      hotelCategoryKeys: prefill.hotelCategoryKeys || "",
      vehicleTypeKeys: prefill.vehicleTypeKeys || "",
      itinerary: Array.isArray(prefill.itinerary) && prefill.itinerary.length
        ? prefill.itinerary.map((item, index) => ({
            day: Number(item?.day || index + 1),
            title: item?.title || "",
            description: item?.description || "",
          }))
        : initialForm.itinerary,
    });
  }, [location.state]);

  const sortedTours = useMemo(
    () =>
      [...tours].sort((a, b) => {
        const aTime = new Date(a?.createdAt || 0).getTime();
        const bTime = new Date(b?.createdAt || 0).getTime();
        return bTime - aTime;
      }),
    [tours],
  );

  const printTourPdf = (tour) => {
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>${tour.title} - Tour PDF</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
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
                  (item) => `<div style="margin-top: 14px;"><p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#13DDB4;">Day ${item.day || ""}${item.title ? ` - ${item.title}` : ""}</p><p style="margin:0;line-height:1.7;">${item.description || "No details added."}</p></div>`,
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
    const payload = {
      ...form,
      itinerary: form.itinerary
        .map((item, index) => ({
          day: index + 1,
          title: String(item?.title || "").trim(),
          description: String(item?.description || "").trim(),
        }))
        .filter((item) => item.title || item.description),
      availableOptions: {
        hotelCategories: form.hotelCategoryKeys
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        vehicleTypes: form.vehicleTypeKeys
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
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
            setIsFormOpen((value) => !value);
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold"
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
        <form onSubmit={onSubmit} className="bg-white rounded-3xl border border-slate-100 p-6 grid md:grid-cols-3 gap-4 dark:bg-slate-900 dark:border-slate-700">
          <label className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Title *</span>
            <input className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
          </label>
          <label className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Location *</span>
            <input className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" placeholder="Location" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} required />
          </label>
          <label className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Duration Days *</span>
            <input className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" type="number" placeholder="Duration Days" value={form.durationDays} onChange={(e) => setForm((p) => ({ ...p, durationDays: Number(e.target.value) }))} required />
          </label>
          <label className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Duration Label</span>
            <input className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" placeholder="e.g. 7 Days / 6 Nights" value={form.durationLabel} onChange={(e) => setForm((p) => ({ ...p, durationLabel: e.target.value }))} />
          </label>
          <label className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Price *</span>
            <input className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} required />
          </label>
          <label className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Available Seats</span>
            <input className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" type="number" placeholder="Seats" value={form.availableSeats} onChange={(e) => setForm((p) => ({ ...p, availableSeats: Number(e.target.value) }))} />
          </label>
          <label className="md:col-span-3 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Image URL *</span>
            <input className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" placeholder="Image URL" value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} required />
          </label>
          <label className="md:col-span-3 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Short Description</span>
            <textarea className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" placeholder="Short description" value={form.shortDescription} onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))} />
          </label>
          <label className="md:col-span-3 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Detailed Description</span>
            <textarea rows={5} className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" placeholder="Tour overview, highlights, inclusions, and important notes" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </label>
          <div className="md:col-span-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/70">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--c-brand)]">Standard Tour Itinerary</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">Day-wise plan builder</h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    itinerary: [...p.itinerary, { day: p.itinerary.length + 1, title: "", description: "" }],
                  }))
                }
                className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-sky-700 transition hover:bg-sky-50 dark:bg-slate-900"
              >
                <Plus size={14} />
                Add Day
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {form.itinerary.map((item, index) => (
                <div key={`tour-itinerary-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                      <ListTodo size={16} className="text-[var(--c-brand)]" />
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
                        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-rose-600 transition hover:text-rose-700"
                      >
                        <X size={14} />
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <div className="grid gap-3 md:grid-cols-[260px_minmax(0,1fr)]">
                    <input
                      className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                      placeholder="Day title e.g. Arrival in Hunza"
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
                      rows={4}
                      className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                      placeholder="Describe the day plan, sightseeing, hotel stay, transport, and highlights"
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
          <label className="md:col-span-3 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Allowed Hotel Category Keys</span>
            <input className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" placeholder="comma separated e.g. 3_star,4_star" value={form.hotelCategoryKeys} onChange={(e) => setForm((p) => ({ ...p, hotelCategoryKeys: e.target.value }))} />
          </label>
          <label className="md:col-span-3 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Allowed Vehicle Type Keys</span>
            <input className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" placeholder="comma separated e.g. premium_suv,hiace" value={form.vehicleTypeKeys} onChange={(e) => setForm((p) => ({ ...p, vehicleTypeKeys: e.target.value }))} />
          </label>
          <div className="flex flex-wrap items-end gap-4 md:col-span-3">
            <label className="space-y-2 min-w-[180px]">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Status</span>
              <select className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Feature Handling</span>
              <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, featured: false }))}
                  className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${!form.featured ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100" : "text-slate-500 hover:text-slate-700 dark:text-slate-300"}`}
                >
                  Regular
                </button>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, featured: true }))}
                  className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${form.featured ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900" : "text-slate-500 hover:text-slate-700 dark:text-slate-300"}`}
                >
                  Featured
                </button>
              </div>
            </div>
          </div>
          <div className="md:col-span-3 flex gap-3">
            <button type="submit" className="px-5 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm">
              {editing ? "Update Tour" : sourceBookingId ? "Create Itinerary" : "Create Tour"}
            </button>
            {editing && (
              <button type="button" onClick={() => { setEditing(null); setForm(initialForm); setIsFormOpen(false); setSourceBookingId(""); setSourceBookingCode(""); }} className="px-5 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold text-sm">
                Cancel
              </button>
            )}
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
                  <td className="px-6 py-4 font-bold">{tour.currency} {tour.price}</td>
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
                          setForm({
                            ...initialForm,
                            ...tour,
                            image: tour.image,
                            hotelCategoryKeys: tour.availableOptions?.hotelCategories?.join(", ") || "",
                            vehicleTypeKeys: tour.availableOptions?.vehicleTypes?.join(", ") || "",
                            itinerary: Array.isArray(tour.itinerary) && tour.itinerary.length
                              ? tour.itinerary.map((item, index) => ({
                                  day: Number(item?.day || index + 1),
                                  title: item?.title || "",
                                  description: item?.description || "",
                                }))
                              : initialForm.itinerary,
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
                <Map size={16} className="text-[var(--c-brand)]" />
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
