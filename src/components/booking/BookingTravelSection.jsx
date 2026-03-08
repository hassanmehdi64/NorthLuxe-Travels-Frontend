import PrettyDateField from "../TourBooking/PrettyDateField";
import BookingDropdown from "./BookingDropdown";

const BookingTravelSection = ({
  form,
  setForm,
  visibleHotelOptions,
  visibleVehicleOptions,
  isTravelSectionValid,
  onBack,
  onNext,
}) => (
  <div className="rounded-2xl border border-theme bg-theme-surface p-3.5 md:p-4.5 shadow-[0_8px_16px_rgba(15,23,42,0.06)]">
    <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
      <label>
        <span className="ql-label">Start Date</span>
        <PrettyDateField
          variant="standalone"
          placeholder="Select start date"
          when={form.travelDate}
          setWhen={(nextValue) =>
            setForm((p) => ({ ...p, travelDate: nextValue }))
          }
        />
      </label>
      <label>
        <span className="ql-label">End Date</span>
        <PrettyDateField
          variant="standalone"
          disabled={form.flexibleDates}
          placeholder="Select end date"
          when={form.endDate}
          setWhen={(nextValue) =>
            setForm((p) => ({ ...p, endDate: nextValue }))
          }
        />
        <label className="mt-2 inline-flex items-center gap-2 text-[13px] text-textMuted">
          <input
            type="checkbox"
            className="ql-check"
            checked={form.flexibleDates}
            onChange={(e) =>
              setForm((p) => ({ ...p, flexibleDates: e.target.checked }))
            }
          />
          My dates are flexible
        </label>
        {form.travelDate &&
        form.endDate &&
        form.endDate < form.travelDate ? (
          <span className="mt-1 block text-xs text-red-500">
            End date cannot be before travel date.
          </span>
        ) : null}
      </label>

      <div className="md:col-span-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-fr">
        <label className="space-y-1.5">
          <span className="ql-label mb-0 text-[10px] normal-case tracking-[0.08em]">
            Departure Time
          </span>
          <BookingDropdown
            value={form.travelTime}
            placeholder="No Preference"
            onChange={(nextValue) =>
              setForm((p) => ({ ...p, travelTime: nextValue }))
            }
            options={[
              { value: "", label: "No Preference" },
              { value: "early_morning", label: "Early Morning (6am - 9am)" },
              { value: "morning", label: "Morning (9am - 12pm)" },
              { value: "afternoon", label: "Afternoon (12pm - 4pm)" },
              { value: "evening", label: "Evening (4pm - 8pm)" },
            ]}
          />
        </label>

        <label className="space-y-1.5">
          <span className="ql-label mb-0 text-[10px] normal-case tracking-[0.08em]">
            Adults
          </span>
          <input
            type="number"
            min={1}
            className="ql-input"
            value={form.adults}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                adults: Number(e.target.value || 1),
              }))
            }
          />
        </label>

        <label className="space-y-1.5">
          <span className="ql-label mb-0 text-[10px] normal-case tracking-[0.08em]">
            Child Below 3
          </span>
          <input
            type="number"
            min={0}
            className="ql-input"
            value={form.children}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                children: Number(e.target.value || 0),
              }))
            }
          />
        </label>
      </div>
    </div>

    <div className="mt-4 space-y-4">
      <label className="inline-flex items-center gap-2 text-sm text-textMain">
        <input
          type="checkbox"
          className="ql-check"
          checked={form.facilities.hotelEnabled}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              facilities: {
                ...p.facilities,
                hotelEnabled: e.target.checked,
              },
            }))
          }
        />
        Include Hotel Stay
      </label>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <label>
          <span className="ql-label">Hotel Category</span>
          <BookingDropdown
            value={form.facilities.hotelType}
            disabled={!form.facilities.hotelEnabled}
            onChange={(nextValue) =>
              setForm((p) => ({
                ...p,
                facilities: {
                  ...p.facilities,
                  hotelType: nextValue,
                },
              }))
            }
            options={visibleHotelOptions.map((item) => ({
              value: item.key,
              label: item.label,
            }))}
          />
        </label>

        <label>
          <span className="ql-label">Vehicle Type</span>
          <BookingDropdown
            value={form.facilities.vehicleType}
            onChange={(nextValue) =>
              setForm((p) => ({
                ...p,
                facilities: {
                  ...p.facilities,
                  vehicleType: nextValue,
                },
              }))
            }
            options={visibleVehicleOptions.map((item) => ({
              value: item.key,
              label: item.label,
            }))}
          />
        </label>
      </div>
    </div>

    <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      <button
        type="button"
        className="ql-btn-secondary w-full sm:w-auto"
        onClick={onBack}
      >
        Back
      </button>
      <button
        type="button"
        className="ql-btn-primary w-full sm:w-auto"
        disabled={!isTravelSectionValid}
        onClick={onNext}
      >
        Next: Preferences
      </button>
    </div>
  </div>
);

export default BookingTravelSection;
