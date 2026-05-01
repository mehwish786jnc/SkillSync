import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, DollarSign, Bookmark } from 'lucide-react';
import { Card, Button } from '../components/ui';

const jobs = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$180k – $250k',
    posted: '2 hours ago',
    tags: ['React', 'TypeScript', 'GraphQL'],
    match: 95,
  },
  {
    id: 2,
    title: 'Staff Software Engineer',
    company: 'Linear',
    location: 'Remote',
    type: 'Full-time',
    salary: '$200k – $280k',
    posted: '5 hours ago',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    match: 91,
  },
  {
    id: 3,
    title: 'Frontend Lead',
    company: 'Vercel',
    location: 'Remote',
    type: 'Full-time',
    salary: '$190k – $260k',
    posted: '1 day ago',
    tags: ['Next.js', 'TypeScript', 'Tailwind'],
    match: 88,
  },
  {
    id: 4,
    title: 'Senior UI Engineer',
    company: 'Figma',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$175k – $245k',
    posted: '2 days ago',
    tags: ['React', 'WebGL', 'Performance'],
    match: 84,
  },
  {
    id: 5,
    title: 'Principal Engineer',
    company: 'Notion',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$220k – $300k',
    posted: '3 days ago',
    tags: ['Architecture', 'React', 'Rust'],
    match: 79,
  },
];

export default function JobsPage() {
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState<number[]>([]);

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSave = (id: number) => {
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Job Listings</h1>
        <p className="mt-1 text-surface-500 dark:text-surface-400">
          Discover opportunities matched to your skills.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          placeholder="Search jobs, companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-surface-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-surface-700 dark:bg-surface-900"
        />
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {filtered.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card hover className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-surface-200 to-surface-300 dark:from-surface-700 dark:to-surface-800" />
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{job.company}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-surface-500 dark:text-surface-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign size={12} /> {job.salary}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {job.posted}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-surface-100 px-2 py-0.5 text-xs text-surface-600 dark:bg-surface-800 dark:text-surface-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                <div className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  {job.match}% match
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSave(job.id)}
                    className={`rounded-lg p-2 transition-colors ${
                      saved.includes(job.id)
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                    }`}
                  >
                    <Bookmark size={16} fill={saved.includes(job.id) ? 'currentColor' : 'none'} />
                  </button>
                  <Button size="sm">Apply</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
