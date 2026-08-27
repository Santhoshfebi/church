import { useEffect, useState } from "react";

import { Church, Menu, X } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import { getChurchSettings } from "../services/churchSettingsService";

const navigation = [
  {
    label: "Home",
    href: "#home",
  },
  {
    label: "About",
    href: "#about",
  },
  {
    label: "Ministries",
    href: "#ministries",
  },
  {
    label: "Sermons",
    href: "#sermons",
  },
  {
    label: "Events",
    href: "#events",
  },
  {
    label: "Books",
    href: "#books",
  },
  {
    label: "Visit",
    href: "#visit",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [churchSettings, setChurchSettings] = useState(null);

  const [scrolled, setScrolled] = useState(false);

  /* ====================================================================== */
  /* LOAD SETTINGS                                                          */
  /* ====================================================================== */

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getChurchSettings();

        setChurchSettings(data);
      } catch (error) {
        console.error("Navbar settings error:", error);
      }
    };

    loadSettings();
  }, []);

  /* ====================================================================== */
  /* NAVBAR SCROLL EFFECT                                                   */
  /* ====================================================================== */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* ====================================================================== */
  /* LOCK BODY WHEN MOBILE MENU IS OPEN                                     */
  /* ====================================================================== */

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* ====================================================================== */
  /* SETTINGS FALLBACKS                                                     */
  /* ====================================================================== */

  const churchName =
    churchSettings?.church_name || "New Grace Jesus With Us Church";

  const shortName = churchSettings?.short_name || "New Grace";

  /* ====================================================================== */
  /* HELPERS                                                                */
  /* ====================================================================== */

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* ================================================================== */}
      {/* DESKTOP / MOBILE HEADER                                            */}
      {/* ================================================================== */}

      <header
        className={`fixed inset-x-0 top-0 z-[90] transition-all duration-300 ${
          scrolled
            ? "border-b border-zinc-200/80 bg-white/95 shadow-sm backdrop-blur-xl"
            : "border-b border-white/10 bg-black/10 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          {/* BRAND */}

          <a
            href="#home"
            onClick={handleNavClick}
            className="group flex min-w-0 items-center gap-3"
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition ${
                scrolled
                  ? "bg-zinc-950 text-amber-300"
                  : "border border-white/20 bg-white/10 text-amber-300"
              }`}
            >
              <Church size={20} />
            </div>

            <div className="min-w-0">
              <p
                className={`truncate text-sm font-semibold transition ${
                  scrolled ? "text-zinc-950" : "text-white"
                }`}
              >
                {shortName}
              </p>

              <p
                className={`max-w-[190px] truncate text-[9px] uppercase tracking-[0.16em] transition sm:max-w-[260px] ${
                  scrolled ? "text-zinc-400" : "text-white/45"
                }`}
              >
                {churchName}
              </p>
            </div>
          </a>

          {/* DESKTOP NAVIGATION */}

          <nav className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  scrolled
                    ? "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* RIGHT SIDE */}

          <div className="flex items-center gap-3">
            <a
              href="#visit"
              className={`hidden rounded-full px-5 py-2.5 text-sm font-semibold transition sm:inline-flex ${
                scrolled
                  ? "bg-zinc-950 text-white hover:bg-zinc-800"
                  : "bg-amber-300 text-zinc-950 hover:bg-amber-200"
              }`}
            >
              Plan Your Visit
            </a>

            {/* MOBILE MENU BUTTON */}

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              className={`flex h-11 w-11 items-center justify-center rounded-full transition lg:hidden ${
                scrolled
                  ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                  : "border border-white/15 bg-white/10 text-white"
              }`}
            >
              <Menu size={21} />
            </button>
          </div>
        </div>
      </header>

      {/* ================================================================== */}
      {/* MOBILE MENU                                                        */}
      {/* ================================================================== */}

      <AnimatePresence>
        {menuOpen && (
          <>
            {/* BACKDROP */}

            <motion.button
              type="button"
              aria-label="Close navigation menu"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* DRAWER */}

            <motion.div
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="fixed bottom-0 right-0 top-0 z-[110] flex w-[88%] max-w-[390px] flex-col bg-zinc-950 text-white shadow-2xl lg:hidden"
            >
              {/* MOBILE HEADER */}

              <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-300 text-zinc-950">
                    <Church size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {shortName}
                    </p>

                    <p className="truncate text-[9px] uppercase tracking-[0.15em] text-white/35">
                      {churchName}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close navigation"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* MOBILE LINKS */}

              <nav className="flex-1 overflow-y-auto px-5 py-6">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">
                  Explore
                </p>

                <div className="space-y-1">
                  {navigation.map((item, index) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={handleNavClick}
                      initial={{
                        opacity: 0,
                        x: 20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: 0.05 + index * 0.04,
                      }}
                      className="group flex items-center justify-between rounded-xl px-4 py-4 text-base font-medium text-white/65 transition hover:bg-white/5 hover:text-white"
                    >
                      <span>{item.label}</span>

                      <ArrowRight
                        size={16}
                        className="text-white/25 transition-transform group-hover:translate-x-1 group-hover:text-amber-300"
                      />
                    </motion.a>
                  ))}
                </div>
              </nav>

              {/* MOBILE CTA */}

              <div className="border-t border-white/10 p-5">
                <a
                  href="#visit"
                  onClick={handleNavClick}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-300 px-6 py-4 text-sm font-semibold text-zinc-950"
                >
                  Plan Your Visit
                  <ArrowRight size={17} />
                </a>

                <p className="mt-5 text-center text-[11px] text-white/30">
                  {churchName}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
