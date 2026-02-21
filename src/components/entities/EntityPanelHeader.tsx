import type { EntityInfo } from '../../services/entities';
import { CloseIcon } from '../icons';

interface EntityPanelHeaderProps {
  entity: EntityInfo;
  colors: { bg: string; border: string; accent: string; text: string };
  systemLabel: string;
  categoryLabel: string;
  onClose: () => void;
  isSidebar: boolean;
}

export function EntityPanelHeader({
  entity,
  colors,
  systemLabel,
  categoryLabel,
  onClose,
  isSidebar,
}: EntityPanelHeaderProps) {
  if (isSidebar) {
    return (
      <div className={`${colors.bg} border-b ${colors.border} p-4 rounded-t-xl`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {entity.symbol && (
                <span className="text-xl">{entity.symbol}</span>
              )}
              <h2
                id="entity-panel-title"
                className="text-base font-semibold text-white truncate"
              >
                {entity.name}
              </h2>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-0.5 text-xs rounded ${colors.accent} text-white`}>
                {systemLabel}
              </span>
              <span className="px-2 py-0.5 text-xs rounded bg-surface-interactive text-theme-text-secondary">
                {categoryLabel}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close panel"
          >
            <CloseIcon className="w-5 h-5 text-theme-text-secondary" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${colors.bg} border-b ${colors.border} p-4 sm:p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {entity.symbol && (
              <span className="text-2xl sm:text-2xl">{entity.symbol}</span>
            )}
            <h2
              id="entity-panel-title"
              className="text-lg sm:text-lg font-semibold text-white truncate"
            >
              {entity.name}
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-1 sm:py-0.5 text-xs rounded ${colors.accent} text-white`}>
              {systemLabel}
            </span>
            <span className="px-2 py-1 sm:py-0.5 text-xs rounded bg-surface-interactive text-theme-text-secondary">
              {categoryLabel}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-3 sm:p-2 -mr-1 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation"
          aria-label="Close panel"
        >
          <CloseIcon className="w-6 h-6 sm:w-5 sm:h-5 text-theme-text-secondary" />
        </button>
      </div>
    </div>
  );
}
