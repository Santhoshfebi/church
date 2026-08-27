import { useEffect, useMemo, useState } from "react";

import {
  CheckCircle2,
  Clock3,
  Mail,
  MessageSquareHeart,
  PhoneCall,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import AdminLayout from "../../components/admin/AdminLayout";

import {
  deletePrayerRequest,
  getPrayerRequests,
  updatePrayerRequestStatus,
} from "../../services/adminService";

export default function PrayerRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPrayerRequests();

      setRequests(data);
    } catch (err) {
      console.error(err);

      setError("Unable to load prayer requests.");
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !query ||
        request.name?.toLowerCase().includes(query) ||
        request.email?.toLowerCase().includes(query) ||
        request.prayer_request?.toLowerCase().includes(query);

      const matchesFilter = filter === "all" || request.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [requests, search, filter]);

  const handleStatusChange = async (request, status) => {
    try {
      setActionLoading(true);

      await updatePrayerRequestStatus(request.id, status);

      setRequests((current) =>
        current.map((item) =>
          item.id === request.id
            ? {
                ...item,
                status,
              }
            : item,
        ),
      );

      setSelectedRequest((current) =>
        current?.id === request.id
          ? {
              ...current,
              status,
            }
          : current,
      );
    } catch (err) {
      console.error(err);

      alert("Unable to update request.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (request) => {
    const confirmed = window.confirm(
      "Delete this prayer request? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await deletePrayerRequest(request.id);

      setRequests((current) =>
        current.filter((item) => item.id !== request.id),
      );

      setSelectedRequest(null);
    } catch (err) {
      console.error(err);

      alert("Unable to delete prayer request.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <main className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              Ministry Care
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Prayer Requests
            </h1>

            <p className="mt-2 text-zinc-500">
              Review and manage prayer requests submitted through the website.
            </p>
          </div>

          {/* STATS */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard label="Total" value={requests.length} />

            <StatCard
              label="New"
              value={requests.filter((item) => item.status === "new").length}
            />

            <StatCard
              label="Completed"
              value={
                requests.filter((item) => item.status === "completed").length
              }
            />
          </div>

          {/* SEARCH */}
          <div className="mt-8 flex flex-col gap-4 rounded-[1.75rem] bg-white p-5 shadow-sm sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email or prayer request..."
                className="w-full rounded-2xl border border-zinc-200 py-3.5 pl-11 pr-4 outline-none focus:border-amber-400"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-2xl border border-zinc-200 bg-white px-5 py-3.5 outline-none"
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

          {/* REQUEST LIST */}
          <div className="mt-6 overflow-hidden rounded-[2rem] bg-white shadow-sm">
            {loading ? (
              <div className="p-10 text-center text-zinc-400">
                Loading prayer requests...
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="p-12 text-center">
                <MessageSquareHeart
                  size={34}
                  className="mx-auto text-zinc-300"
                />

                <p className="mt-4 font-semibold">No prayer requests found.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {filteredRequests.map((request) => (
                  <button
                    key={request.id}
                    onClick={() => setSelectedRequest(request)}
                    className="flex w-full flex-col gap-4 p-6 text-left transition hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-semibold">
                          {request.name || "Anonymous"}
                        </p>

                        <StatusBadge status={request.status} />

                        {request.wants_contact && (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                            Wants Contact
                          </span>
                        )}
                      </div>

                      <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-zinc-500">
                        {request.prayer_request}
                      </p>
                    </div>

                    <p className="shrink-0 text-xs text-zinc-400">
                      {formatDate(request.created_at)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedRequest && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 270,
                damping: 30,
              }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                    Prayer Request
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold">
                    {selectedRequest.name || "Anonymous"}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedRequest(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="mt-8 space-y-4 rounded-2xl bg-[#f7f4ed] p-5">
                <InfoRow
                  icon={User}
                  label="Name"
                  value={selectedRequest.name || "Anonymous"}
                />

                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={selectedRequest.email || "Not provided"}
                />

                <InfoRow
                  icon={Clock3}
                  label="Submitted"
                  value={formatDate(selectedRequest.created_at)}
                />

                {selectedRequest.wants_contact && (
                  <InfoRow
                    icon={PhoneCall}
                    label="Follow Up"
                    value="Requested"
                  />
                )}
              </div>

              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Prayer Request
                </p>

                <p className="mt-4 whitespace-pre-wrap leading-8 text-zinc-700">
                  {selectedRequest.prayer_request}
                </p>
              </div>

              <div className="mt-10">
                <p className="mb-3 text-sm font-semibold">Status</p>

                <select
                  disabled={actionLoading}
                  value={selectedRequest.status || "new"}
                  onChange={(e) =>
                    handleStatusChange(selectedRequest, e.target.value)
                  }
                  className="w-full rounded-2xl border border-zinc-200 px-5 py-4 outline-none focus:border-amber-400"
                >
                  <option value="new">New</option>

                  <option value="in_progress">In Progress</option>

                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="mt-8 flex gap-3">
                {selectedRequest.email && (
                  <a
                    href={`mailto:${selectedRequest.email}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-4 font-semibold text-white"
                  >
                    <Mail size={17} />
                    Email Person
                  </a>
                )}

                <button
                  disabled={actionLoading}
                  onClick={() => handleDelete(selectedRequest)}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-red-200 text-red-600 hover:bg-red-50"
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
