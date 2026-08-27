import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  CalendarDays,
  Inbox,
  Mail,
  MessageSquareHeart,
  Users,
} from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

import {
  getContactMessages,
  getPrayerRequests,
} from "../../services/adminService";

export default function AdminDashboardPage() {
  const { profile } = useAuth();

  const [prayers, setPrayers] = useState([]);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [prayerData, messageData] = await Promise.all([
        getPrayerRequests(),
        getContactMessages(),
      ]);

      setPrayers(prayerData);
      setMessages(messageData);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Unable to load dashboard information.");
    } finally {
      setLoading(false);
    }
  };

  const newPrayerCount = prayers.filter(
    (item) => (item.status || "new") === "new",
  ).length;

  const newMessageCount = messages.filter(
    (item) => (item.status || "new") === "new",
  ).length;

  const totalPeopleReached = prayers.length + messages.length;

  const recentPrayers = prayers.slice(0, 5);
  const recentMessages = messages.slice(0, 5);

  return (
    <AdminLayout>
      <main className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                Church Administration
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Welcome, {profile?.full_name || "Administrator"}
              </h1>

              <p className="mt-3 max-w-2xl text-zinc-500">
                Manage prayer requests, website messages, and church activity
                from one place.
              </p>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm hover:border-amber-300"
            >
              View Website
              <ArrowRight size={16} />
            </a>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* STATS */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardStat
              icon={MessageSquareHeart}
              label="Prayer Requests"
              value={loading ? "..." : prayers.length}
              description={`${newPrayerCount} new`}
            />

            <DashboardStat
              icon={Inbox}
              label="Contact Messages"
              value={loading ? "..." : messages.length}
              description={`${newMessageCount} new`}
            />

            <DashboardStat
              icon={Mail}
              label="Needs Attention"
              value={loading ? "..." : newPrayerCount + newMessageCount}
              description="New submissions"
            />

            <DashboardStat
              icon={Users}
              label="People Reached"
              value={loading ? "..." : totalPeopleReached}
              description="Website responses"
            />
          </div>

          {/* QUICK ACTIONS */}
          <section className="mt-10">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">
                Quick Actions
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
                Manage website activity
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <QuickAction
                to="/admin/prayers"
                icon={MessageSquareHeart}
                title="Prayer Requests"
                description="View, search, update, and follow up on prayer requests."
                count={prayers.length}
              />

              <QuickAction
                to="/admin/messages"
                icon={Mail}
                title="Contact Messages"
                description="Read website inquiries and manage their status."
                count={messages.length}
              />

              <div className="rounded-[1.75rem] border border-dashed border-zinc-300 bg-white/50 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
                  <CalendarDays size={21} />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-zinc-900">
                  Events
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Event management will be connected in the next stage.
                </p>

                <span className="mt-6 inline-flex rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-500">
                  Coming next
                </span>
              </div>
            </div>
          </section>

          {/* RECENT DATA */}
          <div className="mt-10 grid gap-7 xl:grid-cols-2">
            {/* PRAYERS */}
            <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm font-semibold text-amber-700">
                    Prayer Ministry
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold text-zinc-900">
                    Recent Prayer Requests
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f7f4ed] text-amber-800">
                  <MessageSquareHeart size={20} />
                </div>
              </div>

              <div className="mt-7 divide-y divide-zinc-100">
                {loading ? (
                  <LoadingMessage />
                ) : recentPrayers.length === 0 ? (
                  <EmptyMessage text="No prayer requests yet." />
                ) : (
                  recentPrayers.map((request) => (
                    <Link
                      key={request.id}
                      to="/admin/prayers"
                      className="block py-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-zinc-900">
                              {request.name || "Anonymous"}
                            </p>

                            <StatusBadge status={request.status} />
                          </div>

                          {request.email && (
                            <p className="mt-1 text-xs text-zinc-400">
                              {request.email}
                            </p>
                          )}
                        </div>

                        <p className="shrink-0 text-xs text-zinc-400">
                          {formatDate(request.created_at)}
                        </p>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500">
                        {request.prayer_request}
                      </p>
                    </Link>
                  ))
                )}
              </div>

              <Link
                to="/admin/prayers"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900"
              >
                View all prayer requests
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* MESSAGES */}
            <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm font-semibold text-amber-700">
                    Website Inbox
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold text-zinc-900">
                    Recent Messages
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f7f4ed] text-amber-800">
                  <Mail size={20} />
                </div>
              </div>

              <div className="mt-7 divide-y divide-zinc-100">
                {loading ? (
                  <LoadingMessage />
                ) : recentMessages.length === 0 ? (
                  <EmptyMessage text="No contact messages yet." />
                ) : (
                  recentMessages.map((message) => (
                    <Link
                      key={message.id}
                      to="/admin/messages"
                      className="block py-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-zinc-900">
                              {message.name}
                            </p>

                            <StatusBadge status={message.status} />
                          </div>

                          <p className="mt-1 text-xs text-zinc-400">
                            {message.email}
                          </p>
                        </div>

                        <p className="shrink-0 text-xs text-zinc-400">
                          {formatDate(message.created_at)}
                        </p>
                      </div>

                      <p className="mt-3 text-sm font-medium text-zinc-800">
                        {message.subject || "General Question"}
                      </p>

                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-500">
                        {message.message}
                      </p>
                    </Link>
                  ))
                )}
              </div>

              <Link
                to="/admin/messages"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900"
              >
                View all messages
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}

function DashboardStat({ icon: Icon, label, value, description }) {
  return (
    <div className="rounded-[1.75rem] bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7f4ed] text-amber-800">
        <Icon size={21} />
      </div>

      <p className="mt-6 text-3xl font-semibold text-zinc-900">{value}</p>

      <p className="mt-1 text-sm font-medium text-zinc-700">{label}</p>

      <p className="mt-1 text-xs text-zinc-400">{description}</p>
    </div>
  );
}

function QuickAction({ to, icon: Icon, title, description, count }) {
  return (
    <Link
      to={to}
      className="group rounded-[1.75rem] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7f4ed] text-amber-800">
          <Icon size={21} />
        </div>

        <span className="text-2xl font-semibold text-zinc-900">{count}</span>
      </div>

      <h3 className="mt-6 text-xl font-semibold text-zinc-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>

      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900">
        Open
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}

function StatusBadge({ status }) {
  const currentStatus = status || "new";

  const styles = {
    new: "bg-blue-50 text-blue-700",
    in_progress: "bg-amber-100 text-amber-800",
    completed: "bg-green-50 text-green-700",
  };

  const labels = {
    new: "New",
    in_progress: "In Progress",
    completed: "Completed",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
        styles[currentStatus] || styles.new
      }`}
    >
      {labels[currentStatus] || "New"}
    </span>
  );
}

function LoadingMessage() {
  return (
    <div className="py-10 text-center text-sm text-zinc-400">Loading...</div>
  );
}

function EmptyMessage({ text }) {
  return (
    <div className="py-10 text-center">
      <Inbox size={28} className="mx-auto text-zinc-300" />

      <p className="mt-3 text-sm text-zinc-400">{text}</p>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
