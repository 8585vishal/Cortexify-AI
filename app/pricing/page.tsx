"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/ui/navbar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  const priceStarter = annual ? 0 : 0;
  const pricePro = annual ? 190 : 19;
  const priceEnt = annual ? 490 : 49;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <NavBar />

      <main className="mx-auto max-w-7xl px-4">
        <section className="py-12 md:py-20">
          <div className="mb-4 flex items-center justify-center">
            <span className="rounded-full border px-3 py-1 text-xs">Pricing</span>
          </div>
          <h1 className="text-center text-4xl font-bold leading-tight md:text-5xl">
            Simple, Transparent <span className="text-emerald-400">Pricing Plans</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Choose the perfect plan for your AI conversation needs. Start free and scale as you grow.
          </p>
          <div className="mt-6 flex justify-center gap-6 text-sm">
            <button
              className={`rounded-full border px-4 py-1 ${!annual ? "bg-primary text-primary-foreground" : "bg-background"}`}
              onClick={() => setAnnual(false)}
            >
              Monthly
            </button>
            <button
              className={`rounded-full border px-4 py-1 ${annual ? "bg-primary text-primary-foreground" : "bg-background"}`}
              onClick={() => setAnnual(true)}
            >
              Annual
            </button>
          </div>
        </section>

        <section className="py-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <PricingCard
              title="Starter"
              price={priceStarter}
              ctaLabel="Start Free"
              features={[
                "100 messages per month",
                "Basic AI responses",
                "Limited chat history",
                "Community support",
                "Standard response time",
              ]}
              limitations={[
                "No advanced features",
                "Limited customization",
                "Basic integrations only",
              ]}
            />
            <PricingCard
              title="Professional"
              popular
              price={pricePro}
              ctaLabel="Start Professional"
              features={[
                "Unlimited messages",
                "Advanced AI responses",
                "Full chat history & search",
                "Priority support",
                "Fast response times",
                "Conversation templates",
                "Export conversations",
                "Advanced analytics",
              ]}
            />
            <PricingCard
              title="Enterprise"
              price={priceEnt}
              ctaLabel="Contact Sales"
              features={[
                "Everything in Professional",
                "Team collaboration tools",
                "Advanced security features",
                "Custom integrations",
                "Dedicated account manager",
                "99.9% uptime SLA",
                "Custom AI model training",
                "White-label options",
                "Advanced API access",
                "Enterprise SSO",
              ]}
            />
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-center text-3xl font-semibold">Why Choose CORTEXIFY?</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            Advanced features that set us apart from the competition
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <InfoCard title="Enterprise Security" desc="Bank-level encryption and security protocols protect your conversations and data." icon="🛡️" />
            <InfoCard title="Lightning Performance" desc="Optimized infrastructure ensures sub-second response times and 99.9% uptime." icon="⚡" />
            <InfoCard title="Team Collaboration" desc="Share conversations, collaborate on projects, and work together seamlessly." icon="👥" />
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-center text-3xl font-semibold">Frequently Asked Questions</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            Everything you need to know about CORTEXIFY pricing
          </p>
          <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {faqs.map((f) => (
              <FAQItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </section>

        <section id="cta" className="py-14">
          <div className="rounded-xl bg-gradient-to-r from-emerald-500/30 to-teal-500/30 px-6 py-10 text-center">
            <h3 className="text-2xl font-semibold">Ready to Get Started?</h3>
            <p className="mt-2 text-muted-foreground">
              Join thousands of users who are already experiencing the future of AI conversation
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/chat">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full" asChild>
                <Link href="/pricing#contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between">
            <div className="max-w-md">
              <div className="flex items-center gap-2 font-semibold">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-sm">🧠</span>
                </div>
                <span>Cortexify-AI</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                The future of AI conversation. Experience intelligent, contextual, and engaging conversations powered by advanced AI technology.
              </p>
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

function PricingCard({ title, price, features, limitations, ctaLabel, popular }: { title: string; price: number; features: string[]; limitations?: string[]; ctaLabel: string; popular?: boolean }) {
  return (
    <div className={`relative rounded-xl border bg-card p-6 shadow-sm ${popular ? "ring-2 ring-emerald-400" : ""}`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-1 text-xs text-white">Most Popular</div>
      )}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-2xl">{title === "Starter" ? "💬" : title === "Professional" ? "⚡" : "👑"}</div>
        <div className="text-xl font-semibold">{title}</div>
      </div>
      <div className="mb-4 text-4xl font-bold">${price}<span className="text-base font-medium">/month</span></div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {features.map((f) => (
          <li key={f}>✓ {f}</li>
        ))}
        {limitations?.map((l) => (
          <li key={l} className="text-muted-foreground/70">✕ {l}</li>
        ))}
      </ul>
      <div className="mt-6">
        <Button className="w-full rounded-full" variant={popular ? "default" : "outline"}>{ctaLabel}</Button>
      </div>
    </div>
  );
}

function InfoCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-2xl">{icon}</div>
        <div className="text-lg font-semibold">{title}</div>
      </div>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <Collapsible>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-xl border bg-card px-4 py-3 text-left text-sm font-medium">
        <span>{q}</span>
        <span>▾</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-xl border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
        {a}
      </CollapsibleContent>
    </Collapsible>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="mb-3 font-semibold">{title}</div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i.label}>
            <Link href={i.href} className="hover:text-foreground">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const faqs = [
  { q: "Can I switch between plans?", a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences." },
  { q: "What happens to my data if I cancel?", a: "Your data remains accessible for 30 days after cancellation. You can export your conversations and data before permanent deletion." },
  { q: "Do you offer refunds?", a: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll provide a full refund." },
  { q: "Is there a free trial for paid plans?", a: "Yes, all paid plans come with a 14-day free trial. No credit card required to start your trial." },
  { q: "How secure is my data?", a: "We implement bank-level encryption, strict access controls, and regular security audits to keep your data safe." },
];