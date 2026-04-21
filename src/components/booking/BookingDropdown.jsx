import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const BookingDropdown = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const menuRef = useRef(null);
  const selectedOption = options.find((item) => item.value === value);

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
    if (disabled) setOpen(false);
  }, [disabled]);

  useEffect(() => {
    if (!open) return;
    const rect = menuRef.current?.getBoundingClientRect();
    if (!rect) return;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownNeed = 270;
    setOpenUpward(spaceBelow < dropdownNeed && spaceAbove > spaceBelow);
  }, [open, options.length]);

  return (
    <div className="relative min-w-0" ref={menuRef}>
      <button
        type="button"
        className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm text-theme transition ${
          disabled
            ? "cursor-not-allowed border-[#dde3ea] bg-[#f7f8fa] text-muted"
            : "cursor-pointer border-[rgba(15,23,42,0.1)] bg-white hover:border-[rgba(15,23,42,0.16)] hover:bg-[#fbfcfd]"
        }`}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <div className="pr-7">
          <span className="block truncate font-semibold">
            {selectedOption?.label || placeholder}
          </span>
          {selectedOption?.description ? (
            <span className="mt-1 block text-xs leading-4 text-muted">
              {selectedOption.description}
            </span>
          ) : null}
        </div>
        <ChevronDown
          size={14}
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {!disabled && open ? (
        <div
          className={`absolute z-[120] max-h-[min(18rem,70vh)] w-full min-w-0 overflow-hidden rounded-xl border border-[rgba(15,23,42,0.12)] bg-white p-1.5 shadow-[0_16px_32px_rgba(15,23,42,0.12)] ${
            openUpward ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <div className="max-h-[inherit] space-y-1 overflow-auto">
            {options.map((item) => {
              const isActive = item.value === value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  className={`w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    isActive
                      ? "bg-[#F7F1E3] text-[#2B2B2B]"
                      : "bg-white text-theme hover:bg-[#f7f8fa]"
                  }`}
                >
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className={`break-words ${isActive ? "font-bold" : "font-semibold"}`}>
                        {item.label}
                      </p>
                      {item.description ? (
                        <p className={`mt-1 text-xs leading-4 ${isActive ? "text-[#2B2B2B]/70" : "text-muted"}`}>
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                    {item.badge ? (
                      <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
                        isActive ? "bg-white text-[#2B2B2B]" : "bg-[#f3f5f7] text-subheading"
                      }`}>
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BookingDropdown;
