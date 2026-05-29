"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2, LockKeyhole, Pin } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[24px] border border-[var(--border)] bg-[color:rgb(255_253_250_/_0.78)] shadow-[var(--shadow-soft)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden border-r border-[var(--border)] bg-[var(--surface)] p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[var(--accent)] text-white shadow-[0_10px_22px_rgb(15_118_110_/_22%)]">
                <Pin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-lg font-extrabold text-[var(--foreground)]">PinAffiliate AI</p>
                <p className="text-sm font-semibold text-[var(--muted)]">Pinterest affiliate studio</p>
              </div>
            </div>
            <div className="mt-20 max-w-lg">
              <p className="app-eyebrow">Demo workspace</p>
              <h1 className="mt-4 text-5xl font-black leading-[1.02] tracking-normal text-[var(--foreground)]">
                Turn product niches into judge-ready pin campaigns.
              </h1>
              <p className="mt-5 text-base leading-8 text-[var(--muted)]">
                Generate product-backed Pinterest titles, descriptions, hashtags, affiliate links, and exports from a clean command center.
              </p>
            </div>
          </div>

          <div className="grid gap-3 text-sm font-semibold text-[var(--muted-strong)]">
            {["Auto-signup remains enabled", "Affiliate-ready exports", "Fast MVP-friendly workflow"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-8 sm:px-10 sm:py-12">
          <div className="mx-auto max-w-md">
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--accent)] text-white">
                  <Pin className="h-5 w-5" />
                </span>
                <span className="text-lg font-extrabold text-[var(--foreground)]">PinAffiliate AI</span>
              </div>
            </div>

            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[14px] bg-[var(--accent-soft)] text-[var(--accent)]">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <p className="app-eyebrow">Welcome back</p>
              <h2 className="mt-3 text-3xl font-black tracking-normal text-[var(--foreground)]">
                Sign in to continue
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                New users are created automatically for this MVP when valid credentials are submitted.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email-address" className="app-label">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="app-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="app-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="app-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <div className="app-alert app-alert-danger text-sm font-semibold">{error}</div>}

              <button type="submit" disabled={loading} className="app-button-primary w-full gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in / Sign up
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
