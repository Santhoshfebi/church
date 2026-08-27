import { supabase } from "../lib/supabase";

/* -------------------------------------------------------------------------- */
/*                         YOUTUBE VIDEO ID HELPER                            */
/* -------------------------------------------------------------------------- */

export function extractYouTubeVideoId(url) {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);

    // youtube.com/watch?v=VIDEO_ID
    if (
      parsedUrl.hostname.includes("youtube.com") &&
      parsedUrl.pathname === "/watch"
    ) {
      return parsedUrl.searchParams.get("v") || "";
    }

    // youtu.be/VIDEO_ID
    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.replace("/", "").split("/")[0];
    }

    // youtube.com/shorts/VIDEO_ID
    if (
      parsedUrl.hostname.includes("youtube.com") &&
      parsedUrl.pathname.startsWith("/shorts/")
    ) {
      return parsedUrl.pathname.split("/")[2] || "";
    }

    // youtube.com/embed/VIDEO_ID
    if (
      parsedUrl.hostname.includes("youtube.com") &&
      parsedUrl.pathname.startsWith("/embed/")
    ) {
      return parsedUrl.pathname.split("/")[2] || "";
    }

    return "";
  } catch {
    return "";
  }
}

export function getYouTubeThumbnail(videoId) {
  if (!videoId) {
    return "";
  }

  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function getYouTubeEmbedUrl(videoId) {
  if (!videoId) {
    return "";
  }

  return `https://www.youtube.com/embed/${videoId}`;
}

/* -------------------------------------------------------------------------- */
/*                              PUBLIC SERMONS                                */
/* -------------------------------------------------------------------------- */

export async function getPublicSermons() {
  const { data, error } = await supabase
    .from("sermons")
    .select("*")
    .eq("is_published", true)
    .order("sermon_date", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/* -------------------------------------------------------------------------- */
/*                               ADMIN SERMONS                                */
/* -------------------------------------------------------------------------- */

export async function getAdminSermons() {
  const { data, error } = await supabase
    .from("sermons")
    .select("*")
    .order("sermon_date", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/* -------------------------------------------------------------------------- */
/*                               CREATE SERMON                                */
/* -------------------------------------------------------------------------- */

export async function createSermon(sermon) {
  const videoId = extractYouTubeVideoId(sermon.youtubeUrl);

  if (!videoId) {
    throw new Error("Please enter a valid YouTube video URL.");
  }

  const { data, error } = await supabase
    .from("sermons")
    .insert([
      {
        title: sermon.title.trim(),

        description: sermon.description?.trim() || null,

        speaker: sermon.speaker?.trim() || null,

        scripture: sermon.scripture?.trim() || null,

        sermon_date: sermon.sermonDate,

        duration: sermon.duration?.trim() || null,

        youtube_url: sermon.youtubeUrl.trim(),

        youtube_video_id: videoId,

        is_featured: sermon.isFeatured,

        is_published: sermon.isPublished,
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
/*                               UPDATE SERMON                                */
/* -------------------------------------------------------------------------- */

export async function updateSermon(id, sermon) {
  const videoId = extractYouTubeVideoId(sermon.youtubeUrl);

  if (!videoId) {
    throw new Error("Please enter a valid YouTube video URL.");
  }

  const { data, error } = await supabase
    .from("sermons")
    .update({
      title: sermon.title.trim(),

      description: sermon.description?.trim() || null,

      speaker: sermon.speaker?.trim() || null,

      scripture: sermon.scripture?.trim() || null,

      sermon_date: sermon.sermonDate,

      duration: sermon.duration?.trim() || null,

      youtube_url: sermon.youtubeUrl.trim(),

      youtube_video_id: videoId,

      is_featured: sermon.isFeatured,

      is_published: sermon.isPublished,

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
/*                               DELETE SERMON                                */
/* -------------------------------------------------------------------------- */

export async function deleteSermon(id) {
  const { error } = await supabase.from("sermons").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/*                           PUBLISH / UNPUBLISH                              */
/* -------------------------------------------------------------------------- */

export async function toggleSermonPublished(id, isPublished) {
  const { data, error } = await supabase
    .from("sermons")
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
