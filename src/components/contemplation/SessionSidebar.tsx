import { motion } from 'framer-motion';
import type { SavedSession } from '../../services/sessions';
import { CONTEMPLATION_TYPES, CATEGORY_INFO } from '../../hooks/useContemplation';

export interface SessionSidebarProps {
  savedSessions: SavedSession[];
  onResumeSession: (session: SavedSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onBack: () => void;
}

export function SessionSidebar({
  savedSessions,
  onResumeSession,
  onDeleteSession,
  onBack,
}: SessionSidebarProps) {
  return (
    <motion.div
      key="saved-sessions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <button
        onClick={onBack}
        className="mb-4 text-theme-text-secondary hover:text-theme-text-primary text-sm flex items-center gap-1"
      >
        ← Start new session
      </button>

      <h3 className="font-serif text-xl text-theme-text-primary mb-4">Saved Sessions</h3>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {savedSessions.map((session) => {
          const typeOption = CONTEMPLATION_TYPES[session.category]?.find(
            t => t.id === session.contemplationType
          );
          const categoryInfo = CATEGORY_INFO[session.category];
          const lastMessage = session.messages[session.messages.length - 1];
          const previewText = lastMessage?.content.slice(0, 100) + (lastMessage?.content.length > 100 ? '...' : '');
          const updatedDate = new Date(session.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          });

          return (
            <div
              key={session.id}
              className={`p-4 rounded-xl bg-gradient-to-br ${categoryInfo.color} border transition-all`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{categoryInfo.icon}</span>
                    <span className="font-medium text-white">{typeOption?.name || session.contemplationType}</span>
                  </div>
                  {session.focusEntity && (
                    <p className="text-theme-text-secondary text-sm mb-1">{session.focusEntity.name}</p>
                  )}
                  <p className="text-theme-text-tertiary text-xs mb-2">{updatedDate} · {session.messages.length} messages</p>
                  {previewText && (
                    <p className="text-theme-text-secondary text-sm line-clamp-2">{previewText}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onResumeSession(session)}
                    className="px-3 py-1.5 bg-surface-overlay/50 hover:bg-surface-overlay text-theme-text-primary text-sm rounded-lg transition-colors"
                  >
                    Resume
                  </button>
                  <button
                    onClick={() => onDeleteSession(session.id)}
                    className="px-3 py-1.5 text-theme-text-tertiary hover:text-red-400 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {savedSessions.length === 0 && (
        <p className="text-theme-text-tertiary text-center py-8">No saved sessions yet</p>
      )}
    </motion.div>
  );
}
