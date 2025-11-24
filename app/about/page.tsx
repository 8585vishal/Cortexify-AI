"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/ui/navbar";

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <NavBar />

      <main className="mx-auto max-w-7xl px-4">
        <section className="relative grid grid-cols-1 items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div className="flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
              <span className="inline-block rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-400">About Us</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Revolutionizing <span className="text-emerald-400">AI Conversations</span>
            </h1>
            <p className="max-w-xl text-muted-foreground">
              CORTEXIFY is on a mission to make advanced AI conversation technology accessible to everyone, enabling more natural, intelligent, and helpful interactions between humans and artificial intelligence.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="rounded-xl border bg-card p-2 shadow-sm">
              <img src="/assets/image/02.webp" alt="AI" className="h-auto w-full rounded-lg object-cover" />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-6 rounded-xl bg-secondary/20 px-6 py-10 md:grid-cols-4">
          <Stat label="Active Users" value="10,000+" />
          <Stat label="Uptime" value="99.9%" />
          <Stat label="Conversations" value="1M+" />
          <Stat label="Countries" value="50+" />
        </section>

        <section id="mission" className="grid grid-cols-1 items-center gap-10 py-16 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
              <span className="inline-block rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-400">Our Mission</span>
            </div>
            <h2 className="text-2xl font-semibold">Making AI Conversations Natural and Accessible</h2>
            <p className="text-muted-foreground">
              We believe that artificial intelligence should feel natural, helpful, and accessible to everyone. Our mission is to break down the barriers between humans and AI, creating conversations that feel as natural as talking to a knowledgeable friend.
            </p>
            <p className="text-muted-foreground">
              Through CORTEXIFY, we’re building the future of human-AI interaction, where technology enhances human capabilities and makes complex tasks simple and intuitive.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="rounded-xl border bg-card p-2 shadow-sm">
              <img src="https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1200&auto=format&fit=crop" alt="Mission" className="h-auto w-full rounded-lg object-cover" />
            </div>
          </div>
        </section>

        <section id="values" className="py-12">
          <div className="mb-8 flex items-center justify-center">
            <span className="rounded-full border px-3 py-1 text-xs">Our Values</span>
          </div>
          <h2 className="text-center text-3xl font-semibold">What Drives Us Forward</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            Our core values guide every decision we make and every feature we build
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
            <FeatureCard title="AI-First" desc="Artificial intelligence should enhance human capabilities, not replace them." icon="🤖" />
            <FeatureCard title="User-Centric" desc="Designed with our users’ needs and experience in mind." icon="👤" />
            <FeatureCard title="Innovation" desc="Continuously pushing the boundaries of conversational AI." icon="✨" />
            <FeatureCard title="Accessibility" desc="Advanced technology should be accessible to everyone, everywhere." icon="💚" />
          </div>
        </section>

        <section id="team" className="py-12">
          <div className="mb-8 flex items-center justify-center">
            <span className="rounded-full border px-3 py-1 text-xs">Our Team</span>
          </div>
          <h2 className="text-center text-3xl font-semibold">Meet the Minds Behind CORTEXIFY</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            A passionate team of AI researchers, engineers, and visionaries working to shape the future of conversation
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <TeamCard name="Alex Chen" role="CEO & Founder" bio="AI researcher with 10+ years in machine learning and natural language processing." avatarUrl="https://i.pravatar.cc/120?img=12" />
            <TeamCard name="Sarah Rodriguez" role="CTO" bio="Engineer specializing in scalable AI systems and user experience." avatarUrl="https://i.pravatar.cc/120?img=32" />
            <TeamCard name="Michael Park" role="Head of AI" bio="PhD in Computer Science, leading research in conversational AI and language models." avatarUrl="https://i.pravatar.cc/120?img=64" />
          </div>
        </section>

        <section id="cta" className="py-14">
          <div className="rounded-xl bg-secondary/20 px-6 py-10 text-center">
            <h3 className="text-2xl font-semibold">Join Us on This Journey</h3>
            <p className="mt-2 text-muted-foreground">
              Be part of the AI conversation revolution. Experience the future of human-AI interaction today.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/chat">Start Chatting</Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full" asChild>
                <Link href="/about#contact">Get in Touch</Link>
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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-2xl">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function TeamCard({ name, role, bio, avatarUrl }: { name: string; role: string; bio: string; avatarUrl: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 size-20 overflow-hidden rounded-full">
        <img src={avatarUrl} alt={name} className="size-full object-cover" />
      </div>
      <div className="font-medium">{name}</div>
      <div className="text-xs text-muted-foreground">{role}</div>
      <p className="mt-3 text-sm text-muted-foreground">{bio}</p>
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
            <Link href={i.href} className="hover:text-foreground">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}