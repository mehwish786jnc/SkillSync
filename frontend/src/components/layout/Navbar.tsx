import { useState } from 'react';
import { Sun, Moon, Bell, Menu, Search, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onMenuToggle?: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-200 bg-white/80 px-4 backdrop-blur-xl dark:border-surface-800 dark:bg-surface-950/80 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="hidden md:block">
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.div
                key="input"
                initial={{ width: 180, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 180, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs, people, messages…"
                  className="w-full rounded-lg border border-surface-200 bg-surface-50 py-2 pl-9 pr-9 text-sm outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 dark:border-surface-700 dark:bg-surface-900"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-400 transition-colors hover:border-surface-300 hover:text-surface-500 dark:border-surface-700 dark:bg-surface-900 dark:hover:border-surface-600"
              >
                <Search size={15} />
                <span>Search…</span>
                <kbd className="ml-4 rounded bg-surface-200 px-1.5 py-0.5 text-[10px] font-medium text-surface-500 dark:bg-surface-700 dark:text-surface-400">⌘K</kbd>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-surface-800 dark:hover:text-surface-300"
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </motion.div>
        </button>
        <button className="relative rounded-lg p-2 text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-surface-800 dark:hover:text-surface-300">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            3
          </span>
        </button>
        <div className="ml-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-100 dark:hover:bg-surface-800">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 ring-2 ring-white dark:ring-surface-900" />
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-none">Alex Johnson</p>
            <p className="mt-0.5 text-xs text-surface-400">alex@company.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
