import type { RefObject } from 'react';

export interface InputBarProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isSending: boolean;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: RefObject<HTMLTextAreaElement>;
}

export function InputBar({
  inputValue,
  setInputValue,
  isSending,
  onSend,
  onKeyDown,
  inputRef,
}: InputBarProps) {
  return (
    <div className="flex-shrink-0 flex gap-2">
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
  );
}
