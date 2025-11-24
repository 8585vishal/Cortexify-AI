"use client";

import { NavBar } from "@/components/ui/navbar";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <NavBar />
      <main className="container flex min-h-[calc(100dvh-64px)] items-center justify-center">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-semibold">Welcome to Cortexify</h1>
          <p className="mt-3 text-sm text-muted-foreground">You are signed in. Use the navigation to explore features.</p>
          <div className="mt-6">
            <Link href="/chat" className="btn">Go to Chat</Link>
          </div>
        </div>
      </main>
    </div>
  );
}