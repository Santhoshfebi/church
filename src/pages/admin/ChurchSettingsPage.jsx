import { useEffect, useState } from "react";

import { Church, Clock3, Mail, MapPin, Save, Settings } from "lucide-react";

import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

import AdminLayout from "../../components/admin/AdminLayout";

import {
  getChurchSettings,
  updateChurchSettings,
} from "../../services/churchSettingsService";

const emptyForm = {
  churchName: "New Grace Jesus With Us Church",

  shortName: "New Grace",

  heroTitle: "Jesus With Us.",

  heroHighlight: "Grace For Everyone.",

  heroDescription: "",

  serviceDay: "Sunday",

  serviceTime: "10:00 AM",

  address: "",

  googleMapsUrl: "",

  phone: "",

  email: "",

  facebookUrl: "",

  instagramUrl: "",

  youtubeUrl: "",
};

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10";

export default function ChurchSettingsPage() {
  const [settingsId, setSettingsId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getChurchSettings();

      if (!data) {
        setError("Church settings row was not found.");

        return;
      }

      setSettingsId(data.id);

      setForm({
        churchName: data.church_name || "",

        shortName: data.short_name || "",

        heroTitle: data.hero_title || "",

        heroHighlight: data.hero_highlight || "",

        heroDescription: data.hero_description || "",

        serviceDay: data.service_day || "",

        serviceTime: data.service_time || "",

        address: data.address || "",

        googleMapsUrl: data.google_maps_url || "",

        phone: data.phone || "",

        email: data.email || "",

        facebookUrl: data.facebook_url || "",

        instagramUrl: data.instagram_url || "",

        youtubeUrl: data.youtube_url || "",
      });
    } catch (err) {
      console.error("Settings load error:", err);

      setError(err?.message || "Unable to load church settings.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!settingsId) {
      setError("Church settings record was not found.");

      return;
    }

    if (!form.churchName.trim()) {
      setError("Please enter the church name.");

      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await updateChurchSettings(settingsId, form);

      setSettingsId(updated.id);

      setSuccess("Church settings saved successfully.");
    } catch (err) {
      console.error("Settings save error:", err);

      setError(err?.message || "Unable to save church settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <main className="px-5 py-7 sm:px-7 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center text-sm text-zinc-400">
              Loading settings...
            </div>
          </div>
        </main>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <main className="px-5 py-7 sm:px-7 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* HEADER */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              Website Settings
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Church Settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              Update the church information used across the public website.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
              {/* LEFT */}

              <div className="space-y-6">
                {/* CHURCH */}

                <SettingsCard
                  icon={Church}
                  title="Church Identity"
                  description="Main church name and website branding."
                >
                  <Field label="Church Name" required>
                    <input
                      value={form.churchName}
                      onChange={(e) =>
                        updateField("churchName", e.target.value)
                      }
                      placeholder="New Grace Jesus With Us Church"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Short Name">
                    <input
                      value={form.shortName}
                      onChange={(e) => updateField("shortName", e.target.value)}
                      placeholder="New Grace"
                      className={inputClass}
                    />
                  </Field>
                </SettingsCard>

                {/* HERO */}

                <SettingsCard
                  icon={Settings}
                  title="Homepage Hero"
                  description="Control the main heading visitors see."
                >
                  <Field label="Hero Heading">
                    <input
                      value={form.heroTitle}
                      onChange={(e) => updateField("heroTitle", e.target.value)}
                      placeholder="Jesus With Us."
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Highlighted Heading">
                    <input
                      value={form.heroHighlight}
                      onChange={(e) =>
                        updateField("heroHighlight", e.target.value)
                      }
                      placeholder="Grace For Everyone."
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Hero Description">
                    <textarea
                      rows="5"
                      value={form.heroDescription}
                      onChange={(e) =>
                        updateField("heroDescription", e.target.value)
                      }
                      placeholder="Tell visitors about your church..."
                      className={`${inputClass} resize-none`}
                    />
                  </Field>
                </SettingsCard>

                {/* SERVICE */}

                <SettingsCard
                  icon={Clock3}
                  title="Service Information"
                  description="Tell visitors when your church gathers."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Service Day">
                      <input
                        value={form.serviceDay}
                        onChange={(e) =>
                          updateField("serviceDay", e.target.value)
                        }
                        placeholder="Sunday"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Service Time">
                      <input
                        value={form.serviceTime}
                        onChange={(e) =>
                          updateField("serviceTime", e.target.value)
                        }
                        placeholder="10:00 AM"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </SettingsCard>

                {/* LOCATION */}

                <SettingsCard
                  icon={MapPin}
                  title="Church Location"
                  description="Address and Google Maps details."
                >
                  <Field label="Address">
                    <textarea
                      rows="3"
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      placeholder="Enter your church address"
                      className={`${inputClass} resize-none`}
                    />
                  </Field>

                  <Field label="Google Maps Link">
                    <input
                      type="url"
                      value={form.googleMapsUrl}
                      onChange={(e) =>
                        updateField("googleMapsUrl", e.target.value)
                      }
                      placeholder="https://maps.google.com/..."
                      className={inputClass}
                    />
                  </Field>
                </SettingsCard>

                {/* CONTACT */}

                <SettingsCard
                  icon={Mail}
                  title="Contact Information"
                  description="Public phone number and email address."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Phone">
                      <input
                        value={form.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+91..."
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Email">
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="hello@example.com"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </SettingsCard>

                {/* SOCIAL */}

                <SettingsCard
                  icon={FaYoutube}
                  title="Social Media"
                  description="Links visitors can use to follow the church."
                >
                  <SocialField
                    icon={FaFacebookF}
                    label="Facebook"
                    value={form.facebookUrl}
                    onChange={(value) => updateField("facebookUrl", value)}
                  />

                  <SocialField
                    icon={FaInstagram}
                    label="Instagram"
                    value={form.instagramUrl}
                    onChange={(value) => updateField("instagramUrl", value)}
                  />

                  <SocialField
                    icon={FaYoutube}
                    label="YouTube"
                    value={form.youtubeUrl}
                    onChange={(value) => updateField("youtubeUrl", value)}
                  />
                </SettingsCard>
              </div>

              {/* PREVIEW */}

              <div>
                <div className="sticky top-6 rounded-[2rem] bg-zinc-950 p-6 text-white shadow-xl sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                    Website Preview
                  </p>

                  <h2 className="mt-6 text-4xl font-semibold tracking-tight">
                    {form.heroTitle || "Jesus With Us."}

                    <span className="block text-amber-300">
                      {form.heroHighlight || "Grace For Everyone."}
                    </span>
                  </h2>

                  <p className="mt-5 text-sm leading-7 text-white/55">
                    {form.heroDescription ||
                      "Your hero description will appear here."}
                  </p>

                  <div className="mt-8 border-t border-white/10 pt-6">
                    <p className="text-xs uppercase tracking-widest text-white/35">
                      Church
                    </p>

                    <p className="mt-2 font-semibold">{form.churchName}</p>
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-5">
                    <p className="text-xs uppercase tracking-widest text-white/35">
                      Service
                    </p>

                    <p className="mt-2 font-semibold">
                      {form.serviceDay || "Sunday"} •{" "}
                      {form.serviceTime || "10:00 AM"}
                    </p>
                  </div>

                  {form.address && (
                    <div className="mt-5 border-t border-white/10 pt-5">
                      <p className="text-xs uppercase tracking-widest text-white/35">
                        Address
                      </p>

                      <p className="mt-2 text-sm leading-6 text-white/65">
                        {form.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* STATUS */}

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                {success}
              </div>
            )}

            {/* SAVE */}

            <div className="mt-7 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />

                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </AdminLayout>
  );
}

function SettingsCard({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
          <Icon size={20} />
        </div>

        <div>
          <h2 className="font-semibold text-zinc-950">{title}</h2>

          <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">{children}</div>
    </section>
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

function SocialField({ icon: Icon, label, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-zinc-700">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
        />

        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Paste ${label} link`}
          className={`${inputClass} pl-11`}
        />
      </div>
    </div>
  );
}
