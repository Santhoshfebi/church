import { useEffect, useMemo, useRef, useState } from "react";

import {
  Edit3,
  Eye,
  EyeOff,
  ImagePlus,
  Plus,
  Search,
  Star,
  Trash2,
  UploadCloud,
  UsersRound,
  X,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import AdminLayout from "../../components/admin/AdminLayout";
import BlurredImage from "../../components/BlurredImage";

import {
  createMinistry,
  deleteMinistry,
  deleteMinistryImage,
  getAdminMinistries,
  toggleMinistryPublished,
  updateMinistry,
  uploadMinistryImage,
} from "../../services/ministryService";

const emptyForm = {
  title: "",
  shortDescription: "",
  description: "",
  displayOrder: 0,
  imageUrl: "",
  imagePath: "",
  imageFile: null,
  isFeatured: false,
  isPublished: true,
};

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10";

export default function MinistriesManagementPage() {
  const fileInputRef = useRef(null);

  const [ministries, setMinistries] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [imagePreview, setImagePreview] = useState("");

  const [dragging, setDragging] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadMinistries();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const loadMinistries = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminMinistries();

      setMinistries(data);
    } catch (err) {
      console.error("Ministries error:", err);

      setError("Unable to load ministries.");
    } finally {
      setLoading(false);
    }
  };

  const filteredMinistries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return ministries.filter((ministry) => {
      const matchesSearch =
        !query ||
        ministry.title?.toLowerCase().includes(query) ||
        ministry.short_description?.toLowerCase().includes(query) ||
        ministry.description?.toLowerCase().includes(query);

      let matchesFilter = true;

      if (filter === "published") {
        matchesFilter = ministry.is_published === true;
      }

      if (filter === "draft") {
        matchesFilter = ministry.is_published === false;
      }

      if (filter === "featured") {
        matchesFilter = ministry.is_featured === true;
      }

      return matchesSearch && matchesFilter;
    });
  }, [ministries, search, filter]);

  const openCreateForm = () => {
    setEditingMinistry(null);

    setForm({
      ...emptyForm,
      displayOrder: ministries.length + 1,
    });

    setImagePreview("");
    setError("");
    setFormOpen(true);
  };

  const openEditForm = (ministry) => {
    setEditingMinistry(ministry);

    setForm({
      title: ministry.title || "",

      shortDescription: ministry.short_description || "",

      description: ministry.description || "",

      displayOrder: ministry.display_order ?? 0,

      imageUrl: ministry.image_url || "",

      imagePath: ministry.image_path || "",

      imageFile: null,

      isFeatured: ministry.is_featured || false,

      isPublished: ministry.is_published ?? true,
    });

    setImagePreview(ministry.image_url || "");

    setError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setFormOpen(false);
    setEditingMinistry(null);
    setForm(emptyForm);
    setImagePreview("");
    setDragging(false);
    setError("");
  };

  const handleImageFile = (file) => {
    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WebP image.");

      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Image must be 5 MB or smaller.");

      return;
    }

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const preview = URL.createObjectURL(file);

    setForm((current) => ({
      ...current,
      imageFile: file,
    }));

    setImagePreview(preview);
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
      setError("Please enter a ministry name.");

      return;
    }

    if (!form.shortDescription.trim()) {
      setError("Please enter a short description.");

      return;
    }

    try {
      setSaving(true);
      setError("");

      let imageUrl = form.imageUrl || "";

      let imagePath = form.imagePath || "";

      const oldImagePath = editingMinistry?.image_path || "";

      if (form.imageFile) {
        const uploaded = await uploadMinistryImage(form.imageFile);

        imageUrl = uploaded.publicUrl;

        imagePath = uploaded.path;
      }

      const payload = {
        ...form,
        imageUrl,
        imagePath,
      };

      let savedMinistry;

      if (editingMinistry) {
        savedMinistry = await updateMinistry(editingMinistry.id, payload);

        setMinistries((current) =>
          current.map((item) =>
            item.id === savedMinistry.id ? savedMinistry : item,
          ),
        );
      } else {
        savedMinistry = await createMinistry(payload);

        setMinistries((current) =>
          [...current, savedMinistry].sort(
            (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
          ),
        );
      }

      if (
        editingMinistry &&
        form.imageFile &&
        oldImagePath &&
        oldImagePath !== imagePath
      ) {
        try {
          await deleteMinistryImage(oldImagePath);
        } catch (cleanupError) {
          console.error("Old ministry image cleanup error:", cleanupError);
        }
      }

      closeForm();
    } catch (err) {
      console.error("Save ministry error:", err);

      setError(err?.message || "Unable to save ministry.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ministry) => {
    const confirmed = window.confirm(
      `Delete "${ministry.title}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await deleteMinistry(ministry.id);

      if (ministry.image_path) {
        try {
          await deleteMinistryImage(ministry.image_path);
        } catch (imageError) {
          console.error("Ministry image cleanup error:", imageError);
        }
      }

      setMinistries((current) =>
        current.filter((item) => item.id !== ministry.id),
      );
    } catch (err) {
      console.error("Delete ministry error:", err);

      alert("Unable to delete ministry.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublished = async (ministry) => {
    try {
      setActionLoading(true);

      const updated = await toggleMinistryPublished(
        ministry.id,
        !ministry.is_published,
      );

      setMinistries((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      console.error(err);

      alert("Unable to update ministry.");
    } finally {
      setActionLoading(false);
    }
  };

  const publishedCount = ministries.filter(
    (ministry) => ministry.is_published,
  ).length;

  const featuredCount = ministries.filter(
    (ministry) => ministry.is_featured,
  ).length;

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
                Ministries
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-zinc-500">
                Manage the ministries displayed on your church website.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
            >
              <Plus size={17} />
              Add Ministry
            </button>
          </div>

          {/* STATS */}

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <StatCard label="Total Ministries" value={ministries.length} />

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
                placeholder="Search ministries..."
                className="w-full rounded-xl border border-zinc-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="all">All Ministries</option>

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

          {/* CARDS */}

          <div className="mt-6">
            {loading ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center text-sm text-zinc-400">
                Loading ministries...
              </div>
            ) : filteredMinistries.length === 0 ? (
              <EmptyMinistries onCreate={openCreateForm} />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredMinistries.map((ministry) => (
                  <MinistryAdminCard
                    key={ministry.id}
                    ministry={ministry}
                    actionLoading={actionLoading}
                    onEdit={() => openEditForm(ministry)}
                    onToggle={() => handleTogglePublished(ministry)}
                    onDelete={() => handleDelete(ministry)}
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
                        {editingMinistry ? "Edit Ministry" : "Add New Ministry"}
                      </h2>

                      <p className="mt-1 text-xs text-zinc-500">
                        Create and customize a ministry for your website.
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
                      {/* LEFT */}

                      <div className="border-b border-zinc-200 p-6 lg:border-b-0 lg:border-r">
                        <div className="space-y-5">
                          <Field label="Ministry Name" required>
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
                              placeholder="Youth Ministry"
                              className={inputClass}
                            />
                          </Field>

                          <Field label="Short Description" required>
                            <textarea
                              rows="3"
                              required
                              maxLength={250}
                              value={form.shortDescription}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  shortDescription: e.target.value,
                                })
                              }
                              placeholder="A short description shown on the homepage..."
                              className={`${inputClass} resize-none`}
                            />

                            <div className="mt-1 text-right text-[11px] text-zinc-400">
                              {form.shortDescription.length}
                              /250
                            </div>
                          </Field>

                          <Field label="Full Description">
                            <textarea
                              rows="5"
                              maxLength={1500}
                              value={form.description}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  description: e.target.value,
                                })
                              }
                              placeholder="Tell visitors more about this ministry..."
                              className={`${inputClass} resize-none`}
                            />
                          </Field>

                          <Field label="Display Order">
                            <input
                              type="number"
                              min="0"
                              value={form.displayOrder}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  displayOrder: e.target.value,
                                })
                              }
                              className={inputClass}
                            />
                          </Field>

                          {/* IMAGE */}

                          <Field label="Ministry Image">
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
                                  JPG, PNG or WebP • Max 5 MB
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
                          </Field>

                          {/* SETTINGS */}

                          <div className="grid gap-3 sm:grid-cols-2">
                            <ToggleCard
                              title="Featured"
                              description="Highlight this ministry."
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
                              description="Visible on the website."
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
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                              {error}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* PREVIEW */}

                      <div className="bg-zinc-50 p-6">
                        <div className="sticky top-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                            Live Preview
                          </p>

                          <h3 className="mt-2 text-lg font-semibold">
                            Ministry Card
                          </h3>

                          <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-sm">
                            <BlurredImage
                              src={imagePreview}
                              alt={form.title || "Ministry preview"}
                              className="aspect-[4/3]"
                              emptyText="Ministry image"
                            />

                            <div className="p-6">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
                                  <UsersRound size={21} />
                                </div>

                                {form.isFeatured && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 px-2.5 py-1 text-[10px] font-semibold">
                                    <Star size={11} fill="currentColor" />
                                    Featured
                                  </span>
                                )}
                              </div>

                              <h4 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-950">
                                {form.title || "Ministry Name"}
                              </h4>

                              <p className="mt-3 text-sm leading-7 text-zinc-500">
                                {form.shortDescription ||
                                  "Your ministry description will appear here."}
                              </p>

                              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900">
                                Learn More
                                <span>→</span>
                              </span>
                            </div>
                          </div>

                          <div className="mt-5 rounded-xl border border-zinc-200 bg-white p-4">
                            <p className="text-xs font-semibold text-zinc-900">
                              Display position
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              This ministry will use display order{" "}
                              <strong>{form.displayOrder || 0}</strong>.
                            </p>
                          </div>
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
                        className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
                      >
                        {saving
                          ? "Saving..."
                          : editingMinistry
                            ? "Save Changes"
                            : "Create Ministry"}
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

function MinistryAdminCard({
  ministry,
  actionLoading,
  onEdit,
  onToggle,
  onDelete,
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="relative">
        <BlurredImage
          src={ministry.image_url}
          alt={ministry.title}
          className="aspect-[4/3]"
          emptyText="No ministry image"
        />

        <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
              ministry.is_published
                ? "bg-green-100 text-green-700"
                : "bg-white text-zinc-600"
            }`}
          >
            {ministry.is_published ? "Published" : "Draft"}
          </span>

          {ministry.is_featured && (
            <span className="flex items-center gap-1 rounded-full bg-amber-300 px-2.5 py-1 text-[10px] font-semibold text-zinc-900">
              <Star size={11} fill="currentColor" />
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-1 text-lg font-semibold tracking-tight text-zinc-950">
            {ministry.title}
          </h2>

          <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-medium text-zinc-500">
            #{ministry.display_order ?? 0}
          </span>
        </div>

        {ministry.short_description && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-500">
            {ministry.short_description}
          </p>
        )}

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
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
          >
            {ministry.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
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
            {file?.name || "Current ministry image"}
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
          className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
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
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${
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

function EmptyMinistries({ onCreate }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
      <ImagePlus size={34} className="mx-auto text-zinc-300" />

      <h2 className="mt-4 font-semibold text-zinc-900">No ministries yet</h2>

      <p className="mt-1 text-sm text-zinc-400">
        Create your first church ministry.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white"
      >
        <Plus size={16} />
        Add Ministry
      </button>
    </div>
  );
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
