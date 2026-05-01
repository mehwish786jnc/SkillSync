import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold text-surface-200 dark:text-surface-800">404</h1>
        <p className="mt-4 text-lg text-surface-600 dark:text-surface-400">Page not found</p>
        <div className="mt-6">
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
