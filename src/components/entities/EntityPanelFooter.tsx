import { ExternalLinkIcon } from '../icons';

interface EntityPanelFooterProps {
  routePath?: string;
  onViewFullPage: () => void;
  accentClass: string;
  isSidebar: boolean;
}

export function EntityPanelFooter({
  routePath,
  onViewFullPage,
  accentClass,
  isSidebar,
}: EntityPanelFooterProps) {
  if (!routePath) return null;

  if (isSidebar) {
    return (
      <div className="border-t border-cosmic-700 p-3">
        <button
          onClick={onViewFullPage}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2
            ${accentClass} hover:opacity-90 rounded-lg text-white font-medium text-sm
            transition-opacity`}
        >
          <span>View Full Details</span>
          <ExternalLinkIcon className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-cosmic-700 p-4 pb-safe">
      <button
        onClick={onViewFullPage}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 sm:py-2.5
          ${accentClass} hover:opacity-90 active:opacity-80 rounded-lg text-white font-medium
          transition-opacity touch-manipulation`}
      >
        <span>View Full Details</span>
        <ExternalLinkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
