import {
  BookOpen,
  CalendarDays,
  Church,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  Mail,
  UsersRound,
  Settings,
  MessageSquareHeart,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const menuItems = [
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

export default function AdminSidebar() {
  const navigate = useNavigate();

  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();

      navigate("/admin/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-52 shrink-0 flex-col overflow-hidden bg-zinc-950 px-4 py-5 text-white lg:flex">
      {/* BRAND */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-300 text-zinc-950">
          <Church size={18} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">New Grace</p>

          <p className="truncate text-[9px] uppercase tracking-[0.12em] text-white/40">
            Church Admin
          </p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="mt-7 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={17} className="shrink-0" />

              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* BOTTOM */}
      <div className="mt-auto">
        {/* USER */}
        <div className="mb-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-[9px] uppercase tracking-[0.12em] text-white/30">
            Signed In
          </p>

          <p className="mt-1.5 truncate text-xs font-semibold">
            {profile?.full_name || "Church Administrator"}
          </p>

          <p className="mt-0.5 truncate text-[10px] capitalize text-white/30">
            {profile?.role || "admin"}
          </p>
        </div>

        {/* SIGN OUT */}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-xs font-medium text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
