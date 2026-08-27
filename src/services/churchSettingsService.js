import { supabase } from "../lib/supabase";

/* ========================================================================== */
/* GET SETTINGS                                                              */
/* ========================================================================== */

export async function getChurchSettings() {
  const { data, error } = await supabase
    .from("church_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

/* ========================================================================== */
/* UPDATE SETTINGS                                                           */
/* ========================================================================== */

export async function updateChurchSettings(id, settings) {
  const { data, error } = await supabase
    .from("church_settings")
    .update({
      church_name: settings.churchName.trim(),

      short_name: settings.shortName?.trim() || null,

      hero_title: settings.heroTitle?.trim() || null,

      hero_highlight: settings.heroHighlight?.trim() || null,

      hero_description: settings.heroDescription?.trim() || null,

      service_day: settings.serviceDay?.trim() || null,

      service_time: settings.serviceTime?.trim() || null,

      address: settings.address?.trim() || null,

      google_maps_url: settings.googleMapsUrl?.trim() || null,

      phone: settings.phone?.trim() || null,

      email: settings.email?.trim() || null,

      facebook_url: settings.facebookUrl?.trim() || null,

      instagram_url: settings.instagramUrl?.trim() || null,

      youtube_url: settings.youtubeUrl?.trim() || null,

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
