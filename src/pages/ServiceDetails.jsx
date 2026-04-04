import { Link, useParams } from "react-router-dom";
import { Check, MoveUpRight } from "lucide-react";
import { usePublicContentItem, usePublicContentList } from "../hooks/useCms";

const ServiceDetails = () => {
  const { slug } = useParams();
  const { data: backendService, isLoading } = usePublicContentItem("service", slug);
  const { data: backendServices = [] } = usePublicContentList("service");

  const service = backendService || null;

  if (!service && !isLoading) {
    return (
      <section className="py-12 lg:py-14 bg-theme-bg">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
          <div className="rounded-2xl border border-dashed border-theme bg-theme-surface py-16 text-center text-muted">
            Service not found.
          </div>
        </div>
      </section>
    );
  }

  if (!service) return null;

  const related = backendServices
    .filter((item) => (item.id || item.slug) !== (service.id || service.slug))
    .slice(0, 3);
  const deliverables = service.deliverables?.length ? service.deliverables : [];

  return (
    <section className="py-10 md:py-12 bg-theme-bg">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 space-y-7">
        <header className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--c-brand)]">Service Details</p>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-theme">{service.title}</h1>
          <p className="text-sm md:text-base text-muted">{service.category || "Service"}</p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-theme bg-theme-surface">
          <img src={service.image || service.coverImage} alt={service.title} className="h-[220px] w-full object-cover sm:h-[300px] lg:h-[360px]" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-theme">Overview</h2>
            <p className="text-sm md:text-base text-muted leading-relaxed">{service.description}</p>

            <h3 className="text-sm font-black uppercase tracking-[0.16em] text-theme">What You Get</h3>
            <ul className="space-y-2">
              {deliverables.map((item) => (
                <li key={item} className="inline-flex items-start gap-2 text-sm text-theme">
                  <Check size={14} className="mt-0.5 text-[var(--c-brand)]" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <aside className="h-fit rounded-2xl border border-theme bg-theme-surface p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted">Need This Service?</p>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Share your travel window and budget. We will prepare the right service package for your trip.
            </p>
            <Link
              to="/custom-plan-request"
              className="ql-btn-primary mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              Request Service Plan
              <MoveUpRight size={14} />
            </Link>
          </aside>
        </div>

        {related.length ? (
          <section>
            <h2 className="text-lg md:text-xl font-bold text-theme">Related Services</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id || item.slug}
                  to={`/services/${item.slug || item.id}`}
                  className="rounded-xl border border-theme bg-theme-surface p-4 transition hover:border-[var(--c-brand)]/45"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--c-brand)]">{item.category}</p>
                  <p className="mt-1 text-sm font-semibold text-theme">{item.title}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
};

export default ServiceDetails;
