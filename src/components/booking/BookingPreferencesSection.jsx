import { CheckCircle2 } from "lucide-react";

const BookingPreferencesSection = ({
  bookingType,
  form,
  setForm,
  isTravelerSectionValid,
  isTravelSectionValid,
  isPreferencesSectionValid,
  onBack,
  onCancel,
  onContinue,
}) => (
  <div className="rounded-2xl border border-theme bg-theme-surface p-3.5 md:p-4.5 space-y-4 shadow-[0_8px_16px_rgba(15,23,42,0.06)]">
    <label>
      <span className="ql-label">Special Requirements</span>
      <textarea
        className="ql-textarea"
        rows={3}
        placeholder="Dietary preferences, accessibility needs, or trip notes."
        value={form.specialRequirements}
        onChange={(e) =>
          setForm((p) => ({ ...p, specialRequirements: e.target.value }))
        }
      />
    </label>

    {bookingType === "custom" ? (
      <label>
        <span className="ql-label">Custom Requirements</span>
        <textarea
          className="ql-textarea"
          rows={3}
          placeholder="Share route changes, stops, comfort preferences, or special requests."
          value={form.customRequirements}
          onChange={(e) =>
            setForm((p) => ({ ...p, customRequirements: e.target.value }))
          }
        />
      </label>
    ) : null}

    <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-between">
      <button
        type="button"
        className="ql-btn-secondary w-full sm:w-auto"
        onClick={onBack}
      >
        Back
      </button>
      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        <button
          type="button"
          className="ql-btn-secondary w-full sm:w-auto"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="ql-btn-primary w-full sm:w-auto"
          disabled={
            !isTravelerSectionValid ||
            !isTravelSectionValid ||
            !isPreferencesSectionValid
          }
          onClick={onContinue}
        >
          <CheckCircle2 size={16} /> Continue to Review
        </button>
      </div>
    </div>
  </div>
);

export default BookingPreferencesSection;
