import { supabase } from "../lib/supabase";

const EVENT_IMAGE_BUCKET = "event-images";

/* -------------------------------------------------------------------------- */
/*                              PUBLIC EVENTS                                 */
/* -------------------------------------------------------------------------- */

export async function getPublicEvents() {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .gte("event_date", today)
    .order("event_date", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/* -------------------------------------------------------------------------- */
/*                               ADMIN EVENTS                                 */
/* -------------------------------------------------------------------------- */

export async function getAdminEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/* -------------------------------------------------------------------------- */
/*                               CREATE EVENT                                 */
/* -------------------------------------------------------------------------- */

export async function createEvent(event) {
  const { data, error } = await supabase
    .from("events")
    .insert([
      {
        title: event.title.trim(),
        description: event.description?.trim() || null,

        event_date: event.eventDate,
        start_time: event.startTime || null,

        location: event.location?.trim() || null,

        image_url: event.imageUrl || null,

        image_path: event.imagePath || null,

        is_featured: event.isFeatured,

        is_published: event.isPublished,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/* -------------------------------------------------------------------------- */
/*                               UPDATE EVENT                                 */
/* -------------------------------------------------------------------------- */

export async function updateEvent(id, event) {
  const { data, error } = await supabase
    .from("events")
    .update({
      title: event.title.trim(),

      description: event.description?.trim() || null,

      event_date: event.eventDate,

      start_time: event.startTime || null,

      location: event.location?.trim() || null,

      image_url: event.imageUrl || null,

      image_path: event.imagePath || null,

      is_featured: event.isFeatured,

      is_published: event.isPublished,

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

/* -------------------------------------------------------------------------- */
/*                               DELETE EVENT                                 */
/* -------------------------------------------------------------------------- */

export async function deleteEvent(id) {
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/*                            PUBLISH / UNPUBLISH                             */
/* -------------------------------------------------------------------------- */

export async function toggleEventPublished(id, isPublished) {
  const { data, error } = await supabase
    .from("events")
    .update({
      is_published: isPublished,

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

/* -------------------------------------------------------------------------- */
/*                              UPLOAD IMAGE                                  */
/* -------------------------------------------------------------------------- */

export async function uploadEventImage(file) {
  if (!file) {
    throw new Error("No image selected.");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Please upload a JPG, PNG, or WebP image.");
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

  const id = crypto.randomUUID();

  const path = `events/${id}.${extension}`;

  const { error } = await supabase.storage
    .from(EVENT_IMAGE_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(EVENT_IMAGE_BUCKET).getPublicUrl(path);

  return {
    path,
    publicUrl: data.publicUrl,
  };
}

/* -------------------------------------------------------------------------- */
/*                              DELETE IMAGE                                  */
/* -------------------------------------------------------------------------- */

export async function deleteEventImage(path) {
  if (!path) {
    return;
  }

  const { error } = await supabase.storage
    .from(EVENT_IMAGE_BUCKET)
    .remove([path]);

  if (error) {
    throw error;
  }
}
