import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CelestialMandala } from '../components/CelestialMandala';
import { elements, getSignsByElement } from '../data';
import { getPlacementsInSign } from '../data/userProfile';
import type { ZodiacSign } from '../types';

const elementColors = {
  fire: 'text-fire-400 bg-fire-500/10 border-fire-500/30',
  earth: 'text-earth-400 bg-earth-500/10 border-earth-500/30',
  air: 'text-air-400 bg-air-500/10 border-air-500/30',
  water: 'text-water-400 bg-water-500/10 border-water-500/30',
};

export function Wheel() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);

  const handleSignSelect = (sign: ZodiacSign) => {
    setSelectedSign(sign);
  };

  const element = selectedSign ? elements.get(selectedSign.elementId) : null;
  const siblingsSigns = selectedSign ? getSignsByElement(selectedSign.elementId) : [];
  const placements = selectedSign ? getPlacementsInSign(selectedSign.id) : [];

  return (
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
      <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
        {/* Mandala */}
        <div className="flex justify-center">
          <CelestialMandala
            size={Math.min(580, typeof window !== 'undefined' ? window.innerWidth - 64 : 580)}
            onSignSelect={handleSignSelect}
            selectedSignId={selectedSign?.id}
          />
        </div>

        {/* Selected Sign Panel */}
        <div className="w-full lg:w-80 space-y-4">
          {selectedSign ? (
            <>
              {/* Sign Card */}
              <div className={`p-6 rounded-xl border ${elementColors[selectedSign.elementId as keyof typeof elementColors] || 'border-theme-border-subtle'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{selectedSign.symbol}</span>
                  <div>
                    <h2 className="font-serif text-2xl">{selectedSign.name}</h2>
                    <p className="text-theme-text-secondary text-sm">{selectedSign.dateRange}</p>
                  </div>
                </div>
                <p className="text-theme-text-secondary italic mb-4">"{selectedSign.keyPhrase}"</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-surface-raised rounded text-xs">
                    {selectedSign.signModality}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${elementColors[selectedSign.elementId as keyof typeof elementColors]}`}>
                    {element?.name}
                  </span>
                </div>
                <Link
                  to={`/signs/${selectedSign.id}`}
                  className="block w-full py-2 text-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  Explore {selectedSign.name} &rarr;
                </Link>
              </div>

              {/* My Placements in this Sign */}
              {placements.length > 0 && (
                <div className={`p-4 rounded-xl border ${elementColors[selectedSign.elementId as keyof typeof elementColors] || 'border-theme-border-subtle'}`}>
                  <h3 className="text-sm text-theme-text-secondary mb-3">My Placements in {selectedSign.name}</h3>
                  <div className="space-y-2">
                    {placements.map((placement) => (
                      <div
                        key={placement.planetId}
                        className={`flex items-center justify-between p-2 rounded-lg ${
                          placement.placementType === 'planet'
                            ? 'bg-surface-overlay'
                            : 'bg-surface-raised/30 border border-theme-border-subtle/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-xl ${placement.placementType === 'point' ? 'opacity-80' : ''}`}>
                            {placement.planetSymbol}
                          </span>
                          <div>
                            <span className="text-sm font-medium">{placement.planetName}</span>
                            {placement.isRetrograde && (
                              <span className="text-xs text-red-400 ml-1">R</span>
                            )}
                            {placement.dignity && (
                              <span className="text-xs text-amber-400 ml-1">({placement.dignity})</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-theme-text-secondary">{placement.degree}</span>
                          <span className="block text-xs text-theme-text-tertiary">House {placement.houseNumber}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Element Siblings */}
              <div className="p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle">
                <h3 className="text-sm text-theme-text-secondary mb-3">Other {element?.name} Signs</h3>
                <div className="space-y-2">
                  {siblingsSigns
                    .filter((s) => s.id !== selectedSign.id)
                    .map((sign) => (
                      <button
                        key={sign.id}
                        onClick={() => setSelectedSign(sign)}
                        className="flex items-center gap-2 w-full p-2 bg-surface-overlay hover:bg-surface-raised rounded-lg transition-colors text-left"
                      >
                        <span className="text-xl">{sign.symbol}</span>
                        <span className="text-sm">{sign.name}</span>
                      </button>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 bg-surface-base/50 rounded-xl border border-theme-border-subtle text-center">
              <p className="text-theme-text-secondary">
                Click on a sign in the wheel to see its details
              </p>
            </div>
          )}
        </div>
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
  );
}
export default Wheel;
