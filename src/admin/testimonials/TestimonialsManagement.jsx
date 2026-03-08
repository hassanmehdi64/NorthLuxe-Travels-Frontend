import { useMemo, useState } from "react";
import { Edit2, Plus, Star, Trash2 } from "lucide-react";
import {
  useAdminTestimonials,
  useCreateTestimonial,
  useDeleteTestimonial,
  useUpdateTestimonial,
} from "../../hooks/useCms";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../lib/apiError";

const initialForm = {
  name: "",
  role: "Guest",
  city: "",
  country: "",
  rating: 5,
  message: "",
  photo: "",
  date: "",
  status: "draft",
};

const TestimonialsManagement = () => {
  const toast = useToast();
  const { data: testimonials = [] } = useAdminTestimonials();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();

  const [editingId, setEditingId] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState("");
  const [form, setForm] = useState(initialForm);

  const sortedItems = useMemo(
    () => [...testimonials].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [testimonials],
  );

  const resetForm = () => {
    setEditingId("");
    setForm(initialForm);
    setIsFormOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      toast.error("Validation error", "Name and review text are required.");
      return;
    }

    try {
      if (editingId) {
        await updateTestimonial.mutateAsync({ id: editingId, ...form });
        toast.success("Updated", "Testimonial updated successfully.");
      } else {
        await createTestimonial.mutateAsync(form);
        toast.success("Created", "Testimonial saved.");
      }
      resetForm();
    } catch (error) {
      toast.error("Save failed", getApiErrorMessage(error, "Please try again."));
    }
  };

  const startEdit = (item) => {
    setIsFormOpen(true);
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      role: item.role || "Guest",
      city: item.city || "",
      country: item.country || "",
      rating: item.rating || 5,
      message: item.message || "",
      photo: item.photo || item.avatar || "",
      date: item.date ? item.date.slice(0, 10) : "",
      status: item.status || "draft",
    });
  };

  const handleDelete = async (id) => {
    if (pendingDeleteId !== id) {
      setPendingDeleteId(id);
      toast.info("Confirm delete", "Click delete again to remove this testimonial.");
      return;
    }
    try {
      await deleteTestimonial.mutateAsync(id);
      toast.success("Deleted", "Testimonial removed.");
      if (editingId === id) resetForm();
      setPendingDeleteId("");
    } catch (error) {
      toast.error("Delete failed", getApiErrorMessage(error, "Please try again."));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl xl:3xl font-black text-slate-900 tracking-tighter uppercase">
          Testimonials
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Manage guest reviews shown in "What Our Guests Say".
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setEditingId("");
            setForm(initialForm);
            setIsFormOpen((value) => !value);
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold"
        >
          <Plus size={16} />
          {isFormOpen ? "Close Form" : "Add Testimonial"}
        </button>
      </div>

      {isFormOpen ? (
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-100 rounded-[2rem] p-6 grid md:grid-cols-2 gap-4"
      >
        <label>
          <span className="ql-label">Name</span>
          <input
            className="ql-input"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
        </label>
        <label>
          <span className="ql-label">Role</span>
          <input
            className="ql-input"
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
          />
        </label>
        <label>
          <span className="ql-label">City</span>
          <input
            className="ql-input"
            value={form.city}
            onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
          />
        </label>
        <label>
          <span className="ql-label">Country</span>
          <input
            className="ql-input"
            value={form.country}
            onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
          />
        </label>
        <label>
          <span className="ql-label">Rating (1-5)</span>
          <input
            type="number"
            min={1}
            max={5}
            className="ql-input"
            value={form.rating}
            onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
          />
        </label>
        <label>
          <span className="ql-label">Review Date</span>
          <input
            type="date"
            className="ql-input"
            value={form.date}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
          />
        </label>
        <label className="md:col-span-2">
          <span className="ql-label">Photo URL (optional)</span>
          <input
            className="ql-input"
            value={form.photo}
            onChange={(e) => setForm((prev) => ({ ...prev, photo: e.target.value }))}
          />
        </label>
        <label className="md:col-span-2">
          <span className="ql-label">Review Text</span>
          <textarea
            rows={4}
            className="ql-textarea"
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
          />
        </label>
        <label>
          <span className="ql-label">Status</span>
          <select
            className="ql-select"
            value={form.status}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="published">Publish</option>
            <option value="draft">Draft</option>
          </select>
        </label>

        <div className="md:col-span-2 flex items-center gap-3">
          <button type="submit" className="ql-btn-primary">
            <Plus size={16} />
            {editingId ? "Update Testimonial" : "Create Testimonial"}
          </button>
          {editingId ? (
            <button type="button" onClick={resetForm} className="ql-btn-secondary">
              Cancel
            </button>
          ) : null}
        </div>
      </form>
      ) : null}

      <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Guest
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Rating
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Date
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.photo || item.avatar || "https://via.placeholder.com/40x40?text=NL"}
                        alt={item.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          {[item.city, item.country].filter(Boolean).join(", ") || item.role}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="inline-flex items-center gap-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-bold text-slate-700">{item.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-600">
                    {new Date(item.date || item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        item.status === "published"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="p-2 text-slate-500 hover:text-blue-600"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className={`p-2 ${
                          pendingDeleteId === item.id
                            ? "text-rose-600"
                            : "text-slate-500 hover:text-rose-600"
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsManagement;
