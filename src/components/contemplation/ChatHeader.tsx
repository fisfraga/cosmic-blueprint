import type { ContemplationCategory } from '../../services/contemplation/context';
import { CATEGORY_INFO } from '../../hooks/useContemplation';

export interface ChatHeaderProps {
  category: ContemplationCategory;
  typeName: string | undefined;
  onExportMarkdown: () => void;
  onExportJson: () => void;
  onCopyMarkdown: () => Promise<void>;
  copySuccess: boolean;
  onResetSession: () => void;
}

export function ChatHeader({
  category,
  typeName,
  onExportMarkdown,
  onExportJson,
  onCopyMarkdown,
  copySuccess,
  onResetSession,
}: ChatHeaderProps) {
  const info = CATEGORY_INFO[category];

  return (
    <div className="flex-shrink-0 h-12 flex items-center justify-between px-4 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm">
      {/* Left: category icon + name + type */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-lg">{info.icon}</span>
        <span className="text-sm font-medium text-white truncate">
          {info.name}
        </span>
        {typeName && (
          <>
            <span className="text-neutral-600">·</span>
            <span className="text-sm text-neutral-400 truncate">{typeName}</span>
          </>
        )}
      </div>

      {/* Right: session control icon buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={onExportMarkdown}
          className="p-2 text-neutral-500 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          title="Export as Markdown"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
        <button
          onClick={onExportJson}
          className="p-2 text-neutral-500 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          title="Export as JSON"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
        </button>
        <button
          onClick={onCopyMarkdown}
          className={`p-2 rounded-lg transition-colors ${
            copySuccess
              ? 'text-green-400 bg-green-500/10'
              : 'text-neutral-500 hover:text-white hover:bg-neutral-800'
          }`}
          title={copySuccess ? 'Copied!' : 'Copy as Markdown'}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        </button>

        <div className="w-px h-5 bg-neutral-700 mx-1" />

        <button
          onClick={onResetSession}
          className="p-2 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-neutral-800 transition-colors"
          title="End Session & Start New"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
