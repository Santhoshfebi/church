import { useEffect, useMemo, useState } from "react";

import { Clock3, Mail, Phone, Search, Trash2, User, X } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import AdminLayout from "../../components/admin/AdminLayout";

import {
  deleteContactMessage,
  getContactMessages,
  updateContactMessageStatus,
} from "../../services/adminService";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);

  const [selectedMessage, setSelectedMessage] = useState(null);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getContactMessages();

      setMessages(data);
    } catch (err) {
      console.error(err);

      setError("Unable to load contact messages.");
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesSearch =
        !query ||
        message.name?.toLowerCase().includes(query) ||
        message.email?.toLowerCase().includes(query) ||
        message.subject?.toLowerCase().includes(query) ||
        message.message?.toLowerCase().includes(query);

      const matchesFilter = filter === "all" || message.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [messages, search, filter]);

  const handleStatusChange = async (message, status) => {
    try {
      setActionLoading(true);

      await updateContactMessageStatus(message.id, status);

      setMessages((current) =>
        current.map((item) =>
          item.id === message.id
            ? {
                ...item,
                status,
              }
            : item,
        ),
      );

      setSelectedMessage((current) =>
        current?.id === message.id
          ? {
              ...current,
              status,
            }
          : current,
      );
    } catch (err) {
      console.error(err);

      alert("Unable to update message.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (message) => {
    const confirmed = window.confirm(
      "Delete this message? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await deleteContactMessage(message.id);

      setMessages((current) =>
        current.filter((item) => item.id !== message.id),
      );

      setSelectedMessage(null);
    } catch (err) {
      console.error(err);

      alert("Unable to delete message.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <main className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Website Inbox
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Contact Messages
          </h1>

          <p className="mt-2 text-zinc-500">
            View and manage messages submitted from the church website.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard label="Total" value={messages.length} />

            <StatCard
              label="New"
              value={messages.filter((item) => item.status === "new").length}
            />

            <StatCard
              label="Completed"
              value={
                messages.filter((item) => item.status === "completed").length
              }
            />
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-[1.75rem] bg-white p-5 shadow-sm sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages..."
                className="w-full rounded-2xl border border-zinc-200 py-3.5 pl-11 pr-4 outline-none focus:border-amber-400"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-2xl border border-zinc-200 bg-white px-5 py-3.5"
            >
              <option value="all">All Statuses</option>

              <option value="new">New</option>

              <option value="in_progress">In Progress</option>

              <option value="completed">Completed</option>
            </select>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 overflow-hidden rounded-[2rem] bg-white shadow-sm">
            {loading ? (
              <div className="p-10 text-center text-zinc-400">
                Loading messages...
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-12 text-center">
                <Mail size={34} className="mx-auto text-zinc-300" />

                <p className="mt-4 font-semibold">No messages found.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {filteredMessages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className="flex w-full flex-col gap-4 p-6 text-left transition hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-semibold">{message.name}</p>

                        <StatusBadge status={message.status} />
                      </div>

                      <p className="mt-2 text-sm font-medium text-zinc-700">
                        {message.subject}
                      </p>

                      <p className="mt-1 line-clamp-2 max-w-3xl text-sm leading-6 text-zinc-500">
                        {message.message}
                      </p>
                    </div>

                    <p className="shrink-0 text-xs text-zinc-400">
                      {formatDate(message.created_at)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedMessage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMessage(null)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                    Contact Message
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold">
                    {selectedMessage.subject}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedMessage(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="mt-8 space-y-4 rounded-2xl bg-[#f7f4ed] p-5">
                <InfoRow
                  icon={User}
                  label="Name"
                  value={selectedMessage.name}
                />

                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={selectedMessage.email}
                />

                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={selectedMessage.phone || "Not provided"}
                />

                <InfoRow
                  icon={Clock3}
                  label="Submitted"
                  value={formatDate(selectedMessage.created_at)}
                />
              </div>

              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Message
                </p>

                <p className="mt-4 whitespace-pre-wrap leading-8 text-zinc-700">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="mt-10">
                <p className="mb-3 text-sm font-semibold">Status</p>

                <select
                  disabled={actionLoading}
                  value={selectedMessage.status || "new"}
                  onChange={(e) =>
                    handleStatusChange(selectedMessage, e.target.value)
                  }
                  className="w-full rounded-2xl border border-zinc-200 px-5 py-4"
                >
                  <option value="new">New</option>

                  <option value="in_progress">In Progress</option>

                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="mt-8 flex gap-3">
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-4 font-semibold text-white"
                >
                  <Mail size={17} />
                  Reply by Email
                </a>

                <button
                  disabled={actionLoading}
                  onClick={() => handleDelete(selectedMessage)}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
      <p className="text-3xl font-semibold">{value}</p>

      <p className="mt-1 text-sm text-zinc-500">{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
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
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] || styles.new
      }`}
    >
      {labels[status] || "New"}
    </span>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={17} className="mt-0.5 text-amber-700" />

      <div>
        <p className="text-xs uppercase tracking-wider text-zinc-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium">{value}</p>
      </div>
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
