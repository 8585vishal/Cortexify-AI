"use client";

import Link from "next/link";
import { NavBar } from "@/components/ui/navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DocumentationPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Documentation</h1>
            <p className="mt-2 text-muted-foreground">Learn how to build with Cortexify APIs and components.</p>
          </div>
          <Button asChild className="rounded-full"><Link href="/api">Explore API</Link></Button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <DocCard title="Getting Started" desc="Install, configure, and make your first API call." href="#" />
          <DocCard title="Authentication" desc="Manage tokens and sessions securely." href="#" />
          <DocCard title="Chat SDK" desc="Integrate real-time AI chat into your app." href="#" />
          <DocCard title="Webhooks" desc="Receive event notifications from Cortexify." href="#" />
          <DocCard title="Rate Limits" desc="Understand quotas and best practices." href="#" />
          <DocCard title="Errors" desc="Common issues and troubleshooting steps." href="#" />
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

function DocCard({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{desc}</p>
        <div className="mt-4"><Button asChild variant="outline" className="rounded-full"><Link href={href}>Read More</Link></Button></div>
      </CardContent>
    </Card>
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