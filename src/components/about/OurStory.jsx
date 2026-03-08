const OurStory = () => {
  return (
    <section className="py-12 lg:py-14 bg-theme-bg">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="rounded-2xl border border-theme bg-theme-surface p-5 sm:p-6 lg:p-8 shadow-[0_10px_18px_rgba(15,23,42,0.06)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-xl border border-theme">
                <img
                  src="https://skardutrekkers.com/wp-content/uploads/2024/07/Deosai-National-Park01.png"
                  alt="Boutique travel in Gilgit Baltistan"
                  className="w-full h-[260px] sm:h-[320px] lg:h-[360px] object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-3">
                <span className="h-px w-8 bg-[var(--c-brand)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.34em] text-[var(--c-brand)]">
                  Our Story
                </span>
              </div>

              <h2 className="mt-3 text-2xl md:text-3xl font-bold text-theme tracking-tight">
                Built on Trust, Local Insight, and Real Comfort
              </h2>

              <div className="mt-4 space-y-4">
                <p className="text-sm md:text-base text-muted leading-relaxed">
                  North Luxe started with one goal: make travel in the North premium without losing authenticity. We design practical itineraries, partner with reliable local teams, and focus on smooth execution from arrival to return.
                </p>
                <p className="text-sm md:text-base text-muted leading-relaxed">
                  Whether you want a relaxed family trip or a high-adventure route, our planning approach keeps your comfort, safety, and time at the center.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-theme bg-theme-bg px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--c-brand)]">Local Network</p>
                  <p className="mt-1 text-sm text-theme font-semibold">Verified local partners</p>
                </div>
                <div className="rounded-xl border border-theme bg-theme-bg px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--c-brand)]">Safety First</p>
                  <p className="mt-1 text-sm text-theme font-semibold">Reliable support on route</p>
                </div>
                <div className="rounded-xl border border-theme bg-theme-bg px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--c-brand)]">Tailored Plans</p>
                  <p className="mt-1 text-sm text-theme font-semibold">Flexible itineraries by need</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
