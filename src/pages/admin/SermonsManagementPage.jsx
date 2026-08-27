import { useEffect, useMemo, useState } from "react";

import {
  BookMarked,
  BookOpen,
  CalendarDays,
  Clock3,
  Edit3,
  Eye,
  EyeOff,
  ExternalLink,
  Mic2,
  Play,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { FaYoutube } from "react-icons/fa";

import { AnimatePresence, motion } from "framer-motion";

import AdminLayout from "../../components/admin/AdminLayout";

import {
  createSermon,
  deleteSermon,
  extractYouTubeVideoId,
  getAdminSermons,
  getYouTubeThumbnail,
  toggleSermonPublished,
  updateSermon,
} from "../../services/sermonService";

const emptyForm = {
  title: "",
  description: "",
  speaker: "",
  scripture: "",
  sermonDate: "",
  duration: "",
  youtubeUrl: "",
  isFeatured: false,
  isPublished: true,
};

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10";

export default function SermonsManagementPage() {
  const [sermons, setSermons] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);

  const [editingSermon, setEditingSermon] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadSermons();
  }, []);

  const loadSermons = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminSermons();

      setSermons(data);
    } catch (err) {
      console.error("Sermons error:", err);

      setError("Unable to load sermons.");
    } finally {
      setLoading(false);
    }
  };

  const filteredSermons = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sermons.filter((sermon) => {
      const matchesSearch =
        !query ||
        sermon.title?.toLowerCase().includes(query) ||
        sermon.speaker?.toLowerCase().includes(query) ||
        sermon.scripture?.toLowerCase().includes(query);

      let matchesFilter = true;

      if (filter === "published") {
        matchesFilter = sermon.is_published === true;
      }

      if (filter === "draft") {
        matchesFilter = sermon.is_published === false;
      }

      if (filter === "featured") {
        matchesFilter = sermon.is_featured === true;
      }

      return matchesSearch && matchesFilter;
    });
  }, [sermons, search, filter]);

  const videoId = extractYouTubeVideoId(form.youtubeUrl);

  const thumbnail = getYouTubeThumbnail(videoId);

  const openCreateForm = () => {
    setEditingSermon(null);
    setForm(emptyForm);
    setError("");
    setFormOpen(true);
  };

  const openEditForm = (sermon) => {
    setEditingSermon(sermon);

    setForm({
      title: sermon.title || "",

      description: sermon.description || "",

      speaker: sermon.speaker || "",

      scripture: sermon.scripture || "",

      sermonDate: sermon.sermon_date || "",

      duration: sermon.duration || "",

      youtubeUrl: sermon.youtube_url || "",

      isFeatured: sermon.is_featured || false,

      isPublished: sermon.is_published ?? true,
    });

    setError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) {
      return;
    }

    setFormOpen(false);
    setEditingSermon(null);
    setForm(emptyForm);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter a sermon title.");
      return;
    }

    if (!form.sermonDate) {
      setError("Please select the sermon date.");
      return;
    }

    if (!form.youtubeUrl.trim()) {
      setError("Please enter the YouTube video link.");
      return;
    }

    if (!videoId) {
      setError("That does not appear to be a valid YouTube URL.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingSermon) {
        const updated = await updateSermon(editingSermon.id, form);

        setSermons((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
      } else {
        const created = await createSermon(form);

        setSermons((current) =>
          [created, ...current].sort(
            (a, b) => new Date(b.sermon_date) - new Date(a.sermon_date),
          ),
        );
      }

      closeForm();
    } catch (err) {
      console.error("Save sermon error:", err);

      setError(err?.message || "Unable to save sermon.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sermon) => {
    const confirmed = window.confirm(`Delete "${sermon.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await deleteSermon(sermon.id);

      setSermons((current) => current.filter((item) => item.id !== sermon.id));
    } catch (err) {
      console.error(err);

      alert("Unable to delete sermon.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublished = async (sermon) => {
    try {
      setActionLoading(true);

      const updated = await toggleSermonPublished(
        sermon.id,
        !sermon.is_published,
      );

      setSermons((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      console.error(err);

      alert("Unable to update sermon.");
    } finally {
      setActionLoading(false);
    }
  };

  const publishedCount = sermons.filter((sermon) => sermon.is_published).length;

  const featuredCount = sermons.filter((sermon) => sermon.is_featured).length;

  return (
    <AdminLayout>
      <main className="px-5 py-7 sm:px-7 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">
                Website Content
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Sermons
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                Manage sermon messages and YouTube videos displayed on the
                church website.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
            >
              <Plus size={17} />
              Add Sermon
            </button>
          </div>

          {/* STATS */}

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <StatCard label="Total Sermons" value={sermons.length} />

            <StatCard label="Published" value={publishedCount} />

            <StatCard label="Featured" value={featuredCount} />
          </div>

          {/* SEARCH */}

          <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sermons..."
                className="w-full rounded-xl border border-zinc-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-red-500"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="all">All Sermons</option>

              <option value="published">Published</option>

              <option value="draft">Draft</option>

              <option value="featured">Featured</option>
            </select>
          </div>

          {error && !formOpen && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* SERMONS */}

          <div className="mt-6">
            {loading ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center text-sm text-zinc-400">
                Loading sermons...
              </div>
            ) : filteredSermons.length === 0 ? (
              <EmptySermons onCreate={openCreateForm} />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredSermons.map((sermon) => (
                  <SermonCard
                    key={sermon.id}
                    sermon={sermon}
                    actionLoading={actionLoading}
                    onEdit={() => openEditForm(sermon)}
                    onToggle={() => handleTogglePublished(sermon)}
                    onDelete={() => handleDelete(sermon)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}

      <AnimatePresence>
        {formOpen && (
          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={closeForm}
              className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px]"
            />

            <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-5">
              <div className="flex min-h-full items-center justify-center">
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 20,
                    scale: 0.98,
                  }}
                  className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                >
                  {/* HEADER */}

                  <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-950">
                        {editingSermon ? "Edit Sermon" : "Add New Sermon"}
                      </h2>

                      <p className="mt-1 text-xs text-zinc-500">
                        Paste the YouTube video link and the thumbnail will
                        appear automatically.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={closeForm}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100"
                    >
                      <X size={19} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-[1fr_0.95fr]">
                      {/* FORM */}

                      <div className="border-b border-zinc-200 p-6 lg:border-b-0 lg:border-r">
                        <div className="space-y-5">
                          <Field label="Sermon Title" required>
                            <input
                              type="text"
                              required
                              value={form.title}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  title: e.target.value,
                                })
                              }
                              placeholder="Walking By Faith"
                              className={inputClass}
                            />
                          </Field>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Speaker">
                              <input
                                value={form.speaker}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    speaker: e.target.value,
                                  })
                                }
                                placeholder="Pastor Name"
                                className={inputClass}
                              />
                            </Field>

                            <Field label="Scripture">
                              <input
                                value={form.scripture}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    scripture: e.target.value,
                                  })
                                }
                                placeholder="2 Corinthians 5:7"
                                className={inputClass}
                              />
                            </Field>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Sermon Date" required>
                              <input
                                type="date"
                                required
                                value={form.sermonDate}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    sermonDate: e.target.value,
                                  })
                                }
                                className={inputClass}
                              />
                            </Field>

                            <Field label="Duration">
                              <input
                                value={form.duration}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    duration: e.target.value,
                                  })
                                }
                                placeholder="42 min"
                                className={inputClass}
                              />
                            </Field>
                          </div>

                          {/* YOUTUBE */}

                          <Field label="YouTube Video URL" required>
                            <div className="relative">
                              <FaYoutube
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600"
                              />

                              <input
                                type="url"
                                required
                                value={form.youtubeUrl}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    youtubeUrl: e.target.value,
                                  })
                                }
                                placeholder="https://www.youtube.com/watch?v=..."
                                className={`${inputClass} pl-11`}
                              />
                            </div>

                            {form.youtubeUrl && !videoId && (
                              <p className="mt-2 text-xs text-red-600">
                                Please enter a valid YouTube URL.
                              </p>
                            )}

                            {videoId && (
                              <p className="mt-2 text-xs text-green-600">
                                YouTube video recognized successfully.
                              </p>
                            )}
                          </Field>

                          <Field label="Description">
                            <textarea
                              rows="5"
                              maxLength={1200}
                              value={form.description}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  description: e.target.value,
                                })
                              }
                              placeholder="Brief description of the sermon..."
                              className={`${inputClass} resize-none`}
                            />

                            <p className="mt-1 text-right text-[11px] text-zinc-400">
                              {form.description.length}
                              /1200
                            </p>
                          </Field>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <ToggleCard
                              title="Featured"
                              description="Use as the main sermon."
                              checked={form.isFeatured}
                              onChange={(checked) =>
                                setForm({
                                  ...form,
                                  isFeatured: checked,
                                })
                              }
                            />

                            <ToggleCard
                              title="Published"
                              description="Visible on the website."
                              checked={form.isPublished}
                              onChange={(checked) =>
                                setForm({
                                  ...form,
                                  isPublished: checked,
                                })
                              }
                            />
                          </div>

                          {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                              {error}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* PREVIEW */}

                      <div className="bg-zinc-50 p-6">
                        <div className="sticky top-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">
                            Live Preview
                          </p>

                          <h3 className="mt-2 text-lg font-semibold">
                            Sermon Card
                          </h3>

                          <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                            <div className="relative aspect-video overflow-hidden bg-zinc-950">
                              {thumbnail ? (
                                <img
                                  src={thumbnail}
                                  alt="YouTube thumbnail"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full flex-col items-center justify-center text-white/30">
                                  <FaYoutube size={42} />

                                  <p className="mt-3 text-xs">
                                    YouTube preview
                                  </p>
                                </div>
                              )}

                              {thumbnail && (
                                <>
                                  <div className="absolute inset-0 bg-black/20" />

                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-xl">
                                      <Play size={23} fill="currentColor" />
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-600">
                                Sunday Message
                              </p>

                              <h4 className="mt-3 text-xl font-semibold">
                                {form.title || "Sermon Title"}
                              </h4>

                              <div className="mt-4 space-y-2 text-xs text-zinc-500">
                                <PreviewInfo
                                  icon={Mic2}
                                  value={form.speaker || "Speaker"}
                                />

                                <PreviewInfo
                                  icon={BookMarked}
                                  value={form.scripture || "Scripture"}
                                />

                                <PreviewInfo
                                  icon={CalendarDays}
                                  value={
                                    form.sermonDate
                                      ? formatSermonDate(form.sermonDate)
                                      : "Sermon date"
                                  }
                                />

                                {form.duration && (
                                  <PreviewInfo
                                    icon={Clock3}
                                    value={form.duration}
                                  />
                                )}
                              </div>
                            </div>
                          </div>

                          {videoId && (
                            <a
                              href={form.youtubeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 hover:border-red-300"
                            >
                              Open on YouTube
                              <ExternalLink size={15} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* FOOTER */}

                    <div className="flex items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={closeForm}
                        className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                      >
                        {saving
                          ? "Saving..."
                          : editingSermon
                            ? "Save Changes"
                            : "Create Sermon"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

function SermonCard({ sermon, actionLoading, onEdit, onToggle, onDelete }) {
  const thumbnail = getYouTubeThumbnail(sermon.youtube_video_id);

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="relative aspect-video overflow-hidden bg-zinc-950">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={sermon.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/30">
            <FaYoutube size={38} />
          </div>
        )}

        <div className="absolute inset-0 bg-black/10" />

        <a
          href={sermon.youtube_url}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
            <Play size={20} fill="currentColor" />
          </div>
        </a>

        <div className="absolute left-3 top-3 flex gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
              sermon.is_published
                ? "bg-green-100 text-green-700"
                : "bg-white text-zinc-600"
            }`}
          >
            {sermon.is_published ? "Published" : "Draft"}
          </span>

          {sermon.is_featured && (
            <span className="flex items-center gap-1 rounded-full bg-amber-300 px-2.5 py-1 text-[10px] font-semibold">
              <Star size={11} fill="currentColor" />
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <h2 className="line-clamp-2 text-lg font-semibold">{sermon.title}</h2>

        <div className="mt-4 space-y-2 text-xs text-zinc-500">
          {sermon.speaker && <PreviewInfo icon={Mic2} value={sermon.speaker} />}

          {sermon.scripture && (
            <PreviewInfo icon={BookMarked} value={sermon.scripture} />
          )}

          <PreviewInfo
            icon={CalendarDays}
            value={formatSermonDate(sermon.sermon_date)}
          />

          {sermon.duration && (
            <PreviewInfo icon={Clock3} value={sermon.duration} />
          )}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onEdit}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-3 py-2.5 text-xs font-semibold text-white"
          >
            <Edit3 size={15} />
            Edit
          </button>

          <button
            disabled={actionLoading}
            onClick={onToggle}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200"
          >
            {sermon.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>

          <button
            disabled={actionLoading}
            onClick={onDelete}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-zinc-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}
    </div>
  );
}

function ToggleCard({ title, description, checked, onChange }) {
  return (
    <label
      className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${
        checked ? "border-red-200 bg-red-50" : "border-zinc-200"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4"
      />

      <div>
        <p className="text-xs font-semibold">{title}</p>

        <p className="mt-0.5 text-[11px] text-zinc-500">{description}</p>
      </div>
    </label>
  );
}

function PreviewInfo({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className="shrink-0 text-red-600" />

      <span className="truncate">{value}</span>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <p className="text-2xl font-semibold">{value}</p>

      <p className="mt-1 text-xs text-zinc-500">{label}</p>
    </div>
  );
}

function EmptySermons({ onCreate }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
      <BookOpen size={34} className="mx-auto text-zinc-300" />

      <h2 className="mt-4 font-semibold">No sermons yet</h2>

      <p className="mt-1 text-sm text-zinc-400">
        Add your first YouTube sermon.
      </p>

      <button
        onClick={onCreate}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
      >
        <Plus size={16} />
        Add Sermon
      </button>
    </div>
  );
}

function formatSermonDate(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
