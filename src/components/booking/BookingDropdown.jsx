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
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className={`w-full rounded-2xl border px-4 py-3 text-left text-sm text-theme shadow-[0_5px_14px_rgba(123,231,196,0.18)] transition ${
          disabled
            ? "cursor-not-allowed border-[#d7e8e2] bg-[#f6faf8] text-muted shadow-none"
            : "border-[#89dfc3] bg-[#f2fff9] hover:border-[#67d7b2] hover:bg-[#e8fbf3]"
        }`}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className="block truncate">
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {!disabled && open ? (
        <div
          className={`absolute z-[120] w-full overflow-hidden rounded-2xl border border-[#89dfc3] bg-white p-1.5 shadow-[0_16px_32px_rgba(15,23,42,0.16)] ${
            openUpward ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <div className="max-h-60 overflow-auto space-y-1">
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
                  className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    isActive
                      ? "bg-[#7BE7C4] font-semibold text-[#0F172A]"
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

export default BookingDropdown;
