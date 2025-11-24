"use client";

import Link from "next/link";
import { NavBar } from "@/components/ui/navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProductPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Product</h1>
            <p className="mt-2 text-muted-foreground">Cortexify delivers fast, secure, and intelligent AI conversations.</p>
          </div>
          <div className="flex gap-3"><Button asChild className="rounded-full"><Link href="/chat">Try Chat</Link></Button><Button asChild variant="outline" className="rounded-full"><Link href="/pricing">View Pricing</Link></Button></div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FeatureCard title="Intelligent" desc="Understands context and adapts to your workflow." />
          <FeatureCard title="Reliable" desc="High uptime, low latency, and robust infrastructure." />
          <FeatureCard title="Secure" desc="Built with privacy-first architecture and encryption." />
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

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{desc}</p>
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