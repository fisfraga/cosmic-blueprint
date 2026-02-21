import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProfile } from '../context';
import { decans, signs, planets, getSignsInOrder, getDecanByDegree } from '../data';
import type { DecanEntry } from '../data';
import { LoadingSkeleton } from '../components';
import { elementColors } from '../styles';

export function DecanDive() {
  const { profile, isLoading } = useProfile();
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [selectedDecan, setSelectedDecan] = useState<DecanEntry | null>(null);

  const orderedSigns = getSignsInOrder();

  // Get personal decans from profile placements
  const personalDecans = useMemo(() => {
    if (!profile?.placements) return [];
    return profile.placements
      .map(placement => {
        const decan = getDecanByDegree(placement.signId, placement.degree);
        if (!decan) return null;
        return {
          placement,
          decan,
          planet: planets.get(placement.planetId),
          sign: signs.get(placement.signId),
        };
      })
      .filter(Boolean);
  }, [profile]);

  // Get decans for selected sign
  const signDecans = useMemo(() => {
    if (!selectedSign) return [];
    return decans.filter(d => d.signId === selectedSign).sort((a, b) => a.decanNumber - b.decanNumber);
  }, [selectedSign]);

  if (isLoading) {
    return <LoadingSkeleton variant="page" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-serif text-4xl font-medium text-theme-text-primary mb-3">
          Decan Dive
        </h1>
        <p className="text-theme-text-secondary max-w-2xl mx-auto">
          Each zodiac sign contains three decans—10° segments that add nuance to planetary placements.
          Discover how the decan colors your cosmic expression.
        </p>
      </div>

      {/* Personal Decans */}
      {personalDecans.length > 0 && (
        <section>
          <h2 className="font-serif text-xl text-theme-text-primary mb-4 flex items-center gap-2">
            <span>✦</span> Your Decan Placements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personalDecans.slice(0, 6).map((item) => {
              if (!item) return null;
              const { placement, decan, planet, sign } = item;
              const colors = elementColors[(sign?.elementId || 'fire') as keyof typeof elementColors];

              return (
                <motion.div
                  key={placement.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-xl bg-gradient-to-br ${colors.gradient} border ${colors.border} cursor-pointer`}
                  onClick={() => setSelectedDecan(decan)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{planet?.symbol}</span>
                      <span className="text-lg">{sign?.symbol}</span>
                    </div>
                    <span className="text-xs text-theme-text-secondary">{decan.degrees}</span>
                  </div>
                  <h3 className={`font-medium ${colors.text}`}>
                    {planet?.name} in {sign?.name} {decan.decanNumber}
                  </h3>
                  <p className="text-theme-text-secondary text-sm mt-1">
                    "{decan.keyword}" • Ruled by {planets.get(decan.rulerPlanetId)?.symbol}
                  </p>
                </motion.div>
              );
            })}
          </div>
          {personalDecans.length > 6 && (
            <p className="text-theme-text-tertiary text-sm mt-3 text-center">
              + {personalDecans.length - 6} more placements
            </p>
          )}
        </section>
      )}

      {/* Sign Selector */}
      <section>
        <h2 className="font-serif text-xl text-theme-text-primary mb-4">Explore by Sign</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {orderedSigns.map((sign) => {
            const colors = elementColors[sign.elementId as keyof typeof elementColors];
            const isSelected = selectedSign === sign.id;

            return (
              <button
                key={sign.id}
                onClick={() => setSelectedSign(isSelected ? null : sign.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  isSelected
                    ? `${colors.bg} ${colors.border} border ${colors.text}`
                    : 'bg-surface-raised text-theme-text-secondary hover:bg-surface-interactive hover:text-theme-text-primary'
                }`}
              >
                <span className="text-lg">{sign.symbol}</span>
                <span className="text-sm">{sign.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Sign Decans Display */}
      <AnimatePresence mode="wait">
        {selectedSign && (
          <motion.section
            key={selectedSign}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {(() => {
              const sign = signs.get(selectedSign);
              if (!sign) return null;
              const colors = elementColors[sign.elementId as keyof typeof elementColors];

              return (
                <div className={`rounded-xl border ${colors.border} overflow-hidden`}>
                  {/* Sign Header */}
                  <div className={`p-6 bg-gradient-to-r ${colors.gradient}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{sign.symbol}</span>
                      <div>
                        <h2 className="font-serif text-2xltext-theme-text-primary">{sign.name} Decans</h2>
                        <p className="text-theme-text-secondary">Three expressions of {sign.name} energy</p>
                      </div>
                    </div>
                  </div>

                  {/* Decans Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-800">
                    {signDecans.map((decan) => {
                      const rulerPlanet = planets.get(decan.rulerPlanetId);
                      const subrulerSign = signs.get(decan.subrulerSignId);

                      return (
                        <div
                          key={decan.id}
                          className="p-5 hover:bg-surface-base/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedDecan(decan)}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-sm font-medium ${colors.text}`}>
                              Decan {decan.decanNumber}
                            </span>
                            <span className="text-xs text-theme-text-tertiary">{decan.degrees}</span>
                          </div>

                          <h3 className="font-serif text-lg text-theme-text-primary mb-2">
                            "{decan.keyword}"
                          </h3>

                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-1">
                              <span className="text-xl">{rulerPlanet?.symbol}</span>
                              <span className="text-xs text-theme-text-secondary">ruler</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-lg">{subrulerSign?.symbol}</span>
                              <span className="text-xs text-theme-text-secondary">influence</span>
                            </div>
                          </div>

                          <p className="text-theme-text-secondary text-sm line-clamp-3">
                            {decan.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Selected Decan Detail Modal */}
      <AnimatePresence>
        {selectedDecan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setSelectedDecan(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const sign = signs.get(selectedDecan.signId);
                const rulerPlanet = planets.get(selectedDecan.rulerPlanetId);
                const subrulerSign = signs.get(selectedDecan.subrulerSignId);
                const colors = elementColors[(sign?.elementId || 'fire') as keyof typeof elementColors];

                return (
                  <div className={`rounded-xl border ${colors.border} bg-surface-base`}>
                    {/* Header */}
                    <div className={`p-6 bg-gradient-to-r ${colors.gradient}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-4xl">{sign?.symbol}</span>
                            <div>
                              <h2 className="font-serif text-2xltext-theme-text-primary">
                                {sign?.name} Decan {selectedDecan.decanNumber}
                              </h2>
                              <p className="text-theme-text-secondary">{selectedDecan.degrees}</p>
                            </div>
                          </div>
                          <p className={`text-xl ${colors.text} font-serif`}>
                            "{selectedDecan.keyword}"
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedDecan(null)}
                          className="text-theme-text-secondary hover:text-theme-text-primary transition-colors text-2xl"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                      {/* Rulers */}
                      <div className="flex gap-6">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{rulerPlanet?.symbol}</span>
                          <div>
                            <p className="text-theme-text-primary font-medium">{rulerPlanet?.name}</p>
                            <p className="text-theme-text-tertiary text-xs">Decan Ruler</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{subrulerSign?.symbol}</span>
                          <div>
                            <p className="text-theme-text-primary font-medium">{subrulerSign?.name}</p>
                            <p className="text-theme-text-tertiary text-xs">Sub-influence</p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <h3 className={`font-medium ${colors.text} mb-2`}>The Energy</h3>
                        <p className="text-theme-text-secondary leading-relaxed">
                          {selectedDecan.description}
                        </p>
                      </div>

                      {/* Gift & Shadow */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                          <h4 className="font-medium text-emerald-400 mb-2">Gift Expression</h4>
                          <p className="text-theme-text-secondary text-sm">
                            {selectedDecan.giftExpression}
                          </p>
                        </div>
                        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg">
                          <h4 className="font-medium text-rose-400 mb-2">Shadow Expression</h4>
                          <p className="text-theme-text-secondary text-sm">
                            {selectedDecan.shadowExpression}
                          </p>
                        </div>
                      </div>

                      {/* Links */}
                      <div className="flex gap-3 pt-4 border-t border-theme-border-subtle">
                        <Link
                          to={`/signs/${sign?.id}`}
                          onClick={() => setSelectedDecan(null)}
                          className="px-4 py-2 bg-surface-raised hover:bg-surface-interactive text-theme-text-primary text-sm rounded-lg transition-colors"
                        >
                          View {sign?.name}
                        </Link>
                        <Link
                          to={`/planets/${rulerPlanet?.id}`}
                          onClick={() => setSelectedDecan(null)}
                          className="px-4 py-2 bg-surface-raised hover:bg-surface-interactive text-theme-text-primary text-sm rounded-lg transition-colors"
                        >
                          View {rulerPlanet?.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Understanding Decans */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl text-theme-text-primary mb-6">Understanding Decans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle">
            <div className="text-3xl mb-3">1️⃣</div>
            <h3 className="font-medium text-theme-text-primary mb-2">First Decan (0-10°)</h3>
            <p className="text-theme-text-secondary text-sm">
              The purest expression of the sign's energy. Ruled by the sign's own planet,
              this decan embodies the archetypal qualities without modification.
            </p>
          </div>
          <div className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle">
            <div className="text-3xl mb-3">2️⃣</div>
            <h3 className="font-medium text-theme-text-primary mb-2">Second Decan (10-20°)</h3>
            <p className="text-theme-text-secondary text-sm">
              The sign's energy colored by the next sign of its element.
              This adds complexity and a secondary planetary influence.
            </p>
          </div>
          <div className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle">
            <div className="text-3xl mb-3">3️⃣</div>
            <h3 className="font-medium text-theme-text-primary mb-2">Third Decan (20-30°)</h3>
            <p className="text-theme-text-secondary text-sm">
              The sign's energy merging with the third sign of its element.
              Often shows the most evolved or complex expression.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center pt-8">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 font-medium rounded-lg hover:bg-neutral-200 transition-colors"
        >
          <span>✦</span>
          View Your Complete Chart
        </Link>
      </div>
    </motion.div>
  );
}
export default DecanDive;
