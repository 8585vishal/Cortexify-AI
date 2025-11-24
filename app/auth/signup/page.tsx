"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/components/ui/toast-provider";

export default function SignupPage() {
  const router = useRouter();
  const { push } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      push({ title: "Account created", description: "Welcome to Cortexify", variant: "success" });
      router.replace("/");
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
          <h1 className="mb-2 text-2xl font-semibold">Create your account</h1>
          <p className="mb-6 text-sm text-muted-foreground">Sign up with your email and a strong password.</p>
          <form className="space-y-4" onSubmit={onSubmit} aria-label="Signup form">
            <div>
              <label htmlFor="email" className="text-sm">Email</label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-required="true" />
            </div>
            <div>
              <label htmlFor="password" className="text-sm">Password</label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} aria-required="true" />
              <p className="mt-1 text-xs text-muted-foreground">At least 8 characters.</p>
            </div>
            <div>
              <label htmlFor="confirm" className="text-sm">Confirm Password</label>
              <Input id="confirm" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} aria-required="true" />
            </div>
            {error && <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating..." : "Create account"}</Button>
            <div className="text-center text-sm">
              Already have an account? <Link href="/auth/login" className="underline">Sign in</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}