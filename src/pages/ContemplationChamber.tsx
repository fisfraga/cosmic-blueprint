import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSkeleton, ProfileRequiredState } from '../components';
import { EntityDetailPanel, EntityStack } from '../components/entities';
import { useContemplation } from '../hooks/useContemplation';
import {
  MessageThread,
  InputBar,
  ChatHeader,
  CategorySelector,
  SessionSidebar,
  PathwayBanner,
} from '../components/contemplation';

export function ContemplationChamber() {
  const c = useContemplation();

  if (c.isLoading) {
    return <LoadingSkeleton variant="page" />;
  }

  if (!c.hasProfile || !c.profile) {
    return (
      <ProfileRequiredState
        title="Contemplation Chamber"
        description="Create your cosmic profile to access AI-guided contemplation sessions for deeper self-reflection."
      />
    );
  }

  const isInChatMode = c.messages.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`w-full ${isInChatMode ? 'h-[calc(100dvh-140px)] overflow-hidden' : ''}`}
    >
      {/* Main container with flex layout for side-by-side on desktop */}
      <div className={`flex transition-all duration-300 ${
        c.showEntityPanel ? '' : 'max-w-4xl'
      } mx-auto ${isInChatMode ? 'h-full' : 'gap-6'}`}>
        {/* Main Content Area */}
        <div className={`flex-1 min-w-0 transition-all duration-300 ${
          isInChatMode ? 'flex flex-col h-full overflow-hidden' : ''
        }`}>
          {/* Header — slim ChatHeader in chat mode, full title otherwise */}
          {isInChatMode && c.category ? (
            <ChatHeader
              category={c.category}
              typeName={c.selectedTypeOption?.name}
              onExportMarkdown={c.exportAsMarkdown}
              onExportJson={c.exportAsJson}
              onCopyMarkdown={c.copyAsMarkdown}
              copySuccess={c.copySuccess}
              onResetSession={c.resetSession}
            />
          ) : (
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3">
                <h1 className="font-serif font-medium text-white text-4xl mb-3">
                  Contemplation Chamber
                </h1>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded border border-emerald-500/30 mb-3">
                  ILOS
                </span>
              </div>
              <p className="text-neutral-400 max-w-2xl mx-auto">
                A sacred space for AI-guided reflection on your cosmic blueprint. Choose a wisdom system to begin.
              </p>
            </div>
          )}

          {/* Pathway Context Banner */}
          {c.activePathwayStep && c.pathwayContext && (
            <PathwayBanner
              activePathwayStep={c.activePathwayStep}
              stepCompleted={c.stepCompleted}
              hasMessages={c.messages.length > 0}
              onCompleteStep={c.handleCompletePathwayStep}
              onReturnToPathway={c.handleReturnToPathway}
            />
          )}

          <AnimatePresence mode="wait">
            {/* Saved Sessions View */}
            {!c.category && c.showSavedSessions && (
              <SessionSidebar
                savedSessions={c.savedSessions}
                onResumeSession={c.resumeSession}
                onDeleteSession={c.handleDeleteSession}
                onBack={() => c.setShowSavedSessions(false)}
              />
            )}

            {/* Category / Type / Focus / Start selection (when not in chat and not showing sessions) */}
            {c.messages.length === 0 && !(!c.category && c.showSavedSessions) && (
              <CategorySelector
                profile={c.profile}
                category={c.category}
                setCategory={c.setCategory}
                contemplationType={c.contemplationType}
                setContemplationType={c.setContemplationType}
                focusEntity={c.focusEntity}
                setFocusEntity={c.setFocusEntity}
                selectedTypeOption={c.selectedTypeOption}
                needsFocus={c.needsFocus}
                canStartChat={c.canStartChat}
                selectedModel={c.selectedModel}
                setSelectedModel={c.setSelectedModel}
                isSending={c.isSending}
                error={c.error}
                canRetry={c.canRetry}
                isRetrying={c.isRetrying}
                retryFn={c.retryFn}
                savedSessions={c.savedSessions}
                showSavedSessions={c.showSavedSessions}
                setShowSavedSessions={c.setShowSavedSessions}
                goBack={c.goBack}
                startContemplation={c.startContemplation}
              />
            )}

            {/* Chat Interface */}
            {c.messages.length > 0 && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col flex-1 min-h-0"
              >
                <MessageThread
                  messages={c.messages}
                  isSending={c.isSending}
                  category={c.category}
                  contemplationType={c.contemplationType}
                  currentSessionId={c.currentSessionId}
                  focusEntity={c.focusEntity}
                  onEntityClick={c.handleEntityClick}
                  messagesEndRef={c.messagesEndRef}
                />

                {/* Error */}
                {c.error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-between flex-shrink-0">
                    <div>
                      <p className="text-red-400 text-sm">{c.error}</p>
                      {c.isRetrying && (
                        <p className="text-yellow-400 text-xs animate-pulse mt-1">Auto-retrying...</p>
                      )}
                    </div>
                    {c.canRetry && c.retryFn && !c.isRetrying && (
                      <button
                        onClick={c.retryFn}
                        className="ml-3 px-4 py-1.5 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                )}

                <InputBar
                  inputValue={c.inputValue}
                  setInputValue={c.setInputValue}
                  isSending={c.isSending}
                  onSend={c.sendMessage}
                  onKeyDown={c.handleKeyDown}
                  inputRef={c.inputRef}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Guidance Section */}
          {!c.category && !c.showSavedSessions && (
            <section className="mt-12 bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
              <h3 className="font-serif text-lg text-white mb-4">Contemplation Guidance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-purple-400 font-medium mb-1">Create Space</p>
                  <p className="text-neutral-400">
                    Find a quiet moment. Take three deep breaths before beginning.
                  </p>
                </div>
                <div>
                  <p className="text-purple-400 font-medium mb-1">Be Present</p>
                  <p className="text-neutral-400">
                    Engage with curiosity. There are no wrong answers here.
                  </p>
                </div>
                <div>
                  <p className="text-purple-400 font-medium mb-1">Trust the Process</p>
                  <p className="text-neutral-400">
                    Let insights arise naturally. This is your journey of discovery.
                  </p>
                </div>
              </div>
            </section>
          )}

        </div>

        {/* Entity Stack — desktop split-view with up to 2 entities */}
        {isInChatMode && (
          <EntityStack
            entities={c.selectedEntities}
            onCloseEntity={c.handleCloseEntity}
            onEntityClick={c.handleEntityClick}
          />
        )}
      </div>

      {/* Entity Detail Panel — overlay mode for mobile/tablet */}
      {c.selectedEntities.length > 0 && (
        <div className="lg:hidden">
          <EntityDetailPanel
            entity={c.selectedEntities[0]}
            onClose={() => c.handleCloseEntity(c.selectedEntities[0].id)}
            onEntityClick={c.handleEntityClick}
            mode="overlay"
          />
        </div>
      )}
    </motion.div>
  );
}

export default ContemplationChamber;
