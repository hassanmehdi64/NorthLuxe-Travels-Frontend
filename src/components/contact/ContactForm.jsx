import { useState } from "react";
import { useCreateContact } from "../../hooks/useCms";
import { useToast } from "../../context/ToastContext";

const ContactForm = () => {
  const createContact = useCreateContact();
  const toast = useToast();
  const [form, setForm] = useState({ sender: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createContact.mutateAsync(form);
      setForm({ sender: "", email: "", subject: "", message: "" });
      toast.success("Message sent", "Our concierge team will get back to you soon.");
    } catch (error) {
      toast.error(
        "Unable to send message",
        error?.response?.data?.message || "Please try again in a moment.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-theme bg-theme-surface p-5 sm:p-6 lg:p-7 space-y-5 shadow-[0_10px_18px_rgba(15,23,42,0.06)]"
    >
      <div className="pb-3 border-b border-theme">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--c-brand)]">
          Send Inquiry
        </p>
        <h3 className="text-2xl md:text-3xl font-bold text-theme mt-2 tracking-tight">
          Tell Us About Your Journey
        </h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="ql-label">Full Name</label>
          <input
            type="text"
            placeholder="Your name"
            required
            value={form.sender}
            onChange={(e) => setForm((prev) => ({ ...prev, sender: e.target.value }))}
            className="ql-input"
          />
        </div>

        <div>
          <label className="ql-label">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            required
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="ql-input"
          />
        </div>
      </div>

      <div>
        <label className="ql-label">Subject</label>
        <input
          type="text"
          placeholder="Trip inquiry"
          required
          value={form.subject}
          onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
          className="ql-input"
        />
      </div>

      <div>
        <label className="ql-label">Message</label>
        <textarea
          rows="6"
          placeholder="Tell us about your travel plans, dates, and preferences..."
          required
          value={form.message}
          onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
          className="ql-textarea"
        ></textarea>
      </div>

      <button
        type="submit"
        className="ql-btn-primary w-full py-3 font-bold uppercase tracking-[0.16em] text-[11px]"
      >
        Send Message
      </button>
    </form>
  );
};

export default ContactForm;
