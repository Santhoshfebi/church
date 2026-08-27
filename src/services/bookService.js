import { supabase } from "../lib/supabase";

const BOOK_BUCKET = "book-covers";

/* ========================================================================== */
/* PUBLIC BOOKS                                                              */
/* ========================================================================== */

export async function getPublicBooks() {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("is_published", true)
    .order("display_order", {
      ascending: true,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/* ========================================================================== */
/* ADMIN BOOKS                                                               */
/* ========================================================================== */

export async function getAdminBooks() {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("display_order", {
      ascending: true,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/* ========================================================================== */
/* CREATE BOOK                                                               */
/* ========================================================================== */

export async function createBook(book) {
  const { data, error } = await supabase
    .from("books")
    .insert([
      {
        title: book.title.trim(),

        author: book.author?.trim() || null,

        short_description: book.shortDescription?.trim() || null,

        description: book.description?.trim() || null,

        cover_image_url: book.coverImageUrl || null,

        cover_image_path: book.coverImagePath || null,

        publication_year: book.publicationYear
          ? Number(book.publicationYear)
          : null,

        price: book.price?.trim() || null,

        purchase_url: book.purchaseUrl?.trim() || null,

        display_order: Number(book.displayOrder) || 0,

        is_featured: book.isFeatured,

        is_published: book.isPublished,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/* ========================================================================== */
/* UPDATE BOOK                                                               */
/* ========================================================================== */

export async function updateBook(id, book) {
  const { data, error } = await supabase
    .from("books")
    .update({
      title: book.title.trim(),

      author: book.author?.trim() || null,

      short_description: book.shortDescription?.trim() || null,

      description: book.description?.trim() || null,

      cover_image_url: book.coverImageUrl || null,

      cover_image_path: book.coverImagePath || null,

      publication_year: book.publicationYear
        ? Number(book.publicationYear)
        : null,

      price: book.price?.trim() || null,

      purchase_url: book.purchaseUrl?.trim() || null,

      display_order: Number(book.displayOrder) || 0,

      is_featured: book.isFeatured,

      is_published: book.isPublished,

      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/* ========================================================================== */
/* DELETE BOOK                                                               */
/* ========================================================================== */

export async function deleteBook(id) {
  const { error } = await supabase.from("books").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

/* ========================================================================== */
/* TOGGLE PUBLISHED                                                          */
/* ========================================================================== */

export async function toggleBookPublished(id, published) {
  const { data, error } = await supabase
    .from("books")
    .update({
      is_published: published,

      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/* ========================================================================== */
/* UPLOAD COVER                                                              */
/* ========================================================================== */

export async function uploadBookCover(file) {
  if (!file) {
    throw new Error("No cover image selected.");
  }

  const allowed = ["image/jpeg", "image/png", "image/webp"];

  if (!allowed.includes(file.type)) {
    throw new Error("Please upload a JPG, PNG, or WebP image.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Cover image must be 5 MB or smaller.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

  const filename = `${crypto.randomUUID()}.${extension}`;

  const path = `covers/${filename}`;

  const { error: uploadError } = await supabase.storage
    .from(BOOK_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",

      upsert: false,

      contentType: file.type,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(BOOK_BUCKET).getPublicUrl(path);

  return {
    path,
    publicUrl: data.publicUrl,
  };
}

/* ========================================================================== */
/* DELETE COVER                                                              */
/* ========================================================================== */

export async function deleteBookCover(path) {
  if (!path) {
    return;
  }

  const { error } = await supabase.storage.from(BOOK_BUCKET).remove([path]);

  if (error) {
    throw error;
  }
}
