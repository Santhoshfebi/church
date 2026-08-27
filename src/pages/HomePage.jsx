import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  Baby,
  BookMarked,
  BookOpen,
  CalendarDays,
  Church,
  Clock3,
  Coffee,
  Heart,
  HeartHandshake,
  Mail,
  MapPin,
  MapPinned,
  MessageCircle,
  Mic2,
  Music2,
  Navigation,
  Phone,
  Play,
  Send,
  Smile,
  Sparkles,
  Users,
  UsersRound,
  X,
} from "lucide-react";

import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

import Navbar from "../components/Navbar";
import BlurredImage from "../components/BlurredImage";

import {
  submitPrayerRequest,
  submitContactMessage,
} from "../services/churchFormService";

import { getPublicEvents } from "../services/eventService";

import {
  getPublicSermons,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
} from "../services/sermonService";

import { getPublicMinistries } from "../services/ministryService";

import { getChurchSettings } from "../services/churchSettingsService";

import { getPublicBooks } from "../services/bookService";

/* ========================================================================== */
/* HOME PAGE                                                                 */
/* ========================================================================== */

export default function HomePage() {
  /* ====================================================================== */
  /* SETTINGS                                                               */
  /* ====================================================================== */

  const [churchSettings, setChurchSettings] = useState(null);

  /* ====================================================================== */
  /* MINISTRIES                                                             */
  /* ====================================================================== */

  const [publicMinistries, setPublicMinistries] = useState([]);

  const [ministriesLoading, setMinistriesLoading] = useState(true);

  const [ministriesError, setMinistriesError] = useState("");

  const [selectedMinistry, setSelectedMinistry] = useState(null);

  /* ====================================================================== */
  /* BOOKS                                                                  */
  /* ====================================================================== */

  const [publicBooks, setPublicBooks] = useState([]);

  const [booksLoading, setBooksLoading] = useState(true);

  const [booksError, setBooksError] = useState("");

  const [selectedBook, setSelectedBook] = useState(null);

  /* ====================================================================== */
  /* SERMONS                                                                */
  /* ====================================================================== */

  const [publicSermons, setPublicSermons] = useState([]);

  const [sermonsLoading, setSermonsLoading] = useState(true);

  const [sermonsError, setSermonsError] = useState("");

  const [selectedSermon, setSelectedSermon] = useState(null);

  /* ====================================================================== */
  /* EVENTS                                                                 */
  /* ====================================================================== */

  const [publicEvents, setPublicEvents] = useState([]);

  const [eventsLoading, setEventsLoading] = useState(true);

  const [eventsError, setEventsError] = useState("");

  const [prayerForm, setPrayerForm] = useState({
    name: "",
    email: "",
    prayerRequest: "",
    wantsContact: false,
  });

  const [prayerSubmitting, setPrayerSubmitting] = useState(false);
  const [prayerStatus, setPrayerStatus] = useState("");

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Question",
    message: "",
  });

  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState("");

  /* ====================================================================== */
  /* LOAD DATA                                                              */
  /* ====================================================================== */

  useEffect(() => {
    const loadPage = async () => {
      await Promise.allSettled([
        loadSettings(),
        loadMinistries(),
        loadBooks(),
        loadSermons(),
        loadEvents(),
      ]);
    };

    loadPage();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getChurchSettings();

      setChurchSettings(data);
    } catch (error) {
      console.error("Settings error:", error);
    }
  };

  const loadMinistries = async () => {
    try {
      setMinistriesLoading(true);

      setMinistriesError("");

      const data = await getPublicMinistries();

      setPublicMinistries(data || []);
    } catch (error) {
      console.error("Ministry error:", error);

      setMinistriesError("Unable to load ministries right now.");
    } finally {
      setMinistriesLoading(false);
    }
  };

  const loadBooks = async () => {
    try {
      setBooksLoading(true);

      setBooksError("");

      const data = await getPublicBooks();

      setPublicBooks(data || []);
    } catch (error) {
      console.error("Books error:", error);

      setBooksError("Unable to load published books.");
    } finally {
      setBooksLoading(false);
    }
  };

  const loadSermons = async () => {
    try {
      setSermonsLoading(true);

      setSermonsError("");

      const data = await getPublicSermons();

      setPublicSermons(data || []);
    } catch (error) {
      console.error("Sermon error:", error);

      setSermonsError("Unable to load sermons right now.");
    } finally {
      setSermonsLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      setEventsLoading(true);

      setEventsError("");

      const data = await getPublicEvents();

      setPublicEvents(data || []);
    } catch (error) {
      console.error("Event error:", error);

      setEventsError("Unable to load upcoming events.");
    } finally {
      setEventsLoading(false);
    }
  };

  /* ====================================================================== */
  /* SETTINGS                                                               */
  /* ====================================================================== */

  const churchName =
    churchSettings?.church_name || "New Grace Jesus With Us Church";

  const shortName = churchSettings?.short_name || "New Grace";

  const heroTitle = churchSettings?.hero_title || "Jesus With Us.";

  const heroHighlight = churchSettings?.hero_highlight || "Grace For Everyone.";

  const heroDescription =
    churchSettings?.hero_description ||
    "A Christ-centered community where you can encounter Jesus, grow in faith, find meaningful relationships, and experience God's transforming grace.";

  const serviceDay = churchSettings?.service_day || "Sunday";

  const serviceTime = churchSettings?.service_time || "10:00 AM";

  const address = churchSettings?.address || "Church Location";

  const mapsUrl = churchSettings?.google_maps_url || "https://maps.google.com";

  const phone = churchSettings?.phone || "+91 00000 00000";

  const email = churchSettings?.email || "hello@newgracechurch.org";

  const facebookUrl = churchSettings?.facebook_url || "#";

  const instagramUrl = churchSettings?.instagram_url || "#";

  const youtubeUrl = churchSettings?.youtube_url || "#";

  /* ====================================================================== */
  /* SELECT FIRST MINISTRY                                                  */
  /* ====================================================================== */

  useEffect(() => {
    if (publicMinistries.length === 0) {
      setSelectedMinistry(null);

      return;
    }

    const exists =
      selectedMinistry &&
      publicMinistries.some((item) => item.id === selectedMinistry.id);

    if (!exists) {
      setSelectedMinistry(publicMinistries[0]);
    }
  }, [publicMinistries, selectedMinistry]);

  /* ====================================================================== */
  /* SERMONS                                                                */
  /* ====================================================================== */

  const featuredSermon =
    publicSermons.find((item) => item.is_featured) || publicSermons[0] || null;

  const recentSermons = featuredSermon
    ? publicSermons.filter((item) => item.id !== featuredSermon.id).slice(0, 6)
    : [];

  /* ====================================================================== */
  /* EVENTS                                                                 */
  /* ====================================================================== */

  const featuredEvent =
    publicEvents.find((item) => item.is_featured) || publicEvents[0] || null;

  const upcomingEvents = featuredEvent
    ? publicEvents.filter((item) => item.id !== featuredEvent.id).slice(0, 6)
    : [];

  /* ====================================================================== */
  /* BODY LOCK                                                              */
  /* ====================================================================== */

  useEffect(() => {
    document.body.style.overflow =
      selectedBook || selectedSermon ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedBook, selectedSermon]);

  /* ====================================================================== */
  /* PRAYER SUBMIT                                                          */
  /* ====================================================================== */

  const handlePrayerSubmit = async (e) => {
    e.preventDefault();

    if (!prayerForm.prayerRequest.trim()) {
      setPrayerStatus("Please enter your prayer request.");
      return;
    }

    try {
      setPrayerSubmitting(true);
      setPrayerStatus("");

      await submitPrayerRequest(prayerForm);

      setPrayerForm({
        name: "",
        email: "",
        prayerRequest: "",
        wantsContact: false,
      });

      setPrayerStatus("Thank you. Your prayer request has been received.");
    } catch (error) {
      console.error("Prayer request error:", error);

      setPrayerStatus("Something went wrong. Please try again.");
    } finally {
      setPrayerSubmitting(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (
      !contactForm.name.trim() ||
      !contactForm.email.trim() ||
      !contactForm.message.trim()
    ) {
      setContactStatus("Please complete your name, email, and message.");
      return;
    }

    try {
      setContactSubmitting(true);
      setContactStatus("");

      await submitContactMessage(contactForm);

      setContactForm({
        name: "",
        email: "",
        phone: "",
        subject: "General Question",
        message: "",
      });

      setContactStatus("Thank you. Your message has been sent.");
    } catch (error) {
      console.error("Contact form error:", error);

      setContactStatus("Something went wrong. Please try again.");
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <Navbar />

      {/* ================================================================== */}
      {/* HERO                                                               */}
      {/* ================================================================== */}

      <section
        id="home"
        className="relative min-h-screen overflow-hidden bg-zinc-950 text-white"
      >
        <img
          src="https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=2200&q=90"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/65 to-black/25" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-24 pt-32 lg:px-8">
          <div className="max-w-4xl">
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 backdrop-blur"
            >
              <Church size={15} />
              Welcome to {shortName}
            </motion.div>

            <motion.h1
              initial={{
                opacity: 0,
                y: 35,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.75,
                delay: 0.08,
              }}
              className="mt-7 text-5xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-8xl"
            >
              {heroTitle}

              <span className="block text-amber-300">{heroHighlight}</span>
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.18,
              }}
              className="mt-8 max-w-2xl text-base leading-8 text-white/65 sm:text-lg"
            >
              {heroDescription}
            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.28,
              }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="#visit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-7 py-4 font-semibold text-zinc-950 transition hover:bg-amber-200"
              >
                Plan Your Visit
                <ArrowRight size={18} />
              </a>

              <a
                href="#sermons"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                <Play size={17} />
                Watch Latest Message
              </a>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.42,
              }}
              className="mt-12 flex flex-wrap gap-6 border-t border-white/10 pt-7 text-sm text-white/55"
            >
              <div className="flex items-center gap-2">
                <Clock3 size={16} className="text-amber-300" />
                {serviceDay} • {serviceTime}
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-amber-300" />

                {address}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* ABOUT - PREMIUM SPLIT LAYOUT                                       */}
      {/* ================================================================== */}

      <section
        id="about"
        className="overflow-hidden bg-[#f7f4ed] px-6 py-24 sm:py-32 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          {/* LEFT SIDE */}

          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
            }}
            className="relative lg:pr-8"
          >
            {/* MAIN IMAGE */}

            <div className="overflow-hidden rounded-[2rem]">
              <img
                src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1400&q=90"
                alt="Church worship"
                className="h-[500px] w-full object-cover sm:h-[600px] lg:h-[610px]"
              />
            </div>

            {/* TOP FLOATING LABEL */}

            <div className="absolute left-6 top-6 z-20 rounded-[1.3rem] bg-white/95 px-6 py-5 shadow-xl backdrop-blur sm:left-8 sm:top-8">
              <p className="text-2xl font-semibold tracking-tight text-zinc-950">
                Jesus
              </p>

              <p className="mt-1 text-sm text-zinc-500">is at the center.</p>
            </div>

            {/* SECONDARY IMAGE */}

            <div className="absolute -bottom-10 right-2 z-20 hidden w-[220px] overflow-hidden rounded-[1.4rem] border-[8px] border-[#f7f4ed] shadow-xl sm:block lg:-right-3 lg:w-[235px]">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=90"
                alt="Life with God"
                className="h-[270px] w-full object-cover"
              />
            </div>
          </motion.div>

          {/* RIGHT SIDE */}

          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
            }}
            className="lg:pl-4"
          >
            {/* EYEBROW */}

            <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
              <Sparkles size={17} />
              Who We Are
            </div>

            {/* TITLE */}

            <h2 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.08] tracking-[-0.04em] text-zinc-950 sm:text-6xl lg:text-[68px]">
              A church where
              <br />
              everyone can
              <br />
              experience God&apos;s
              <br />
              grace.
            </h2>

            {/* DESCRIPTION */}

            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600">
              {churchName} is a Christ-centered community passionate about
              loving God, loving people, and sharing the hope found in Jesus.
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-500">
              Whether you&apos;ve followed Jesus for many years, are returning
              to church, or are simply searching for answers, you are welcome
              here. We want every person to find family, grow spiritually, and
              discover God&apos;s purpose for their life.
            </p>

            {/* FEATURE CARDS */}

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <AboutFeatureCard
                icon={HeartHandshake}
                title="Come As You Are"
                description="You don't need to have everything figured out before you walk through our doors."
              />

              <AboutFeatureCard
                icon={Users}
                title="Find Community"
                description="Build meaningful relationships and grow together as one church family."
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* MINISTRIES                                                         */}
      {/* ================================================================== */}

      <section
        id="ministries"
        className="overflow-hidden bg-[#f7f4ed] px-6 py-24 sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Our Ministries"
            title="Find where you belong."
            description="Discover communities where you can grow in faith, build meaningful friendships, serve others, and walk with Jesus together."
          />

          {ministriesLoading ? (
            <LoadingBox icon={UsersRound} text="Loading ministries..." />
          ) : ministriesError ? (
            <ErrorBox text={ministriesError} />
          ) : publicMinistries.length === 0 ? (
            <EmptyBox
              icon={UsersRound}
              title="Ministries are coming soon."
              text="Check back soon for ways to get connected."
            />
          ) : (
            <>
              <MinistryCarousel
                ministries={publicMinistries}
                selected={selectedMinistry}
                onSelect={setSelectedMinistry}
              />

              <MinistrySpotlight ministry={selectedMinistry} />
            </>
          )}
        </div>
      </section>

      {/* ================================================================== */}
      {/* BOOKS                                                              */}
      {/* ================================================================== */}

      <section
        id="books"
        className="overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Published Books"
            title="Resources for your faith journey."
            description="Explore publications from our church and ministry leaders created to encourage, equip, and strengthen your walk with God."
          />

          {booksLoading ? (
            <LoadingBox icon={BookOpen} text="Loading books..." />
          ) : booksError ? (
            <ErrorBox text={booksError} />
          ) : publicBooks.length === 0 ? (
            <EmptyBox
              icon={BookOpen}
              title="No books published yet."
              text="Check back soon for new publications."
            />
          ) : (
            <BooksCarousel books={publicBooks} onSelect={setSelectedBook} />
          )}
        </div>
      </section>

      {/* ================================================================== */}
      {/* MISSION                                                            */}
      {/* ================================================================== */}

      <section className="relative overflow-hidden bg-zinc-950 px-6 py-24 text-white sm:py-32 lg:px-8">
        <div className="absolute -left-60 top-0 h-[500px] w-[500px] rounded-full bg-amber-300/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                Our Mission
              </p>

              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Helping people know Jesus and live transformed lives.
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <MissionCard
                number="01"
                title="Encounter Jesus"
                text="Experience the love, presence, and transforming power of God."
              />

              <MissionCard
                number="02"
                title="Grow Together"
                text="Grow through Scripture, worship, prayer, fellowship, and discipleship."
              />

              <MissionCard
                number="03"
                title="Impact Our World"
                text="Share God's grace through compassion, service, and the Gospel."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* SERMONS - SAME STYLE AS YOUR REFERENCE                             */}
      {/* ================================================================== */}

      <section
        id="sermons"
        className="overflow-hidden bg-[#f7f4ed] px-6 py-24 sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Messages"
            title="Be encouraged by God's Word."
            description="Watch our latest messages and discover biblical teaching designed to help you grow in faith and follow Jesus."
          />

          {sermonsLoading ? (
            <div className="mt-16 rounded-[2rem] bg-white p-12 text-center shadow-sm">
              <Play
                size={34}
                className="mx-auto animate-pulse text-amber-700"
              />

              <p className="mt-4 text-sm text-zinc-500">Loading messages...</p>
            </div>
          ) : sermonsError ? (
            <ErrorBox text={sermonsError} />
          ) : !featuredSermon ? (
            <EmptyBox
              icon={BookOpen}
              title="No sermons available yet."
              text="Check back soon for new messages."
            />
          ) : (
            <>
              <motion.article
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.7,
                }}
                className="mt-16 overflow-hidden rounded-[2rem] bg-zinc-950 text-white shadow-2xl"
              >
                <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="group relative aspect-video overflow-hidden lg:aspect-auto lg:min-h-[560px]">
                    <YouTubeThumbnail
                      sermon={featuredSermon}
                      className="absolute inset-0 h-full w-full"
                    />

                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                    <button
                      type="button"
                      onClick={() => setSelectedSermon(featuredSermon)}
                      className="absolute left-1/2 top-1/2 z-20 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl transition duration-300 hover:scale-110 hover:bg-red-500"
                    >
                      <Play size={27} fill="currentColor" />
                    </button>

                    <div className="absolute bottom-7 left-7 z-20">
                      <span className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] backdrop-blur">
                        Latest Message
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                      Sunday Message
                    </p>

                    <h3 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                      {featuredSermon.title}
                    </h3>

                    <div className="mt-6 space-y-3 text-sm text-white/60">
                      {featuredSermon.speaker && (
                        <SermonInfo icon={Mic2}>
                          {featuredSermon.speaker}
                        </SermonInfo>
                      )}

                      {featuredSermon.scripture && (
                        <SermonInfo icon={BookMarked}>
                          {featuredSermon.scripture}
                        </SermonInfo>
                      )}

                      <SermonInfo icon={CalendarDays}>
                        {formatSermonDate(featuredSermon.sermon_date)}
                      </SermonInfo>

                      {featuredSermon.duration && (
                        <SermonInfo icon={Clock3}>
                          {featuredSermon.duration}
                        </SermonInfo>
                      )}
                    </div>

                    {featuredSermon.description && (
                      <p className="mt-8 leading-8 text-white/55">
                        {featuredSermon.description}
                      </p>
                    )}

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setSelectedSermon(featuredSermon)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-7 py-4 font-semibold text-white transition hover:bg-red-500"
                      >
                        <Play size={18} fill="currentColor" />
                        Watch Message
                      </button>

                      {featuredSermon.youtube_url && (
                        <a
                          href={featuredSermon.youtube_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-4 font-semibold text-white hover:bg-white/10"
                        >
                          <FaYoutube size={18} />
                          YouTube
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>

              {recentSermons.length > 0 && (
                <div className="mt-20">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                        Watch Anytime
                      </p>

                      <h3 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                        Recent Messages
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <FaYoutube size={17} className="text-red-600" />
                      Available on YouTube
                    </div>
                  </div>

                  <div className="mt-9 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                    {recentSermons.map((sermon, index) => (
                      <motion.article
                        key={sermon.id}
                        initial={{
                          opacity: 0,
                          y: 30,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          delay: index * 0.06,
                        }}
                        className="group overflow-hidden rounded-[1.75rem] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedSermon(sermon)}
                          className="relative block aspect-video w-full overflow-hidden bg-zinc-950"
                        >
                          <YouTubeThumbnail
                            sermon={sermon}
                            className="h-full w-full transition duration-700 group-hover:scale-105"
                          />

                          <div className="absolute inset-0 z-10 bg-black/15 transition group-hover:bg-black/30" />

                          <div className="absolute inset-0 z-20 flex items-center justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-xl transition group-hover:scale-110">
                              <Play size={22} fill="currentColor" />
                            </div>
                          </div>

                          {sermon.duration && (
                            <span className="absolute bottom-4 right-4 z-20 rounded-full bg-black/75 px-3 py-1.5 text-xs text-white backdrop-blur">
                              {sermon.duration}
                            </span>
                          )}
                        </button>

                        <div className="p-7">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                            Sunday Message
                          </p>

                          <h4 className="mt-3 line-clamp-2 text-2xl font-semibold tracking-tight text-zinc-900">
                            {sermon.title}
                          </h4>

                          <div className="mt-5 space-y-2 text-sm text-zinc-500">
                            {sermon.speaker && (
                              <SermonCardInfo
                                icon={Mic2}
                                value={sermon.speaker}
                              />
                            )}

                            {sermon.scripture && (
                              <SermonCardInfo
                                icon={BookMarked}
                                value={sermon.scripture}
                              />
                            )}

                            <SermonCardInfo
                              icon={CalendarDays}
                              value={formatSermonDate(sermon.sermon_date)}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedSermon(sermon)}
                            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900"
                          >
                            Watch Message
                            <ArrowRight
                              size={16}
                              className="transition-transform group-hover:translate-x-1"
                            />
                          </button>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ================================================================== */}
      {/* EVENTS                                                             */}
      {/* ================================================================== */}

      <section
        id="events"
        className="overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="What's Happening"
            title="There's always something to be part of."
            description="Stay connected with upcoming worship gatherings, prayer meetings, youth gatherings, family events, and more."
          />

          {eventsLoading ? (
            <LoadingBox icon={CalendarDays} text="Loading upcoming events..." />
          ) : eventsError ? (
            <ErrorBox text={eventsError} />
          ) : !featuredEvent ? (
            <EmptyBox
              icon={CalendarDays}
              title="No upcoming events yet."
              text="Check back soon for upcoming church gatherings."
            />
          ) : (
            <>
              <motion.article
                initial={{
                  opacity: 0,
                  y: 35,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                className="mt-16 overflow-hidden rounded-[2rem] bg-[#f7f4ed]"
              >
                <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative min-h-[440px] overflow-hidden lg:min-h-[580px]">
                    <BlurredImage
                      src={featuredEvent.image_url}
                      alt={featuredEvent.title}
                      className="absolute inset-0 h-full w-full"
                      emptyText="Event image"
                    />

                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

                    <div className="absolute left-6 top-6 z-20 rounded-[1.5rem] bg-white px-5 py-4 text-center shadow-xl">
                      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-amber-700">
                        {getMonth(featuredEvent.event_date)}
                      </p>

                      <p className="mt-1 text-4xl font-semibold">
                        {getDay(featuredEvent.event_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                      Featured Event
                    </p>

                    <h3 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                      {featuredEvent.title}
                    </h3>

                    {featuredEvent.description && (
                      <p className="mt-6 leading-8 text-zinc-600">
                        {featuredEvent.description}
                      </p>
                    )}

                    <div className="mt-8 space-y-5 border-y border-zinc-200 py-7">
                      <EventInfo
                        icon={CalendarDays}
                        label="Date"
                        value={formatEventDate(featuredEvent.event_date)}
                      />

                      {featuredEvent.start_time && (
                        <EventInfo
                          icon={Clock3}
                          label="Time"
                          value={formatEventTime(featuredEvent.start_time)}
                        />
                      )}

                      {featuredEvent.location && (
                        <EventInfo
                          icon={MapPinned}
                          label="Location"
                          value={featuredEvent.location}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>

              {upcomingEvents.length > 0 && (
                <div className="mt-16 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingEvents.map((event, index) => (
                    <motion.article
                      key={event.id}
                      initial={{
                        opacity: 0,
                        y: 25,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                      className="group overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white transition hover:-translate-y-2 hover:shadow-xl"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <BlurredImage
                          src={event.image_url}
                          alt={event.title}
                          className="h-full w-full"
                          emptyText="Event image"
                        />

                        <div className="absolute left-5 top-5 z-20 rounded-2xl bg-white px-4 py-3 text-center shadow-lg">
                          <p className="text-[10px] font-bold uppercase text-amber-700">
                            {getMonth(event.event_date)}
                          </p>

                          <p className="text-2xl font-semibold">
                            {getDay(event.event_date)}
                          </p>
                        </div>
                      </div>

                      <div className="p-7">
                        <h3 className="text-2xl font-semibold tracking-tight">
                          {event.title}
                        </h3>

                        {event.description && (
                          <p className="mt-4 line-clamp-3 text-sm leading-7 text-zinc-500">
                            {event.description}
                          </p>
                        )}

                        <div className="mt-6 space-y-3 border-t border-zinc-100 pt-5 text-sm text-zinc-500">
                          {event.start_time && (
                            <div className="flex items-center gap-2">
                              <Clock3 size={15} className="text-amber-700" />

                              {formatEventTime(event.start_time)}
                            </div>
                          )}

                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin size={15} className="text-amber-700" />

                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ================================================================== */}
      {/* VISIT                                                              */}
      {/* ================================================================== */}

      <section
        id="visit"
        className="overflow-hidden bg-zinc-950 px-6 py-24 text-white sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            dark
            eyebrow="Plan Your Visit"
            title={`We'd love to welcome you this ${serviceDay}.`}
            description="Your first visit should feel simple, comfortable, welcoming, and meaningful."
          />

          <div className="mt-16 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5">
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-[520px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1400&q=85"
                  alt={churchName}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>

              <div className="flex flex-col justify-center p-8 sm:p-12">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                  You're Welcome Here
                </p>

                <h3 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                  Join us this {serviceDay}.
                </h3>

                <p className="mt-6 leading-8 text-white/55">
                  Experience worship, biblical teaching, prayer, and a warm
                  church family centered on Jesus.
                </p>

                <div className="mt-8 space-y-4">
                  <VisitInfo
                    icon={Clock3}
                    label="Service Time"
                    value={`${serviceDay} • ${serviceTime}`}
                  />

                  <VisitInfo
                    icon={MapPinned}
                    label="Location"
                    value={address}
                  />

                  <VisitInfo icon={Church} label="Church" value={churchName} />
                </div>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-amber-300 px-7 py-4 font-semibold text-zinc-950 transition hover:bg-amber-200"
                >
                  <Navigation size={18} />
                  Get Directions
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <ExpectationCard
              icon={Smile}
              title="Warm Welcome"
              text="Friendly faces and a church family ready to welcome you."
            />

            <ExpectationCard
              icon={Music2}
              title="Worship"
              text="Christ-centered worship through praise and prayer."
            />

            <ExpectationCard
              icon={BookOpen}
              title="God's Word"
              text="Practical biblical teaching centered on Jesus."
            />

            <ExpectationCard
              icon={Baby}
              title="Families"
              text="Children and families are always welcome."
            />
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* PRAYER                                                             */}
      {/* ================================================================== */}

      <section className="bg-[#f7f4ed] px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-[2.5rem] bg-amber-300"
          >
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              {/* LEFT SIDE */}
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                  <Heart size={24} />
                </div>

                <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-zinc-800">
                  Prayer Changes Things
                </p>

                <h2 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
                  How can we pray for you?
                </h2>

                <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-800/75">
                  Whatever you're walking through, you don't have to face it
                  alone. Our prayer team would be honored to stand with you in
                  faith and prayer.
                </p>

                <div className="mt-8 flex items-start gap-3 text-sm font-medium text-zinc-800">
                  <HeartHandshake size={19} className="mt-0.5 shrink-0" />

                  <span>
                    Your prayer request will be treated with care and respect.
                  </span>
                </div>
              </div>

              {/* RIGHT SIDE - PRAYER FORM */}
              <div className="bg-zinc-950 p-8 text-white sm:p-12 lg:p-14">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                  We're Here For You
                </p>

                <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                  Send a Prayer Request
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/50">
                  Share as much or as little as you're comfortable with.
                </p>

                <form className="mt-8 space-y-5" onSubmit={handlePrayerSubmit}>
                  {/* NAME */}
                  <div>
                    <label
                      htmlFor="prayer-name"
                      className="mb-2 block text-sm font-medium text-white/70"
                    >
                      Your Name
                    </label>

                    <input
                      id="prayer-name"
                      type="text"
                      value={prayerForm.name}
                      onChange={(e) =>
                        setPrayerForm({
                          ...prayerForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter your name"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-amber-300 focus:bg-white/[0.07]"
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="prayer-email"
                      className="mb-2 block text-sm font-medium text-white/70"
                    >
                      Email
                    </label>

                    <input
                      id="prayer-email"
                      type="email"
                      value={prayerForm.email}
                      onChange={(e) =>
                        setPrayerForm({
                          ...prayerForm,
                          email: e.target.value,
                        })
                      }
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-amber-300 focus:bg-white/[0.07]"
                    />
                  </div>

                  {/* PRAYER MESSAGE */}
                  <div>
                    <label
                      htmlFor="prayer-message"
                      className="mb-2 block text-sm font-medium text-white/70"
                    >
                      Prayer Request
                    </label>

                    <textarea
                      id="prayer-message"
                      rows="5"
                      required
                      value={prayerForm.prayerRequest}
                      onChange={(e) =>
                        setPrayerForm({
                          ...prayerForm,
                          prayerRequest: e.target.value,
                        })
                      }
                      placeholder="How can we pray for you?"
                      className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-amber-300 focus:bg-white/[0.07]"
                    />
                  </div>

                  {/* CONTACT CHECKBOX */}
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <input
                      type="checkbox"
                      checked={prayerForm.wantsContact}
                      onChange={(e) =>
                        setPrayerForm({
                          ...prayerForm,
                          wantsContact: e.target.checked,
                        })
                      }
                      className="mt-1 h-4 w-4 shrink-0 accent-amber-300"
                    />

                    <span className="text-sm leading-6 text-white/55">
                      I would like someone from New Grace Jesus With Us Church
                      to contact me.
                    </span>
                  </label>

                  {/* STATUS */}
                  {prayerStatus && (
                    <div
                      className={`rounded-2xl border px-4 py-3 text-sm ${
                        prayerStatus.toLowerCase().includes("thank")
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                          : "border-red-400/20 bg-red-400/10 text-red-200"
                      }`}
                    >
                      {prayerStatus}
                    </div>
                  )}

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={prayerSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-300 px-7 py-4 font-semibold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {prayerSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950/30 border-t-zinc-950" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Prayer Request
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CONTACT                                                            */}
      {/* ================================================================== */}

      <section
        id="contact"
        className="overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            {/* LEFT SIDE - CONTACT INFO */}
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
                <MessageCircle size={17} />
                Get In Touch
              </div>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                We'd love to hear from you.
              </h2>

              <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-500">
                Have a question about our church, ministries, services, prayer,
                or an upcoming event? Send us a message and we'll be happy to
                help.
              </p>

              {/* CONTACT CARDS */}
              <div className="mt-10 space-y-4">
                {/* PHONE */}
                <a
                  href="tel:+910000000000"
                  className="group flex items-center gap-5 rounded-2xl border border-zinc-200 p-5 transition hover:border-amber-300 hover:bg-[#f7f4ed]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f7f4ed] text-amber-800 transition group-hover:bg-amber-300 group-hover:text-zinc-950">
                    <Phone size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
                      Call Us
                    </p>

                    <p className="mt-1 font-semibold text-zinc-900">
                      +91 00000 00000
                    </p>
                  </div>
                </a>

                {/* EMAIL */}
                <a
                  href="mailto:hello@newgracechurch.org"
                  className="group flex items-center gap-5 rounded-2xl border border-zinc-200 p-5 transition hover:border-amber-300 hover:bg-[#f7f4ed]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f7f4ed] text-amber-800 transition group-hover:bg-amber-300 group-hover:text-zinc-950">
                    <Mail size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
                      Email Us
                    </p>

                    <p className="mt-1 break-all font-semibold text-zinc-900">
                      hello@newgracechurch.org
                    </p>
                  </div>
                </a>

                {/* LOCATION */}
                <div className="flex items-start gap-5 rounded-2xl border border-zinc-200 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f7f4ed] text-amber-800">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
                      Visit Us
                    </p>

                    <p className="mt-1 font-semibold text-zinc-900">
                      New Grace Jesus With Us Church
                    </p>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      Your church address goes here
                    </p>
                  </div>
                </div>

                {/* SERVICE TIME */}
                <div className="flex items-start gap-5 rounded-2xl border border-zinc-200 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f7f4ed] text-amber-800">
                    <Clock3 size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
                      Sunday Worship
                    </p>

                    <p className="mt-1 font-semibold text-zinc-900">
                      Sunday • 10:00 AM
                    </p>

                    <p className="mt-2 text-sm text-zinc-500">
                      Everyone is welcome.
                    </p>
                  </div>
                </div>
              </div>

              {/* SOCIALS */}
              <div className="mt-10">
                <p className="text-sm font-semibold text-zinc-900">
                  Follow our church
                </p>

                <div className="mt-4 flex gap-3">
                  <a
                    href={facebookUrl}
                    aria-label="Facebook"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 text-white transition hover:-translate-y-1 hover:bg-amber-300 hover:text-zinc-950"
                  >
                    <FaFacebookF size={17} />
                  </a>

                  <a
                    href={instagramUrl}
                    aria-label="Instagram"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 text-white transition hover:-translate-y-1 hover:bg-amber-300 hover:text-zinc-950"
                  >
                    <FaInstagram size={18} />
                  </a>

                  <a
                    href={youtubeUrl}
                    aria-label="YouTube"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 text-white transition hover:-translate-y-1 hover:bg-amber-300 hover:text-zinc-950"
                  >
                    <FaYoutube size={19} />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* RIGHT SIDE - CONTACT FORM */}
            <motion.div
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-[2.25rem] bg-[#f7f4ed] p-7 sm:p-10 lg:p-12"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                Send A Message
              </p>

              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                How can we help?
              </h3>

              <p className="mt-4 max-w-xl leading-7 text-zinc-500">
                Fill out the form below and someone from our church team will
                get back to you.
              </p>

              <form className="mt-9 space-y-5" onSubmit={handleContactSubmit}>
                {/* NAME + EMAIL */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-sm font-medium text-zinc-700"
                    >
                      Name
                    </label>

                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="Your name"
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block text-sm font-medium text-zinc-700"
                    >
                      Email
                    </label>

                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          email: e.target.value,
                        })
                      }
                      placeholder="Your email"
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    />
                  </div>
                </div>

                {/* PHONE */}
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Phone
                    <span className="ml-2 text-xs font-normal text-zinc-400">
                      Optional
                    </span>
                  </label>

                  <input
                    id="contact-phone"
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        phone: e.target.value,
                      })
                    }
                    placeholder="Your phone number"
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  />
                </div>

                {/* SUBJECT */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Subject
                  </label>

                  <select
                    id="contact-subject"
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        subject: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  >
                    <option value="General Question">General Question</option>

                    <option value="Plan My Visit">Plan My Visit</option>

                    <option value="Ministries">Ministries</option>

                    <option value="Prayer">Prayer</option>

                    <option value="Events">Events</option>

                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* MESSAGE */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Message
                  </label>

                  <textarea
                    id="contact-message"
                    rows="6"
                    required
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    placeholder="Write your message..."
                    className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  />
                </div>

                {/* STATUS */}
                {contactStatus && (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm ${
                      contactStatus.toLowerCase().includes("thank")
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {contactStatus}
                  </div>
                )}

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-7 py-4 font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {contactSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FOOTER                                                             */}
      {/* ================================================================== */}

      <footer className="bg-zinc-950 px-6 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 border-b border-white/10 py-16 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-300 text-zinc-950">
                  <Church size={20} />
                </div>

                <div>
                  <h3 className="font-semibold">{shortName}</h3>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/35">
                    {churchName}
                  </p>
                </div>
              </div>

              <p className="mt-6 max-w-xs text-sm leading-7 text-white/45">
                A Christ-centered community where people can encounter Jesus,
                grow in faith, and experience God's grace.
              </p>

              <div className="mt-6 flex gap-3">
                <FooterSocial icon={FaFacebookF} href={facebookUrl} />

                <FooterSocial icon={FaInstagram} href={instagramUrl} />

                <FooterSocial icon={FaYoutube} href={youtubeUrl} />
              </div>
            </div>

            <FooterColumn
              title="Explore"
              links={[
                ["About", "#about"],
                ["Ministries", "#ministries"],
                ["Books", "#books"],
                ["Sermons", "#sermons"],
                ["Events", "#events"],
              ]}
            />

            <div>
              <h3 className="font-semibold">Join Us</h3>

              <p className="mt-6 text-sm text-white/50">{serviceDay} Worship</p>

              <p className="mt-2 text-sm text-white/50">{serviceTime}</p>

              <p className="mt-4 text-sm leading-6 text-white/35">{address}</p>
            </div>

            <div>
              <h3 className="font-semibold">Contact</h3>

              <p className="mt-6 text-sm text-white/50">{phone}</p>

              <p className="mt-3 break-all text-sm text-white/50">{email}</p>

              <a
                href="#visit"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-300"
              >
                Plan Your Visit
                <ArrowRight size={15} />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3 py-7 text-sm text-white/30 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {churchName}.
            </p>

            <p>
              {heroTitle} {heroHighlight}
            </p>
          </div>
        </div>
      </footer>

      {/* ================================================================== */}
      {/* MODALS                                                             */}
      {/* ================================================================== */}

      <AnimatePresence>
        {selectedSermon && (
          <SermonVideoModal
            sermon={selectedSermon}
            onClose={() => setSelectedSermon(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedBook && (
          <BookDetailsModal
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

/* ========================================================================== */
/* MINISTRY CAROUSEL                                                         */
/* ========================================================================== */

function MinistryCarousel({ ministries, selected, onSelect }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const el = scrollRef.current;

    if (!el) return;

    const card = el.querySelector("[data-ministry-card]");

    const amount = card ? card.getBoundingClientRect().width + 20 : 300;

    el.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="mt-16">
      <CarouselHeading
        eyebrow="Explore Ministries"
        title="Choose a ministry to learn more."
        onPrevious={() => scroll("previous")}
        onNext={() => scroll("next")}
        showButtons={ministries.length > 1}
      />

      <div
        ref={scrollRef}
        className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 scrollbar-hide"
      >
        {ministries.map((ministry, index) => {
          const isSelected = selected?.id === ministry.id;

          return (
            <motion.button
              key={ministry.id}
              data-ministry-card
              type="button"
              onClick={() => onSelect(ministry)}
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: Math.min(index * 0.05, 0.25),
              }}
              className={`group relative h-[350px] min-w-[270px] snap-start overflow-hidden rounded-[1.75rem] border bg-zinc-950 text-left shadow-sm transition duration-300 sm:min-w-[290px] lg:min-w-[310px] ${
                isSelected
                  ? "border-amber-300 ring-4 ring-amber-300/20 shadow-xl"
                  : "border-white/10 hover:-translate-y-2 hover:shadow-xl"
              }`}
            >
              {ministry.image_url ? (
                <>
                  <img
                    src={ministry.image_url}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl brightness-[0.55]"
                  />

                  <img
                    src={ministry.image_url}
                    alt={ministry.title}
                    className="absolute inset-0 z-[1] h-full w-full object-contain"
                  />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <UsersRound size={44} className="text-white/15" />
                </div>
              )}

              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/15 to-transparent" />

              {isSelected && (
                <span className="absolute right-4 top-4 z-20 rounded-full bg-amber-300 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-950">
                  Selected
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 z-20 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-800 shadow-lg">
                  <UsersRound size={18} />
                </div>

                <h3 className="mt-4 line-clamp-1 text-xl font-semibold text-white">
                  {ministry.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/60">
                  {ministry.short_description}
                </p>

                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white">
                  View Ministry
                  <ArrowRight
                    size={14}
                    className="transition group-hover:translate-x-1"
                  />
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* MINISTRY SPOTLIGHT                                                        */
/* ========================================================================== */

function MinistrySpotlight({ ministry }) {
  if (!ministry) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={ministry.id}
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -15,
        }}
        transition={{
          duration: 0.35,
        }}
        className="mt-10 overflow-hidden rounded-[2.5rem] bg-zinc-950 text-white shadow-2xl"
      >
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[430px] overflow-hidden lg:min-h-[590px]">
            <BlurredImage
              src={ministry.image_url}
              alt={ministry.title}
              className="absolute inset-0 h-full w-full"
              emptyText="Ministry image"
            />

            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-300 text-zinc-950">
              <UsersRound size={24} />
            </div>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
              Ministry Spotlight
            </p>

            <h3 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              {ministry.title}
            </h3>

            {ministry.short_description && (
              <p className="mt-6 text-lg leading-8 text-white/70">
                {ministry.short_description}
              </p>
            )}

            {ministry.description && (
              <p className="mt-5 whitespace-pre-line leading-8 text-white/50">
                {ministry.description}
              </p>
            )}

            <a
              href="#contact"
              className="mt-9 inline-flex w-fit items-center gap-2 rounded-full bg-amber-300 px-7 py-4 font-semibold text-zinc-950 transition hover:bg-amber-200"
            >
              I'm Interested
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </motion.article>
    </AnimatePresence>
  );
}

/* ========================================================================== */
/* BOOKS CAROUSEL                                                            */
/* ========================================================================== */

function BooksCarousel({ books, onSelect }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const el = scrollRef.current;

    if (!el) return;

    const card = el.querySelector("[data-book-card]");

    const amount = card ? card.getBoundingClientRect().width + 28 : 300;

    el.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="mt-16">
      <CarouselHeading
        eyebrow="Our Publications"
        title="Discover our books."
        onPrevious={() => scroll("previous")}
        onNext={() => scroll("next")}
        showButtons={books.length > 1}
      />

      <div
        ref={scrollRef}
        className="mt-9 flex snap-x snap-mandatory gap-8 overflow-x-auto pb-10 scrollbar-hide"
      >
        {books.map((book, index) => (
          <motion.article
            key={book.id}
            data-book-card
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: Math.min(index * 0.06, 0.3),
            }}
            className="group min-w-[78%] snap-start sm:min-w-[270px] lg:min-w-[290px]"
          >
            <button
              type="button"
              onClick={() => onSelect(book)}
              className="block w-full text-left"
            >
              <div className="relative mx-auto h-[410px] w-full max-w-[270px] overflow-hidden rounded-[1.5rem] bg-zinc-200 shadow-xl transition duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
                {book.cover_image_url ? (
                  <>
                    <img
                      src={book.cover_image_url}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl brightness-75"
                    />

                    <img
                      src={book.cover_image_url}
                      alt={book.title}
                      className="absolute inset-0 z-[1] h-full w-full object-contain"
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                    <BookOpen size={46} className="text-white/20" />
                  </div>
                )}

                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                {book.is_featured && (
                  <span className="absolute right-4 top-4 z-20 rounded-full bg-amber-300 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-950">
                    Featured
                  </span>
                )}
              </div>

              <div className="mx-auto mt-6 max-w-[270px]">
                <h3 className="line-clamp-2 text-xl font-semibold tracking-tight">
                  {book.title}
                </h3>

                {book.author && (
                  <p className="mt-2 text-sm text-zinc-500">By {book.author}</p>
                )}

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-400">
                  {book.publication_year && (
                    <span>{book.publication_year}</span>
                  )}

                  {book.price && (
                    <span className="font-semibold text-amber-700">
                      {book.price}
                    </span>
                  )}
                </div>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  View Book
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </button>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* BOOK MODAL                                                                */
/* ========================================================================== */

function BookDetailsModal({ book, onClose }) {
  return (
    <>
      <motion.button
        type="button"
        aria-label="Close"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md"
      />

      <div className="fixed inset-0 z-[110] overflow-y-auto p-4 sm:p-6">
        <div className="flex min-h-full items-center justify-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 25,
              scale: 0.98,
            }}
            className="w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                  Published Book
                </p>

                <h2 className="mt-1 line-clamp-1 text-xl font-semibold">
                  {book.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 hover:bg-zinc-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
              <div className="bg-[#f7f4ed] p-8 sm:p-10">
                <div className="relative mx-auto h-[440px] max-w-[290px] overflow-hidden rounded-xl bg-zinc-200 shadow-2xl">
                  {book.cover_image_url ? (
                    <>
                      <img
                        src={book.cover_image_url}
                        alt=""
                        className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl brightness-75"
                      />

                      <img
                        src={book.cover_image_url}
                        alt={book.title}
                        className="absolute inset-0 z-[1] h-full w-full object-contain"
                      />
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen size={52} className="text-zinc-300" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                {book.is_featured && (
                  <span className="w-fit rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800">
                    Featured Publication
                  </span>
                )}

                <h3 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                  {book.title}
                </h3>

                {book.author && (
                  <p className="mt-4 text-lg text-zinc-500">
                    By{" "}
                    <span className="font-semibold text-zinc-700">
                      {book.author}
                    </span>
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  {book.publication_year && (
                    <span className="rounded-full bg-zinc-100 px-4 py-2 text-sm text-zinc-600">
                      Published {book.publication_year}
                    </span>
                  )}

                  {book.price && (
                    <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
                      {book.price}
                    </span>
                  )}
                </div>

                {book.short_description && (
                  <p className="mt-7 text-lg leading-8 text-zinc-600">
                    {book.short_description}
                  </p>
                )}

                {book.description && (
                  <p className="mt-6 whitespace-pre-line border-t border-zinc-200 pt-6 leading-8 text-zinc-500">
                    {book.description}
                  </p>
                )}

                <div className="mt-9">
                  {book.purchase_url ? (
                    <a
                      href={book.purchase_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-7 py-4 font-semibold text-white hover:bg-zinc-800"
                    >
                      Get This Book
                      <ArrowRight size={17} />
                    </a>
                  ) : (
                    <a
                      href="#contact"
                      onClick={onClose}
                      className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-7 py-4 font-semibold text-white hover:bg-zinc-800"
                    >
                      Enquire About Book
                      <ArrowRight size={17} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

/* ========================================================================== */
/* SERMON MODAL                                                              */
/* ========================================================================== */

function SermonVideoModal({ sermon, onClose }) {
  const embedUrl = getYouTubeEmbedUrl(sermon.youtube_video_id);

  return (
    <>
      <motion.button
        type="button"
        aria-label="Close sermon"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md"
      />

      <div className="fixed inset-0 z-[110] overflow-y-auto p-4 sm:p-6">
        <div className="flex min-h-full items-center justify-center">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.97,
              y: 20,
            }}
            className="w-full max-w-5xl overflow-hidden rounded-[1.75rem] bg-zinc-950 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5 sm:px-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.17em] text-amber-300">
                  Sermon
                </p>

                <h2 className="mt-1 text-xl font-semibold">{sermon.title}</h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {embedUrl && (
              <div className="aspect-video bg-black">
                <iframe
                  src={`${embedUrl}?autoplay=1&rel=0`}
                  title={sermon.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap gap-5 text-sm text-white/50">
                {sermon.speaker && (
                  <SermonInfo icon={Mic2}>{sermon.speaker}</SermonInfo>
                )}

                {sermon.scripture && (
                  <SermonInfo icon={BookMarked}>{sermon.scripture}</SermonInfo>
                )}
              </div>

              {sermon.description && (
                <p className="mt-6 max-w-3xl leading-7 text-white/55">
                  {sermon.description}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

/* ========================================================================== */
/* YOUTUBE                                                                   */
/* ========================================================================== */

function YouTubeThumbnail({ sermon, className = "" }) {
  const primary = getYouTubeThumbnail(sermon.youtube_video_id);

  const fallback = sermon.youtube_video_id
    ? `https://img.youtube.com/vi/${sermon.youtube_video_id}/hqdefault.jpg`
    : "";

  const [imageSrc, setImageSrc] = useState(primary);

  useEffect(() => {
    setImageSrc(primary);
  }, [primary]);

  if (!imageSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-zinc-900 ${className}`}
      >
        <FaYoutube size={42} className="text-white/20" />
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={sermon.title}
      onError={() => {
        if (imageSrc !== fallback) {
          setImageSrc(fallback);
        }
      }}
      className={`object-cover ${className}`}
    />
  );
}

/* ========================================================================== */
/* SHARED COMPONENTS                                                        */
/* ========================================================================== */

function SectionHeading({ eyebrow, title, description, dark = false }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      className="mx-auto max-w-3xl text-center"
    >
      <p
        className={`text-sm font-semibold uppercase tracking-[0.22em] ${
          dark ? "text-amber-300" : "text-amber-700"
        }`}
      >
        {eyebrow}
      </p>

      <h2
        className={`mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl ${
          dark ? "text-white" : "text-zinc-900"
        }`}
      >
        {title}
      </h2>

      <p
        className={`mx-auto mt-6 max-w-2xl text-lg leading-8 ${
          dark ? "text-white/55" : "text-zinc-500"
        }`}
      >
        {description}
      </p>
    </motion.div>
  );
}

function SectionLabel({ icon: Icon, children }) {
  return (
    <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
      <Icon size={17} />

      {children}
    </div>
  );
}

function AboutCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
        <Icon size={20} />
      </div>

      <h3 className="mt-5 font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
    </div>
  );
}

function MissionCard({ number, title, text }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-7 transition hover:bg-white/[0.08]">
      <span className="text-sm font-semibold text-amber-300">{number}</span>

      <h3 className="mt-8 text-xl font-semibold">{title}</h3>

      <p className="mt-3 text-sm leading-7 text-white/50">{text}</p>
    </div>
  );
}

function SermonInfo({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={16} className="shrink-0 text-amber-300" />

      {children}
    </div>
  );
}

function SermonCardInfo({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={15} className="shrink-0 text-amber-700" />

      <span className="line-clamp-1">{value}</span>
    </div>
  );
}

function EventInfo({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-amber-800">
        <Icon size={18} />
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-400">
          {label}
        </p>

        <p className="mt-1 font-medium">{value}</p>
      </div>
    </div>
  );
}

function VisitInfo({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-4 rounded-[1.25rem] border border-white/10 bg-white/5 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-300 text-zinc-950">
        <Icon size={19} />
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-white/35">
          {label}
        </p>

        <p className="mt-1 font-semibold">{value}</p>
      </div>
    </div>
  );
}

function ExpectationCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-7">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-300 text-zinc-950">
        <Icon size={21} />
      </div>

      <h3 className="mt-6 text-lg font-semibold">{title}</h3>

      <p className="mt-3 text-sm leading-7 text-white/45">{text}</p>
    </div>
  );
}

function ContactInfo({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-5 rounded-[1.5rem] border border-zinc-200 p-5 transition hover:border-amber-200 hover:bg-amber-50/40">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f7f4ed] text-amber-800">
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <p className="text-xs uppercase tracking-widest text-zinc-400">
          {label}
        </p>

        <p className="mt-1 break-words font-semibold">{value}</p>
      </div>
    </div>
  );
}

function DarkInput({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/65">{label}</label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-white/25 focus:border-amber-300"
      />
    </div>
  );
}

function LightInput({
  label,
  type = "text",
  value,
  onChange,
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-700">
        {label}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 outline-none focus:border-amber-400"
      />
    </div>
  );
}

function SocialIcon({ icon: Icon, label, href }) {
  return (
    <a
      href={href}
      target={href !== "#" ? "_blank" : undefined}
      rel={href !== "#" ? "noreferrer" : undefined}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 text-white transition hover:bg-amber-300 hover:text-zinc-950"
    >
      <Icon size={18} />
    </a>
  );
}

function FooterSocial({ icon: Icon, href }) {
  return (
    <a
      href={href}
      target={href !== "#" ? "_blank" : undefined}
      rel={href !== "#" ? "noreferrer" : undefined}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/55 transition hover:border-amber-300 hover:bg-amber-300 hover:text-zinc-950"
    >
      <Icon size={16} />
    </a>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="font-semibold">{title}</h3>

      <div className="mt-6 flex flex-col gap-4 text-sm text-white/45">
        {links.map(([label, href]) => (
          <a
            key={label}
            href={href}
            className="transition hover:text-amber-300"
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}

function CarouselHeading({ eyebrow, title, onPrevious, onNext, showButtons }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          {eyebrow}
        </p>

        <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h3>
      </div>

      {showButtons && (
        <div className="hidden gap-2 sm:flex">
          <CarouselButton icon={ArrowLeft} onClick={onPrevious} />

          <CarouselButton icon={ArrowRight} onClick={onNext} dark />
        </div>
      )}
    </div>
  );
}

function CarouselButton({ icon: Icon, onClick, dark = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
        dark
          ? "bg-zinc-950 text-white hover:bg-zinc-800"
          : "border border-zinc-200 bg-white text-zinc-700 hover:border-amber-300 hover:bg-amber-50"
      }`}
    >
      <Icon size={18} />
    </button>
  );
}

function LoadingBox({ icon: Icon, text }) {
  return (
    <div className="mt-16 rounded-[2rem] bg-white p-12 text-center shadow-sm">
      <Icon size={34} className="mx-auto animate-pulse text-amber-700" />

      <p className="mt-4 text-sm text-zinc-500">{text}</p>
    </div>
  );
}

function ErrorBox({ text }) {
  return (
    <div className="mt-16 rounded-[2rem] border border-red-100 bg-red-50 p-10 text-center">
      <p className="text-sm text-red-700">{text}</p>
    </div>
  );
}

function EmptyBox({ icon: Icon, title, text }) {
  return (
    <div className="mt-16 rounded-[2rem] bg-white p-12 text-center shadow-sm">
      <Icon size={36} className="mx-auto text-zinc-300" />

      <h3 className="mt-4 text-xl font-semibold">{title}</h3>

      <p className="mt-2 text-sm text-zinc-500">{text}</p>
    </div>
  );
}

/* ========================================================================== */
/* FORMATTERS                                                                */
/* ========================================================================== */

function formatSermonDate(date) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatEventDate(date) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatEventTime(time) {
  if (!time) {
    return "";
  }

  const [hour, minute] = time.split(":");

  const date = new Date();

  date.setHours(Number(hour), Number(minute), 0);

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getMonth(date) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
  })
    .format(new Date(`${date}T00:00:00`))
    .toUpperCase();
}

function getDay(date) {
  if (!date) {
    return "";
  }

  return new Date(`${date}T00:00:00`).getDate();
}
function AboutFeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      className="group rounded-[1.5rem] border border-zinc-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 transition group-hover:bg-amber-300 group-hover:text-zinc-950">
        <Icon size={21} />
      </div>

      <h3 className="mt-6 text-xl font-semibold tracking-tight text-zinc-950">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-zinc-500">{description}</p>
    </motion.div>
  );
}
