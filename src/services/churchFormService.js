import { supabase } from "../lib/supabase";

export async function submitPrayerRequest({
  name,
  email,
  prayerRequest,
  wantsContact,
}) {
  const { error } = await supabase
    .from("prayer_requests")
    .insert([
      {
        name: name?.trim() || null,
        email: email?.trim() || null,
        prayer_request: prayerRequest.trim(),
        wants_contact: wantsContact,
      },
    ]);

  if (error) {
    throw error;
  }
}

export async function submitContactMessage({
  name,
  email,
  phone,
  subject,
  message,
}) {
  const { error } = await supabase
    .from("contact_messages")
    .insert([
      {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        subject: subject?.trim() || "General Question",
        message: message.trim(),
      },
    ]);

  if (error) {
    throw error;
  }
}