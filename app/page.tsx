"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/ui/navbar";

export default function Home() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <NavBar />

      <main className="mx-auto max-w-7xl px-4">
        <section className="relative grid grid-cols-1 items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div className="flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
              <span className="inline-block rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-400">Powered by Gemini 2.0</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              The Future of <span className="text-emerald-400">AI Conversation</span>
            </h1>
            <p className="max-w-xl text-muted-foreground">
              Experience intelligent, contextual, and engaging conversations with Cortexify-AI. Our advanced AI assistant understands you, learns with you, and helps you achieve more.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/chat">Start Chatting Now</Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full" asChild>
                <Link href="/features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="rounded-xl border bg-card p-2 shadow-sm">
              <img
                src="/assets/image/01.webp"
                alt="AI"
                className="h-auto w-full rounded-lg object-cover"
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-6 rounded-xl bg-secondary/20 px-6 py-10 md:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold">10K+</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">1M+</div>
            <div className="text-sm text-muted-foreground">Conversations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">4.9/5</div>
            <div className="text-sm text-muted-foreground">User Rating</div>
          </div>
        </section>

        <section id="features" className="py-16">
          <div className="mb-8 flex items-center justify-center">
            <span className="rounded-full border px-3 py-1 text-xs">Features</span>
          </div>
          <h2 className="text-center text-3xl font-semibold">Powerful AI Features</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            Discover what makes Cortexify-AI the most advanced AI conversation platform
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
            <FeatureCard title="Advanced AI Intelligence" desc="Powered by cutting-edge models for intelligent, contextual conversations." icon="🧠" />
            <FeatureCard title="Lightning Fast" desc="Instant responses with real-time typing indicators." icon="⚡" />
            <FeatureCard title="Secure & Private" desc="End-to-end encryption with robust privacy controls." icon="🔒" />
            <FeatureCard title="Multilingual Support" desc="Conversations in multiple languages with natural flow." icon="🌍" />
          </div>
        </section>

        <section id="testimonials" className="py-10">
          <div className="mb-6 flex items-center justify-center">
            <span className="rounded-full border px-3 py-1 text-xs">Testimonials</span>
          </div>
          <h2 className="text-center text-3xl font-semibold">What Our Users Say</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <TestimonialCard name="Sarah Chen" role="Product Manager" quote="Cortexify-AI has revolutionized how our team collaborates. The AI understands context incredibly well." />
            <TestimonialCard name="Michael Rodriguez" role="Software Developer" quote="The response quality is outstanding. It feels like talking to a knowledgeable colleague who's always available." />
            <TestimonialCard name="Emma Thompson" role="Creative Director" quote="From brainstorming to problem-solving, Cortexify-AI helps me think through ideas more effectively." />
          </div>
        </section>

        <section id="cta" className="py-14">
          <div className="rounded-xl bg-secondary/20 px-6 py-10 text-center">
            <h3 className="text-2xl font-semibold">Ready to Experience the Future?</h3>
            <p className="mt-2 text-muted-foreground">
              Join thousands of users who are already having intelligent conversations with Cortexify-AI
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/chat">Start Your Conversation</Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="border-t">
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
                The future of AI conversation. Experience intelligent, contextual, and engaging conversations powered by advanced AI technology from Cortexify-AI.
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
            <span>© 2024 Cortexify-AI. All rights reserved.</span>
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

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-2xl">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function TestimonialCard({ name, role, quote }: { name: string; role: string; quote: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-3 text-yellow-400">★★★★★</div>
      <p className="text-sm text-muted-foreground">“{quote}”</p>
      <div className="mt-4">
        <div className="font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{role}</div>
      </div>
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
