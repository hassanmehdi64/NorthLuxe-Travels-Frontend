import { Link, useParams } from "react-router-dom";
import {
  Camera,
  ChevronRight,
  Map,
  Mountain,
  MoveUpRight,
  Users,
  ImageOff,
} from "lucide-react";
import { usePublicContentItem, usePublicContentList, usePublicTours } from "../hooks/useCms";
import { normalizeDestinationKey, resolveDestinationMatch } from "../utils/destinations";

const FALLBACK_HERO_IMAGE = "https://gilgitbaltistan.gov.pk/public/images/river-5688258_1920.jpg";
const MAX_GALLERY_IMAGES = 12;

const humanizeDestinationName = (value = "destination") =>
  String(value || "destination")
    .replace(/-/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const toParagraphs = (value = "") =>
  String(value || "")
    .split("\n\n")
    .map((item) => item.trim())
    .filter(Boolean);

const highlightKeywords = (text = "") => {
  const keywords = ["mountain", "valley", "culture", "meadows", "lakes", "routes", "local", "scenic", "heritage"];
  let output = String(text || "");

  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b(${keyword}\\w*)\\b`, "gi");
    output = output.replace(
      regex,
      '<span class="font-semibold text-theme">$1</span>',
    );
  });

  return output;
};

const splitMetaList = (value, fallback) => {
  const items = Array.isArray(value)
    ? value
    : String(value || "")
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter(Boolean);

  return items.length ? items : fallback;
};

const StoryCard = ({ icon: Icon, title, items, tone = "green" }) => {
  const tones = {
    green: "bg-[rgba(36,179,126,0.08)] text-[var(--c-brand)]",
    navy: "bg-[rgba(6,27,58,0.08)] text-[#0b2545]",
    sand: "bg-[rgba(198,162,75,0.12)] text-[#8b6a1f]",
  };

  return (
    <article className="group flex h-full flex-col rounded-[1.7rem] border border-[rgba(15,23,42,0.08)] bg-white/96 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,0.08)] md:p-6">
      <div className="flex items-center gap-3">
        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone] || tones.green}`}>
          <Icon size={18} />
        </span>
        <h3 className="text-lg font-semibold tracking-[-0.02em] text-theme">{title}</h3>
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm leading-6 text-muted">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--c-brand)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
};

const EmptyToursState = () => (
  <div className="flex flex-col items-center rounded-[1.8rem] border border-dashed border-[rgba(36,179,126,0.24)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,250,247,0.96))] px-6 py-12 text-center shadow-[0_14px_34px_rgba(15,23,42,0.04)]">
    <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(36,179,126,0.12)] text-[var(--c-brand)]">
      <ImageOff size={24} />
    </span>
    <h3 className="mt-5 text-lg font-semibold text-theme">Tours are being curated for this destination</h3>
    <p className="mt-2 max-w-md text-sm leading-6 text-muted">
      We do not have a published trip for this location yet, but you can still explore similar routes and comfort-focused travel plans across the north.
    </p>
    <Link
      to="/tours"
      className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--c-brand)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1da56e]">
      Explore Other Tours
      <MoveUpRight size={15} />
    </Link>
  </div>
);

const DestinationDetails = () => {
  const { slug } = useParams();
  const normalizedSlug = String(slug || "").trim().toLowerCase();
  const destinationKey = normalizeDestinationKey(normalizedSlug);

  const { data: tours = [] } = usePublicTours();
  const { data: destinationItems = [] } = usePublicContentList("destination");
  const { data: exactDestination } = usePublicContentItem("destination", normalizedSlug);

  const destination = exactDestination || resolveDestinationMatch(destinationItems, normalizedSlug);
  const destinationName = destination?.title || humanizeDestinationName(normalizedSlug || "destination");

  const matchedTours = tours.filter((tour) => {
    const locationKey = normalizeDestinationKey(tour?.location || "");
    return locationKey && locationKey === destinationKey;
  });

  const shortDescription =
    destination?.shortDescription ||
    destination?.description ||
    `Explore curated trips, practical itineraries, and verified travel experiences in ${destinationName}.`;

  const overviewText =
    destination?.description ||
    destination?.shortDescription ||
    `${destinationName} is a premium northern destination known for scenic routes, comfortable stays, and practical trip planning support.`;

  const storyText =
    destination?.content ||
    `${destinationName} offers a layered travel story shaped by mountain roads, local hospitality, and memorable natural scenery. The destination content from the admin dashboard now drives this page, making it easier to keep the experience current and consistent.`;

  const storyParagraphs = toParagraphs(storyText);
  const overviewParagraphs = toParagraphs(overviewText);

  const whyVisitItems = splitMetaList(
    destination?.highlights,
    ["Iconic landscapes and scenic viewpoints", "Comfort-focused route planning", "Local culture, food, and warm hospitality"],
  );
  const experienceItems = splitMetaList(
    destination?.features,
    ["Verified stays and practical support", "Flexible pacing for scenic stops", "A clean blend of nature, comfort, and local experiences"],
  );
  const bestForItems = splitMetaList(
    destination?.meta?.idealFor,
    ["Couples and families", "Road-trip lovers and photographers", "Travelers wanting a calm premium northern escape"],
  );

  const galleryImages = Array.from(
    new Set(
      [
        destination?.coverImage,
        destination?.image,
        ...(destination?.gallery || []),
        ...matchedTours.flatMap((tour) => [tour?.image, ...(tour?.gallery || [])]),
        FALLBACK_HERO_IMAGE,
      ].filter(Boolean),
    ),
  ).slice(0, MAX_GALLERY_IMAGES);

  const featuredImage = galleryImages[0] || FALLBACK_HERO_IMAGE;
  const supportingImages = galleryImages.slice(1, 3);
  const galleryCount = galleryImages.length;
  const extraPhotoCount = Math.max(galleryImages.length - 3, 0);

  const tourCountLabel = matchedTours.length === 1 ? "1 curated tour" : `${matchedTours.length} curated tours`;

  return (
    <section className="bg-[linear-gradient(180deg,#f7fafc_0%,#f8fbfd_32%,#ffffff_100%)] py-5 md:py-6">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-3 px-4 sm:px-6 lg:px-8 xl:px-10">
        <section className="rounded-[1.7rem] bg-white px-5 py-5 shadow-[0_14px_34px_rgba(15,23,42,0.04)] sm:px-6 sm:py-6">
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--c-brand)]">
              {destination?.eyebrow || "Destination Overview"}
            </p>
            <div className="mt-3 max-w-3xl">
              <h1 className="text-[1.9rem] font-semibold leading-[1.02] tracking-[-0.045em] text-theme sm:text-[2.35rem] lg:text-[2.8rem]">
                {destinationName}
              </h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted">
                {shortDescription}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.2rem] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf9_100%)] p-4 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.05)]">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted">Region</p>
              <p className="mt-2 text-sm font-semibold text-theme">{destinationName}</p>
            </div>
            <div className="rounded-[1.2rem] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf9_100%)] p-4 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.05)]">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted">Best Time</p>
              <p className="mt-2 text-sm font-semibold text-theme">
                {destination?.meta?.bestTime || "May to October"}
              </p>
            </div>
            <div className="rounded-[1.2rem] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf9_100%)] p-4 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.05)]">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted">Available Tours</p>
              <p className="mt-2 text-sm font-semibold text-theme">{tourCountLabel}</p>
            </div>
          </div>
        </section>

        <section id="destination-story-gallery" className="space-y-2">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--c-brand)]">Photo Story</p>
              <h2 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.03em] text-theme sm:text-[1.45rem]">
                Destination gallery
              </h2>
            </div>
          </div>

          {galleryCount <= 1 ? (
            <div className="group relative overflow-hidden rounded-[1.55rem] bg-[#d9e7e1] shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
              <img
                src={featuredImage}
                alt={`${destinationName} featured`}
                className="h-[15rem] w-full object-cover transition duration-500 group-hover:scale-[1.04] sm:h-[18rem] lg:h-[20rem]"
              />
            </div>
          ) : galleryCount === 2 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {galleryImages.slice(0, 2).map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="group overflow-hidden rounded-[1.5rem] bg-[#dfe9e4] shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
                  <img
                    src={image}
                    alt={`${destinationName} gallery ${index + 1}`}
                    className="h-[14rem] w-full object-cover transition duration-500 group-hover:scale-[1.04] sm:h-[17rem] lg:h-[18rem]"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.45fr)_minmax(14rem,0.82fr)]">
              <div className="group relative overflow-hidden rounded-[1.55rem] bg-[#d9e7e1] shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
                <img
                  src={featuredImage}
                  alt={`${destinationName} featured`}
                  className="h-[15rem] w-full object-cover transition duration-500 group-hover:scale-[1.04] sm:h-[18rem] lg:h-[21rem]"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,27,58,0.04)_15%,rgba(6,27,58,0.38)_100%)]" />
                <div className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full border border-white/18 bg-[rgba(6,27,58,0.58)] px-3.5 py-2 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(6,27,58,0.18)] backdrop-blur-md">
                  <Camera size={15} />
                  {extraPhotoCount > 0 ? `+${extraPhotoCount} Photos` : `${galleryImages.length} Photos`}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {supportingImages.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="group overflow-hidden rounded-[1.45rem] bg-[#dfe9e4] shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
                    <img
                      src={image}
                      alt={`${destinationName} gallery ${index + 2}`}
                      className="h-[10rem] w-full object-cover transition duration-500 group-hover:scale-[1.04] sm:h-[11rem] lg:h-[9rem]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-start">
          <article className="rounded-[1.7rem] bg-white px-5 py-5 shadow-[0_14px_34px_rgba(15,23,42,0.04)] sm:px-6 sm:py-6">
            <div className="max-w-3xl">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--c-brand)]">Editorial Overview</p>
              <h2 className="mt-3 text-[1.6rem] font-semibold tracking-[-0.035em] text-theme sm:text-[1.95rem]">
                Discover the story behind {destinationName}
              </h2>
            </div>
            <div className="mt-5 h-px w-full bg-[linear-gradient(90deg,rgba(36,179,126,0.22),rgba(15,23,42,0.06),transparent)]" />
            <div className="mt-5 max-w-3xl space-y-4">
              {overviewParagraphs.map((paragraph, index) => (
                <p
                  key={`${paragraph.slice(0, 38)}-${index}`}
                  className="text-[15px] leading-8 text-muted"
                  dangerouslySetInnerHTML={{ __html: highlightKeywords(paragraph) }}
                />
              ))}
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {storyParagraphs.slice(0, 2).map((paragraph, index) => (
                <div
                  key={`${paragraph.slice(0, 38)}-story-${index}`}
                  className="rounded-[1.25rem] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_100%)] px-4 py-4 text-sm leading-7 text-muted shadow-[inset_0_0_0_1px_rgba(15,23,42,0.05)]"
                  dangerouslySetInnerHTML={{ __html: highlightKeywords(paragraph) }}
                />
              ))}
            </div>
          </article>

          <aside className="rounded-[1.7rem] bg-[linear-gradient(180deg,#ffffff_0%,#f6fbf8_100%)] px-5 py-5 shadow-[0_14px_34px_rgba(15,23,42,0.04)] sm:px-6">
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[var(--c-brand)]">Travel Notes</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-white/90 p-4 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.05)]">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted">Best time to visit</p>
                <p className="mt-2 text-sm font-semibold text-theme">
                  {destination?.meta?.bestTime || "May to October"}
                </p>
              </div>
              <div className="rounded-2xl bg-white/90 p-4 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.05)]">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted">Popular for</p>
                <p className="mt-2 text-sm font-semibold text-theme">
                  {bestForItems[0]}
                </p>
              </div>
              <div className="rounded-2xl bg-white/90 p-4 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.05)]">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted">Published tours</p>
                <p className="mt-2 text-sm font-semibold text-theme">{tourCountLabel}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {[...whyVisitItems.slice(0, 2), ...experienceItems.slice(0, 1), ...bestForItems.slice(0, 1)].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[rgba(36,179,126,0.08)] px-3.5 py-2 text-xs font-semibold text-theme">
                  {item}
                </span>
              ))}
            </div>
          </aside>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <StoryCard icon={Mountain} title={`Why Visit ${destinationName}`} items={whyVisitItems} tone="green" />
          <StoryCard icon={Map} title="Travel Experience" items={experienceItems} tone="navy" />
          <StoryCard icon={Users} title="Best For" items={bestForItems} tone="sand" />
        </section>

        <section className="rounded-[1.8rem] bg-white px-5 py-5 shadow-[0_16px_38px_rgba(15,23,42,0.045)] sm:px-6 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--c-brand)]">Curated Trips</p>
              <h2 className="mt-3 text-[1.55rem] font-semibold tracking-[-0.03em] text-theme sm:text-[1.9rem]">
                Available tours in {destinationName}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
                Explore ready-to-book journeys connected to this destination, with verified stays, clear itineraries, and a cleaner premium planning experience.
              </p>
            </div>
            <Link
              to="/tours"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-theme transition hover:text-[var(--c-brand)]">
              Browse all tours
              <MoveUpRight size={14} />
            </Link>
          </div>

          <div className="mt-5">
            {matchedTours.length ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {matchedTours.map((tour) => (
                  <article
                    key={tour.id}
                    className="group overflow-hidden rounded-[1.55rem] border border-[rgba(15,23,42,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_100%)] shadow-[0_14px_34px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,0.08)]">
                    {tour.image ? (
                      <div className="overflow-hidden">
                        <img
                          src={tour.image}
                          alt={tour.title}
                          className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                        />
                      </div>
                    ) : null}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold tracking-[-0.02em] text-theme line-clamp-1">
                            {tour.title}
                          </h3>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--c-brand)]">
                            {tour.location || destinationName}
                          </p>
                        </div>
                        <span className="rounded-full bg-[rgba(36,179,126,0.1)] px-2.5 py-1 text-[11px] font-semibold text-[var(--c-brand)]">
                          {tour.currency || "PKR"} {tour.price || 0}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted line-clamp-3">
                        {tour.shortDescription || "Premium trip plan with local coordination and verified stays."}
                      </p>
                      <Link
                        to={`/tours/${tour.slug}`}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-theme transition hover:text-[var(--c-brand)]">
                        View tour
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyToursState />
            )}
          </div>
        </section>
      </div>
    </section>
  );
};

export default DestinationDetails;
