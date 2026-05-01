import { motion } from 'framer-motion';
import {
  Briefcase,
  Users,
  MessageCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card } from '../components/ui';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const stats = [
  {
    label: 'Applied Jobs',
    value: '47',
    change: '+12',
    changeLabel: 'this month',
    trend: 'up' as const,
    icon: Briefcase,
    color: 'primary',
  },
  {
    label: 'Matches',
    value: '128',
    change: '+24',
    changeLabel: 'new matches',
    trend: 'up' as const,
    icon: Sparkles,
    color: 'violet',
  },
  {
    label: 'Messages',
    value: '36',
    change: '+8',
    changeLabel: 'unread',
    trend: 'up' as const,
    icon: MessageCircle,
    color: 'emerald',
  },
  {
    label: 'Profile Views',
    value: '2,847',
    change: '+18%',
    changeLabel: 'vs last month',
    trend: 'up' as const,
    icon: Eye,
    color: 'amber',
  },
];

const applicationTrend = [
  { month: 'Jan', applications: 12, interviews: 4 },
  { month: 'Feb', applications: 18, interviews: 7 },
  { month: 'Mar', applications: 15, interviews: 5 },
  { month: 'Apr', applications: 25, interviews: 11 },
  { month: 'May', applications: 22, interviews: 9 },
  { month: 'Jun', applications: 30, interviews: 14 },
  { month: 'Jul', applications: 28, interviews: 12 },
  { month: 'Aug', applications: 35, interviews: 18 },
];

const weeklyActivity = [
  { day: 'Mon', count: 8 },
  { day: 'Tue', count: 12 },
  { day: 'Wed', count: 6 },
  { day: 'Thu', count: 15 },
  { day: 'Fri', count: 10 },
  { day: 'Sat', count: 4 },
  { day: 'Sun', count: 2 },
];

const pipelineData = [
  { name: 'Applied', value: 47, color: '#818cf8' },
  { name: 'Screening', value: 18, color: '#6366f1' },
  { name: 'Interview', value: 12, color: '#4f46e5' },
  { name: 'Offer', value: 3, color: '#4338ca' },
];

const recentApplications = [
  {
    company: 'Stripe',
    role: 'Senior Frontend Engineer',
    status: 'interview',
    date: '2 hours ago',
    logo: 'S',
  },
  {
    company: 'Linear',
    role: 'Staff Software Engineer',
    status: 'screening',
    date: '1 day ago',
    logo: 'L',
  },
  {
    company: 'Vercel',
    role: 'Frontend Lead',
    status: 'applied',
    date: '2 days ago',
    logo: 'V',
  },
  {
    company: 'Figma',
    role: 'Senior UI Engineer',
    status: 'rejected',
    date: '4 days ago',
    logo: 'F',
  },
  {
    company: 'Notion',
    role: 'Principal Engineer',
    status: 'offer',
    date: '5 days ago',
    logo: 'N',
  },
];

const topMatches = [
  { company: 'Raycast', role: 'Senior Frontend Engineer', match: 97, logo: 'R' },
  { company: 'Resend', role: 'Full Stack Engineer', match: 94, logo: 'Re' },
  { company: 'Cal.com', role: 'Staff Engineer', match: 91, logo: 'C' },
];

const recentMessages = [
  { from: 'Sarah Chen', company: 'Stripe', preview: "Hi Alex! We'd love to schedule a...", time: '10m ago', unread: true },
  { from: 'James Park', company: 'Linear', preview: 'Thanks for completing the assessment...', time: '2h ago', unread: true },
  { from: 'Emily Zhao', company: 'Vercel', preview: 'Your application has been reviewed...', time: '1d ago', unread: false },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle2; className: string }> = {
  applied: { label: 'Applied', icon: Clock, className: 'text-surface-500 bg-surface-100 dark:bg-surface-800' },
  screening: { label: 'Screening', icon: Eye, className: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400' },
  interview: { label: 'Interview', icon: Users, className: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400' },
  offer: { label: 'Offer', icon: CheckCircle2, className: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' },
  rejected: { label: 'Rejected', icon: XCircle, className: 'text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400' },
};

const iconBg: Record<string, string> = {
  primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
};

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.06 },
});

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-surface-500 dark:text-surface-400">
            Welcome back, Alex. Here's your hiring pipeline at a glance.
          </p>
        </div>
        <p className="text-xs text-surface-400">Last updated: just now</p>
      </div>

      {/* ── Stat Cards ────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} {...fadeUp(i)}>
            <Card hover className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-surface-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold tracking-tight">{stat.value}</p>
                </div>
                <div className={`rounded-xl p-2.5 ${iconBg[stat.color]}`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                {stat.trend === 'up' ? (
                  <ArrowUpRight size={14} className="text-emerald-500" />
                ) : (
                  <ArrowDownRight size={14} className="text-red-500" />
                )}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stat.change}</span>
                <span className="text-surface-400">{stat.changeLabel}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Charts Row ────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Area chart - Application Trend */}
        <motion.div className="lg:col-span-2" {...fadeUp(4)}>
          <Card>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">Application Trend</h2>
                <p className="mt-0.5 text-xs text-surface-400">Applications &amp; interviews over time</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary-500" /> Applications
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Interviews
                </span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={applicationTrend}>
                  <defs>
                    <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="intGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.06} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.3} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.3} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-surface-900)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="applications" stroke="#6366f1" strokeWidth={2} fill="url(#appGrad)" />
                  <Area type="monotone" dataKey="interviews" stroke="#10b981" strokeWidth={2} fill="url(#intGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Pie - Pipeline Breakdown */}
        <motion.div {...fadeUp(5)}>
          <Card className="flex h-full flex-col">
            <h2 className="text-base font-semibold">Pipeline Breakdown</h2>
            <p className="mt-0.5 text-xs text-surface-400">Current application stages</p>
            <div className="flex flex-1 items-center justify-center py-4">
              <div className="h-48 w-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pipelineData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {pipelineData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-surface-900)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {pipelineData.map((p) => (
                <div key={p.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-surface-500 dark:text-surface-400">{p.name}</span>
                  <span className="ml-auto font-semibold">{p.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ── Middle Row ────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Applications */}
        <motion.div className="lg:col-span-2" {...fadeUp(6)}>
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">Recent Applications</h2>
              <button className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                View all <ChevronRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-surface-100 dark:divide-surface-800">
              {recentApplications.map((app) => {
                const status = statusConfig[app.status];
                const StatusIcon = status.icon;
                return (
                  <div key={app.company + app.role} className="flex items-center gap-4 py-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-surface-100 to-surface-200 text-sm font-bold text-surface-600 dark:from-surface-800 dark:to-surface-700 dark:text-surface-300">
                      {app.logo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{app.role}</p>
                      <p className="text-xs text-surface-400">{app.company}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
                      <StatusIcon size={12} />
                      {status.label}
                    </span>
                    <span className="hidden text-xs text-surface-400 sm:block">{app.date}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div {...fadeUp(7)}>
          <Card className="flex h-full flex-col">
            <h2 className="text-base font-semibold">Weekly Activity</h2>
            <p className="mt-0.5 text-xs text-surface-400">Actions taken per day</p>
            <div className="mt-4 flex-1">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weeklyActivity} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.06} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="currentColor" opacity={0.3} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} stroke="currentColor" opacity={0.3} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-surface-900)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ── Bottom Row ────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Matches */}
        <motion.div {...fadeUp(8)}>
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">Top Matches</h2>
                <p className="mt-0.5 text-xs text-surface-400">AI-recommended roles for you</p>
              </div>
              <button className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                See all <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {topMatches.map((m) => (
                <div
                  key={m.company}
                  className="flex items-center gap-4 rounded-xl border border-surface-100 p-3.5 transition-colors hover:border-primary-200 hover:bg-primary-50/30 dark:border-surface-800 dark:hover:border-primary-800/40 dark:hover:bg-primary-900/10"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 text-sm font-bold text-primary-700 dark:from-primary-900/40 dark:to-primary-800/30 dark:text-primary-300">
                    {m.logo}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{m.role}</p>
                    <p className="text-xs text-surface-400">{m.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-surface-100 dark:bg-surface-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${m.match}%` }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
                      />
                    </div>
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                      {m.match}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Messages */}
        <motion.div {...fadeUp(9)}>
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">Recent Messages</h2>
                <p className="mt-0.5 text-xs text-surface-400">From recruiters &amp; hiring managers</p>
              </div>
              <button className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                Open inbox <ChevronRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-surface-100 dark:divide-surface-800">
              {recentMessages.map((msg) => (
                <div key={msg.from} className="flex items-start gap-3.5 py-3.5">
                  <div className="relative mt-0.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-surface-200 to-surface-300 text-xs font-bold text-surface-600 dark:from-surface-700 dark:to-surface-600 dark:text-surface-300">
                      {msg.from.split(' ').map((n) => n[0]).join('')}
                    </div>
                    {msg.unread && (
                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-primary-500 dark:border-surface-900" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{msg.from}</p>
                      <span className="text-[10px] text-surface-400">{msg.time}</span>
                    </div>
                    <p className="text-xs text-surface-400">{msg.company}</p>
                    <p className="mt-1 truncate text-xs text-surface-500 dark:text-surface-400">{msg.preview}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ── Skill Score Row ───────────────────────────────────────── */}
      <motion.div {...fadeUp(10)}>
        <Card>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex items-center gap-5">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-[3px] border-primary-200 dark:border-primary-800/40">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">87</span>
                <svg className="absolute inset-0" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="46"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-primary-500"
                    strokeDasharray={`${87 * 2.89} ${(100 - 87) * 2.89}`}
                    strokeDashoffset="72"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold">Skill Score</h2>
                <p className="text-xs text-surface-400">Top 15% in your field</p>
              </div>
            </div>
            <div className="flex-1 space-y-3 lg:ml-8">
              {[
                { skill: 'React & TypeScript', level: 95 },
                { skill: 'System Design', level: 82 },
                { skill: 'Backend / Node.js', level: 76 },
                { skill: 'DevOps & CI/CD', level: 64 },
              ].map((s) => (
                <div key={s.skill}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{s.skill}</span>
                    <span className="text-surface-400">{s.level}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-100 dark:bg-surface-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.level}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden items-center gap-2 text-xs lg:flex">
              <TrendingUp size={14} className="text-emerald-500" />
              <span className="text-surface-500">+4 pts this month</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
