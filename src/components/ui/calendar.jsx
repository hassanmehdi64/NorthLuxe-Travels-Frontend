import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const shiftMonth = (date, offset) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + offset);
  return next;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  month,
  defaultMonth,
  selected,
  onMonthChange,
  ...props
}) {
  const initialMonth = React.useMemo(() => {
    if (month) return month;
    if (defaultMonth) return defaultMonth;
    if (selected instanceof Date && !Number.isNaN(selected.getTime())) return selected;
    return new Date();
  }, [defaultMonth, month, selected]);

  const [internalMonth, setInternalMonth] = React.useState(initialMonth);
  const [openMenu, setOpenMenu] = React.useState(null);
  const rootRef = React.useRef(null);

  React.useEffect(() => {
    if (month) setInternalMonth(month);
  }, [month]);

  React.useEffect(() => {
    const handleOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const displayMonth = month ?? internalMonth;
  const currentYear = displayMonth.getFullYear();
  const years = React.useMemo(
    () => Array.from({ length: 15 }, (_, index) => currentYear - 7 + index),
    [currentYear],
  );

  const handleMonthChange = React.useCallback(
    (nextMonth) => {
      if (!month) {
        setInternalMonth(nextMonth);
      }
      onMonthChange?.(nextMonth);
    },
    [month, onMonthChange],
  );

  const selectMonth = (monthIndex) => {
    const next = new Date(displayMonth);
    next.setMonth(monthIndex);
    handleMonthChange(next);
    setOpenMenu(null);
  };

  const selectYear = (yearValue) => {
    const next = new Date(displayMonth);
    next.setFullYear(yearValue);
    handleMonthChange(next);
    setOpenMenu(null);
  };

  return (
    <div ref={rootRef} className={cn("relative w-full max-w-[17.5rem] p-2.5 sm:max-w-none sm:p-3.5", className)}>
      <div className="mb-2 flex items-center justify-between gap-1.5 px-0.5 sm:gap-2 sm:px-1">
        <button
          type="button"
          onClick={() => handleMonthChange(shiftMonth(displayMonth, -1))}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-700 transition hover:bg-slate-100"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="relative flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOpenMenu((prev) => (prev === "month" ? null : "month"))}
            className="inline-flex items-center gap-1 rounded-md px-1 py-1 text-sm font-medium text-slate-900 transition hover:bg-slate-100 sm:px-1.5 sm:text-[15px]"
          >
            {MONTHS[displayMonth.getMonth()]}
            <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
          </button>
          <button
            type="button"
            onClick={() => setOpenMenu((prev) => (prev === "year" ? null : "year"))}
            className="inline-flex items-center gap-1 rounded-md px-1 py-1 text-sm font-medium text-slate-900 transition hover:bg-slate-100 sm:px-1.5 sm:text-[15px]"
          >
            {displayMonth.getFullYear()}
            <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
          </button>

          {openMenu === "month" ? (
            <div className="absolute left-0 top-full z-20 mt-2 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_36px_rgba(15,23,42,0.12)] sm:w-44 sm:p-2">
              <div className="grid grid-cols-3 gap-1">
                {MONTHS.map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => selectMonth(index)}
                    className={cn(
                      "rounded-lg px-1.5 py-1.5 text-xs font-medium transition sm:px-2 sm:py-2 sm:text-sm",
                      index === displayMonth.getMonth()
                        ? "bg-slate-950 text-white"
                        : "text-slate-700 hover:bg-slate-100",
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {openMenu === "year" ? (
            <div className="absolute right-0 top-full z-20 mt-2 w-[4.5rem] rounded-xl border border-slate-200 bg-white p-1 shadow-[0_18px_36px_rgba(15,23,42,0.12)] sm:w-[5rem]">
              <div className="calendar-year-scroll max-h-44 overflow-y-auto sm:max-h-56">
                {years.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => selectYear(item)}
                    className={cn(
                      "flex w-full rounded-lg px-1.5 py-1.5 text-[11px] font-medium transition sm:py-2 sm:text-xs",
                      item === displayMonth.getFullYear()
                        ? "bg-slate-950 text-white"
                        : "text-slate-700 hover:bg-slate-100",
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => handleMonthChange(shiftMonth(displayMonth, 1))}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-700 transition hover:bg-slate-100"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <DayPicker
        showOutsideDays={showOutsideDays}
        month={displayMonth}
        onMonthChange={handleMonthChange}
        className="p-0"
        classNames={{
          months: "flex flex-col items-stretch",
          month: "w-full space-y-3",
          month_caption: "hidden",
          nav: "hidden",
          month_grid: "w-full border-collapse",
          weekdays: "flex w-full justify-between",
          weekday: "flex h-8 w-8 items-center justify-center text-center text-[10px] font-normal text-slate-500 sm:h-9 sm:w-9 sm:text-[11px]",
          week: "mt-1.5 flex w-full justify-between",
          day: "h-8 w-8 p-0 text-center text-sm sm:h-9 sm:w-9",
          day_button:
            "h-8 w-8 rounded-full p-0 text-sm font-normal text-slate-900 transition hover:bg-slate-100 sm:h-9 sm:w-9 sm:text-[15px]",
          selected:
            "bg-slate-950 text-white hover:bg-slate-950 hover:text-white focus:bg-slate-950 focus:text-white",
          today: "text-slate-900",
          outside: "text-slate-400",
          disabled: "text-slate-300 opacity-50",
          hidden: "invisible",
          ...classNames,
        }}
        {...props}
      />
    </div>
  );
}

export { Calendar };
