import { motion, AnimatePresence } from 'framer-motion';
import type { EntityInfo } from '../../services/entities';
import { EntityDetailPanel } from './EntityDetailPanel';

export interface EntityStackProps {
  entities: EntityInfo[];
  onCloseEntity: (entityId: string) => void;
  onEntityClick: (entity: EntityInfo) => void;
}

export function EntityStack({ entities, onCloseEntity, onEntityClick }: EntityStackProps) {
  if (entities.length === 0) return null;

  const lastEntity = entities[entities.length - 1];

  return (
    <>
      {/* ── Desktop: side-by-side columns (unchanged) ── */}
      <div className="hidden lg:flex h-full flex-shrink-0">
        <AnimatePresence mode="popLayout">
          {entities.map((entity) => (
            <motion.div
              key={entity.id}
              layout
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 20 }}
              transition={{ type: 'spring', stiffness: 360, damping: 32 }}
              style={{ width: entities.length === 1 ? 420 : 380 }}
              className="h-full border-l border-theme-border-subtle flex-shrink-0 overflow-hidden"
            >
              <EntityDetailPanel
                entity={entity}
                onClose={() => onCloseEntity(entity.id)}
                onEntityClick={onEntityClick}
                mode="sidebar"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Mobile: bottom sheet for last entity ── */}
      <div className="lg:hidden">
        <AnimatePresence>
          {lastEntity && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => onCloseEntity(lastEntity.id)}
              />
              {/* Sheet */}
              <motion.div
                key={lastEntity.id}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 360, damping: 36 }}
                className="fixed bottom-0 left-0 right-0 z-50
                  bg-surface-base border-t border-theme-border-subtle
                  rounded-t-2xl shadow-2xl
                  max-h-[80vh] flex flex-col"
              >
                {/* Drag handle */}
                <div className="flex-shrink-0 flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-theme-border-subtle" />
                </div>
                {/* Content — scrollable */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                  <EntityDetailPanel
                    entity={lastEntity}
                    onClose={() => onCloseEntity(lastEntity.id)}
                    onEntityClick={onEntityClick}
                    mode="sidebar"
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
