import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  Target,
  Users,
  BarChart3,
  BrainCircuit,
  Shield,
  Sparkles,
  Sun,
  Moon,
  Star,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/ui/Button';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: BrainCircuit,
    title: 'AI-Powered Matching',
    description:
      'Deep-learning algorithms analyse thousands of signals to connect talent with roles that truly fit.',
  },
  {
    icon: Target,
    title: 'Smart Screening',
    description:
      'Automated skill assessments and scoring reduce time-to-hire by 60 % without sacrificing quality.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Real-time shared workspaces let hiring teams evaluate, comment, and decide together — instantly.',
  },
  {
    icon: BarChart3,
    title: 'Pipeline Analytics',
    description:
      'Live dashboards surface bottlenecks, conversion rates, and DEI metrics across every stage.',
  },
  {
    icon: Shield,
    title: 'Bias Reduction',
    description:
      'Built-in fairness checks flag biased language and ensure equitable evaluation criteria.',
  },
  {
    icon: Sparkles,
    title: 'Career Intelligence',
    description:
      'Personalised growth plans, skill-gap analysis, and market benchmarks keep candidates engaged.',
  },
];

const testimonials = [
  {
    quote:
      'SkillSync cut our engineering hiring cycle from 45 days to 12. The AI matching is scarily accurate.',
    name: 'Sarah Chen',
    role: 'VP Engineering, Raycast',
    avatar: 'SC',
  },
  {
    quote:
      'We replaced three separate tools with SkillSync. The collaboration features alone are worth the switch.',
    name: 'Marcus Rivera',
    role: 'Head of Talent, Linear',
    avatar: 'MR',
  },
  {
    quote:
      'The analytics dashboard finally gave us visibility into where diverse candidates drop off — and how to fix it.',
    name: 'Priya Sharma',
    role: 'CHRO, Loom',
    avatar: 'PS',
  },
];

const stats = [
  { value: '10k+', label: 'Companies' },
  { value: '2.4M', label: 'Matches Made' },
  { value: '60%', label: 'Faster Hiring' },
  { value: '98%', label: 'Satisfaction' },
];

const footerLinks = {
  Product: ['Features', 'Pricing', 'Integrations', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Resources: ['Documentation', 'API Reference', 'Community', 'Status'],
  Legal: ['Privacy', 'Terms', 'Security', 'GDPR'],
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.97]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white dark:bg-surface-950">
      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 z-50 w-full border-b border-surface-200/40 bg-white/70 backdrop-blur-2xl dark:border-surface-800/40 dark:bg-surface-950/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">SkillSync</span>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium text-surface-500 md:flex">
            <a href="#features" className="transition-colors hover:text-surface-900 dark:hover:text-white">Features</a>
            <a href="#testimonials" className="transition-colors hover:text-surface-900 dark:hover:text-white">Testimonials</a>
            <a href="#pricing" className="transition-colors hover:text-surface-900 dark:hover:text-white">Pricing</a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800 dark:hover:text-surface-300"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative flex min-h-[100vh] items-center justify-center pt-16"
      >
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary-400/20 via-primary-500/10 to-transparent blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-20 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-primary-600/10 via-violet-500/5 to-transparent blur-3xl"
          />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
            style={{
              backgroundSize: '60px 60px',
              backgroundImage:
                'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            }}
          />
        </div>

        <div className="mx-auto max-w-5xl px-6 text-center">
          {/* Badge */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200/60 bg-primary-50/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700 shadow-sm backdrop-blur dark:border-primary-800/40 dark:bg-primary-900/20 dark:text-primary-300">
              <Sparkles size={12} />
              Now in public beta
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="mt-8 text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl"
          >
            AI-Powered Hiring
            <br />
            <span className="bg-gradient-to-r from-primary-400 via-primary-600 to-violet-600 bg-clip-text text-transparent">
              &amp; Collaboration
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-surface-500 dark:text-surface-400"
          >
            SkillSync uses advanced AI to match talent with opportunity, streamline your
            hiring pipeline, and give every candidate a fair shot — all in one beautiful platform.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link to="/dashboard">
              <Button size="lg" className="gap-2 shadow-lg shadow-primary-500/25">
                Start Free Trial <ArrowRight size={16} />
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="gap-2">
              Book a Demo <ChevronRight size={16} />
            </Button>
          </motion.div>

          {/* Social proof bar */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={4}
            variants={fadeUp}
            className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-surface-400"
          >
            {stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-surface-900 dark:text-white">{s.value}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section id="features" className="relative py-32">
        {/* Subtle separator gradient */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-surface-200 to-transparent dark:via-surface-800" />

        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
            variants={fadeUp}
            className="text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Features
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Everything you need to hire smarter
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-surface-500 dark:text-surface-400">
              A unified platform that replaces your ATS, assessment tools, and analytics suite.
            </p>
          </motion.div>

          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={i}
                variants={fadeUp}
                className="group relative rounded-2xl border border-surface-200/60 bg-white/60 p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/5 dark:border-surface-800/60 dark:bg-surface-900/40 dark:hover:border-primary-800/60"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-primary-500/0 via-primary-500/0 to-violet-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

                <div className="relative">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-sm dark:from-primary-900/30 dark:to-primary-800/20">
                    <feature.icon size={20} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-surface-500 dark:text-surface-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────── */}
      <section id="testimonials" className="relative py-32">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-surface-200 to-transparent dark:via-surface-800" />

        {/* Background accent */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary-500/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
            variants={fadeUp}
            className="text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Testimonials
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Loved by hiring teams everywhere
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={i}
                variants={fadeUp}
                className="relative rounded-2xl border border-surface-200/60 bg-white/70 p-8 backdrop-blur-sm dark:border-surface-800/60 dark:bg-surface-900/50"
              >
                {/* Stars */}
                <div className="mb-4 flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={14} fill="currentColor" />
                  ))}
                </div>

                <p className="text-[15px] leading-relaxed text-surface-600 dark:text-surface-300">
                  "{t.quote}"
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-xs font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
            variants={fadeUp}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-violet-700 px-8 py-16 text-center text-white shadow-2xl shadow-primary-600/20 sm:px-16"
          >
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

            <div className="relative">
              <h2 className="text-3xl font-bold sm:text-4xl">Ready to transform your hiring?</h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-100">
                Join 10,000+ companies that use SkillSync to build world-class teams faster and fairer.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    className="gap-2 border border-white/20 bg-white text-primary-700 shadow-lg hover:bg-primary-50"
                  >
                    Start Free Trial <ArrowRight size={16} />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white/90 hover:bg-white/10 hover:text-white"
                >
                  Talk to Sales
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-surface-200/60 dark:border-surface-800/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700">
                  <Zap size={16} className="text-white" />
                </div>
                <span className="text-lg font-bold">SkillSync</span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-surface-500 dark:text-surface-400">
                AI-powered hiring and collaboration platform.
                Built for teams that value speed and fairness.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-semibold">{title}</h4>
                <ul className="mt-4 space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <span className="cursor-pointer text-sm text-surface-500 transition-colors hover:text-surface-900 dark:text-surface-400 dark:hover:text-white">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-surface-200/60 pt-8 text-xs text-surface-400 dark:border-surface-800/60 sm:flex-row">
            <span>&copy; {new Date().getFullYear()} SkillSync. All rights reserved.</span>
            <div className="flex gap-6">
              <span className="cursor-pointer transition-colors hover:text-surface-600 dark:hover:text-surface-300">Privacy Policy</span>
              <span className="cursor-pointer transition-colors hover:text-surface-600 dark:hover:text-surface-300">Terms of Service</span>
              <span className="cursor-pointer transition-colors hover:text-surface-600 dark:hover:text-surface-300">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
