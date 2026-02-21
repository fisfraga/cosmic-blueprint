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
