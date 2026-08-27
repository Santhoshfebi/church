import { useEffect, useMemo, useRef, useState } from "react";

import {
  BookOpen,
  Edit3,
  Eye,
  EyeOff,
  ImagePlus,
  Plus,
  Search,
  Star,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import AdminLayout from "../../components/admin/AdminLayout";

import {
  createBook,
  deleteBook,
  deleteBookCover,
  getAdminBooks,
  toggleBookPublished,
  updateBook,
  uploadBookCover,
} from "../../services/bookService";

const emptyForm = {
  title: "",
  author: "",
  shortDescription: "",
  description: "",
  publicationYear: "",
  price: "",
  purchaseUrl: "",
  displayOrder: 0,
  coverImageUrl: "",
  coverImagePath: "",
  coverFile: null,
  isFeatured: false,
  isPublished: true,
};

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10";

export default function BooksManagementPage() {
  const fileInputRef = useRef(null);

  const [books, setBooks] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);

  const [editingBook, setEditingBook] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [imagePreview, setImagePreview] = useState("");

  const [dragging, setDragging] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminBooks();

      setBooks(data);
    } catch (err) {
      console.error("Books error:", err);

      setError("Unable to load books.");
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return books.filter((book) => {
      const matchesSearch =
        !query ||
        book.title?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query) ||
        book.short_description?.toLowerCase().includes(query);

      let matchesFilter = true;

      if (filter === "published") {
        matchesFilter = book.is_published === true;
      }

      if (filter === "draft") {
        matchesFilter = book.is_published === false;
      }

      if (filter === "featured") {
        matchesFilter = book.is_featured === true;
      }

      return matchesSearch && matchesFilter;
    });
  }, [books, search, filter]);

  const openCreateForm = () => {
    setEditingBook(null);

    setForm({
      ...emptyForm,
      displayOrder: books.length + 1,
    });

    setImagePreview("");
    setError("");
    setFormOpen(true);
  };

  const openEditForm = (book) => {
    setEditingBook(book);

    setForm({
      title: book.title || "",

      author: book.author || "",

      shortDescription: book.short_description || "",

      description: book.description || "",

      publicationYear: book.publication_year || "",

      price: book.price || "",

      purchaseUrl: book.purchase_url || "",

      displayOrder: book.display_order ?? 0,

      coverImageUrl: book.cover_image_url || "",

      coverImagePath: book.cover_image_path || "",

      coverFile: null,

      isFeatured: book.is_featured || false,

      isPublished: book.is_published ?? true,
    });

    setImagePreview(book.cover_image_url || "");

    setError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) {
      return;
    }

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setFormOpen(false);
    setEditingBook(null);
    setForm(emptyForm);
    setImagePreview("");
    setDragging(false);
    setError("");
  };

  const handleCoverFile = (file) => {
    if (!file) {
      return;
    }

    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WebP image.");

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Cover image must be 5 MB or smaller.");

      return;
    }

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const preview = URL.createObjectURL(file);

    setForm((current) => ({
      ...current,
      coverFile: file,
    }));

    setImagePreview(preview);
    setError("");
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];

    handleCoverFile(file);

    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragging(false);

    const file = e.dataTransfer.files?.[0];

    handleCoverFile(file);
  };

  const removeCover = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview("");

    setForm((current) => ({
      ...current,
      coverFile: null,
      coverImageUrl: "",
      coverImagePath: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter the book title.");

      return;
    }

    try {
      setSaving(true);
      setError("");

      let coverImageUrl = form.coverImageUrl || "";

      let coverImagePath = form.coverImagePath || "";

      const oldCoverPath = editingBook?.cover_image_path || "";

      if (form.coverFile) {
        const uploaded = await uploadBookCover(form.coverFile);

        coverImageUrl = uploaded.publicUrl;

        coverImagePath = uploaded.path;
      }

      const payload = {
        ...form,
        coverImageUrl,
        coverImagePath,
      };

      let savedBook;

      if (editingBook) {
        savedBook = await updateBook(editingBook.id, payload);

        setBooks((current) =>
          current.map((item) => (item.id === savedBook.id ? savedBook : item)),
        );
      } else {
        savedBook = await createBook(payload);

        setBooks((current) =>
          [...current, savedBook].sort(
            (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
          ),
        );
      }

      if (
        editingBook &&
        form.coverFile &&
        oldCoverPath &&
        oldCoverPath !== coverImagePath
      ) {
        try {
          await deleteBookCover(oldCoverPath);
        } catch (cleanupError) {
          console.error("Old cover cleanup error:", cleanupError);
        }
      }

      closeForm();
    } catch (err) {
      console.error("Save book error:", err);

      setError(err?.message || "Unable to save book.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (book) => {
    const confirmed = window.confirm(`Delete "${book.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await deleteBook(book.id);

      if (book.cover_image_path) {
        try {
          await deleteBookCover(book.cover_image_path);
        } catch (imageError) {
          console.error("Book cover cleanup error:", imageError);
        }
      }

      setBooks((current) => current.filter((item) => item.id !== book.id));
    } catch (err) {
      console.error(err);

      alert("Unable to delete book.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublished = async (book) => {
    try {
      setActionLoading(true);

      const updated = await toggleBookPublished(book.id, !book.is_published);

      setBooks((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      console.error(err);

      alert("Unable to update book.");
    } finally {
      setActionLoading(false);
    }
  };

  const publishedCount = books.filter((book) => book.is_published).length;

  const featuredCount = books.filter((book) => book.is_featured).length;

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

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                Published Books
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                Manage books published by your church and authors.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-700"
            >
              <Plus size={17} />
              Add Book
            </button>
          </div>

          {/* STATS */}

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <StatCard label="Total Books" value={books.length} />

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
                placeholder="Search books..."
                className="w-full rounded-xl border border-zinc-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="all">All Books</option>

              <option value="published">Published</option>

              <option value="draft">Draft</option>

              <option value="featured">Featured</option>
            </select>
          </div>

          {/* CARDS */}

          <div className="mt-6">
            {loading ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center text-sm text-zinc-400">
                Loading books...
              </div>
            ) : filteredBooks.length === 0 ? (
              <EmptyBooks onCreate={openCreateForm} />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredBooks.map((book) => (
                  <BookAdminCard
                    key={book.id}
                    book={book}
                    actionLoading={actionLoading}
                    onEdit={() => openEditForm(book)}
                    onToggle={() => handleTogglePublished(book)}
                    onDelete={() => handleDelete(book)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL */}

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
                  <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {editingBook ? "Edit Book" : "Add New Book"}
                      </h2>

                      <p className="mt-1 text-xs text-zinc-500">
                        Add publication details and upload the book cover.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={closeForm}
                      className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-zinc-100"
                    >
                      <X size={19} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-[1fr_0.9fr]">
                      <div className="space-y-5 border-b border-zinc-200 p-6 lg:border-b-0 lg:border-r">
                        <Field label="Book Title" required>
                          <input
                            required
                            value={form.title}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                title: e.target.value,
                              })
                            }
                            placeholder="Book title"
                            className={inputClass}
                          />
                        </Field>

                        <Field label="Author">
                          <input
                            value={form.author}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                author: e.target.value,
                              })
                            }
                            placeholder="Author name"
                            className={inputClass}
                          />
                        </Field>

                        <Field label="Short Description">
                          <textarea
                            rows="3"
                            maxLength={300}
                            value={form.shortDescription}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                shortDescription: e.target.value,
                              })
                            }
                            className={`${inputClass} resize-none`}
                          />
                        </Field>

                        <Field label="Full Description">
                          <textarea
                            rows="5"
                            value={form.description}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                description: e.target.value,
                              })
                            }
                            className={`${inputClass} resize-none`}
                          />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Publication Year">
                            <input
                              type="number"
                              min="1900"
                              max="2100"
                              value={form.publicationYear}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  publicationYear: e.target.value,
                                })
                              }
                              className={inputClass}
                            />
                          </Field>

                          <Field label="Price / Availability">
                            <input
                              value={form.price}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  price: e.target.value,
                                })
                              }
                              placeholder="₹299 / Free / Contact us"
                              className={inputClass}
                            />
                          </Field>
                        </div>

                        <Field label="Purchase Link">
                          <input
                            type="url"
                            value={form.purchaseUrl}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                purchaseUrl: e.target.value,
                              })
                            }
                            placeholder="https://..."
                            className={inputClass}
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

                        <Field label="Book Cover">
                          {!imagePreview ? (
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              onDragEnter={(e) => {
                                e.preventDefault();
                                setDragging(true);
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setDragging(true);
                              }}
                              onDragLeave={() => setDragging(false)}
                              onDrop={handleDrop}
                              className={`flex w-full flex-col items-center rounded-xl border-2 border-dashed px-6 py-8 ${
                                dragging
                                  ? "border-amber-500 bg-amber-50"
                                  : "border-zinc-200 bg-zinc-50"
                              }`}
                            >
                              <UploadCloud size={24} />

                              <p className="mt-3 text-sm font-semibold">
                                Upload book cover
                              </p>

                              <p className="mt-1 text-xs text-zinc-400">
                                JPG, PNG, WebP • 5 MB
                              </p>
                            </button>
                          ) : (
                            <div className="rounded-xl border border-zinc-200 p-3">
                              <div className="flex items-center gap-4">
                                <img
                                  src={imagePreview}
                                  alt="Book cover"
                                  className="h-24 w-16 rounded-md object-cover shadow"
                                />

                                <div className="flex-1">
                                  <p className="text-sm font-semibold">
                                    Book cover
                                  </p>

                                  <div className="mt-3 flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        fileInputRef.current?.click()
                                      }
                                      className="rounded-lg border px-3 py-2 text-xs"
                                    >
                                      Replace
                                    </button>

                                    <button
                                      type="button"
                                      onClick={removeCover}
                                      className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-500"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleFileInput}
                            className="hidden"
                          />
                        </Field>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <ToggleCard
                            title="Featured"
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

                      {/* PREVIEW */}

                      <div className="bg-[#f7f4ed] p-6">
                        <div className="sticky top-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                            Live Preview
                          </p>

                          <div className="mt-6 rounded-[2rem] bg-white p-7 text-center shadow-sm">
                            <div className="mx-auto flex h-[330px] w-[220px] items-center justify-center overflow-hidden rounded-lg bg-zinc-100 shadow-xl">
                              {imagePreview ? (
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <BookOpen size={42} className="text-zinc-300" />
                              )}
                            </div>

                            <h3 className="mt-7 text-2xl font-semibold">
                              {form.title || "Book Title"}
                            </h3>

                            <p className="mt-2 text-sm text-zinc-500">
                              {form.author || "Author"}
                            </p>

                            {form.publicationYear && (
                              <p className="mt-2 text-xs text-zinc-400">
                                Published {form.publicationYear}
                              </p>
                            )}

                            {form.price && (
                              <p className="mt-4 font-semibold text-amber-700">
                                {form.price}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-zinc-200 px-6 py-4">
                      <button
                        type="button"
                        onClick={closeForm}
                        className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-semibold"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                      >
                        {saving
                          ? "Saving..."
                          : editingBook
                            ? "Save Changes"
                            : "Create Book"}
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

function BookAdminCard({ book, actionLoading, onEdit, onToggle, onDelete }) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex gap-5">
        <div className="flex h-48 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 shadow-md">
          {book.cover_image_url ? (
            <img
              src={book.cover_image_url}
              alt={book.title}
              className="h-full w-full object-contain"
            />
          ) : (
            <BookOpen size={30} className="text-zinc-300" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                book.is_published
                  ? "bg-green-100 text-green-700"
                  : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {book.is_published ? "Published" : "Draft"}
            </span>

            {book.is_featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 px-2.5 py-1 text-[10px] font-semibold">
                <Star size={10} fill="currentColor" />
                Featured
              </span>
            )}
          </div>

          <h2 className="mt-4 line-clamp-2 text-lg font-semibold">
            {book.title}
          </h2>

          {book.author && (
            <p className="mt-2 text-sm text-zinc-500">{book.author}</p>
          )}

          {book.publication_year && (
            <p className="mt-2 text-xs text-zinc-400">
              Published {book.publication_year}
            </p>
          )}

          {book.price && (
            <p className="mt-3 text-sm font-semibold text-amber-700">
              {book.price}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-3 py-2.5 text-xs font-semibold text-white"
        >
          <Edit3 size={15} />
          Edit
        </button>

        <button
          type="button"
          disabled={actionLoading}
          onClick={onToggle}
          className="flex h-10 w-10 items-center justify-center rounded-xl border"
        >
          {book.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>

        <button
          type="button"
          disabled={actionLoading}
          onClick={onDelete}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 text-red-500"
        >
          <Trash2 size={16} />
        </button>
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

function ToggleCard({ title, checked, onChange }) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${
        checked ? "border-amber-300 bg-amber-50" : "border-zinc-200"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />

      <span className="text-xs font-semibold">{title}</span>
    </label>
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

function EmptyBooks({ onCreate }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
      <ImagePlus size={34} className="mx-auto text-zinc-300" />

      <h2 className="mt-4 font-semibold">No books yet</h2>

      <p className="mt-1 text-sm text-zinc-400">
        Add your first published book.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white"
      >
        <Plus size={16} />
        Add Book
      </button>
    </div>
  );
}
