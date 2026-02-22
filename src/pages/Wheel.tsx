import { useState, useCallback } from 'react';

import { CelestialMandala } from '../components/CelestialMandala';
import { EntityStack } from '../components/entities/EntityStack';
import { getEntity } from '../services/entities/registry';
import { elements } from '../data';
import type { EntityInfo } from '../services/entities/registry';
import type { ZodiacSign } from '../types';

const elementColors = {
  fire: 'text-fire-400 bg-fire-500/10 border-fire-500/30',
  earth: 'text-earth-400 bg-earth-500/10 border-earth-500/30',
  air: 'text-air-400 bg-air-500/10 border-air-500/30',
  water: 'text-water-400 bg-water-500/10 border-water-500/30',
};

export function Wheel() {
  const [selectedEntities, setSelectedEntities] = useState<EntityInfo[]>([]);
  const [selectedSignId, setSelectedSignId] = useState<string | undefined>(undefined);

  const handleEntityClick = useCallback((entity: EntityInfo) => {
    setSelectedEntities(prev => {
      const already = prev.findIndex(e => e.id === entity.id);
      if (already !== -1) return prev;
      if (prev.length >= 2) return [prev[1], entity];
      return [...prev, entity];
    });
  }, []);

  const handleCloseEntity = useCallback((id: string) => {
    setSelectedEntities(prev => prev.filter(e => e.id !== id));
    setSelectedSignId(prev => (prev === id ? undefined : prev));
  }, []);

  const handleSignSelect = useCallback((sign: ZodiacSign) => {
    setSelectedSignId(sign.id);
    const entity = getEntity(sign.id);
    if (entity) handleEntityClick(entity);
  }, [handleEntityClick]);

  return (
    <div className="flex h-full">
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="space-y-8">
          {/* Header */}
          <section className="text-center">
            <h1 className="font-serif text-3xl font-medium mb-2">Celestial Mandala</h1>
            <p className="text-theme-text-secondary max-w-2xl mx-auto">
              Explore the zodiac wheel. Click any sign to learn more about its energy,
              or hover to see the key phrase.
            </p>
          </section>

          {/* Main Content */}
          <div className="flex flex-col items-center justify-center gap-8">
            {/* Mandala */}
            <div className="flex justify-center">
              <CelestialMandala
                size={Math.min(580, typeof window !== 'undefined' ? window.innerWidth - 64 : 580)}
                onSignSelect={handleSignSelect}
                selectedSignId={selectedSignId}
              />
            </div>

            {/* Hint when nothing selected */}
            {selectedEntities.length === 0 && (
              <div className="p-6 bg-surface-base/50 rounded-xl border border-theme-border-subtle text-center max-w-sm">
                <p className="text-theme-text-secondary">
                  Click on a sign in the wheel to see its details
                </p>
              </div>
            )}
          </div>

          {/* Legend */}
          <section className="flex flex-wrap justify-center gap-4 pt-4">
            {Array.from(elements.values())
              .filter((e) => e.elementCategory === 'Classical')
              .map((el) => (
                <div
                  key={el.id}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                    elementColors[el.id as keyof typeof elementColors]
                  }`}
                >
                  <span>{el.symbol}</span>
                  <span className="text-sm">{el.name}</span>
                </div>
              ))}
          </section>
        </div>
      </div>

      <EntityStack
        entities={selectedEntities}
        onCloseEntity={handleCloseEntity}
        onEntityClick={handleEntityClick}
      />
    </div>
  );
}
export default Wheel;
