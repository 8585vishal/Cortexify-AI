"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/ui/navbar";

export default function FeaturesPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <NavBar />

      <main className="mx-auto max-w-7xl px-4">
        <section className="py-12 md:py-20">
          <div className="mb-4 flex items-center justify-center">
            <span className="rounded-full border px-3 py-1 text-xs">Features</span>
          </div>
          <h1 className="text-center text-4xl font-bold leading-tight md:text-5xl">
            Powerful Features for <span className="text-emerald-400">Intelligent Conversations</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Discover the advanced capabilities that make CORTEXIFY the most sophisticated AI conversation platform available today.
          </p>
          <div className="mt-10 flex justify-center">
            <div className="rounded-xl border bg-card p-2 shadow-sm">
              <img src="/assets/image/03.jpg" alt="Features" className="h-auto w-full rounded-lg object-cover" />
            </div>
          </div>
        </section>

        <section className="py-8">
          <h2 className="text-center text-3xl font-semibold">Core Features</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            The foundation of intelligent AI conversations
          </p>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-2xl">🧠</div>
                <div className="text-xl font-semibold">Advanced AI Intelligence</div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Natural conversation flow</li>
                <li>✓ Context awareness</li>
                <li>✓ Multi-step reasoning</li>
                <li>✓ Creative problem solving</li>
              </ul>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-2xl">⚡</div>
                <div className="text-xl font-semibold">Lightning Fast Responses</div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Sub-second response times</li>
                <li>✓ Real-time typing animation</li>
                <li>✓ Optimized performance</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-2xl">💬</div>
                <div className="text-xl font-semibold">Persistent Conversations</div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Session management</li>
                <li>✓ Chat history</li>
                <li>✓ Cross-device sync</li>
                <li>✓ Easy navigation</li>
              </ul>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-2xl">🛡️</div>
                <div className="text-xl font-semibold">Privacy & Security</div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ End-to-end encryption</li>
                <li>✓ Data protection</li>
                <li>✓ Privacy controls</li>
                <li>✓ Secure storage</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-center text-3xl font-semibold">Advanced Capabilities</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            Explore the extended features that make CORTEXIFY even more powerful
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <CapabilityCard title="Multilingual Support" desc="Communicate in 100+ languages with natural flow and cultural understanding." icon="🌐" />
            <CapabilityCard title="Code Generation" desc="Generate, debug, and explain code in multiple languages with detailed explanations." icon="🧩" />
            <CapabilityCard title="Voice Integration" desc="Coming soon: voice-to-text and text-to-voice for hands-free conversations." icon="🎙️" />
            <CapabilityCard title="Image Analysis" desc="Upload images, get descriptions, and ask questions about visual content." icon="🖼️" />
            <CapabilityCard title="Analytics Dashboard" desc="Track conversation patterns, topics, and interaction insights over time." icon="📊" />
            <CapabilityCard title="Team Collaboration" desc="Share conversations with team members and collaborate on AI-assisted projects." icon="👥" />
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-center text-3xl font-semibold">Endless Possibilities</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            Use CORTEXIFY across tasks, roles, and industries
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <UseCaseCard title="Content Creation" desc="Draft blogs, social posts, and marketing copy with your tone." icon="✍️" />
            <UseCaseCard title="Learning & Education" desc="Explain concepts, prepare notes, and practice with quizzes." icon="🎓" />
            <UseCaseCard title="Problem Solving" desc="Break down complex problems and explore solution strategies." icon="🧠" />
            <UseCaseCard title="Research & Analysis" desc="Summarize papers, compare sources, and synthesize insights." icon="🔎" />
            <UseCaseCard title="Coding & Development" desc="Generate code, fix bugs, and review implementations." icon="💻" />
            <UseCaseCard title="Business Strategy" desc="Analyze markets, draft plans, and build presentations." icon="📈" />
          </div>
        </section>

        <section id="cta" className="py-14">
          <div className="rounded-xl bg-secondary/20 px-6 py-10 text-center">
            <h3 className="text-2xl font-semibold">Experience All Features Today</h3>
            <p className="mt-2 text-muted-foreground">
              Start a conversation and explore everything CORTEXIFY can do for you
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/chat">Start Chatting</Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full" asChild>
                <Link href="/about">Learn About Us</Link>
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

function CapabilityCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-2xl">{icon}</div>
      <div className="text-lg font-semibold">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function UseCaseCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
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