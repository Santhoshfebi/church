import {
  BookOpen,
  CalendarDays,
  Church,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  Mail,
  Menu,
  MessageSquareHeart,
  UsersRound,
  Settings,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { useAuth } from "../../context/AuthContext";

const links = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Prayer Requests",
    path: "/admin/prayers",
    icon: MessageSquareHeart,
  },
  {
    label: "Contact Messages",
    path: "/admin/messages",
    icon: Mail,
  },
  {
    label: "Ministries",
    path: "/admin/ministries",
    icon: UsersRound,
  },
  {
    label: "Sermons",
    path: "/admin/sermons",
    icon: BookOpen,
  },
  {
    label: "Events",
    path: "/admin/events",
    icon: CalendarDays,
  },
  {
    label: "Published Books",
    path: "/admin/books",
    icon: LibraryBig,
  },
  {
    label: "Website Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminMobileHeader() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const { profile, signOut } = useAuth();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSignOut = async () => {
    try {
      await signOut();

      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 text-amber-300">
            <Church size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold">New Grace</p>

            <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-400">
              Admin
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200"
        >
          <Menu size={20} />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 30,
              }}
              className="fixed right-0 top-0 z-[60] flex h-full w-full max-w-sm flex-col bg-zinc-950 p-6 text-white lg:hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">New Grace Admin</p>

                  <p className="mt-1 text-xs text-white/40">
                    {profile?.full_name || "Administrator"}
                  </p>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="mt-10 space-y-2">
                {links.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-2xl px-4 py-4 ${
                          isActive ? "bg-white/10" : "text-white/55"
                        }`
                      }
                    >
                      <Icon size={19} />

                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>

              <button
                onClick={handleSignOut}
                className="mt-auto flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-4 text-white/60"
              >
                <LogOut size={17} />
                Sign Out
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
