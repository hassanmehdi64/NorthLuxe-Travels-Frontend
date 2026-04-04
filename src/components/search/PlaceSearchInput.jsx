import { useEffect, useMemo, useRef, useState } from "react";
import { filterPlaceSuggestions } from "../../utils/tourSearch";

const PlaceSearchInput = ({
  value,
  onChange,
  suggestions = [],
  placeholder = "Search places",
  rootClassName = "",
  inputClassName = "",
  panelClassName = "",
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handleOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const visibleSuggestions = useMemo(
    () => filterPlaceSuggestions(suggestions, value, 7),
    [suggestions, value],
  );

  return (
    <div ref={rootRef} className={`relative w-full ${rootClassName}`.trim()}>
      <input
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={inputClassName}
      />

      {open && visibleSuggestions.length ? (
        <div className={`absolute left-0 right-0 top-full z-50 mt-3 rounded-2xl border border-theme bg-white p-1.5 shadow-[0_18px_36px_rgba(15,23,42,0.14)] ${panelClassName}`.trim()}>
          <div className="space-y-1">
            {visibleSuggestions.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  onChange(item.label);
                  setOpen(false);
                }}
                className="flex w-full cursor-pointer items-center rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-theme transition hover:bg-theme-bg"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PlaceSearchInput;
