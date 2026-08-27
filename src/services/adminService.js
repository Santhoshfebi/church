import { supabase } from "../lib/supabase";

export async function getPrayerRequests() {
  const { data, error } = await supabase
    .from("prayer_requests")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getContactMessages() {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function updatePrayerRequestStatus(id, status) {
  const { error } = await supabase
    .from("prayer_requests")
    .update({
      status,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function updateContactMessageStatus(id, status) {
  const { error } = await supabase
    .from("contact_messages")
    .update({
      status,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deletePrayerRequest(id) {
  const { error } = await supabase
    .from("prayer_requests")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteContactMessage(id) {
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}
