import type { PathwayStep } from '../../services/pathways';

export interface PathwayBannerProps {
  activePathwayStep: PathwayStep;
  stepCompleted: boolean;
  hasMessages: boolean;
  onCompleteStep: () => void;
  onReturnToPathway: () => void;
}

export function PathwayBanner({
  activePathwayStep,
  stepCompleted,
  hasMessages,
  onCompleteStep,
  onReturnToPathway,
}: PathwayBannerProps) {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-purple-400 text-xs uppercase tracking-wider mb-1">Guided Pathway</p>
          <p className="text-white font-medium">{activePathwayStep.title}</p>
          <p className="text-neutral-400 text-sm">{activePathwayStep.description}</p>
        </div>
        <div className="flex items-center gap-3">
          {!stepCompleted && hasMessages && (
            <button
              onClick={onCompleteStep}
              className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-colors"
            >
              Mark Complete
            </button>
          )}
          {stepCompleted && (
            <span className="text-green-400 text-sm flex items-center gap-1">
              ✓ Completed
            </span>
          )}
          <button
            onClick={onReturnToPathway}
            className="text-neutral-400 hover:text-white text-sm transition-colors"
          >
            Back to Pathway
          </button>
        </div>
      </div>
      {activePathwayStep.journalPrompt && hasMessages && (
        <div className="mt-3 p-3 bg-neutral-900/50 rounded-lg border border-neutral-700">
          <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Reflection Prompt</p>
          <p className="text-neutral-300 text-sm italic">{activePathwayStep.journalPrompt}</p>
        </div>
      )}
    </div>
  );
}
