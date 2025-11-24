import Link from "next/link";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex items-center justify-between py-3">
        <Link href="#" className="flex items-center gap-2 font-semibold">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">🧠</div>
          <span>Cortexify-AI</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm opacity-90 hover:opacity-100">Home</Link>
          <Link href="/chat" className="text-sm opacity-90 hover:opacity-100">Chat</Link>
          <Link href="/about" className="text-sm opacity-90 hover:opacity-100">About</Link>
          <Link href="/features" className="text-sm opacity-90 hover:opacity-100">Features</Link>
          <Link href="/pricing" className="text-sm opacity-90 hover:opacity-100">Pricing</Link>
          <Link href="/api" className="text-sm opacity-90 hover:opacity-100">API</Link>
          <Link href="/documentation" className="text-sm opacity-90 hover:opacity-100">Docs</Link>
          <Link href="/status" className="text-sm opacity-90 hover:opacity-100">Status</Link>
          <Link href="/support" className="text-sm opacity-90 hover:opacity-100">Support</Link>
          <Link href="/contact" className="text-sm opacity-90 hover:opacity-100">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button asChild className="rounded-full"><Link href="/chat">Start Chatting</Link></Button>
        </div>
      </div>
    </header>
  );
}