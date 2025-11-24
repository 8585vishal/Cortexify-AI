"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/ui/navbar";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <NavBar />

      <main className="mx-auto max-w-7xl px-4">
        <section className="py-12 md:py-20">
          <div className="mb-4 flex items-center justify-center">
            <span className="rounded-full border px-3 py-1 text-xs">Contact Us</span>
          </div>
          <h1 className="text-center text-4xl font-bold leading-tight md:text-5xl">
            Let’s Start a <span className="text-emerald-400">Conversation</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Have questions about CORTEXIFY? Want to explore enterprise solutions? Our team is here to help you unlock the power of AI conversations.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
            <ContactCard title="Email Us" value="hello@cortexify.ai" icon="✉️" />
            <ContactCard title="Call Us" value="+1 (555) 123-4567" icon="📞" />
            <ContactCard title="Visit Us" value="San Francisco, CA" icon="📍" />
            <ContactCard title="Business Hours" value="Mon–Fri 9AM–6PM PST" icon="⏰" />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-10 py-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">Send Us a Message</h2>
            <p className="mt-2 text-sm text-muted-foreground">Fill out the form below and we’ll get back to you within 24 hours.</p>
            <form className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input placeholder="Your full name" aria-label="Full Name" />
                <Input type="email" placeholder="your@email.com" aria-label="Email Address" />
              </div>
              <Input placeholder="Company (Optional)" aria-label="Company" />
              <Input placeholder="Subject" aria-label="Subject" />
              <textarea className="flex h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30" placeholder="Tell us more about your needs..." aria-label="Message" />
              <Button className="w-full rounded-full">Send Message</Button>
            </form>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Why Contact Us?</h2>
            <p className="mt-2 text-sm text-muted-foreground">Whether you’re curious about features, need enterprise solutions, or have technical questions, we’re here to help.</p>
            <div className="mt-6 space-y-4">
              <InfoItem title="Product Questions" desc="Learn more about CORTEXIFY’s features and capabilities." icon="📦" />
              <InfoItem title="Enterprise Solutions" desc="Discuss custom plans and enterprise integrations." icon="🏢" />
              <InfoItem title="Security & Compliance" desc="Questions about data privacy and security measures." icon="🔐" />
              <InfoItem title="Technical Support" desc="Get help with implementation and troubleshooting." icon="🛠️" />
            </div>
            <div className="mt-6 rounded-xl border bg-muted/20 p-4 text-sm">
              <div className="font-medium">Need Immediate Help?</div>
              <div className="mt-2 text-muted-foreground">Email: hello@cortexify.ai • Call: +1 (555) 123-4567</div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-center text-3xl font-semibold">Quick Answers</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">Common questions we get from our users</p>
          <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {quickAnswers.map((qa) => (
              <QA key={qa.q} q={qa.q} a={qa.a} />
            ))}
          </div>
        </section>

        <section id="cta" className="py-14">
          <div className="rounded-xl bg-secondary/20 px-6 py-10 text-center">
            <h3 className="text-2xl font-semibold">Ready to Experience CORTEXIFY?</h3>
            <p className="mt-2 text-muted-foreground">While you’re waiting for our response, why not try CORTEXIFY right now?</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/chat">Try CORTEXIFY Now</Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full" asChild>
                <Link href="/pricing">View Pricing</Link>
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
              <FooterCol title="Quick Links" items={[{label:"Home",href:"/"},{label:"About",href:"/about"},{label:"Features",href:"/features"},{label:"Pricing",href:"/pricing"}]} />
              <FooterCol title="Product" items={[{label:"AI Chat",href:"/chat"},{label:"API",href:"/api"},{label:"Documentation",href:"/documentation"},{label:"Status",href:"/status"}]} />
              <FooterCol title="Support" items={[{label:"Support",href:"/support"},{label:"Contact Us",href:"/contact"},{label:"Help Center",href:"/help-center"},{label:"Privacy Policy",href:"/privacy-policy"}]} />
              <FooterCol title="Legal" items={[{label:"Terms of Service",href:"/terms-of-service"},{label:"Cookies",href:"#"},{label:"Security",href:"#"},{label:"Accessibility",href:"#"}]} />
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground md:flex-row">
            <span>© 2024 CORTEXIFY. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href="#">Privacy</Link>
              <Link href="#">Terms</Link>
              <Link href="#">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ContactCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-2xl">{icon}</div>
      <div className="font-semibold">{title}</div>
      <div className="mt-1 text-sm text-emerald-400">{value}</div>
    </div>
  );
}

function InfoItem({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-1 flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-xl">{icon}</div>
        <div className="font-medium">{title}</div>
      </div>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function QA({ q, a }: { q: string; a: string }) {
  return (
    <Collapsible>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-xl border bg-card px-4 py-3 text-left text-sm font-medium">
        <span>{q}</span>
        <span>▾</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-xl border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">{a}</CollapsibleContent>
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

const quickAnswers = [
  { q: "How quickly do you respond to inquiries?", a: "We aim to respond to all inquiries within 24 hours during business days. Urgent matters are prioritized and may receive faster responses." },
  { q: "Do you offer custom enterprise solutions?", a: "Yes! We offer custom enterprise solutions including white-label options, custom integrations, and dedicated support. Contact our sales team to learn more." },
  { q: "Can I schedule a demo?", a: "Absolutely! Mention in your message that you'd like to schedule a demo, and we'll set up a personalized demonstration of CORTEXIFY's features." },
  { q: "What information should I include in my message?", a: "Please include your use case, team size (if applicable), any specific features you're interested in, and your timeline. This helps us provide the most relevant information." },
];