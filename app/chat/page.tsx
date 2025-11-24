"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Assistant } from "../assistant";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();
  const onLogout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include", keepalive: true });
    } finally {
      if (typeof window !== "undefined") {
        window.location.assign("/auth/login");
      } else {
        router.replace("/auth/login");
      }
    }
  }, [router]);
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="#" className="flex items-center gap-2 font-semibold">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm">🧠</span>
            </div>
            <span>Cortexify-AI</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm opacity-90 hover:opacity-100">Home</Link>
            <Link href="/chat" className="text-sm opacity-90 hover:opacity-100">Chat</Link>
            <Link href="/about" className="text-sm opacity-90 hover:opacity-100">About</Link>
            <Link href="/features" className="text-sm opacity-90 hover:opacity-100">Features</Link>
            <Link href="/pricing" className="text-sm opacity-90 hover:opacity-100">Pricing</Link>
            <Link href="/contact" className="text-sm opacity-90 hover:opacity-100">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" className="rounded-full" onClick={onLogout}>Logout</Button>
          </div>
        </div>
      </header>
      <main className="px-0">
        <div className="h-[calc(100dvh-64px)] w-full">
          <Assistant />
        </div>
      </main>
    </div>
  );
}