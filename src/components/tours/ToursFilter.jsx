import {
  Calendar,
  ChevronDown,
  MapPin,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const FilterDropdown = ({
  value,
  onChange,
  options,
  placeholder = "Select",
}) => {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const menuRef = useRef(null);
  const selected = options.find((item) => item.value === value);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const rect = menuRef.current?.getBoundingClientRect();
    if (!rect) return;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownNeed = 220;
    setOpenUpward(spaceBelow < dropdownNeed && spaceAbove > spaceBelow);
  }, [open, options.length]);

  return (
    <div ref={menuRef} className="relative w-full sm:w-auto sm:min-w-[170px]">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="h-9 w-full rounded-lg border border-theme bg-theme-surface px-3 text-left text-sm font-semibold text-theme transition hover:border-[var(--c-brand)]/45 hover:bg-theme-bg"
        aria-expanded={open}
      >
        <span className="block truncate pr-6">{selected?.label || placeholder}</span>
        <ChevronDown
          size={14}
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div
          className={`absolute z-[80] w-full overflow-hidden rounded-xl border border-[#89dfc3] bg-white p-1.5 shadow-[0_16px_32px_rgba(15,23,42,0.16)] ${
            openUpward ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <div className="max-h-56 overflow-auto space-y-1">
            {options.map((item) => {
              const active = value === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                    active
                      ? "bg-[#7BE7C4] text-[#0F172A] font-semibold"
                      : "bg-[#f8fffc] text-theme hover:bg-[#dcf8ed]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const ToursFilter = ({
  filters,
  setFilters,
  destinations,
}) => {
  const set = (patch) => setFilters((prev) => ({ ...prev, ...patch }));

  return (
    <section className="py-8 lg:py-10 bg-theme-bg">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="mb-3 flex items-center justify-center">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--c-brand)]" />
            <span className="text-[11px] font-black uppercase tracking-[0.26em] text-[var(--c-brand)]">
              Smart Filters
            </span>
            <span className="h-px w-8 bg-[var(--c-brand)]" />
          </div>
        </div>

        <div className="rounded-xl border border-theme bg-theme-surface p-2.5 shadow-[0_10px_18px_rgba(15,23,42,0.06)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            <InlineSelect icon={MapPin} label="Location">
              <FilterDropdown
                value={filters.destination}
                onChange={(nextValue) => set({ destination: nextValue })}
                options={destinations.map((item) => ({
                  value: item,
                  label: item === "all" ? "All Regions" : item,
                }))}
              />
            </InlineSelect>

            <InlineSelect icon={Calendar} label="Duration">
              <FilterDropdown
                value={filters.duration}
                onChange={(nextValue) => set({ duration: nextValue })}
                options={[
                  { value: "all", label: "Any Days" },
                  { value: "1-3", label: "1-3 Days" },
                  { value: "4-7", label: "4-7 Days" },
                  { value: "8+", label: "8+ Days" },
                ]}
              />
            </InlineSelect>

            <InlineSelect icon={SlidersHorizontal} label="Priority">
              <FilterDropdown
                value={filters.sortBy}
                onChange={(nextValue) => set({ sortBy: nextValue })}
                options={[
                  { value: "popular", label: "Popular" },
                  { value: "newest", label: "Latest" },
                  { value: "price_low", label: "Budget" },
                  { value: "price_high", label: "Premium" },
                ]}
              />
            </InlineSelect>
          </div>
        </div>
      </div>
    </section>
  );
};

const InlineSelect = ({ icon: Icon, label, children }) => (
  <label className="flex items-center gap-2.5 rounded-lg border border-theme bg-theme-bg px-2.5 py-2 text-xs font-black uppercase tracking-[0.1em] text-muted">
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--c-brand)]/10">
      <Icon size={14} className="text-[var(--c-brand)]" />
    </span>
    <span className="text-[11px] sm:text-[12px] shrink-0">{label}</span>
    <div className="ml-auto w-full sm:w-auto">{children}</div>
  </label>
);

export default ToursFilter;
