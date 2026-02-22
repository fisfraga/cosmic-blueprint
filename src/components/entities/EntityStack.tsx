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

  // Single card is wider; two cards split narrower so chat stays comfortable
  const cardWidth = entities.length === 1 ? 420 : 380;

  return (
    <div className="hidden lg:flex h-full flex-shrink-0">
      <AnimatePresence mode="popLayout">
        {entities.map((entity) => (
          <motion.div
            key={entity.id}
            layout
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1,    x: 0  }}
            exit={{    opacity: 0, scale: 0.95, x: 20  }}
            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
            style={{ width: cardWidth }}
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
  );
}
