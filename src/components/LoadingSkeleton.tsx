import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  variant?: 'page' | 'cards' | 'detail' | 'profile';
  count?: number;
}

export function LoadingSkeleton({ variant = 'page', count = 6 }: LoadingSkeletonProps) {
  if (variant === 'cards') {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} delay={i * 0.1} />
        ))}
      </div>
    );
  }

  if (variant === 'detail') {
    return (
      <div className="space-y-8 max-w-4xl mx-auto animate-pulse">
        {/* Header skeleton */}
        <div className="text-center py-10 rounded-2xl bg-neutral-800/30 border border-neutral-800">
          <div className="w-16 h-16 bg-neutral-700 rounded-full mx-auto mb-4" />
          <div className="h-8 bg-neutral-700 rounded w-48 mx-auto mb-2" />
          <div className="h-4 bg-neutral-700/50 rounded w-32 mx-auto" />
        </div>

        {/* Content sections */}
        <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <div className="h-6 bg-neutral-700 rounded w-32 mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-neutral-700/50 rounded w-full" />
            <div className="h-4 bg-neutral-700/50 rounded w-3/4" />
          </div>
        </div>

        <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <div className="h-6 bg-neutral-700 rounded w-40 mb-4" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-neutral-700/30 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'profile') {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Profile header */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-neutral-700 rounded-full" />
          <div>
            <div className="h-6 bg-neutral-700 rounded w-40 mb-2" />
            <div className="h-4 bg-neutral-700/50 rounded w-24" />
          </div>
        </div>

        {/* Content grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="bg-neutral-900/50 rounded-xl p-5 border border-neutral-800">
              <div className="h-4 bg-neutral-700 rounded w-20 mb-3" />
              <div className="h-6 bg-neutral-700/50 rounded w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default page skeleton
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-neutral-700 rounded" />
          <div className="h-8 bg-neutral-700 rounded w-48" />
        </div>
        <div className="h-4 bg-neutral-700/50 rounded w-96 max-w-full" />
      </div>

      {/* Filter bar */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 bg-neutral-800 rounded-lg w-24" />
        ))}
      </div>

      {/* Content grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} delay={i * 0.1} />
        ))}
      </div>
    </div>
  );
}

function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="bg-neutral-900/50 rounded-xl p-5 border border-neutral-800"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 bg-neutral-700 rounded-full" />
        <div className="w-16 h-6 bg-neutral-700/50 rounded" />
      </div>
      <div className="h-5 bg-neutral-700 rounded w-3/4 mb-2" />
      <div className="space-y-1">
        <div className="h-3 bg-neutral-700/50 rounded w-full" />
        <div className="h-3 bg-neutral-700/50 rounded w-2/3" />
      </div>
    </motion.div>
  );
}

// Inline loading spinner for buttons/small areas
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} text-neutral-400`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
