// ============================================
// Entity Detail Panel — Orchestrator
// ============================================
// Slide-in panel showing entity details when clicked in chat.
// Composes Header + Content + Footer sub-components.

import React, { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { EntityInfo } from '../../services/entities';
import { useProfile } from '../../context';
import { SYSTEM_COLORS, SYSTEM_LABELS, CATEGORY_LABELS, SIGN_ELEMENT_PANEL_COLORS } from './entityPanelConstants';
import { getProfileSpheresForGeneKey } from './entityPanelUtils';
import { EntityPanelHeader } from './EntityPanelHeader';
import { EntityPanelFooter } from './EntityPanelFooter';
import { EntityPanelContent } from './content';

interface EntityDetailPanelProps {
  entity: EntityInfo | null;
  onClose: () => void;
  onEntityClick?: (entity: EntityInfo) => void;
  mode?: 'overlay' | 'sidebar';
}

export function EntityDetailPanel({
  entity,
  onClose,
  onEntityClick,
  mode = 'overlay',
}: EntityDetailPanelProps): React.ReactElement | null {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const isSidebar = mode === 'sidebar';

  // Gene Key sphere lookup
  const geneKeyNumber = useMemo(() => {
    if (entity?.type === 'gene-key' && entity.data) {
      const data = entity.data as Record<string, unknown>;
      return typeof data.keyNumber === 'number' ? data.keyNumber : null;
    }
    return null;
  }, [entity]);

  const profileSpheres = useMemo(() => {
    if (geneKeyNumber === null) return [];
    return getProfileSpheresForGeneKey(geneKeyNumber, profile);
  }, [geneKeyNumber, profile]);

  // Escape key handler (overlay only)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSidebar) {
        onClose();
      }
    },
    [onClose, isSidebar]
  );

  useEffect(() => {
    if (!isSidebar) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, isSidebar]);

  if (!entity) return null;

  let resolvedColors = SYSTEM_COLORS[entity.system];
  if (entity.type === 'sign' && entity.data) {
    const elementId = (entity.data as { elementId?: string }).elementId;
    if (elementId && SIGN_ELEMENT_PANEL_COLORS[elementId as keyof typeof SIGN_ELEMENT_PANEL_COLORS]) {
      resolvedColors = SIGN_ELEMENT_PANEL_COLORS[elementId as keyof typeof SIGN_ELEMENT_PANEL_COLORS];
    }
  }
  const colors = resolvedColors;
  const systemLabel = SYSTEM_LABELS[entity.system];
  const categoryLabel = CATEGORY_LABELS[entity.type] || entity.type;

  const handleViewFullPage = () => {
    if (entity.routePath) {
      navigate(entity.routePath);
      onClose();
    }
  };

  const headerProps = { entity, colors, systemLabel, categoryLabel, onClose, isSidebar };
  const contentProps = { entity, colors, onEntityClick, profile, profileSpheres };
  const footerProps = { routePath: entity.routePath, onViewFullPage: handleViewFullPage, accentClass: colors.accent, isSidebar };

  // Sidebar mode
  if (isSidebar) {
    return (
      <div
        className="bg-surface-base border border-theme-border-subtle rounded-xl shadow-lg
          flex flex-col h-[600px] sticky top-4 animate-fade-in"
        role="region"
        aria-labelledby="entity-panel-title"
      >
        <EntityPanelHeader {...headerProps} />
        <div className="flex-1 overflow-y-auto p-4 overscroll-contain">
          <EntityPanelContent {...contentProps} />
        </div>
        <EntityPanelFooter {...footerProps} />
      </div>
    );
  }

  // Overlay mode
  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed right-0 top-0 h-full w-full sm:max-w-sm bg-surface-base
          border-l border-theme-border-subtle shadow-2xl z-50
          flex flex-col animate-slide-in-right
          safe-area-inset-top safe-area-inset-bottom"
        role="dialog"
        aria-modal="true"
        aria-labelledby="entity-panel-title"
      >
        <EntityPanelHeader {...headerProps} />
        <div className="flex-1 overflow-y-auto p-4 sm:p-4 overscroll-contain">
          <EntityPanelContent {...contentProps} />
        </div>
        <EntityPanelFooter {...footerProps} />
      </div>
    </>
  );
}

export default EntityDetailPanel;
