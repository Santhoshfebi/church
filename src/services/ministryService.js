import { supabase } from "../lib/supabase";

const MINISTRY_BUCKET = "ministry-images";

/* ============================================================ */
/* PUBLIC                                                       */
/* ============================================================ */

export async function getPublicMinistries() {
  const { data, error } = await supabase
    .from("ministries")
    .select("*")
    .eq("is_published", true)
    .order("display_order", {
      ascending: true,
    })
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/* ============================================================ */
/* ADMIN                                                        */
/* ============================================================ */

export async function getAdminMinistries() {
  const { data, error } = await supabase
    .from("ministries")
    .select("*")
    .order("display_order", {
      ascending: true,
    })
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/* ============================================================ */
/* CREATE                                                       */
/* ============================================================ */

export async function createMinistry(ministry) {
  const { data, error } = await supabase
    .from("ministries")
    .insert([
      {
        title: ministry.title.trim(),

        short_description: ministry.shortDescription?.trim() || null,

        description: ministry.description?.trim() || null,

        image_url: ministry.imageUrl || null,

        image_path: ministry.imagePath || null,

        display_order: Number(ministry.displayOrder) || 0,

        is_featured: ministry.isFeatured,

        is_published: ministry.isPublished,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/* ============================================================ */
/* UPDATE                                                       */
/* ============================================================ */

export async function updateMinistry(id, ministry) {
  const { data, error } = await supabase
    .from("ministries")
    .update({
      title: ministry.title.trim(),

      short_description: ministry.shortDescription?.trim() || null,

      description: ministry.description?.trim() || null,

      image_url: ministry.imageUrl || null,

      image_path: ministry.imagePath || null,

      display_order: Number(ministry.displayOrder) || 0,

      is_featured: ministry.isFeatured,

      is_published: ministry.isPublished,

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

/* ============================================================ */
/* DELETE                                                       */
/* ============================================================ */

export async function deleteMinistry(id) {
  const { error } = await supabase.from("ministries").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

/* ============================================================ */
/* PUBLISH                                                      */
/* ============================================================ */

export async function toggleMinistryPublished(id, published) {
  const { data, error } = await supabase
    .from("ministries")
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

/* ============================================================ */
/* UPLOAD IMAGE                                                 */
/* ============================================================ */

export async function uploadMinistryImage(file) {
  if (!file) {
    throw new Error("No image selected.");
  }

  const allowed = ["image/jpeg", "image/png", "image/webp"];

  if (!allowed.includes(file.type)) {
    throw new Error("Please upload a JPG, PNG, or WebP image.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

  const filename = `${crypto.randomUUID()}.${extension}`;

  const path = `ministries/${filename}`;

  const { error: uploadError } = await supabase.storage
    .from(MINISTRY_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",

      upsert: false,

      contentType: file.type,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(MINISTRY_BUCKET).getPublicUrl(path);

  return {
    path,
    publicUrl: data.publicUrl,
  };
}

/* ============================================================ */
/* DELETE IMAGE                                                 */
/* ============================================================ */

export async function deleteMinistryImage(path) {
  if (!path) {
    return;
  }

  const { error } = await supabase.storage.from(MINISTRY_BUCKET).remove([path]);

  if (error) {
    throw error;
  }
}
