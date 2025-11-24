"use client";

import Link from "next/link";
import { NavBar } from "@/components/ui/navbar";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <NavBar />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="mt-2 text-muted-foreground">Please review the terms governing your use of Cortexify.</p>
        <div className="mt-8 space-y-6">
          <section className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="text-lg font-semibold">Acceptance of Terms</div>
            <p className="mt-2 text-sm text-muted-foreground">By using Cortexify, you agree to these terms and our policies.</p>
          </section>
          <section className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="text-lg font-semibold">Usage Guidelines</div>
            <p className="mt-2 text-sm text-muted-foreground">Do not misuse the service, violate laws, or infringe on rights.</p>
          </section>
          <section className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="text-lg font-semibold">Limitation of Liability</div>
            <p className="mt-2 text-sm text-muted-foreground">Cortexify is provided as-is; liability is limited as permitted by law.</p>
          </section>
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