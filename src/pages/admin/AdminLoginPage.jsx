import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, Church, LockKeyhole, Mail } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const { user, profile, loading, signIn } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loading && user && profile) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      await signIn(form.email.trim(), form.password);

      navigate("/admin");
    } catch (err) {
      console.error(err);

      setError("Unable to sign in. Please check your email and password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-zinc-950 text-white lg:grid-cols-2">
      {/* LEFT SIDE */}
      <section className="relative hidden overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1400&q=85"
          alt="Church"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/65" />

        <div className="relative flex h-full flex-col justify-between p-14">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-300 text-zinc-950">
              <Church size={23} />
            </div>

            <div>
              <p className="font-semibold">New Grace</p>

              <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                Jesus With Us Church
              </p>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
              Church Administration
            </p>

            <h1 className="mt-5 text-5xl font-semibold tracking-tight">
              Serve people.
              <span className="block text-amber-300">Manage ministry.</span>
            </h1>

            <p className="mt-6 leading-8 text-white/60">
              Secure access for authorized New Grace church administrators.
            </p>
          </div>
        </div>
      </section>

      {/* LOGIN */}
      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-300 text-zinc-950">
              <Church size={23} />
            </div>

            <p className="mt-4 font-semibold">New Grace Jesus With Us Church</p>
          </div>

          <p className="mt-12 text-sm font-semibold uppercase tracking-[0.2em] text-amber-300 lg:mt-0">
            Admin Portal
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight">
            Welcome back
          </h2>

          <p className="mt-3 text-white/50">
            Sign in to manage church information.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-white/70">Email</label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />

                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  placeholder="admin@church.org"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-5 text-white outline-none placeholder:text-white/25 focus:border-amber-300"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />

                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  placeholder="Enter password"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-5 text-white outline-none placeholder:text-white/25 focus:border-amber-300"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-300 px-6 py-4 font-semibold text-zinc-950 hover:bg-amber-200 disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign In"}

              {!submitting && <ArrowRight size={18} />}
            </button>
          </form>

          <a
            href="/"
            className="mt-8 block text-center text-sm text-white/40 hover:text-white"
          >
            ← Return to church website
          </a>
        </div>
      </section>
    </main>
  );
}
