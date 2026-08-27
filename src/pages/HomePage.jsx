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
  submitContactMessage,
  submitPrayerRequest,
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

export default function HomePage() {
  /* ====================================================================== */
  /* CHURCH SETTINGS                                                        */
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

  /* ====================================================================== */
  /* PRAYER FORM                                                            */
  /* ====================================================================== */

  const [prayerForm, setPrayerForm] = useState({
    name: "",
    email: "",
    prayerRequest: "",
    wantsContact: false,
  });

  const [prayerSubmitting, setPrayerSubmitting] = useState(false);

  const [prayerStatus, setPrayerStatus] = useState("");

  /* ====================================================================== */
  /* CONTACT FORM                                                           */
  /* ====================================================================== */

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
  /* LOAD PAGE DATA                                                         */
  /* ====================================================================== */

  useEffect(() => {
    const loadPageData = async () => {
      await Promise.allSettled([
        loadChurchSettings(),
        loadMinistries(),
        loadBooks(),
        loadSermons(),
        loadEvents(),
      ]);
    };

    loadPageData();
  }, []);

  const loadChurchSettings = async () => {
    try {
      const data = await getChurchSettings();

      setChurchSettings(data);
    } catch (error) {
      console.error("Church settings error:", error);
    }
  };

  const loadMinistries = async () => {
    try {
      setMinistriesLoading(true);
      setMinistriesError("");

      const data = await getPublicMinistries();

      setPublicMinistries(data || []);
    } catch (error) {
      console.error("Public ministries error:", error);

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
      console.error("Public books error:", error);

      setBooksError("Unable to load published books right now.");
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
      console.error("Public sermons error:", error);

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
      console.error("Public events error:", error);

      setEventsError("Unable to load upcoming events.");
    } finally {
      setEventsLoading(false);
    }
  };

  /* ====================================================================== */
  /* SETTINGS FALLBACKS                                                     */
  /* ====================================================================== */

  const churchName =
    churchSettings?.church_name || "New Grace Jesus With Us Church";

  const shortName = churchSettings?.short_name || "New Grace";

  const heroTitle = churchSettings?.hero_title || "Jesus With Us.";

  const heroHighlight = churchSettings?.hero_highlight || "Grace For Everyone.";

  const heroDescription =
    churchSettings?.hero_description ||
    "A Christ-centered community where you can encounter Jesus, grow in faith, find meaningful relationships, and discover the transforming power of God's grace.";

  const serviceDay = churchSettings?.service_day || "Sunday";

  const serviceTime = churchSettings?.service_time || "10:00 AM";

  const churchAddress = churchSettings?.address || "Church Location";

  const mapsUrl = churchSettings?.google_maps_url || "https://maps.google.com";

  const phone = churchSettings?.phone || "+91 00000 00000";

  const email = churchSettings?.email || "hello@newgracechurch.org";

  const facebookUrl = churchSettings?.facebook_url || "#";

  const instagramUrl = churchSettings?.instagram_url || "#";

  const youtubeUrl = churchSettings?.youtube_url || "#";

  /* ====================================================================== */
  /* DEFAULT MINISTRY                                                       */
  /* ====================================================================== */

  useEffect(() => {
    if (publicMinistries.length === 0) {
      setSelectedMinistry(null);
      return;
    }

    const exists =
      selectedMinistry &&
      publicMinistries.some((ministry) => ministry.id === selectedMinistry.id);

    if (!exists) {
      setSelectedMinistry(publicMinistries[0]);
    }
  }, [publicMinistries, selectedMinistry]);

  /* ====================================================================== */
  /* FEATURED SERMON                                                        */
  /* ====================================================================== */

  const featuredSermon =
    publicSermons.find((sermon) => sermon.is_featured) ||
    publicSermons[0] ||
    null;

  const recentSermons = featuredSermon
    ? publicSermons
        .filter((sermon) => sermon.id !== featuredSermon.id)
        .slice(0, 6)
    : [];

  /* ====================================================================== */
  /* FEATURED EVENT                                                         */
  /* ====================================================================== */

  const featuredEvent =
    publicEvents.find((event) => event.is_featured) || publicEvents[0] || null;

  const upcomingEvents = featuredEvent
    ? publicEvents.filter((event) => event.id !== featuredEvent.id).slice(0, 6)
    : [];

  /* ====================================================================== */
  /* MODAL BODY LOCK                                                        */
  /* ====================================================================== */

  useEffect(() => {
    document.body.style.overflow =
      selectedSermon || selectedBook ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedSermon, selectedBook]);

  /* ====================================================================== */
  /* PRAYER SUBMIT                                                         */
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

  /* ====================================================================== */
  /* CONTACT SUBMIT                                                        */
  /* ====================================================================== */

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
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ================================================================== */}
      {/* HERO                                                               */}
      {/* ================================================================== */}

      <section className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=2200&q=90')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/20" />

        <div
          id="home"
          className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-20 pt-32 lg:px-8"
        >
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
              className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 backdrop-blur-md"
            >
              <Church size={15} />
              Welcome To {shortName}
            </motion.div>

            <motion.h1
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-7 text-5xl font-semibold leading-[1.03] tracking-[-0.04em] sm:text-6xl lg:text-8xl"
            >
              {heroTitle}

              <span className="block text-amber-300">{heroHighlight}</span>
            </motion.h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              {heroDescription}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#visit"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-semibold text-zinc-950"
              >
                Plan Your Visit
                <ArrowRight size={17} />
              </a>

              <a
                href="#sermons"
                className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md"
              >
                <Play size={16} />
                Watch Latest Message
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm text-white/55">
              <div className="flex items-center gap-2">
                <Clock3 size={16} className="text-amber-300" />
                {serviceDay} • {serviceTime}
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-amber-300" />

                {churchName}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* ABOUT                                                              */}
      {/* ================================================================== */}

      <section id="about" className="bg-[#f7f4ed] px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem]">
            <img
              src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=85"
              alt="Church worship"
              className="h-[520px] w-full object-cover"
            />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
              Who We Are
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              A church where everyone can experience God's grace.
            </h2>

            <p className="mt-7 text-lg leading-8 text-zinc-600">
              {churchName} is a Christ-centered community passionate about
              loving God, loving people, and sharing the hope found in Jesus.
            </p>

            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              <AboutCard
                icon={HeartHandshake}
                title="Come As You Are"
                description="You are welcome here, wherever you are in your journey."
              />

              <AboutCard
                icon={Users}
                title="Find Community"
                description="Build meaningful relationships and grow together."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* MINISTRIES                                                         */}
      {/* ================================================================== */}

      <section id="ministries" className="bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Our Ministries"
            title="Find where you belong."
            description="Discover communities where you can grow in faith, build friendships, serve others, and walk with Jesus together."
          />

          {ministriesLoading ? (
            <LoadingBox icon={UsersRound} text="Loading ministries..." />
          ) : ministriesError ? (
            <ErrorBox text={ministriesError} />
          ) : publicMinistries.length === 0 ? (
            <EmptyBox
              icon={UsersRound}
              title="Ministries are coming soon."
              text="Check back soon to discover ways to connect and serve."
            />
          ) : (
            <>
              <MinistryCarousel
                ministries={publicMinistries}
                selectedMinistry={selectedMinistry}
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
        className="overflow-hidden bg-[#f7f4ed] px-6 py-24 sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Published Books"
            title="Books to strengthen your faith."
            description="Explore publications from our church and ministry leaders created to encourage, equip, and help you grow deeper in God's Word."
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
            <BooksCarousel books={publicBooks} onSelectBook={setSelectedBook} />
          )}
        </div>
      </section>

      {/* ================================================================== */}
      {/* MISSION                                                            */}
      {/* ================================================================== */}

      <section
        id="mission"
        className="bg-zinc-950 px-6 py-24 text-white sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
                Our Mission
              </p>

              <h2 className="mt-5 text-4xl font-semibold sm:text-5xl">
                Helping people know Jesus and live transformed lives.
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <MissionCard
                number="01"
                title="Encounter Jesus"
                text="Experience the love and presence of God."
              />

              <MissionCard
                number="02"
                title="Grow Together"
                text="Grow through Scripture, prayer, worship, and community."
              />

              <MissionCard
                number="03"
                title="Impact Our World"
                text="Share God's grace through service and the Gospel."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* SERMONS                                                            */}
      {/* ================================================================== */}

      <section
        id="sermons"
        className="bg-[#f7f4ed] px-6 py-24 sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Messages"
            title="Be encouraged by God's Word."
            description="Watch our latest messages and discover biblical teaching designed to help you grow in faith."
          />

          {sermonsLoading ? (
            <LoadingBox icon={Play} text="Loading messages..." />
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
              <FeaturedSermon
                sermon={featuredSermon}
                onWatch={setSelectedSermon}
              />

              {recentSermons.length > 0 && (
                <div className="mt-16 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                  {recentSermons.map((sermon) => (
                    <SermonCard
                      key={sermon.id}
                      sermon={sermon}
                      onWatch={() => setSelectedSermon(sermon)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ================================================================== */}
      {/* EVENTS                                                             */}
      {/* ================================================================== */}

      <section id="events" className="bg-white px-6 py-24 sm:py-32 lg:px-8">
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
              <FeaturedEvent event={featuredEvent} />

              {upcomingEvents.length > 0 && (
                <div className="mt-16 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ================================================================== */}
      {/* PLAN VISIT                                                         */}
      {/* ================================================================== */}

      <section
        id="visit"
        className="bg-zinc-950 px-6 py-24 text-white sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            dark
            eyebrow="Plan Your Visit"
            title={`We'd love to welcome you this ${serviceDay}.`}
            description={`Join us at ${churchName} for worship, God's Word, prayer, and community.`}
          />

          <div className="mt-16 grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 lg:grid-cols-2">
            <div className="relative min-h-[520px]">
              <img
                src="https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1400&q=85"
                alt={churchName}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div className="p-8 sm:p-12">
              <h3 className="text-4xl font-semibold">
                Join us this {serviceDay}
              </h3>

              <div className="mt-8 space-y-5">
                <VisitInfo
                  icon={Clock3}
                  label="Service Time"
                  value={`${serviceDay} • ${serviceTime}`}
                />

                <VisitInfo
                  icon={MapPinned}
                  label="Location"
                  value={churchAddress}
                />

                <VisitInfo icon={Church} label="Church" value={churchName} />
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-amber-300 px-7 py-4 font-semibold text-zinc-950"
              >
                <Navigation size={18} />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* PRAYER                                                             */}
      {/* ================================================================== */}

      <section className="bg-[#f7f4ed] px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[2.5rem] bg-amber-300">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="p-8 sm:p-12 lg:p-16">
                <Heart size={30} />

                <h2 className="mt-6 text-4xl font-semibold sm:text-5xl">
                  How can we pray for you?
                </h2>
              </div>

              <div className="bg-zinc-950 p-8 text-white sm:p-12">
                <form onSubmit={handlePrayerSubmit} className="space-y-5">
                  <DarkInput
                    label="Your Name"
                    value={prayerForm.name}
                    onChange={(value) =>
                      setPrayerForm({
                        ...prayerForm,
                        name: value,
                      })
                    }
                  />

                  <DarkInput
                    label="Email"
                    type="email"
                    value={prayerForm.email}
                    onChange={(value) =>
                      setPrayerForm({
                        ...prayerForm,
                        email: value,
                      })
                    }
                  />

                  <textarea
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
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                  />

                  <label className="flex gap-3 text-sm text-white/50">
                    <input
                      type="checkbox"
                      checked={prayerForm.wantsContact}
                      onChange={(e) =>
                        setPrayerForm({
                          ...prayerForm,
                          wantsContact: e.target.checked,
                        })
                      }
                    />
                    I would like someone from the church to contact me.
                  </label>

                  <button
                    type="submit"
                    disabled={prayerSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-300 px-7 py-4 font-semibold text-zinc-950"
                  >
                    <Send size={18} />

                    {prayerSubmitting ? "Sending..." : "Send Prayer Request"}
                  </button>

                  {prayerStatus && (
                    <p className="text-center text-sm text-white/60">
                      {prayerStatus}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CONTACT                                                            */}
      {/* ================================================================== */}

      <section id="contact" className="bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
              Get In Touch
            </p>

            <h2 className="mt-5 text-4xl font-semibold sm:text-5xl">
              We'd love to hear from you.
            </h2>

            <div className="mt-10 space-y-5">
              <ContactInfo icon={Phone} label="Call Us" value={phone} />

              <ContactInfo icon={Mail} label="Email Us" value={email} />

              <ContactInfo
                icon={MapPin}
                label="Visit Us"
                value={churchAddress}
              />
            </div>

            <div className="mt-8 flex gap-3">
              <SocialIcon
                icon={FaFacebookF}
                label="Facebook"
                href={facebookUrl}
              />

              <SocialIcon
                icon={FaInstagram}
                label="Instagram"
                href={instagramUrl}
              />

              <SocialIcon icon={FaYoutube} label="YouTube" href={youtubeUrl} />
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#f7f4ed] p-7 sm:p-10">
            <form onSubmit={handleContactSubmit} className="space-y-5">
              <LightInput
                label="Name"
                required
                value={contactForm.name}
                onChange={(value) =>
                  setContactForm({
                    ...contactForm,
                    name: value,
                  })
                }
              />

              <LightInput
                label="Email"
                type="email"
                required
                value={contactForm.email}
                onChange={(value) =>
                  setContactForm({
                    ...contactForm,
                    email: value,
                  })
                }
              />

              <LightInput
                label="Phone"
                value={contactForm.phone}
                onChange={(value) =>
                  setContactForm({
                    ...contactForm,
                    phone: value,
                  })
                }
              />

              <select
                value={contactForm.subject}
                onChange={(e) =>
                  setContactForm({
                    ...contactForm,
                    subject: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4"
              >
                <option>General Question</option>

                <option>Plan My Visit</option>

                <option>Ministries</option>

                <option>Books</option>

                <option>Prayer</option>

                <option>Events</option>
              </select>

              <textarea
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
                className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4"
              />

              <button
                type="submit"
                disabled={contactSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-7 py-4 font-semibold text-white"
              >
                {contactSubmitting ? "Sending..." : "Send Message"}

                <Send size={18} />
              </button>

              {contactStatus && (
                <p className="text-sm text-zinc-600">{contactStatus}</p>
              )}
            </form>
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
              <h3 className="text-xl font-semibold">{shortName}</h3>

              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/40">
                {churchName}
              </p>

              <div className="mt-6 flex gap-3">
                <FooterSocialIcon
                  icon={FaFacebookF}
                  label="Facebook"
                  href={facebookUrl}
                />

                <FooterSocialIcon
                  icon={FaInstagram}
                  label="Instagram"
                  href={instagramUrl}
                />

                <FooterSocialIcon
                  icon={FaYoutube}
                  label="YouTube"
                  href={youtubeUrl}
                />
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
                ["Plan Your Visit", "#visit"],
              ]}
            />

            <div>
              <h3 className="font-semibold">Join Us</h3>

              <p className="mt-6 text-sm text-white/50">{serviceDay}</p>

              <p className="mt-2 text-sm text-white/50">{serviceTime}</p>

              <p className="mt-4 text-sm text-white/40">{churchAddress}</p>
            </div>

            <div>
              <h3 className="font-semibold">Contact</h3>

              <p className="mt-6 text-sm text-white/50">{phone}</p>

              <p className="mt-3 break-all text-sm text-white/50">{email}</p>
            </div>
          </div>

          <div className="py-7 text-sm text-white/35">
            © {new Date().getFullYear()} {churchName}. All rights reserved.
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

function MinistryCarousel({ ministries, selectedMinistry, onSelect }) {
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
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Explore Ministries</h3>

        <div className="hidden gap-2 sm:flex">
          <CarouselButton icon={ArrowLeft} onClick={() => scroll("previous")} />

          <CarouselButton
            icon={ArrowRight}
            dark
            onClick={() => scroll("next")}
          />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 scrollbar-hide"
      >
        {ministries.map((ministry) => {
          const selected = selectedMinistry?.id === ministry.id;

          return (
            <button
              key={ministry.id}
              data-ministry-card
              type="button"
              onClick={() => onSelect(ministry)}
              className={`relative h-[350px] min-w-[280px] snap-start overflow-hidden rounded-[1.75rem] border bg-zinc-950 text-left ${
                selected
                  ? "border-amber-300 ring-4 ring-amber-300/15"
                  : "border-zinc-200"
              }`}
            >
              {ministry.image_url ? (
                <>
                  <img
                    src={ministry.image_url}
                    alt=""
                    className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl brightness-50"
                  />

                  <img
                    src={ministry.image_url}
                    alt={ministry.title}
                    className="absolute inset-0 z-[1] h-full w-full object-contain"
                  />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <UsersRound size={42} className="text-white/20" />
                </div>
              )}

              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 z-20 p-5">
                <h3 className="text-xl font-semibold text-white">
                  {ministry.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/60">
                  {ministry.short_description}
                </p>
              </div>
            </button>
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
  if (!ministry) return null;

  return (
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
      className="mt-10 overflow-hidden rounded-[2.5rem] bg-zinc-950 text-white"
    >
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[480px]">
          <BlurredImage
            src={ministry.image_url}
            alt={ministry.title}
            className="absolute inset-0 h-full w-full"
          />
        </div>

        <div className="flex flex-col justify-center p-8 sm:p-12">
          <p className="text-sm uppercase tracking-[0.2em] text-amber-300">
            Ministry Spotlight
          </p>

          <h3 className="mt-4 text-4xl font-semibold sm:text-5xl">
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
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-amber-300 px-7 py-4 font-semibold text-zinc-950"
          >
            I'm Interested
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

/* ========================================================================== */
/* BOOK CAROUSEL                                                             */
/* ========================================================================== */

function BooksCarousel({ books, onSelectBook }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const el = scrollRef.current;

    if (!el) return;

    const card = el.querySelector("[data-book-card]");

    const amount = card ? card.getBoundingClientRect().width + 24 : 280;

    el.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="mt-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Our Publications
          </p>

          <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Discover our latest books.
          </h3>
        </div>

        {books.length > 1 && (
          <div className="hidden gap-2 sm:flex">
            <CarouselButton
              icon={ArrowLeft}
              onClick={() => scroll("previous")}
            />

            <CarouselButton
              icon={ArrowRight}
              dark
              onClick={() => scroll("next")}
            />
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 scrollbar-hide"
      >
        {books.map((book) => (
          <article
            key={book.id}
            data-book-card
            className="min-w-[78%] snap-start sm:min-w-[280px] lg:min-w-[300px]"
          >
            <button
              type="button"
              onClick={() => onSelectBook(book)}
              className="w-full text-left"
            >
              <div className="relative mx-auto h-[410px] max-w-[270px] overflow-hidden rounded-[1.3rem] bg-zinc-200 shadow-xl">
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
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                    <BookOpen size={46} className="text-white/20" />
                  </div>
                )}

                {book.is_featured && (
                  <span className="absolute right-4 top-4 z-20 rounded-full bg-amber-300 px-3 py-1.5 text-[10px] font-bold uppercase text-zinc-950">
                    Featured
                  </span>
                )}
              </div>

              <div className="mx-auto mt-6 max-w-[270px]">
                <h3 className="line-clamp-2 text-xl font-semibold">
                  {book.title}
                </h3>

                {book.author && (
                  <p className="mt-2 text-sm text-zinc-500">By {book.author}</p>
                )}

                {book.price && (
                  <p className="mt-3 font-semibold text-amber-700">
                    {book.price}
                  </p>
                )}

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                  View Book
                  <ArrowRight size={15} />
                </span>
              </div>
            </button>
          </article>
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        type="button"
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md"
      />

      <div className="fixed inset-0 z-[110] overflow-y-auto p-4">
        <div className="flex min-h-full items-center justify-center">
          <motion.div
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
              y: 20,
            }}
            className="w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
              <h2 className="font-semibold">{book.title}</h2>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200"
              >
                <X size={19} />
              </button>
            </div>

            <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
              <div className="bg-[#f7f4ed] p-8">
                <div className="mx-auto h-[430px] max-w-[290px] overflow-hidden rounded-xl bg-zinc-200 shadow-xl">
                  {book.cover_image_url ? (
                    <img
                      src={book.cover_image_url}
                      alt={book.title}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen size={50} className="text-zinc-300" />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 sm:p-12">
                <h3 className="text-4xl font-semibold sm:text-5xl">
                  {book.title}
                </h3>

                {book.author && (
                  <p className="mt-4 text-lg text-zinc-500">
                    By <strong>{book.author}</strong>
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  {book.publication_year && (
                    <span className="rounded-full bg-zinc-100 px-4 py-2 text-sm">
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
                  <p className="mt-6 whitespace-pre-line leading-8 text-zinc-500">
                    {book.description}
                  </p>
                )}

                <div className="mt-9">
                  {book.purchase_url ? (
                    <a
                      href={book.purchase_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-7 py-4 font-semibold text-white"
                    >
                      Get This Book
                      <ArrowRight size={17} />
                    </a>
                  ) : (
                    <a
                      href="#contact"
                      onClick={onClose}
                      className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-7 py-4 font-semibold text-white"
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
/* SERMON COMPONENTS                                                        */
/* ========================================================================== */

function FeaturedSermon({ sermon, onWatch }) {
  return (
    <article className="mt-16 overflow-hidden rounded-[2rem] bg-zinc-950 text-white">
      <div className="grid lg:grid-cols-2">
        <button
          type="button"
          onClick={() => onWatch(sermon)}
          className="relative aspect-video lg:aspect-auto lg:min-h-[520px]"
        >
          <YouTubeThumbnail
            sermon={sermon}
            className="absolute inset-0 h-full w-full"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600">
              <Play size={27} fill="currentColor" />
            </div>
          </div>
        </button>

        <div className="p-8 sm:p-12">
          <p className="text-sm uppercase tracking-[0.2em] text-amber-300">
            Latest Message
          </p>

          <h3 className="mt-5 text-4xl font-semibold">{sermon.title}</h3>

          {sermon.description && (
            <p className="mt-6 leading-8 text-white/55">{sermon.description}</p>
          )}

          <button
            type="button"
            onClick={() => onWatch(sermon)}
            className="mt-8 rounded-full bg-red-600 px-7 py-4 font-semibold"
          >
            Watch Message
          </button>
        </div>
      </div>
    </article>
  );
}

function SermonCard({ sermon, onWatch }) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] bg-white">
      <button
        type="button"
        onClick={onWatch}
        className="relative aspect-video w-full"
      >
        <YouTubeThumbnail sermon={sermon} className="h-full w-full" />
      </button>

      <div className="p-6">
        <h3 className="text-xl font-semibold">{sermon.title}</h3>
      </div>
    </article>
  );
}

function SermonVideoModal({ sermon, onClose }) {
  const embedUrl = getYouTubeEmbedUrl(sermon.youtube_video_id);

  return (
    <>
      <motion.div
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/85"
      />

      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-zinc-950">
          <div className="flex justify-between p-5 text-white">
            <h2>{sermon.title}</h2>

            <button onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {embedUrl && (
            <div className="aspect-video">
              <iframe
                src={`${embedUrl}?autoplay=1&rel=0`}
                title={sermon.title}
                className="h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function YouTubeThumbnail({ sermon, className = "" }) {
  const primary = getYouTubeThumbnail(sermon.youtube_video_id);

  const fallback = sermon.youtube_video_id
    ? `https://img.youtube.com/vi/${sermon.youtube_video_id}/hqdefault.jpg`
    : "";

  const [imageSrc, setImageSrc] = useState(primary);

  useEffect(() => {
    setImageSrc(primary);
  }, [primary]);

  return (
    <img
      src={imageSrc || fallback}
      alt={sermon.title}
      onError={() => setImageSrc(fallback)}
      className={`object-cover ${className}`}
    />
  );
}

/* ========================================================================== */
/* EVENT COMPONENTS                                                         */
/* ========================================================================== */

function FeaturedEvent({ event }) {
  return (
    <article className="mt-16 grid overflow-hidden rounded-[2rem] bg-[#f7f4ed] lg:grid-cols-2">
      <BlurredImage
        src={event.image_url}
        alt={event.title}
        className="min-h-[450px]"
      />

      <div className="p-8 sm:p-12">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-700">
          Featured Event
        </p>

        <h3 className="mt-4 text-4xl font-semibold">{event.title}</h3>

        <p className="mt-6 text-zinc-600">{event.description}</p>
      </div>
    </article>
  );
}

function EventCard({ event }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-zinc-200">
      <BlurredImage
        src={event.image_url}
        alt={event.title}
        className="aspect-video"
      />

      <div className="p-6">
        <h3 className="text-xl font-semibold">{event.title}</h3>
      </div>
    </article>
  );
}

/* ========================================================================== */
/* SHARED SMALL COMPONENTS                                                  */
/* ========================================================================== */

function SectionHeading({ eyebrow, title, description, dark = false }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p
        className={
          dark
            ? "text-sm uppercase tracking-[0.22em] text-amber-300"
            : "text-sm uppercase tracking-[0.22em] text-amber-700"
        }
      >
        {eyebrow}
      </p>

      <h2
        className={`mt-5 text-4xl font-semibold sm:text-5xl lg:text-6xl ${
          dark ? "text-white" : "text-zinc-900"
        }`}
      >
        {title}
      </h2>

      <p
        className={`mx-auto mt-6 max-w-2xl text-lg leading-8 ${
          dark ? "text-white/60" : "text-zinc-500"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

function AboutCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <Icon size={22} className="text-amber-700" />

      <h3 className="mt-4 font-semibold">{title}</h3>

      <p className="mt-2 text-sm text-zinc-500">{description}</p>
    </div>
  );
}

function MissionCard({ number, title, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
      <span className="text-amber-300">{number}</span>

      <h3 className="mt-8 text-xl font-semibold">{title}</h3>

      <p className="mt-3 text-sm text-white/55">{text}</p>
    </div>
  );
}

function VisitInfo({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <Icon size={20} className="text-amber-300" />

      <div>
        <p className="text-xs uppercase text-white/40">{label}</p>

        <p className="mt-1 font-semibold">{value}</p>
      </div>
    </div>
  );
}

function DarkInput({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/70">{label}</label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
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
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4"
      />
    </div>
  );
}

function ContactInfo({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-5 rounded-2xl border border-zinc-200 p-5">
      <Icon size={20} className="text-amber-700" />

      <div>
        <p className="text-xs uppercase text-zinc-400">{label}</p>

        <p className="mt-1 font-semibold">{value}</p>
      </div>
    </div>
  );
}

function SocialIcon({ icon: Icon, label, href }) {
  return (
    <a
      href={href}
      target={href !== "#" ? "_blank" : undefined}
      rel="noreferrer"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 text-white"
    >
      <Icon size={18} />
    </a>
  );
}

function FooterSocialIcon({ icon: Icon, label, href }) {
  return <SocialIcon icon={Icon} label={label} href={href} />;
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="font-semibold">{title}</h3>

      <div className="mt-6 flex flex-col gap-4 text-sm text-white/50">
        {links.map(([label, href]) => (
          <a key={label} href={href}>
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}

function CarouselButton({ icon: Icon, onClick, dark = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-11 w-11 items-center justify-center rounded-full ${
        dark ? "bg-zinc-950 text-white" : "border border-zinc-200 bg-white"
      }`}
    >
      <Icon size={18} />
    </button>
  );
}

function LoadingBox({ icon: Icon, text }) {
  return (
    <div className="mt-16 rounded-2xl bg-white p-12 text-center">
      <Icon size={34} className="mx-auto animate-pulse text-amber-700" />

      <p className="mt-4 text-zinc-500">{text}</p>
    </div>
  );
}

function ErrorBox({ text }) {
  return (
    <div className="mt-16 rounded-2xl bg-red-50 p-10 text-center text-red-700">
      {text}
    </div>
  );
}

function EmptyBox({ icon: Icon, title, text }) {
  return (
    <div className="mt-16 rounded-2xl bg-white p-12 text-center">
      <Icon size={36} className="mx-auto text-zinc-300" />

      <h3 className="mt-4 text-xl font-semibold">{title}</h3>

      <p className="mt-2 text-zinc-500">{text}</p>
    </div>
  );
}
