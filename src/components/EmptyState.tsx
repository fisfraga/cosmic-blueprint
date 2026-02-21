import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─── Types ───────────────────────────────────────────────────────────────────

type EmptyStateAction =
  | { label: string; onClick: () => void }
  | { label: string; to: string };

export interface EmptyStateProps {
  /** Optional icon or illustration displayed above the title */
  icon?: ReactNode;
  /** Main message (e.g., "No insights yet") */
  title: string;
  /** Optional supporting text below the title */
  description?: string;
  /** Optional CTA — either a click handler or a React Router link */
  action?: EmptyStateAction;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isLinkAction(
  action: EmptyStateAction,
): action is { label: string; to: string } {
  return 'to' in action;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-md"
    >
      <div className="rounded-2xl border border-theme-border-subtle bg-gradient-to-br from-purple-950/40 via-surface-base/60 to-amber-950/30 p-10 text-center shadow-xl">
        {icon != null && (
          <div className="mb-4 text-5xl" aria-hidden="true">
            {icon}
          </div>
        )}

        <h2 className="mb-2 text-xl font-semibold text-theme-text-primary">{title}</h2>

        {description && (
          <p className="mb-6 text-sm leading-relaxed text-theme-text-secondary">
            {description}
          </p>
        )}

        {action && (
          isLinkAction(action) ? (
            <Link
              to={action.to}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-opacity hover:opacity-90"
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-opacity hover:opacity-90"
            >
              {action.label}
            </button>
          )
        )}
      </div>
    </motion.div>
  );
}
