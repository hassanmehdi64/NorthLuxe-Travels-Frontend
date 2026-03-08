const ContactMap = () => {
  return (
    <div className="rounded-2xl border border-theme bg-theme-surface p-4 sm:p-5 shadow-[0_10px_18px_rgba(15,23,42,0.06)]">
      <div className="mb-3">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--c-brand)] mb-1">
          Visit Our Region
        </p>
        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-theme">Location Map</h3>
      </div>
      <iframe
        title="North Luxe Travels Location"
        src="https://www.google.com/maps?q=Skardu&output=embed"
        className="w-full h-[360px] md:h-[420px] border-0 rounded-xl"
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default ContactMap;
