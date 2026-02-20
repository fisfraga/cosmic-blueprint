import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NotFoundStateProps {
  title?: string;
  description?: string;
  backLink: string;
  backLabel: string;
  icon?: string;
}

export function NotFoundState({
  title = 'Not Found',
  description = "The item you're looking for doesn't exist or may have been moved.",
  backLink,
  backLabel,
  icon = '✦',
}: NotFoundStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-4"
    >
      <div className="max-w-md mx-auto">
        <span className="text-6xl block mb-6 opacity-30">{icon}</span>
        <h1 className="font-serif text-2xl text-white mb-3">{title}</h1>
        <p className="text-neutral-400 mb-8">{description}</p>
        <Link
          to={backLink}
          className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
        >
          <span>←</span>
          {backLabel}
        </Link>
      </div>
    </motion.div>
  );
}

// Empty state for when data exists but is empty (e.g., no results)
interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title = 'No Results',
  description = 'Try adjusting your filters or search criteria.',
  icon = '◇',
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12 px-4"
    >
      <span className="text-4xl block mb-4 opacity-30">{icon}</span>
      <h3 className="font-serif text-lg text-white mb-2">{title}</h3>
      <p className="text-neutral-400 text-sm mb-4">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}

// Profile required state - shown when a page requires a profile
interface ProfileRequiredStateProps {
  title?: string;
  description?: string;
}

export function ProfileRequiredState({
  title = 'Profile Required',
  description = 'Create your cosmic profile to access this feature.',
}: ProfileRequiredStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-4"
    >
      <div className="max-w-md mx-auto">
        <span className="text-6xl block mb-6">✦</span>
        <h2 className="font-serif text-2xl text-white mb-3">{title}</h2>
        <p className="text-neutral-400 mb-8">{description}</p>
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg transition-all"
        >
          <span>✦</span>
          Create Your Profile
        </Link>
      </div>
    </motion.div>
  );
}
