import { useEffect, useMemo, useRef, useState } from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  EyeOff,
  ImagePlus,
  MapPin,
  Plus,
  Search,
  Star,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import AdminLayout from "../../components/admin/AdminLayout";
import BlurredImage from "../../components/BlurredImage";

import {
  createEvent,
  deleteEvent,
  deleteEventImage,
  getAdminEvents,
  toggleEventPublished,
  updateEvent,
  uploadEventImage,
} from "../../services/eventService";

const emptyForm = {
  title: "",
  description: "",
  eventDate: "",
  startTime: "",
  location: "",
  imageUrl: "",
  imagePath: "",
  imageFile: null,
  isFeatured: false,
  isPublished: true,
};

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10";

export default function EventsManagementPage() {
  const fileInputRef = useRef(null);

  const [events, setEvents] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [imagePreview, setImagePreview] = useState("");

  const [dragging, setDragging] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminEvents();

      setEvents(data);
    } catch (err) {
      console.error("Events error:", err);

      setError("Unable to load events.");
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        !query ||
        event.title?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query);

      let matchesFilter = true;

      if (filter === "published") {
        matchesFilter = event.is_published === true;
      }

      if (filter === "draft") {
        matchesFilter = event.is_published === false;
      }

      if (filter === "featured") {
        matchesFilter = event.is_featured === true;
      }

      return matchesSearch && matchesFilter;
    });
  }, [events, search, filter]);

  const openCreateForm = () => {
    setEditingEvent(null);
    setForm(emptyForm);
    setImagePreview("");
    setError("");
    setFormOpen(true);
  };

  const openEditForm = (event) => {
    setEditingEvent(event);

    setForm({
      title: event.title || "",

      description: event.description || "",

      eventDate: event.event_date || "",

      startTime: formatTimeForInput(event.start_time),

      location: event.location || "",

      imageUrl: event.image_url || "",

      imagePath: event.image_path || "",

      imageFile: null,

      isFeatured: event.is_featured || false,

      isPublished: event.is_published ?? true,
    });

    setImagePreview(event.image_url || "");

    setError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setFormOpen(false);
    setEditingEvent(null);
    setForm(emptyForm);
    setImagePreview("");
    setDragging(false);
    setError("");
  };

  const handleImageFile = (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Image size must be 5 MB or less.");
      return;
    }

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setForm((current) => ({
      ...current,
      imageFile: file,
    }));

    setImagePreview(previewUrl);

    setError("");
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];

    handleImageFile(file);

    e.target.value = "";
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragging(false);

    const file = e.dataTransfer.files?.[0];

    handleImageFile(file);
  };

  const removeSelectedImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview("");

    setForm((current) => ({
      ...current,
      imageFile: null,
      imageUrl: "",
      imagePath: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter an event title.");
      return;
    }

    if (!form.eventDate) {
      setError("Please select an event date.");
      return;
    }

    if (!form.location.trim()) {
      setError("Please enter an event location.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please enter an event description.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      let imageUrl = form.imageUrl || "";

      let imagePath = form.imagePath || "";

      const oldImagePath = editingEvent?.image_path || "";

      if (form.imageFile) {
        const uploaded = await uploadEventImage(form.imageFile);

        imageUrl = uploaded.publicUrl;

        imagePath = uploaded.path;
      }

      const payload = {
        ...form,
        imageUrl,
        imagePath,
      };

      let savedEvent;

      if (editingEvent) {
        savedEvent = await updateEvent(editingEvent.id, payload);

        setEvents((current) =>
          current.map((item) =>
            item.id === savedEvent.id ? savedEvent : item,
          ),
        );
      } else {
        savedEvent = await createEvent(payload);

        setEvents((current) =>
          [...current, savedEvent].sort(
            (a, b) => new Date(a.event_date) - new Date(b.event_date),
          ),
        );
      }

      if (
        editingEvent &&
        form.imageFile &&
        oldImagePath &&
        oldImagePath !== imagePath
      ) {
        try {
          await deleteEventImage(oldImagePath);
        } catch (cleanupError) {
          console.error("Old image cleanup error:", cleanupError);
        }
      }

      closeForm();
    } catch (err) {
      console.error("Save event error:", err);

      setError(err?.message || "Unable to save event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (event) => {
    const confirmed = window.confirm(
      `Delete "${event.title}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await deleteEvent(event.id);

      if (event.image_path) {
        try {
          await deleteEventImage(event.image_path);
        } catch (cleanupError) {
          console.error("Image cleanup error:", cleanupError);
        }
      }

      setEvents((current) => current.filter((item) => item.id !== event.id));
    } catch (err) {
      console.error("Delete event error:", err);

      alert("Unable to delete event.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublished = async (event) => {
    try {
      setActionLoading(true);

      const updated = await toggleEventPublished(event.id, !event.is_published);

      setEvents((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      console.error(err);

      alert("Unable to update event.");
    } finally {
      setActionLoading(false);
    }
  };

  const publishedCount = events.filter((event) => event.is_published).length;

  const featuredCount = events.filter((event) => event.is_featured).length;

  return (
    <AdminLayout>
      <main className="px-5 py-7 sm:px-7 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                Website Content
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Events
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                Create and manage events displayed on your church website.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
            >
              <Plus size={17} />
              Add Event
            </button>
          </div>

          {/* STATS */}

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <StatCard label="Total Events" value={events.length} />

            <StatCard label="Published" value={publishedCount} />

            <StatCard label="Featured" value={featuredCount} />
          </div>

          {/* FILTERS */}

          <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events..."
                className="w-full rounded-xl border border-zinc-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="all">All Events</option>

              <option value="published">Published</option>

              <option value="draft">Draft</option>

              <option value="featured">Featured</option>
            </select>
          </div>

          {/* EVENT LIST */}

          <div className="mt-6">
            {loading ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center text-sm text-zinc-400">
                Loading events...
              </div>
            ) : filteredEvents.length === 0 ? (
              <EmptyEvents onCreate={openCreateForm} />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredEvents.map((event) => (
                  <EventAdminCard
                    key={event.id}
                    event={event}
                    actionLoading={actionLoading}
                    onEdit={() => openEditForm(event)}
                    onToggle={() => handleTogglePublished(event)}
                    onDelete={() => handleDelete(event)}
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
                  transition={{
                    duration: 0.2,
                  }}
                  className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                >
                  {/* MODAL HEADER */}

                  <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-950">
                        {editingEvent ? "Edit Event" : "Add New Event"}
                      </h2>

                      <p className="mt-1 text-xs text-zinc-500">
                        {editingEvent
                          ? "Update event details and preview."
                          : "Create an event for your church website."}
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
                      {/* LEFT SIDE */}

                      <div className="border-b border-zinc-200 p-6 lg:border-b-0 lg:border-r">
                        <div className="space-y-5">
                          <Field label="Event Title" required>
                            <input
                              type="text"
                              required
                              maxLength={120}
                              value={form.title}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  title: e.target.value,
                                })
                              }
                              placeholder="Enter event title"
                              className={inputClass}
                            />
                          </Field>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Event Date" required>
                              <input
                                type="date"
                                required
                                value={form.eventDate}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    eventDate: e.target.value,
                                  })
                                }
                                className={inputClass}
                              />
                            </Field>

                            <Field label="Time">
                              <input
                                type="time"
                                value={form.startTime}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    startTime: e.target.value,
                                  })
                                }
                                className={inputClass}
                              />
                            </Field>
                          </div>

                          <Field label="Location" required>
                            <input
                              type="text"
                              required
                              value={form.location}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  location: e.target.value,
                                })
                              }
                              placeholder="Enter event location"
                              className={inputClass}
                            />
                          </Field>

                          <Field label="Description" required>
                            <textarea
                              rows="5"
                              required
                              maxLength={1000}
                              value={form.description}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  description: e.target.value,
                                })
                              }
                              placeholder="Tell visitors about this event..."
                              className={`${inputClass} resize-none`}
                            />

                            <div className="mt-1 text-right text-[11px] text-zinc-400">
                              {form.description.length}
                              /1000
                            </div>
                          </Field>

                          {/* IMAGE UPLOAD */}

                          <Field label="Event Image" required>
                            {!imagePreview ? (
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                onDragEnter={handleDragEnter}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition ${
                                  dragging
                                    ? "border-amber-500 bg-amber-50"
                                    : "border-zinc-200 bg-zinc-50 hover:border-amber-400 hover:bg-amber-50/40"
                                }`}
                              >
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-500 shadow-sm">
                                  <UploadCloud size={22} />
                                </div>

                                <p className="mt-4 text-sm font-semibold text-zinc-800">
                                  Click to upload or drag and drop
                                </p>

                                <p className="mt-1 text-xs text-zinc-400">
                                  JPG, PNG or WebP (Max 5 MB)
                                </p>
                              </button>
                            ) : (
                              <SelectedImage
                                file={form.imageFile}
                                imageUrl={imagePreview}
                                onRemove={removeSelectedImage}
                                onReplace={() => fileInputRef.current?.click()}
                              />
                            )}

                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={handleFileInput}
                              className="hidden"
                            />

                            <p className="mt-2 text-[11px] leading-5 text-zinc-400">
                              Recommended aspect ratio: 16:9. Images with a
                              different ratio will use blurred side fill instead
                              of being cropped.
                            </p>
                          </Field>

                          {/* SETTINGS */}

                          <div className="grid gap-3 sm:grid-cols-2">
                            <ToggleCard
                              title="Featured"
                              description="Highlight on homepage."
                              checked={form.isFeatured}
                              onChange={(value) =>
                                setForm({
                                  ...form,
                                  isFeatured: value,
                                })
                              }
                            />

                            <ToggleCard
                              title="Published"
                              description="Visible to visitors."
                              checked={form.isPublished}
                              onChange={(value) =>
                                setForm({
                                  ...form,
                                  isPublished: value,
                                })
                              }
                            />
                          </div>

                          {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                              {error}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* RIGHT PREVIEW */}

                      <div className="bg-zinc-50 p-6">
                        <div className="sticky top-4">
                          <h3 className="text-sm font-semibold text-zinc-900">
                            Image Preview
                          </h3>

                          <p className="mt-1 text-xs text-zinc-500">
                            This is how the image will appear.
                          </p>

                          <div className="mt-4">
                            <BlurredImage
                              src={imagePreview}
                              alt={form.title || "Event preview"}
                              className="aspect-video rounded-xl"
                              emptyText="Upload an image to preview"
                            />
                          </div>

                          {imagePreview && (
                            <div className="mt-3 flex items-start gap-2 text-xs leading-5 text-zinc-500">
                              <CheckCircle2
                                size={16}
                                className="mt-0.5 shrink-0 text-green-600"
                              />

                              <span>
                                Your image will preserve the original ratio.
                                Blurred side fill will be used whenever needed.
                              </span>
                            </div>
                          )}

                          <div className="my-6 h-px bg-zinc-200" />

                          <h3 className="text-sm font-semibold text-zinc-900">
                            Event Card Preview
                          </h3>

                          <p className="mt-1 text-xs text-zinc-500">
                            This is how your event will appear to visitors.
                          </p>

                          <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                            <BlurredImage
                              src={imagePreview}
                              alt={form.title || "Event preview"}
                              className="aspect-video"
                              emptyText="Event image"
                            />

                            <div className="p-4">
                              <div className="flex items-center gap-2 text-xs text-amber-700">
                                <CalendarDays size={14} />

                                <span>
                                  {form.eventDate
                                    ? formatEventDate(form.eventDate)
                                    : "Select a date"}

                                  {form.startTime &&
                                    ` • ${formatEventTime(form.startTime)}`}
                                </span>
                              </div>

                              <h4 className="mt-3 text-lg font-semibold tracking-tight text-zinc-950">
                                {form.title || "Event Title"}
                              </h4>

                              <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-500">
                                {form.description ||
                                  "Your event description will appear here."}
                              </p>

                              <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
                                <MapPin size={14} className="text-amber-700" />

                                <span>{form.location || "Event location"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* MODAL FOOTER */}

                    <div className="flex items-center justify-end gap-3 border-t border-zinc-200 bg-white px-6 py-4">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={closeForm}
                        className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {saving
                          ? "Saving..."
                          : editingEvent
                            ? "Save Changes"
                            : "Create Event"}
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

function SelectedImage({ file, imageUrl, onRemove, onReplace }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex items-center gap-3">
        <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg">
          <BlurredImage
            src={imageUrl}
            alt="Selected"
            className="h-full w-full"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-800">
            {file?.name || "Current event image"}
          </p>

          {file && (
            <p className="mt-1 text-xs text-zinc-400">
              {formatBytes(file.size)}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onReplace}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
        >
          Replace
        </button>

        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove image"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

function EventAdminCard({ event, actionLoading, onEdit, onToggle, onDelete }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="relative">
        <BlurredImage
          src={event.image_url}
          alt={event.title}
          className="aspect-video"
          emptyText="No event image"
        />

        <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm ${
              event.is_published
                ? "bg-green-100 text-green-700"
                : "bg-white text-zinc-600"
            }`}
          >
            {event.is_published ? "Published" : "Draft"}
          </span>

          {event.is_featured && (
            <span className="flex items-center gap-1 rounded-full bg-amber-300 px-2.5 py-1 text-[10px] font-semibold text-zinc-900">
              <Star size={11} fill="currentColor" />
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <h2 className="line-clamp-1 text-lg font-semibold tracking-tight text-zinc-950">
          {event.title}
        </h2>

        {event.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
            {event.description}
          </p>
        )}

        <div className="mt-4 space-y-2 border-t border-zinc-100 pt-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <CalendarDays size={14} className="text-amber-700" />

            {formatEventDate(event.event_date)}
          </div>

          {event.start_time && (
            <div className="flex items-center gap-2">
              <Clock3 size={14} className="text-amber-700" />

              {formatEventTime(event.start_time)}
            </div>
          )}

          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin size={14} className="shrink-0 text-amber-700" />

              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-3 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800"
          >
            <Edit3 size={15} />
            Edit
          </button>

          <button
            type="button"
            disabled={actionLoading}
            onClick={onToggle}
            title={event.is_published ? "Unpublish" : "Publish"}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
          >
            {event.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>

          <button
            type="button"
            disabled={actionLoading}
            onClick={onDelete}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 text-red-500 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

function Field({ label, required = false, children }) {
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
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
        checked ? "border-amber-300 bg-amber-50" : "border-zinc-200 bg-white"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4"
      />

      <div>
        <p className="text-xs font-semibold text-zinc-900">{title}</p>

        <p className="mt-0.5 text-[11px] text-zinc-500">{description}</p>
      </div>
    </label>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <p className="text-2xl font-semibold text-zinc-950">{value}</p>

      <p className="mt-1 text-xs text-zinc-500">{label}</p>
    </div>
  );
}

function EmptyEvents({ onCreate }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
      <CalendarDays size={34} className="mx-auto text-zinc-300" />

      <h2 className="mt-4 font-semibold text-zinc-900">No events found</h2>

      <p className="mt-1 text-sm text-zinc-400">
        Create your first church event.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white"
      >
        <Plus size={16} />
        Add Event
      </button>
    </div>
  );
}

function formatEventDate(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatEventTime(time) {
  if (!time) return "";

  const [hour, minute] = time.split(":");

  const date = new Date();

  date.setHours(Number(hour), Number(minute), 0);

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatTimeForInput(time) {
  if (!time) return "";

  return time.slice(0, 5);
}

function formatBytes(bytes) {
  if (!bytes) {
    return "0 Bytes";
  }

  const sizes = ["Bytes", "KB", "MB", "GB"];

  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, index)).toFixed(
    index === 0 ? 0 : 1,
  )} ${sizes[index]}`;
}
