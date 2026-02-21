import type { RefObject } from 'react';

export interface InputBarProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isSending: boolean;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: RefObject<HTMLTextAreaElement>;
  // Session controls
  onExportMarkdown: () => void;
  onExportJson: () => void;
  onCopyMarkdown: () => Promise<void>;
  copySuccess: boolean;
  onResetSession: () => void;
}

export function InputBar({
  inputValue,
  setInputValue,
  isSending,
  onSend,
  onKeyDown,
  inputRef,
  onExportMarkdown,
  onExportJson,
  onCopyMarkdown,
  copySuccess,
  onResetSession,
}: InputBarProps) {
  return (
    <>
      {/* Input */}
      <div className="flex gap-2">
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Share your thoughts or ask a question..."
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl p-4 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 resize-none"
          rows={2}
          disabled={isSending}
        />
        <button
          onClick={onSend}
          disabled={!inputValue.trim() || isSending}
          className="px-6 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>

      {/* Session Controls */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          onClick={onExportMarkdown}
          className="text-neutral-500 hover:text-white text-sm transition-colors flex items-center gap-1"
          title="Export as Markdown file"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Markdown
        </button>
        <button
          onClick={onExportJson}
          className="text-neutral-500 hover:text-white text-sm transition-colors flex items-center gap-1"
          title="Export as JSON"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export JSON
        </button>
        <button
          onClick={onCopyMarkdown}
          className={`text-sm transition-colors flex items-center gap-1 ${
            copySuccess ? 'text-green-400' : 'text-neutral-500 hover:text-white'
          }`}
          title="Copy as Markdown"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          {copySuccess ? 'Copied!' : 'Copy Markdown'}
        </button>
        <span className="text-neutral-700">|</span>
        <button
          onClick={onResetSession}
          className="text-neutral-500 hover:text-white text-sm transition-colors"
        >
          End Session & Start New
        </button>
      </div>
    </>
  );
}
