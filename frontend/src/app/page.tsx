'use client';

import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle,
  Zap,
  BarChart3,
  Shield,
  Users,
  ChevronRight,
  Star,
  Menu,
  X,
  MousePointerClick,
  SlidersHorizontal,
  Webhook,
  Brain,
  Globe,
  Lock,
} from 'lucide-react';
import { useState, useEffect } from 'react';

/* ─── tiny inline components so the file is self-contained ─── */
function Button({ children, className = '', variant = 'primary', size = 'md', asChild, ...props }) {
  const base = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50';
  const sizes = { sm: 'h-9 px-4 text-sm', md: 'h-11 px-5 text-sm', lg: 'h-12 px-7 text-base' };
  const variants = {
    primary:
      'bg-white text-slate-900 hover:bg-slate-100 shadow-lg shadow-white/10',
    outline:
      'border border-white/20 text-white hover:bg-white/8 backdrop-blur-sm',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/6',
    gradient:
      'bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:opacity-90',
  };
  const cls = `${base} ${sizes[size] ?? sizes.md} ${variants[variant] ?? ''} ${className}`;

  if (asChild && children) {
    const child = children;
    if (child?.type === Link || child?.type === 'a') {
      return <child.type {...child.props} className={`${cls} ${child.props?.className ?? ''}`} />;
    }
  }
  return <button className={cls} {...props}>{children}</button>;
}

const STATS = [
  { value: '50K+', label: 'Forms created' },
  { value: '4.2M', label: 'Responses collected' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '180+', label: 'Countries served' },
];

const FEATURES = [
  {
    icon: MousePointerClick,
    color: 'indigo',
    title: 'Drag & Drop Builder',
    desc: 'Compose forms visually with a pixel-perfect builder. Add, reorder, and configure fields without writing a single line of code.',
  },
  {
    icon: Zap,
    color: 'amber',
    title: 'Smart Conditional Logic',
    desc: 'Show or hide fields based on user answers. Chain conditions, set dependencies, and craft adaptive experiences automatically.',
  },
  {
    icon: BarChart3,
    color: 'emerald',
    title: 'Real-time Analytics',
    desc: 'Track submissions, drop-off rates, and completion funnels live. AI surfaces the insights you actually need.',
  },
  {
    icon: Shield,
    color: 'rose',
    title: 'Enterprise Security',
    desc: 'AES-256 encryption at rest, SOC 2 Type II certified, GDPR-ready with data residency controls and audit logs.',
  },
  {
    icon: Webhook,
    color: 'cyan',
    title: 'One-click Integrations',
    desc: 'Push data to Slack, HubSpot, Salesforce, Notion, and 2,000+ apps via native integrations or open webhooks.',
  },
  {
    icon: Brain,
    color: 'violet',
    title: 'AI-Powered Insights',
    desc: 'Let AI summarise open-ended answers, detect sentiment, flag anomalies, and recommend form improvements automatically.',
  },
];

const COLOR_MAP = {
  indigo: { bg: 'bg-indigo-500/10', icon: 'text-indigo-400', ring: 'ring-indigo-500/20' },
  amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', ring: 'ring-amber-500/20' },
  emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', ring: 'ring-emerald-500/20' },
  rose: { bg: 'bg-rose-500/10', icon: 'text-rose-400', ring: 'ring-rose-500/20' },
  cyan: { bg: 'bg-cyan-500/10', icon: 'text-cyan-400', ring: 'ring-cyan-500/20' },
  violet: { bg: 'bg-violet-500/10', icon: 'text-violet-400', ring: 'ring-violet-500/20' },
};

const TESTIMONIALS = [
  {
    quote: 'Switched from Typeform and never looked back. The conditional logic alone saved us 40 hours of manual follow-up every month.',
    name: 'Sarah Chen',
    role: 'Head of Operations, Lattice',
    avatar: 'SC',
    stars: 5,
  },
  {
    quote: 'The analytics dashboard finally gives our growth team the drop-off data they need. Setup took 20 minutes, not 20 days.',
    name: 'Marcus Webb',
    role: 'Growth Lead, Notion',
    avatar: 'MW',
    stars: 5,
  },
  {
    quote: "Our NPS surveys went from 12% to 38% completion rate after switching. The form experience is genuinely beautiful.",
    name: 'Priya Kapoor',
    role: 'CX Director, Brex',
    avatar: 'PK',
    stars: 5,
  },
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'For individuals getting started.',
    features: ['3 active forms', '100 responses / mo', 'Basic analytics', 'Email support'],
    cta: 'Get started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    desc: 'For growing teams that need more.',
    features: ['Unlimited forms', '10,000 responses / mo', 'Advanced analytics', 'Integrations', 'Priority support'],
    cta: 'Start free trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact sales',
    desc: 'For large orgs with complex needs.',
    features: ['Unlimited everything', 'SSO & SAML', 'SLA guarantee', 'Custom data residency', 'Dedicated CSM'],
    cta: 'Contact sales',
    highlight: false,
  },
];

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Docs', href: '#' },
];

/* ─────────────────────────── PAGE ─────────────────────────── */
export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#070B14] text-white antialiased selection:bg-indigo-500/40">
      {/* ── Ambient background ─────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute top-1/3 -right-60 h-[500px] w-[500px] rounded-full bg-violet-600/8 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-purple-600/6 blur-[100px]" />
      </div>

      {/* ── Navigation ─────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#070B14]/80 backdrop-blur-xl border-b border-white/6' : ''
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-[15px] font-bold tracking-tight">FormCraft</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="px-3 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-150">
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link
              href="/forms/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors shadow-lg shadow-white/10"
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/6 transition-all"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/6 bg-[#070B14]/95 backdrop-blur-xl px-6 pb-6 pt-4">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="block py-3 text-slate-300 hover:text-white border-b border-white/6" onClick={() => setMobileOpen(false)}>
                {l.label}
              </a>
            ))}
            <Link href="/forms/new" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-slate-900">
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </header>

      <div className="relative z-10">
        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-16">
          <div className="mx-auto max-w-5xl w-full text-center">

            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-1.5 text-[13px] text-slate-400 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Now with real-time analytics &amp; AI insights
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-7xl font-bold tracking-[-0.03em] leading-[1.06]">
              <span className="text-white">Forms that</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
                actually convert
              </span>
            </h1>

            <p className="mt-6 max-w-xl mx-auto text-lg text-slate-400 leading-relaxed">
              Build sophisticated forms with conditional logic, live analytics, and beautiful UX —
              without touching code. Deploy in minutes.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/forms/new"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-7 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-indigo-500/30 hover:opacity-90 transition-opacity"
              >
                Start building — it&apos;s free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-white/12 px-7 py-3.5 text-[15px] font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all backdrop-blur-sm"
              >
                See how it works
              </a>
            </div>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap justify-center items-center gap-6 text-sm text-slate-500">
              {['No credit card required', 'Free forever plan', 'Setup in minutes'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  {t}
                </span>
              ))}
            </div>

            {/* Hero preview card */}
            <div className="mt-16 mx-auto max-w-3xl rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-1 shadow-2xl shadow-black/40">
              <div className="rounded-xl bg-[#0D1525] overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 border-b border-white/6 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-rose-500/60" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/60" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/60" />
                  <div className="ml-4 flex-1 rounded-md bg-white/5 px-3 py-1 text-left text-xs text-slate-500">
                    formcraft.io/forms/customer-onboarding
                  </div>
                </div>
                {/* Mock form UI */}
                <div className="p-8 text-left">
                  <p className="mb-1 text-xs font-medium text-indigo-400 uppercase tracking-wider">Step 2 of 4</p>
                  <h3 className="text-lg font-semibold text-white mb-5">Tell us about your company</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1.5">Company name</label>
                      <div className="rounded-lg border border-white/10 bg-white/4 px-3 py-2.5 text-sm text-white">Acme Corp</div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1.5">Team size</label>
                      <div className="rounded-lg border border-indigo-500/50 bg-indigo-500/8 px-3 py-2.5 text-sm text-indigo-300 flex items-center justify-between">
                        51–200 employees <ChevronRight className="h-3.5 w-3.5 rotate-90" />
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-xs text-slate-500 mb-1.5">What&apos;s your main use case?</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Customer research', 'Lead capture', 'Employee surveys'].map((opt, i) => (
                        <div key={opt} className={`rounded-lg border px-3 py-2 text-xs text-center cursor-pointer transition-all ${i === 0 ? 'border-indigo-500/60 bg-indigo-500/10 text-indigo-300' : 'border-white/8 text-slate-400 hover:border-white/20'}`}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <button className="text-sm text-slate-500 hover:text-white transition-colors">← Back</button>
                    <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 cursor-pointer">
                      Continue <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats strip ────────────────────────────────────── */}
        <section className="border-y border-white/6 py-12 px-6">
          <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
                <p className="mt-1 text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ───────────────────────────────────────── */}
        <section id="features" className="py-28 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">Features</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Everything to build better forms
              </h2>
              <p className="mt-4 text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
                Powerful primitives that let you design, analyze, and optimize your forms end-to-end.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map(({ icon: Icon, color, title, desc }) => {
                const c = COLOR_MAP[color];
                return (
                  <div
                    key={title}
                    className="group relative rounded-2xl border border-white/6 bg-white/2 p-6 hover:bg-white/4 hover:border-white/10 transition-all duration-200"
                  >
                    <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${c.bg} ${c.ring}`}>
                      <Icon className={`h-5 w-5 ${c.icon}`} />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Testimonials ───────────────────────────────────── */}
        <section id="testimonials" className="py-28 px-6 border-t border-white/6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">Testimonials</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Loved by teams that care about conversion
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {TESTIMONIALS.map(({ quote, name, role, avatar, stars }) => (
                <div key={name} className="rounded-2xl border border-white/6 bg-white/2 p-6 flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: stars }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed flex-1">&ldquo;{quote}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/15 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
                      {avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{name}</p>
                      <p className="text-xs text-slate-500">{role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ────────────────────────────────────────── */}
        <section id="pricing" className="py-28 px-6 border-t border-white/6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">Pricing</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Simple, transparent pricing</h2>
              <p className="mt-4 text-slate-400 max-w-md mx-auto">Start free. Scale when you need to. No surprises.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {PLANS.map(({ name, price, period, desc, features, cta, highlight }) => (
                <div
                  key={name}
                  className={`relative rounded-2xl p-6 flex flex-col ${
                    highlight
                      ? 'bg-gradient-to-b from-indigo-600/20 to-violet-600/10 border border-indigo-500/30'
                      : 'border border-white/6 bg-white/2'
                  }`}
                >
                  {highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-3 py-0.5 text-[11px] font-semibold text-white">
                      Most popular
                    </div>
                  )}
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">{price}</span>
                      <span className="text-sm text-slate-400">/ {period}</span>
                    </div>
                    <p className="mt-1.5 text-sm text-slate-500">{desc}</p>
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={name === 'Enterprise' ? '/contact' : '/forms/new'}
                    className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                      highlight
                        ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:opacity-90'
                        : 'border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {cta} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ──────────────────────────────────────── */}
        <section className="py-28 px-6 border-t border-white/6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              Ready to build your{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                first form?
              </span>
            </h2>
            <p className="mt-5 text-lg text-slate-400">
              Join 50,000+ teams using FormCraft to collect better data, faster.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/forms/new"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-8 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-indigo-500/30 hover:opacity-90 transition-opacity"
              >
                Get started — free forever
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/12 px-8 py-3.5 text-[15px] font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all"
              >
                Talk to sales
              </Link>
            </div>
            <p className="mt-5 text-sm text-slate-600">No credit card required · Cancel anytime</p>
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────────── */}
        <footer className="border-t border-white/6 py-14 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
              {/* Brand */}
              <div className="col-span-2">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="font-bold">FormCraft</span>
                </div>
                <p className="text-sm text-slate-500 max-w-[220px] leading-relaxed">
                  The modern form builder for teams that care about conversion.
                </p>
              </div>

              {/* Links */}
              {[
                { heading: 'Product', links: ['Features', 'Integrations', 'Pricing', 'Changelog'] },
                { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
                { heading: 'Legal', links: ['Privacy', 'Terms', 'Security', 'GDPR'] },
              ].map(({ heading, links }) => (
                <div key={heading}>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">{heading}</p>
                  <ul className="space-y-2">
                    {links.map((l) => (
                      <li key={l}>
                        <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
              <p>&copy; {new Date().getFullYear()} FormCraft. All rights reserved.</p>
              <div className="flex items-center gap-1 text-slate-600">
                <Globe className="h-3.5 w-3.5" />
                <span>English (US)</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
