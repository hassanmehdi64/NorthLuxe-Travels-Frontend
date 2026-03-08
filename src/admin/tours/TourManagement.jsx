import { useMemo, useState } from "react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useAdminTours, useCreateTour, useDeleteTour, useUpdateTour } from "../../hooks/useCms";
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
  status: "draft",
  featured: false,
  availableSeats: 20,
  hotelCategoryKeys: "",
  vehicleTypeKeys: "",
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
  const { data: tours = [] } = useAdminTours();
  const createTour = useCreateTour();
  const updateTour = useUpdateTour();
  const deleteTour = useDeleteTour();

  const [editing, setEditing] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const sortedTours = useMemo(
    () =>
      [...tours].sort((a, b) => {
        const aTime = new Date(a?.createdAt || 0).getTime();
        const bTime = new Date(b?.createdAt || 0).getTime();
        return bTime - aTime;
      }),
    [tours],
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
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
        await updateTour.mutateAsync({
          id: editing.id,
          ...payload,
        });
        toast.success(
          "Tour updated",
          form.status === "published"
            ? "The tour is updated on the public site."
            : "Saved as draft. It will not appear publicly until published.",
        );
      } else {
        await createTour.mutateAsync(payload);
        toast.success(
          "Tour created",
          form.status === "published"
            ? "The tour is now available on the public site."
            : "Saved as draft. It will not appear publicly until published.",
        );
      }
      setEditing(null);
      setIsFormOpen(false);
      setForm(initialForm);
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
            setForm(initialForm);
            setIsFormOpen((value) => !value);
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold"
        >
          <Plus size={16} />
          {isFormOpen ? "Close Form" : "Add New Tour"}
        </button>
      </div>

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
          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Allowed Hotel Category Keys</span>
          <input className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" placeholder="comma separated e.g. 3_star,4_star" value={form.hotelCategoryKeys} onChange={(e) => setForm((p) => ({ ...p, hotelCategoryKeys: e.target.value }))} />
        </label>
        <label className="md:col-span-3 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Allowed Vehicle Type Keys</span>
          <input className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" placeholder="comma separated e.g. premium_suv,hiace" value={form.vehicleTypeKeys} onChange={(e) => setForm((p) => ({ ...p, vehicleTypeKeys: e.target.value }))} />
        </label>
        <div className="flex items-center gap-4 md:col-span-3">
          <label className="space-y-2 min-w-[180px]">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Status</span>
            <select className="p-3 rounded-xl border border-slate-200 w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-600 inline-flex items-center gap-2 mt-6">
            <input type="checkbox" className="mr-1" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} />
            Featured Tour
          </label>
        </div>
        <div className="md:col-span-3 flex gap-3">
          <button type="submit" className="px-5 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm">
            {editing ? "Update Tour" : "Create Tour"}
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm(initialForm); setIsFormOpen(false); }} className="px-5 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold text-sm">
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
                      onClick={() => {
                        setEditing(tour);
                        setIsFormOpen(true);
                        setForm({
                          ...initialForm,
                          ...tour,
                          image: tour.image,
                          hotelCategoryKeys: tour.availableOptions?.hotelCategories?.join(", ") || "",
                          vehicleTypeKeys: tour.availableOptions?.vehicleTypes?.join(", ") || "",
                        });
                      }}
                      className="p-2 text-blue-600"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(tour.id)} className="p-2 text-rose-600">
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
    </div>
  );
};

export default TourManagement;
