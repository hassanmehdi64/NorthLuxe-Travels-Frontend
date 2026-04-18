import BookingDropdown from "./BookingDropdown";

const BookingTravelerSection = ({
  form,
  setForm,
  hasLockedTour,
  isCustomBooking,
  tours,
  isTravelerSectionValid,
  onNext,
}) => (
  <div className="rounded-xl border border-booking bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)] space-y-3.5">
    <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
      <label>
        <span className="ql-label">Full Name</span>
        <input
          className="ql-input"
          placeholder="e.g. Ali Khan"
          value={form.customerName}
          onChange={(e) =>
            setForm((p) => ({ ...p, customerName: e.target.value }))
          }
        />
      </label>
      <label>
        <span className="ql-label">Email</span>
        <input
          type="email"
          className="ql-input"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
        />
      </label>
      <label>
        <span className="ql-label">Phone</span>
        <input
          type="tel"
          className="ql-input"
          placeholder="+92 3XX XXX XXXX"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
        />
      </label>
      <label>
        <span className="ql-label">
          {hasLockedTour
            ? "Selected Tour"
            : isCustomBooking
              ? "Preferred Tour"
              : "Tour"}
        </span>
        <BookingDropdown
          value={form.tourId}
          disabled={hasLockedTour}
          placeholder="Select a tour"
          onChange={(nextValue) =>
            setForm((p) => ({ ...p, tourId: nextValue }))
          }
          options={tours.map((tour) => ({
            value: tour.id,
            label: `${tour.title} - ${tour.location}`,
          }))}
        />
      </label>
    </div>

    <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
      <label>
        <span className="ql-label">Traveler Type</span>
        <BookingDropdown
          value={form.travelerType}
          onChange={(nextValue) =>
            setForm((p) => ({ ...p, travelerType: nextValue }))
          }
          options={[
            { value: "local", label: "Pakistani Resident" },
            { value: "international", label: "International Visitor" },
          ]}
        />
      </label>

      {form.travelerType === "local" ? (
        <label>
          <span className="ql-label">Local ID Type</span>
          <BookingDropdown
            value={form.localIdType}
            onChange={(nextValue) =>
              setForm((p) => ({ ...p, localIdType: nextValue }))
            }
            options={[
              { value: "cnic", label: "CNIC" },
              { value: "passport", label: "Passport" },
            ]}
          />
        </label>
      ) : (
        <label>
          <span className="ql-label">Country</span>
          <input
            className="ql-input"
            placeholder="Country of Residence"
            value={form.country}
            onChange={(e) =>
              setForm((p) => ({ ...p, country: e.target.value }))
            }
          />
        </label>
      )}

      {form.travelerType === "local" ? (
        <label className="md:col-span-2">
          <span className="ql-label">
            {form.localIdType === "passport" ? "Passport Number" : "CNIC Number"}
          </span>
          <input
            className="ql-input"
            placeholder={form.localIdType === "passport" ? "AA1234567" : "12345-1234567-1"}
            value={form.localIdNumber}
            onChange={(e) =>
              setForm((p) => ({ ...p, localIdNumber: e.target.value }))
            }
          />
        </label>
      ) : (
        <label>
          <span className="ql-label">Passport Number</span>
          <input
            className="ql-input"
            placeholder="Passport Number"
            value={form.passportNumber}
            onChange={(e) =>
              setForm((p) => ({ ...p, passportNumber: e.target.value }))
            }
          />
        </label>
      )}
    </div>

    <div className="mt-2 flex justify-end">
      <button
        type="button"
        className="ql-btn-primary w-full sm:w-auto"
        disabled={!isTravelerSectionValid}
        onClick={onNext}
      >
        Next: Travel
      </button>
    </div>
  </div>
);

export default BookingTravelerSection;
