import { motion } from "framer-motion";
import {
  ArrowRight,
  Baby,
  BookOpen,
  CalendarDays,
  Clock3,
  HeartHandshake,
  MapPin,
  Play,
  Sparkles,
  Users,
  Video,
  Mic2,
  CalendarCheck,
  Church,
  MapPinned,
  Ticket,
  BookMarked,
  Navigation,
  Coffee,
  Smile,
  Music2,
  CircleHelp,
  Phone,
  Mail,
  Send,
  Heart,
  MessageCircle,
} from "lucide-react";

import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const ministries = [
  {
    title: "Kids Ministry",
    description:
      "A safe, joyful environment where children can learn about Jesus, build friendships, and grow in faith.",
    icon: Baby,
  },
  {
    title: "Youth Ministry",
    description:
      "Helping young people discover their identity in Christ and build strong, lasting faith.",
    icon: Users,
  },
  {
    title: "Bible Study",
    description:
      "Growing deeper in God's Word through prayer, teaching, discussion, and community.",
    icon: BookOpen,
  },
  {
    title: "Prayer Ministry",
    description:
      "Standing together in prayer and believing God for healing, restoration, breakthrough, and hope.",
    icon: HeartHandshake,
  },
];

const sermons = [
  {
    id: 1,
    title: "Walking By Faith",
    speaker: "Pastor Name",
    scripture: "2 Corinthians 5:7",
    date: "August 23, 2026",
    duration: "42 min",
    image:
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 2,
    title: "The Power of Grace",
    speaker: "Pastor Name",
    scripture: "Ephesians 2:8-9",
    date: "August 16, 2026",
    duration: "38 min",
    image:
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 3,
    title: "Jesus Is With Us",
    speaker: "Pastor Name",
    scripture: "Matthew 28:20",
    date: "August 9, 2026",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=1200&q=85",
  },
];

const events = [
  {
    id: 1,
    title: "Sunday Worship Celebration",
    description:
      "Come together as one church family for powerful worship, prayer, fellowship, and an encouraging message from God's Word.",
    date: "30",
    month: "AUG",
    day: "Sunday",
    time: "7:30 AM",
    location: "New Grace Jesus With Us Church",
    image:
      "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1400&q=85",
    featured: true,
  },
  {
    id: 2,
    title: "Youth Gathering",
    description:
      "An evening for young people to connect, worship, grow in faith, and build meaningful friendships.",
    date: "05",
    month: "SEP",
    day: "Saturday",
    time: "6:00 PM",
    location: "Church Campus",
    image:
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 3,
    title: "Prayer Night",
    description:
      "A special evening dedicated to worship, intercession, thanksgiving, and seeking God's presence together.",
    date: "11",
    month: "SEP",
    day: "Friday",
    time: "7:00 PM",
    location: "Main Sanctuary",
    image:
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 4,
    title: "Family Fellowship",
    description:
      "A joyful time for families to connect, share food, build friendships, and enjoy community together.",
    date: "19",
    month: "SEP",
    day: "Saturday",
    time: "5:00 PM",
    location: "Church Campus",
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=85",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=2000&q=85')",
          }}
        />

        <div className="absolute inset-0 bg-black/65" />

        <div className="absolute -left-40 top-32 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

        {/* NAVBAR */}
        <header className="relative z-20 border-b border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
            <a href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10">
                <span className="text-xl font-semibold text-amber-300">✝</span>
              </div>

              <div>
                <p className="text-sm font-semibold tracking-wide sm:text-base">
                  New Grace
                </p>

                <p className="text-[10px] uppercase tracking-[0.22em] text-white/60 sm:text-xs">
                  Jesus With Us Church
                </p>
              </div>
            </a>

            <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 lg:flex">
              <a href="#home" className="hover:text-white">
                Home
              </a>

              <a href="#about" className="hover:text-white">
                About
              </a>

              <a href="#ministries" className="hover:text-white">
                Ministries
              </a>

              <a href="#sermons" className="hover:text-white">
                Sermons
              </a>

              <a href="#events" className="hover:text-white">
                Events
              </a>

              <a href="#contact" className="hover:text-white">
                Contact
              </a>
            </nav>

            <a
              href="#visit"
              className="hidden rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-200 sm:inline-flex"
            >
              Plan Your Visit
            </a>
          </div>
        </header>

        {/* HERO CONTENT */}
        <div
          id="home"
          className="relative z-10 mx-auto flex min-h-[calc(100vh-85px)] max-w-7xl items-center px-6 py-20 lg:px-8"
        >
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-amber-200 backdrop-blur-md"
            >
              A place of faith, hope & grace
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-8xl"
            >
              Jesus With Us.
              <span className="block text-amber-300">Grace For Everyone.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-8 max-w-2xl text-base leading-8 text-white/70 sm:text-lg"
            >
              Welcome to New Grace Jesus With Us Church — a community where
              people can encounter Jesus, grow in faith, discover purpose, and
              experience the transforming power of God's grace.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <a
                href="#visit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-7 py-4 font-semibold text-zinc-950 hover:bg-amber-200"
              >
                Plan Your Visit
                <ArrowRight size={18} />
              </a>

              <a
                href="#sermons"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur-md hover:bg-white/15"
              >
                <Play size={18} />
                Watch Latest Message
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-16 grid max-w-3xl gap-5 border-t border-white/15 pt-8 sm:grid-cols-3"
            >
              <div className="flex gap-3">
                <Clock3 className="mt-1 text-amber-300" size={20} />

                <div>
                  <p className="text-xs uppercase tracking-widest text-white/50">
                    Sunday Service
                  </p>

                  <p className="mt-1 font-medium">7:30 AM</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CalendarDays className="mt-1 text-amber-300" size={20} />

                <div>
                  <p className="text-xs uppercase tracking-widest text-white/50">
                    Join Us
                  </p>

                  <p className="mt-1 font-medium">Every Sunday</p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin className="mt-1 text-amber-300" size={20} />

                <div>
                  <p className="text-xs uppercase tracking-widest text-white/50">
                    Location
                  </p>

                  <p className="mt-1 font-medium">Zion Nagar</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="overflow-hidden bg-[#f7f4ed] px-6 py-24 sm:py-32 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
          {/* IMAGES */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[2rem]">
              <img
                src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=85"
                alt="Church worship"
                className="h-[520px] w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-8 -right-4 hidden w-52 overflow-hidden rounded-3xl border-8 border-[#f7f4ed] sm:block lg:-right-10">
              <img
                src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=700&q=85"
                alt="Church community"
                className="h-64 w-full object-cover"
              />
            </div>

            <div className="absolute left-6 top-6 rounded-2xl bg-white/95 px-5 py-4 shadow-xl backdrop-blur">
              <p className="text-3xl font-semibold text-zinc-900">Jesus</p>
              <p className="text-sm text-zinc-500">is at the center.</p>
            </div>
          </motion.div>

          {/* CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="lg:pl-8"
          >
            <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
              <Sparkles size={17} />
              Who We Are
            </div>

            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              A church where everyone can experience God's grace.
            </h2>

            <p className="mt-7 text-lg leading-8 text-zinc-600">
              New Grace Jesus With Us Church is a Christ-centered community
              passionate about loving God, loving people, and sharing the hope
              found in Jesus.
            </p>

            <p className="mt-5 leading-8 text-zinc-500">
              Whether you've followed Jesus for many years, are returning to
              church, or are simply searching for answers, you are welcome here.
              We want every person to find family, grow spiritually, and
              discover God's purpose for their life.
            </p>

            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200/70 bg-white p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                  <HeartHandshake size={21} />
                </div>

                <h3 className="font-semibold text-zinc-900">Come As You Are</h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  You don't have to have everything figured out before walking
                  through our doors.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200/70 bg-white p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                  <Users size={21} />
                </div>

                <h3 className="font-semibold text-zinc-900">Find Community</h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Build meaningful relationships and grow together as one church
                  family.
                </p>
              </div>
            </div>

            <a
              href="#mission"
              className="mt-9 inline-flex items-center gap-2 font-semibold text-zinc-900 hover:gap-3"
            >
              Learn more about our church
              <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* MINISTRIES */}
      <section id="ministries" className="bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
              Find Your Place
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              There's a ministry for everyone.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-500">
              Church is more than attending a Sunday service. It's about growing
              together, serving together, and doing life together.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {ministries.map((ministry, index) => {
              const Icon = ministry.icon;

              return (
                <motion.article
                  key={ministry.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="group rounded-[2rem] border border-zinc-200 bg-white p-8 transition duration-300 hover:-translate-y-2 hover:border-amber-200 hover:shadow-2xl hover:shadow-zinc-200/60"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f4ed] text-amber-800 transition group-hover:bg-amber-300 group-hover:text-zinc-950">
                    <Icon size={25} />
                  </div>

                  <h3 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
                    {ministry.title}
                  </h3>

                  <p className="mt-4 leading-7 text-zinc-500">
                    {ministry.description}
                  </p>

                  <button className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900">
                    Learn More
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section
        id="mission"
        className="relative overflow-hidden bg-zinc-950 px-6 py-24 text-white sm:py-32 lg:px-8"
      >
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-amber-300/5 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-300/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
                Our Mission
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                Helping people know Jesus and live transformed lives.
              </h2>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-7"
              >
                <span className="text-sm font-semibold text-amber-300">01</span>

                <h3 className="mt-8 text-xl font-semibold">Encounter Jesus</h3>

                <p className="mt-3 text-sm leading-7 text-white/55">
                  Creating an atmosphere where people can experience the love,
                  presence, and power of God.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-7"
              >
                <span className="text-sm font-semibold text-amber-300">02</span>

                <h3 className="mt-8 text-xl font-semibold">Grow Together</h3>

                <p className="mt-3 text-sm leading-7 text-white/55">
                  Building strong disciples through Scripture, prayer,
                  fellowship, worship, and genuine relationships.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-7"
              >
                <span className="text-sm font-semibold text-amber-300">03</span>

                <h3 className="mt-8 text-xl font-semibold">Impact Our World</h3>

                <p className="mt-3 text-sm leading-7 text-white/55">
                  Sharing God's grace beyond the walls of the church through
                  compassion, service, and the Gospel.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* NEXT SECTIONS */}
      {/* SERMONS */}
      <section
        id="sermons"
        className="overflow-hidden bg-[#f7f4ed] px-6 py-24 sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
                <Mic2 size={17} />
                Messages
              </div>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                Be encouraged by God's Word.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-500">
                Watch our latest messages and discover biblical teaching
                designed to help you grow in faith and follow Jesus in everyday
                life.
              </p>
            </div>

            <a
              href="#all-sermons"
              className="inline-flex items-center gap-2 font-semibold text-zinc-900 hover:gap-3"
            >
              View All Messages
              <ArrowRight size={18} />
            </a>
          </motion.div>

          {/* FEATURED SERMON */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7 }}
            className="mt-16 overflow-hidden rounded-[2rem] bg-zinc-950 text-white shadow-2xl"
          >
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              {/* IMAGE */}
              <div className="group relative min-h-[420px] overflow-hidden lg:min-h-[560px]">
                <img
                  src={sermons[0].image}
                  alt={sermons[0].title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <button
                  type="button"
                  className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-amber-300 text-zinc-950 shadow-2xl transition hover:scale-110 hover:bg-amber-200"
                >
                  <Play size={28} fill="currentColor" />
                </button>

                <div className="absolute bottom-8 left-8">
                  <span className="rounded-full bg-amber-300 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-950">
                    Latest Message
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                  Sunday Message
                </p>

                <h3 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                  {sermons[0].title}
                </h3>

                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <Mic2 size={16} className="text-amber-300" />
                    {sermons[0].speaker}
                  </div>

                  <div className="flex items-center gap-2">
                    <BookMarked size={16} className="text-amber-300" />
                    {sermons[0].scripture}
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-amber-300" />
                    {sermons[0].date}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock3 size={16} className="text-amber-300" />
                    {sermons[0].duration}
                  </div>
                </div>

                <p className="mt-8 leading-8 text-white/60">
                  Faith is not simply believing that God exists. It is learning
                  to trust Him even when we cannot see what comes next. Discover
                  how God's Word teaches us to walk confidently by faith.
                </p>

                <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-7 py-4 font-semibold text-zinc-950 hover:bg-amber-200"
                  >
                    <Play size={18} fill="currentColor" />
                    Watch Message
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-4 font-semibold text-white hover:bg-white/10"
                  >
                    <BookOpen size={18} />
                    Message Notes
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RECENT SERMONS */}
          <div id="all-sermons" className="mt-20">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                Recent Messages
              </h3>

              <div className="hidden items-center gap-2 text-sm text-zinc-500 sm:flex">
                <Video size={17} />
                Watch anytime
              </div>
            </div>

            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {sermons.map((sermon, index) => (
                <motion.article
                  key={sermon.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="group overflow-hidden rounded-[1.75rem] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  {/* Thumbnail */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={sermon.image}
                      alt={sermon.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/35" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-300 text-zinc-950 shadow-xl">
                        <Play size={22} fill="currentColor" />
                      </div>
                    </div>

                    <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                      {sermon.duration}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                      Sunday Message
                    </p>

                    <h4 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
                      {sermon.title}
                    </h4>

                    <div className="mt-5 space-y-2 text-sm text-zinc-500">
                      <div className="flex items-center gap-2">
                        <Mic2 size={15} />
                        {sermon.speaker}
                      </div>

                      <div className="flex items-center gap-2">
                        <BookMarked size={15} />
                        {sermon.scripture}
                      </div>

                      <div className="flex items-center gap-2">
                        <CalendarDays size={15} />
                        {sermon.date}
                      </div>
                    </div>

                    <button
                      type="button"
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
        </div>
      </section>

      {/* EVENTS */}
      <section
        id="events"
        className="overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          {/* SECTION HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
                <CalendarCheck size={17} />
                What's Happening
              </div>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                There's always something to be part of.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-500">
                From worship gatherings and prayer nights to youth meetings and
                family fellowship, there's a place for you to connect and grow.
              </p>
            </div>

            <a
              href="#all-events"
              className="inline-flex items-center gap-2 font-semibold text-zinc-900 hover:gap-3"
            >
              View All Events
              <ArrowRight size={18} />
            </a>
          </motion.div>

          {/* FEATURED EVENT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7 }}
            className="mt-16 overflow-hidden rounded-[2.25rem] bg-[#f7f4ed]"
          >
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              {/* IMAGE */}
              <div className="group relative min-h-[420px] overflow-hidden lg:min-h-[580px]">
                <img
                  src={events[0].image}
                  alt={events[0].title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

                {/* DATE BADGE */}
                <div className="absolute left-6 top-6 rounded-3xl bg-white px-5 py-4 text-center shadow-xl sm:left-8 sm:top-8">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                    {events[0].month}
                  </p>

                  <p className="mt-1 text-4xl font-semibold tracking-tight text-zinc-900">
                    {events[0].date}
                  </p>
                </div>

                <div className="absolute bottom-8 left-8">
                  <span className="rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-md">
                    Featured Event
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                  {events[0].day}
                </p>

                <h3 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                  {events[0].title}
                </h3>

                <p className="mt-6 text-base leading-8 text-zinc-600">
                  {events[0].description}
                </p>

                {/* EVENT INFO */}
                <div className="mt-8 space-y-4 border-y border-zinc-200 py-7">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-amber-800">
                      <CalendarDays size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                        Date
                      </p>

                      <p className="mt-1 font-medium text-zinc-900">
                        {events[0].day}, {events[0].month} {events[0].date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-amber-800">
                      <Clock3 size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                        Time
                      </p>

                      <p className="mt-1 font-medium text-zinc-900">
                        {events[0].time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-amber-800">
                      <MapPinned size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                        Location
                      </p>

                      <p className="mt-1 font-medium text-zinc-900">
                        {events[0].location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-7 py-4 font-semibold text-white hover:bg-zinc-800"
                  >
                    Event Details
                    <ArrowRight size={18} />
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 px-7 py-4 font-semibold text-zinc-900 hover:bg-white"
                  >
                    <Ticket size={18} />
                    I'm Interested
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* UPCOMING EVENTS */}
          <div id="all-events" className="mt-20">
            <div className="mb-9 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                  Mark Your Calendar
                </p>

                <h3 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                  Upcoming Events
                </h3>
              </div>

              <div className="hidden items-center gap-2 text-sm text-zinc-500 md:flex">
                <Church size={17} />
                Everyone is welcome
              </div>
            </div>

            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {events.slice(1).map((event, index) => (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="group overflow-hidden rounded-[2rem] border border-zinc-200 bg-white transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-zinc-200/70"
                >
                  {/* IMAGE */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                    {/* EVENT DATE */}
                    <div className="absolute left-5 top-5 rounded-2xl bg-white px-4 py-3 text-center shadow-lg">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">
                        {event.month}
                      </p>

                      <p className="text-2xl font-bold text-zinc-900">
                        {event.date}
                      </p>
                    </div>

                    <div className="absolute bottom-5 left-5">
                      <span className="text-sm font-medium text-white">
                        {event.day}
                      </span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-7">
                    <h4 className="text-2xl font-semibold tracking-tight text-zinc-900">
                      {event.title}
                    </h4>

                    <p className="mt-4 text-sm leading-7 text-zinc-500">
                      {event.description}
                    </p>

                    <div className="mt-6 space-y-3 border-t border-zinc-100 pt-6">
                      <div className="flex items-center gap-3 text-sm text-zinc-500">
                        <Clock3 size={16} className="text-amber-700" />
                        {event.time}
                      </div>

                      <div className="flex items-center gap-3 text-sm text-zinc-500">
                        <MapPin size={16} className="text-amber-700" />
                        {event.location}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900"
                    >
                      View Event
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
        </div>
      </section>

      {/* PLAN YOUR VISIT */}
      <section
        id="visit"
        className="relative overflow-hidden bg-zinc-950 px-6 py-24 text-white sm:py-32 lg:px-8"
      >
        {/* BACKGROUND DECORATION */}
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-amber-300/5 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-amber-300/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          {/* SECTION HEADING */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
              <MapPin size={17} />
              Plan Your Visit
            </div>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              We'd love to welcome you this Sunday.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/60">
              Visiting a church for the first time can feel unfamiliar. We want
              to make your visit to New Grace Jesus With Us Church simple,
              comfortable, and meaningful.
            </p>
          </motion.div>

          {/* MAIN VISIT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7 }}
            className="mt-16 overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 backdrop-blur"
          >
            <div className="grid lg:grid-cols-2">
              {/* IMAGE */}
              <div className="relative min-h-[460px] overflow-hidden lg:min-h-[650px]">
                <img
                  src="https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1400&q=85"
                  alt="New Grace Jesus With Us Church"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                    You're Invited
                  </p>

                  <h3 className="mt-3 max-w-lg text-3xl font-semibold sm:text-4xl">
                    Come as you are. There's a place for you here.
                  </h3>
                </div>
              </div>

              {/* SERVICE INFORMATION */}
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                  Sunday Gathering
                </p>

                <h3 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                  Join us this Sunday
                </h3>

                <p className="mt-6 leading-8 text-white/60">
                  Experience uplifting worship, biblical teaching, prayer, and a
                  welcoming community centered on Jesus Christ.
                </p>

                {/* DETAILS */}
                <div className="mt-9 space-y-5">
                  {/* TIME */}
                  <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-300 text-zinc-950">
                      <Clock3 size={20} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                        Service Time
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        Sunday • 7:30 AM
                      </p>

                      <p className="mt-1 text-sm text-white/45">
                        You're welcome to arrive a little early.
                      </p>
                    </div>
                  </div>

                  {/* LOCATION */}
                  <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-300 text-zinc-950">
                      <MapPinned size={20} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                        Location
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        New Grace Jesus With Us Church
                      </p>

                      <p className="mt-1 text-sm leading-6 text-white/45">
                        Your church address will go here.
                      </p>
                    </div>
                  </div>

                  {/* SERVICE */}
                  <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-300 text-zinc-950">
                      <Church size={20} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                        What To Expect
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        Worship • Word • Prayer • Community
                      </p>

                      <p className="mt-1 text-sm leading-6 text-white/45">
                        A welcoming service centered on Jesus and God's Word.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA BUTTONS */}
                <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                  <a
                    href="https://maps.app.goo.gl/JGhVvA63GQfv6tGG6"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-7 py-4 font-semibold text-zinc-950 hover:bg-amber-200"
                  >
                    <Navigation size={18} />
                    Get Directions
                  </a>

                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-4 font-semibold text-white hover:bg-white/10"
                  >
                    Ask a Question
                    <ArrowRight size={18} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* WHAT TO EXPECT */}
          <div className="mt-20">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10 text-center"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                Your First Sunday
              </p>

              <h3 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                What can I expect?
              </h3>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {/* WELCOME */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-7"
              >
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-amber-300 text-zinc-950">
                  <Smile size={23} />
                </div>

                <h4 className="mt-7 text-xl font-semibold">A Warm Welcome</h4>

                <p className="mt-3 text-sm leading-7 text-white/50">
                  Our church family will be happy to welcome you and help you
                  feel comfortable from the moment you arrive.
                </p>
              </motion.div>

              {/* WORSHIP */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-7"
              >
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-amber-300 text-zinc-950">
                  <Music2 size={23} />
                </div>

                <h4 className="mt-7 text-xl font-semibold">
                  Meaningful Worship
                </h4>

                <p className="mt-3 text-sm leading-7 text-white/50">
                  Join us as we worship Jesus together through music,
                  thanksgiving, prayer, and praise.
                </p>
              </motion.div>

              {/* TEACHING */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-7"
              >
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-amber-300 text-zinc-950">
                  <BookOpen size={23} />
                </div>

                <h4 className="mt-7 text-xl font-semibold">
                  Biblical Teaching
                </h4>

                <p className="mt-3 text-sm leading-7 text-white/50">
                  Hear practical, Christ-centered teaching from Scripture that
                  encourages and equips you for everyday life.
                </p>
              </motion.div>

              {/* CHILDREN */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.24 }}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-7"
              >
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-amber-300 text-zinc-950">
                  <Baby size={23} />
                </div>

                <h4 className="mt-7 text-xl font-semibold">Families Welcome</h4>

                <p className="mt-3 text-sm leading-7 text-white/50">
                  Children and families are welcome. We'll later add your exact
                  kids ministry and children's service information here.
                </p>
              </motion.div>
            </div>
          </div>

          {/* FIRST TIME VISITOR CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-20 rounded-[2.25rem] bg-amber-300 px-7 py-12 text-zinc-950 sm:px-12 lg:px-16"
          >
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em]">
                  <Coffee size={18} />
                  First Time Here?
                </div>

                <h3 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  We'd love the opportunity to meet you.
                </h3>

                <p className="mt-5 max-w-2xl leading-8 text-zinc-800/75">
                  Tell us you're planning to visit and our team can help answer
                  any questions you have before you arrive.
                </p>
              </div>

              <a
                href="#contact"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-zinc-950 px-7 py-4 font-semibold text-white hover:bg-zinc-800"
              >
                Plan My Visit
                <ArrowRight size={18} />
              </a>
            </div>
          </motion.div>

          {/* FAQ LINK */}
          <div className="mt-10 flex justify-center">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white"
            >
              <CircleHelp size={17} />
              Have another question? We'd be happy to help.
            </a>
          </div>
        </div>
      </section>

      {/* PRAYER REQUEST */}
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
              {/* CONTENT */}
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

                <div className="mt-8 flex items-center gap-3 text-sm font-medium text-zinc-800">
                  <HeartHandshake size={19} />

                  <span>
                    Your prayer request will be treated with care and respect.
                  </span>
                </div>
              </div>

              {/* PRAYER FORM */}
              <div className="bg-zinc-950 p-8 text-white sm:p-12 lg:p-14">
                <h3 className="text-2xl font-semibold">
                  Send a Prayer Request
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  Share as much or as little as you're comfortable with.
                </p>

                <form
                  className="mt-8 space-y-5"
                  onSubmit={(e) => e.preventDefault()}
                >
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
                      placeholder="Enter your name"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-amber-300"
                    />
                  </div>

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
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-amber-300"
                    />
                  </div>

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
                      placeholder="How can we pray for you?"
                      className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-amber-300"
                    />
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 text-sm text-white/50">
                    <input type="checkbox" className="mt-1 h-4 w-4 rounded" />

                    <span>
                      I would like someone from the church to contact me.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-300 px-7 py-4 font-semibold text-zinc-950 hover:bg-amber-200"
                  >
                    <Send size={18} />
                    Send Prayer Request
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
            {/* CONTACT INFORMATION */}
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
                Have a question about our church, services, ministries, or
                upcoming events? Reach out and our team will be happy to help.
              </p>

              <div className="mt-10 space-y-5">
                {/* PHONE */}
                <a
                  href="tel:+910000000000"
                  className="group flex items-center gap-5 rounded-2xl border border-zinc-200 p-5 hover:border-amber-300"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f7f4ed] text-amber-800">
                    <Phone size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
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
                  className="group flex items-center gap-5 rounded-2xl border border-zinc-200 p-5 hover:border-amber-300"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f7f4ed] text-amber-800">
                    <Mail size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                      Email Us
                    </p>

                    <p className="mt-1 font-semibold text-zinc-900">
                      hello@newgracechurch.org
                    </p>
                  </div>
                </a>

                {/* LOCATION */}
                <div className="flex items-center gap-5 rounded-2xl border border-zinc-200 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f7f4ed] text-amber-800">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                      Visit Us
                    </p>

                    <p className="mt-1 font-semibold text-zinc-900">
                      New Grace Jesus With Us Church
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      Your church address goes here
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
                    href="#"
                    aria-label="Facebook"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 text-white hover:bg-amber-300 hover:text-zinc-950"
                  >
                    <FaFacebookF size={18} />
                    
                  </a>

                  <a
                    href="#"
                    aria-label="Instagram"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 text-white hover:bg-amber-300 hover:text-zinc-950"
                  >
                    <FaInstagram size={18} />
                  </a>

                  <a
                    href="#"
                    aria-label="YouTube"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 text-white hover:bg-amber-300 hover:text-zinc-950"
                  >
                    
                    <FaYoutube size={18} />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* CONTACT FORM */}
            <motion.div
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-[2rem] bg-[#f7f4ed] p-7 sm:p-10 lg:p-12"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                Send A Message
              </p>

              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
                How can we help?
              </h3>

              <form
                className="mt-8 space-y-5"
                onSubmit={(e) => e.preventDefault()}
              >
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
                      placeholder="Your name"
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-amber-400"
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
                      placeholder="Your email"
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Phone
                  </label>

                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="Your phone number"
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-amber-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Subject
                  </label>

                  <select
                    id="contact-subject"
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-zinc-900 outline-none focus:border-amber-400"
                  >
                    <option>General Question</option>
                    <option>Plan My Visit</option>
                    <option>Ministries</option>
                    <option>Prayer</option>
                    <option>Events</option>
                    <option>Other</option>
                  </select>
                </div>

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
                    placeholder="Write your message..."
                    className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-7 py-4 font-semibold text-white hover:bg-zinc-800 sm:w-auto"
                >
                  Send Message
                  <Send size={18} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-950 px-6 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* MAIN FOOTER */}
          <div className="grid gap-12 border-b border-white/10 py-16 sm:py-20 md:grid-cols-2 lg:grid-cols-4">
            {/* BRAND */}
            <div className="lg:pr-8">
              <a href="#home" className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5">
                  <span className="text-2xl text-amber-300">✝</span>
                </div>

                <div>
                  <p className="font-semibold">New Grace</p>

                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Jesus With Us Church
                  </p>
                </div>
              </a>

              <p className="mt-6 text-sm leading-7 text-white/45">
                A Christ-centered church where people can encounter Jesus, grow
                in faith, find community, and experience God's grace.
              </p>

              <div className="mt-6 flex gap-3">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 hover:border-amber-300 hover:bg-amber-300 hover:text-zinc-950"
                >
                  <FaFacebookF size={17} />
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 hover:border-amber-300 hover:bg-amber-300 hover:text-zinc-950"
                >
                  <FaInstagram size={17} />
                </a>

                <a
                  href="#"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 hover:border-amber-300 hover:bg-amber-300 hover:text-zinc-950"
                >
                  <FaYoutube size={17} />
                </a>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h3 className="font-semibold">Explore</h3>

              <div className="mt-6 flex flex-col gap-4 text-sm text-white/50">
                <a href="#about" className="hover:text-amber-300">
                  About Us
                </a>

                <a href="#ministries" className="hover:text-amber-300">
                  Ministries
                </a>

                <a href="#sermons" className="hover:text-amber-300">
                  Sermons
                </a>

                <a href="#events" className="hover:text-amber-300">
                  Events
                </a>

                <a href="#visit" className="hover:text-amber-300">
                  Plan Your Visit
                </a>
              </div>
            </div>

            {/* SERVICE */}
            <div>
              <h3 className="font-semibold">Join Us</h3>

              <div className="mt-6 space-y-5 text-sm">
                <div className="flex items-start gap-3">
                  <Clock3
                    size={17}
                    className="mt-0.5 shrink-0 text-amber-300"
                  />

                  <div>
                    <p className="text-white/80">Sunday Worship</p>

                    <p className="mt-1 text-white/45">10:00 AM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0 text-amber-300"
                  />

                  <div>
                    <p className="text-white/80">
                      New Grace Jesus With Us Church
                    </p>

                    <p className="mt-1 leading-6 text-white/45">
                      Your church address goes here
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTACT */}
            <div>
              <h3 className="font-semibold">Contact</h3>

              <div className="mt-6 space-y-5 text-sm">
                <a
                  href="tel:+910000000000"
                  className="flex items-center gap-3 text-white/50 hover:text-amber-300"
                >
                  <Phone size={17} />
                  +91 00000 00000
                </a>

                <a
                  href="mailto:hello@newgracechurch.org"
                  className="flex items-center gap-3 text-white/50 hover:text-amber-300"
                >
                  <Mail size={17} />
                  hello@newgracechurch.org
                </a>
              </div>
            </div>
          </div>

          {/* COPYRIGHT */}
          <div className="flex flex-col gap-4 py-7 text-sm text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} New Grace Jesus With Us Church. All
              rights reserved.
            </p>

            <p>Jesus With Us • Grace For Everyone</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
