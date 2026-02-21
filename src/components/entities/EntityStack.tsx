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

  return (
    <div className="hidden lg:flex flex-col w-[360px] lg:w-[400px] h-full border-l border-theme-border-subtle flex-shrink-0">
      <AnimatePresence mode="popLayout">
        {entities.map((entity, index) => (
          <motion.div
            key={entity.id}
            layout
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`flex-1 min-h-0 overflow-y-auto ${
              index < entities.length - 1 ? 'border-b border-theme-border-subtle' : ''
            }`}
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
  );
}
