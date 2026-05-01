import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, LinkIcon, Mail } from 'lucide-react';
import { Card, Button, Input } from '../components/ui';

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-1 text-surface-500 dark:text-surface-400">
          Manage your personal information and preferences.
        </p>
      </div>

      {/* Profile Header */}
      <Card>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600" />
            <button className="absolute bottom-0 right-0 rounded-full bg-white p-1.5 shadow-md dark:bg-surface-800">
              <Camera size={14} className="text-surface-600 dark:text-surface-300" />
            </button>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold">Alex Johnson</h2>
            <p className="text-surface-500 dark:text-surface-400">Senior Frontend Engineer</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-surface-500 dark:text-surface-400 sm:justify-start">
              <span className="flex items-center gap-1">
                <MapPin size={14} /> San Francisco, CA
              </span>
              <span className="flex items-center gap-1">
                <LinkIcon size={14} /> alexjohnson.dev
              </span>
              <span className="flex items-center gap-1">
                <Mail size={14} /> alex@email.com
              </span>
            </div>
          </div>
          <Button
            variant={editing ? 'primary' : 'secondary'}
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Save' : 'Edit'}
          </Button>
        </div>
      </Card>

      {/* Personal Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="First Name" defaultValue="Alex" disabled={!editing} />
            <Input label="Last Name" defaultValue="Johnson" disabled={!editing} />
            <Input label="Email" type="email" defaultValue="alex@email.com" disabled={!editing} />
            <Input label="Phone" defaultValue="+1 (555) 123-4567" disabled={!editing} />
            <div className="sm:col-span-2">
              <Input label="Location" defaultValue="San Francisco, CA" disabled={!editing} />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <h3 className="text-lg font-semibold">Skills</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Node.js', 'Python', 'System Design', 'GraphQL', 'AWS', 'Docker'].map(
              (skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </Card>
      </motion.div>

      {/* Experience */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <h3 className="text-lg font-semibold">Experience</h3>
          <div className="mt-4 space-y-6">
            {[
              { role: 'Senior Frontend Engineer', company: 'TechCorp', period: '2023 – Present' },
              { role: 'Frontend Engineer', company: 'StartupXYZ', period: '2021 – 2023' },
              { role: 'Junior Developer', company: 'WebAgency', period: '2019 – 2021' },
            ].map((exp) => (
              <div key={exp.role} className="flex gap-4">
                <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-primary-500" />
                <div>
                  <p className="font-medium">{exp.role}</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    {exp.company} · {exp.period}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
