"use client";

import Link from "next/link";
import { NavBar } from "@/components/ui/navbar";
import { Input } from "@/components/ui/input";

export default function HelpCenterPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Help Center</h1>
          <p className="mt-2 text-muted-foreground">Search articles and guides to get help fast.</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Input placeholder="Search help topics" />
            <div className="text-sm text-muted-foreground">Popular: Reset password, API keys, Billing</div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <HelpCard title="Account" href="#" />
            <HelpCard title="API" href="#" />
            <HelpCard title="Chat" href="#" />
            <HelpCard title="Billing" href="#" />
            <HelpCard title="Security" href="#" />
            <HelpCard title="Workspace" href="#" />
          </div>
        </div>
      </main>
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between">
            <div className="max-w-md">
              <div className="flex items-center gap-2 font-semibold">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><span className="text-sm">🧠</span></div>
                <span>Cortexify-AI</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">The future of AI conversation. Experience intelligent, contextual, and engaging conversations powered by advanced AI technology.</p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <FooterCol title="Quick Links" items={[{label:"Home",href:"/"},{label:"About",href:"/about"},{label:"Features",href:"/features"},{label:"Pricing",href:"/pricing"},{label:"Product",href:"/product"}]} />
              <FooterCol title="Product" items={[{label:"AI Chat",href:"/chat"},{label:"API",href:"/api"},{label:"Documentation",href:"/documentation"},{label:"Status",href:"/status"}]} />
              <FooterCol title="Support" items={[{label:"Support",href:"/support"},{label:"Contact Us",href:"/contact"},{label:"Help Center",href:"/help-center"},{label:"Privacy Policy",href:"/privacy-policy"}]} />
              <FooterCol title="Legal" items={[{label:"Terms of Service",href:"/terms-of-service"},{label:"Cookies",href:"#"},{label:"Security",href:"#"},{label:"Accessibility",href:"#"}]} />
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground md:flex-row">
            <span>© 2024 CORTEXIFY. All rights reserved.</span>
            <div className="flex gap-4"><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-service">Terms</Link><Link href="#">Cookies</Link></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HelpCard({ title, href }: { title: string; href: string }) {
  return (
    <Link href={href} className="rounded-xl border bg-card p-6 shadow-sm hover:border-primary">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">Guides and FAQs</div>
    </Link>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="mb-3 font-semibold">{title}</div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i.label}>
            <Link href={i.href} className="hover:text-foreground">{i.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}