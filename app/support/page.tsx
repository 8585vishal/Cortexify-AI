"use client";

import Link from "next/link";
import { NavBar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function SupportPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Support</h1>
          <p className="mt-2 text-muted-foreground">Get help, find answers, and contact our team.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="text-lg font-semibold">Contact</div>
            <p className="mt-2 text-sm text-muted-foreground">Reach us for billing, technical, or general queries.</p>
            <div className="mt-4 flex gap-3"><Button asChild className="rounded-full" variant="outline"><Link href="/contact">Contact Us</Link></Button><Button asChild className="rounded-full"><Link href="/help-center">Help Center</Link></Button></div>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="text-lg font-semibold">FAQs</div>
            <div className="mt-3 space-y-3">
              <Collapsible>
                <CollapsibleTrigger className="w-full text-left">How do I reset my password?</CollapsibleTrigger>
                <CollapsibleContent className="text-sm text-muted-foreground">Use the account settings page to change credentials securely.</CollapsibleContent>
              </Collapsible>
              <Collapsible>
                <CollapsibleTrigger className="w-full text-left">Where can I view my usage?</CollapsibleTrigger>
                <CollapsibleContent className="text-sm text-muted-foreground">Usage analytics are available in your dashboard.</CollapsibleContent>
              </Collapsible>
              <Collapsible>
                <CollapsibleTrigger className="w-full text-left">Do you offer SLAs?</CollapsibleTrigger>
                <CollapsibleContent className="text-sm text-muted-foreground">Business plans include SLA commitments and priority support.</CollapsibleContent>
              </Collapsible>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="text-lg font-semibold">Resources</div>
            <p className="mt-2 text-sm text-muted-foreground">Guides, onboarding, and API documentation.</p>
            <div className="mt-4 flex gap-3"><Button asChild variant="outline" className="rounded-full"><Link href="/documentation">Documentation</Link></Button><Button asChild className="rounded-full"><Link href="/api">API</Link></Button></div>
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