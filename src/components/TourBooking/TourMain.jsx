import { Search, MapPin, ShieldCheck, BadgeCheck, Headphones } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import PrettyDateField from "./PrettyDateField";
import PlaceSearchInput from "../search/PlaceSearchInput";
import { usePublicContentList, usePublicTours } from "../../hooks/useCms";
import { buildPlaceSuggestions } from "../../utils/tourSearch";

const HERO_POINTS = [
  { icon: ShieldCheck, label: "Trusted partners" },
  { icon: BadgeCheck, label: "Transparent pricing" },
  { icon: Headphones, label: "Fast support" },
];

const YOUTUBE_VIDEO_ID = "gu32w5wjsOM";
const HERO_PLAYBACK_RATE = 0.5;
const HERO_START_AT = 1;
const HERO_LOOP_CUTOFF_SECONDS = 1.8;

const loadYouTubeApi = () =>
  new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(null);
    if (window.YT?.Player) return resolve(window.YT);

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousReady === "function") previousReady();
      resolve(window.YT);
    };

    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });

const TourMain = () => {
  const navigate = useNavigate();
  const { data: tours = [] } = usePublicTours();
  const { data: destinationItems = [] } = usePublicContentList("destination");

  const [where, setWhere] = useState("");
  const [when, setWhen] = useState("");
  const [videoReady, setVideoReady] = useState(false);
  const [loopMaskVisible, setLoopMaskVisible] = useState(true);
  const playerHostRef = useRef(null);
  const playerRef = useRef(null);
  const loopRestartingRef = useRef(false);

  const placeSuggestions = useMemo(
    () =>
      buildPlaceSuggestions({ tours, destinationItems }),
    [tours, destinationItems],
  );

  useEffect(() => {
    let cancelled = false;
    let loopWatchInterval;

    const mountPlayer = async () => {
      const YT = await loadYouTubeApi();
      if (!YT?.Player || !playerHostRef.current || cancelled) return;

      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }

      playerRef.current = new YT.Player(playerHostRef.current, {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          loop: 1,
          modestbranding: 1,
          mute: 1,
          playsinline: 1,
          rel: 0,
          start: HERO_START_AT,
          playlist: YOUTUBE_VIDEO_ID,
        },
        events: {
          onReady: (event) => {
            event.target.mute();
            try {
              event.target.setPlaybackRate(HERO_PLAYBACK_RATE);
            } catch {
              // Ignore unsupported rate errors from YouTube.
            }
            event.target.playVideo();

            loopWatchInterval = window.setInterval(() => {
              try {
                const duration = Number(event.target.getDuration?.() || 0);
                const currentTime = Number(event.target.getCurrentTime?.() || 0);
                const remaining = duration - currentTime;
                if (duration > 0 && currentTime <= HERO_START_AT + 0.8) {
                  loopRestartingRef.current = false;
                }

                if (duration > 0 && remaining <= HERO_LOOP_CUTOFF_SECONDS && !loopRestartingRef.current) {
                  loopRestartingRef.current = true;
                  setLoopMaskVisible(true);
                  event.target.seekTo(HERO_START_AT, true);
                  try {
                    event.target.setPlaybackRate(HERO_PLAYBACK_RATE);
                  } catch {
                    // Ignore unsupported rate errors from YouTube.
                  }
                  event.target.playVideo();
                }
              } catch {
                // Ignore polling issues from YouTube while player is not ready.
              }
            }, 250);
          },
          onStateChange: (event) => {
            if (event.data === window.YT?.PlayerState?.PLAYING) {
              setVideoReady(true);
              loopRestartingRef.current = false;
              setLoopMaskVisible(false);
              try {
                event.target.setPlaybackRate(HERO_PLAYBACK_RATE);
              } catch {
                // Ignore unsupported rate errors from YouTube.
              }
            }

            if (event.data === window.YT?.PlayerState?.BUFFERING || event.data === window.YT?.PlayerState?.CUED) {
              setLoopMaskVisible(true);
            }

            if (event.data === window.YT?.PlayerState?.ENDED) {
              setLoopMaskVisible(true);
              event.target.seekTo(HERO_START_AT, true);
              try {
                event.target.setPlaybackRate(HERO_PLAYBACK_RATE);
              } catch {
                // Ignore unsupported rate errors from YouTube.
              }
              event.target.playVideo();
            }
          },
        },
      });
    };

    mountPlayer();

    return () => {
      cancelled = true;
      if (loopWatchInterval) {
        window.clearInterval(loopWatchInterval);
      }
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const trimmedWhere = where.trim();

    if (trimmedWhere) params.set("q", trimmedWhere);
    if (when) params.set("date", when);

    navigate(`/tours?${params.toString()}`);
  };

  return (
    <section className="relative flex min-h-[72vh] items-center justify-center overflow-hidden sm:-mx-[5px] md:min-h-[85vh]">
      <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
        <img
          src="/gb.jpg"
          alt="Gilgit Baltistan travel"
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-45"
        />
        <div className={`absolute inset-0 z-10 scale-[1.35] transition-opacity duration-300 md:scale-[1.18] ${videoReady ? "opacity-100" : "opacity-0"}`}>
          <div
            ref={playerHostRef}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        <img
          src="/gb.jpg"
          alt="Gilgit Baltistan scenic overlay"
          className={`absolute inset-0 z-20 h-full w-full object-cover transition-opacity duration-300 ${loopMaskVisible ? "opacity-100" : "opacity-0"}`}
        />
        <div className="absolute inset-0 z-30 bg-[linear-gradient(180deg,rgba(5,8,12,0.26),rgba(5,8,12,0.5))]" />
      </div>

      <div className="text-center px-4 max-w-4xl w-full">
        <h1 className="text-white text-3xl md:text-5xl font-semibold leading-tight">
          Discover Pakistan Beautifully
        </h1>

        <p className="mt-3 md:mt-4 text-white/85 text-sm md:text-lg">
          Luxury tours, verified partners, seamless booking.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 md:mt-8 bg-white rounded-2xl shadow-lg overflow-visible relative"
        >
          <div className="grid md:grid-cols-3 rounded-2xl">
            <div className="flex items-center gap-3 px-4 py-3.5 md:py-4 border-b md:border-b-0 md:border-r border-[var(--c-border)]">
              <MapPin size={18} className="text-[var(--c-muted)] shrink-0" />
              <PlaceSearchInput
                value={where}
                onChange={setWhere}
                suggestions={placeSuggestions}
                placeholder="Where to?"
                inputClassName="w-full bg-transparent outline-none text-sm text-[var(--c-text)] placeholder:text-[var(--c-muted)]"
              />
            </div>

            <PrettyDateField when={when} setWhen={setWhen} />

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

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 text-white/90">
          {HERO_POINTS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium md:text-sm"
            >
              <Icon size={14} className="shrink-0 text-[var(--c-brand)]" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TourMain;








