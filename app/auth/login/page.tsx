"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/components/ui/toast-provider";

export default function LoginPage() {
  const router = useRouter();
  const { push } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      push({ title: "Successfully signed in", description: "Welcome back to Cortexify", variant: "success" });
      if (typeof window !== "undefined") {
        window.location.reload();
      } else {
        router.replace("/chat");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <NavBar />
      <main className="container flex min-h-[calc(100dvh-64px)] items-center justify-center">
        <div className="mx-auto w-full max-w-md card p-6">
          <h1 className="mb-4 text-xl font-semibold">Sign in</h1>
          <form className="space-y-4" aria-label="Login form" onSubmit={onSubmit}>
            <div>
              <label htmlFor="email" className="text-sm">Email</label>
              <Input id="email" type="email" className="mt-1" placeholder="you@example.com" aria-required="true" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password" className="text-sm">Password</label>
              <Input id="password" type="password" className="mt-1" placeholder="••••••••" aria-required="true" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Continue"}</Button>
            <div className="text-center text-sm">
              No account? <Link href="/auth/signup" className="underline">Create one</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}