// TourMain.jsx
import { Search, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import PrettyDateField from "./PrettyDateField";

const TourMain = () => {
  const navigate = useNavigate();

  const [where, setWhere] = useState("");
  const [when, setWhen] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (where.trim()) params.set("q", where.trim());
    if (when) params.set("date", when);
    navigate(`/tours?${params.toString()}`);
  };

  return (
    <section className="relative flex min-h-[72vh] items-center justify-center sm:-mx-[5px] md:min-h-[85vh]">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/gb.jpg"
          alt="Pakistan travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="text-center px-4 max-w-4xl w-full">
        <h1 className="text-white text-3xl md:text-5xl font-semibold leading-tight">
          Discover Pakistan Beautifully
        </h1>

        <p className="mt-3 md:mt-4 text-white/85 text-sm md:text-lg">
          Luxury tours, verified partners, seamless booking.
        </p>

        {/* IMPORTANT: no overflow-hidden anywhere around the date popover */}
        <form
          onSubmit={onSubmit}
          className="mt-6 md:mt-8 bg-white rounded-2xl shadow-lg overflow-visible relative">
          {/* IMPORTANT: remove overflow-hidden here too */}
          <div className="grid md:grid-cols-3 rounded-2xl">
            {/* Where */}
            <div className="flex items-center gap-3 px-4 py-3.5 md:py-4 border-b md:border-b-0 md:border-r border-[var(--c-border)]">
              <MapPin size={18} className="text-[var(--c-muted)]" />
              <input
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                placeholder="Where to?"
                className="w-full outline-none text-sm text-[var(--c-text)] placeholder:text-[var(--c-muted)]"
              />
            </div>

            {/* Date */}
            <PrettyDateField when={when} setWhen={setWhen} />

            {/* Search button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 py-3.5 md:py-4 font-semibold text-[var(--c-text)] transition rounded-br-2xl rounded-bl-2xl md:rounded-bl-none md:rounded-tr-2xl md:rounded-br-2xl"
              style={{ background: "var(--c-brand)" }}>
              <Search size={18} />
              Search
            </button>
          </div>
        </form>

        <div className="mt-5 md:mt-6 flex flex-wrap justify-center gap-3 md:gap-4">
          <Link
            to="/custom-plan-request"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-[var(--c-text)] transition"
            style={{ background: "var(--c-brand)" }}>
            Custom Request
          </Link>

          <Link
            to="/book"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold border border-white/40 text-white hover:bg-white/10 transition">
            Book Tour
          </Link>
        </div>

        <p className="mt-4 text-white/75 text-sm">
          Trusted partners • Transparent pricing • Fast support
        </p>
      </div>
    </section>
  );
};

export default TourMain;
