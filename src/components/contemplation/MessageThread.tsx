import type { RefObject } from 'react';
import type { Message } from '../../services/claude';
import type { ContemplationCategory, ContemplationType, FocusEntity } from '../../services/contemplation/context';
import type { EntityInfo } from '../../services/entities';
import { MessageContent } from '../entities';
import { InsightSaveButton } from '../InsightSaveButton';

export interface MessageThreadProps {
  messages: Message[];
  isSending: boolean;
  category: ContemplationCategory | null;
  contemplationType: ContemplationType | null;
  currentSessionId: string | null;
  focusEntity: FocusEntity | null;
  onEntityClick: (entity: EntityInfo) => void;
  messagesEndRef: RefObject<HTMLDivElement>;
}

export function MessageThread({
  messages,
  isSending,
  category,
  contemplationType,
  currentSessionId,
  focusEntity,
  onEntityClick,
  messagesEndRef,
}: MessageThreadProps) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto space-y-4 mb-4 pr-2">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[85%] p-4 rounded-xl relative group ${
              msg.role === 'user'
                ? 'bg-purple-500/20 border border-purple-500/30 text-white'
                : 'bg-neutral-800/50 border border-neutral-700 text-neutral-200'
            }`}
          >
            {msg.role === 'user' ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
            ) : (
              <>
                <MessageContent
                  content={msg.content}
                  onEntityClick={onEntityClick}
                  className="text-sm"
                />
                {/* Save Insight Button - show on hover for completed assistant messages */}
                {msg.content && !isSending && category && contemplationType && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <InsightSaveButton
                      content={msg.content}
                      category={category}
                      contemplationType={contemplationType}
                      sessionId={currentSessionId || undefined}
                      focusEntity={focusEntity?.name}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}
      {isSending && (
        <div className="flex justify-start">
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4">
            <div className="flex items-center gap-2 text-neutral-400">
              <div className="animate-pulse">Contemplating</div>
              <div className="flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
