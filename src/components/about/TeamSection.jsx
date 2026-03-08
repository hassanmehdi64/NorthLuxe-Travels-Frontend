import { Quote, ShieldCheck } from "lucide-react";

const leadershipTeam = [
  {
    name: "Hassan Mehdi",
    role: "Chairman & Director",
    avatar: "./HM.png",
    message:
      "We craft journeys that inspire and comfort. Every trip reflects our dedication to trust, detail, and unforgettable experiences.",
    focusAreas: ["Guest Trust", "Service Standards", "Long-term Vision"],
  },
  {
    name: "Hassan Abbas",
    role: "CEO & Tour Operator",
    avatar: "./HA.png",
    message:
      "Our tours are executed with precision and passion. Every itinerary is designed to ensure seamless, memorable experiences.",
    focusAreas: ["Tour Operations", "Route Planning", "On-ground Execution"],
  },
];

const TeamSection = () => {
  return (
    <section className="py-12 lg:py-14 bg-theme-bg">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="mb-8 lg:mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-[var(--c-brand)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.34em] text-[var(--c-brand)]">
              Leadership
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-theme">
            Meet Our Team
          </h2>
          <p className="mt-3 max-w-2xl text-sm md:text-base text-muted leading-relaxed">
            The people behind each itinerary, committed to dependable planning and personalized support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {leadershipTeam.map((leader) => (
            <article
              key={leader.name}
              className="group rounded-2xl border border-theme bg-theme-surface p-5 sm:p-6 shadow-[0_8px_16px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_26px_rgba(15,23,42,0.12)] transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-theme-bg text-[var(--c-brand)] border border-theme">
                    <Quote size={16} />
                  </span>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">
                    Leader Message
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-theme bg-theme-bg px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-theme">
                  <ShieldCheck size={12} className="text-[var(--c-brand)]" />
                  Verified
                </span>
              </div>

              <p className="mt-4 text-sm md:text-base text-muted leading-relaxed">
                {leader.message}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {leader.focusAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center rounded-full border border-theme bg-theme-bg px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-muted"
                  >
                    {area}
                  </span>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-theme flex items-center gap-4">
                <img
                  src={leader.avatar}
                  alt={leader.name}
                  className="h-12 w-12 rounded-xl object-cover border border-theme bg-theme-bg"
                />
                <div>
                  <h3 className="text-base md:text-lg font-bold tracking-tight text-theme">{leader.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--c-brand)]">
                    {leader.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
