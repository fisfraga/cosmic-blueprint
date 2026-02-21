import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProfile } from '../context';
import { configurations, planets } from '../data';
import type { AspectConfiguration } from '../types';
import { LoadingSkeleton } from '../components';

const configColors: Record<string, { bg: string; border: string; text: string }> = {
  'grand-trine': { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400' },
  'grand-cross': { bg: 'bg-rose-500/20', border: 'border-rose-500/50', text: 'text-rose-400' },
  'stellium': { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400' },
  't-square': { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400' },
  'yod': { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400' },
  'kite': { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400' },
  'mystic-rectangle': { bg: 'bg-cyan-500/20', border: 'border-cyan-500/50', text: 'text-cyan-400' },
  'cradle': { bg: 'bg-pink-500/20', border: 'border-pink-500/50', text: 'text-pink-400' },
};

// SVG paths for configuration shapes
const configShapes: Record<string, JSX.Element> = {
  'grand-trine': (
    <svg viewBox="0 0 100 100" className="w-16 h-16">
      <polygon
        points="50,15 15,75 85,75"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="50" cy="15" r="4" fill="currentColor" />
      <circle cx="15" cy="75" r="4" fill="currentColor" />
      <circle cx="85" cy="75" r="4" fill="currentColor" />
    </svg>
  ),
  'grand-cross': (
    <svg viewBox="0 0 100 100" className="w-16 h-16">
      <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(45 50 50)" />
      <circle cx="50" cy="15" r="4" fill="currentColor" />
      <circle cx="85" cy="50" r="4" fill="currentColor" />
      <circle cx="50" cy="85" r="4" fill="currentColor" />
      <circle cx="15" cy="50" r="4" fill="currentColor" />
      <line x1="50" y1="15" x2="50" y2="85" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
      <line x1="15" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
    </svg>
  ),
  'stellium': (
    <svg viewBox="0 0 100 100" className="w-16 h-16">
      <circle cx="35" cy="50" r="4" fill="currentColor" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
      <circle cx="65" cy="50" r="4" fill="currentColor" />
      <circle cx="50" cy="35" r="4" fill="currentColor" />
      <line x1="35" y1="50" x2="50" y2="50" stroke="currentColor" strokeWidth="2" />
      <line x1="50" y1="50" x2="65" y2="50" stroke="currentColor" strokeWidth="2" />
      <line x1="50" y1="35" x2="50" y2="50" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="50" cy="50" rx="25" ry="20" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
    </svg>
  ),
  't-square': (
    <svg viewBox="0 0 100 100" className="w-16 h-16">
      <line x1="15" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="2" />
      <line x1="15" y1="50" x2="50" y2="85" stroke="currentColor" strokeWidth="2" />
      <line x1="85" y1="50" x2="50" y2="85" stroke="currentColor" strokeWidth="2" />
      <circle cx="15" cy="50" r="4" fill="currentColor" />
      <circle cx="85" cy="50" r="4" fill="currentColor" />
      <circle cx="50" cy="85" r="4" fill="currentColor" />
    </svg>
  ),
  'yod': (
    <svg viewBox="0 0 100 100" className="w-16 h-16">
      <line x1="25" y1="75" x2="75" y2="75" stroke="currentColor" strokeWidth="2" />
      <line x1="25" y1="75" x2="50" y2="20" stroke="currentColor" strokeWidth="2" strokeDasharray="4,2" />
      <line x1="75" y1="75" x2="50" y2="20" stroke="currentColor" strokeWidth="2" strokeDasharray="4,2" />
      <circle cx="25" cy="75" r="4" fill="currentColor" />
      <circle cx="75" cy="75" r="4" fill="currentColor" />
      <circle cx="50" cy="20" r="6" fill="currentColor" />
      <path d="M 50 8 L 50 20" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />
    </svg>
  ),
  'kite': (
    <svg viewBox="0 0 100 100" className="w-16 h-16">
      <polygon points="50,10 85,50 50,90 15,50" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
      <circle cx="50" cy="10" r="4" fill="currentColor" />
      <circle cx="85" cy="50" r="4" fill="currentColor" />
      <circle cx="50" cy="90" r="4" fill="currentColor" />
      <circle cx="15" cy="50" r="4" fill="currentColor" />
    </svg>
  ),
  'mystic-rectangle': (
    <svg viewBox="0 0 100 100" className="w-16 h-16">
      <rect x="20" y="30" width="60" height="40" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="20" y1="30" x2="80" y2="70" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
      <line x1="80" y1="30" x2="20" y2="70" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
      <circle cx="20" cy="30" r="4" fill="currentColor" />
      <circle cx="80" cy="30" r="4" fill="currentColor" />
      <circle cx="80" cy="70" r="4" fill="currentColor" />
      <circle cx="20" cy="70" r="4" fill="currentColor" />
    </svg>
  ),
  'cradle': (
    <svg viewBox="0 0 100 100" className="w-16 h-16">
      <path d="M 20 40 Q 50 80 80 40" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="20" y1="40" x2="50" y2="20" stroke="currentColor" strokeWidth="2" />
      <line x1="80" y1="40" x2="50" y2="20" stroke="currentColor" strokeWidth="2" />
      <line x1="20" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
      <circle cx="20" cy="40" r="4" fill="currentColor" />
      <circle cx="80" cy="40" r="4" fill="currentColor" />
      <circle cx="50" cy="20" r="4" fill="currentColor" />
      <circle cx="50" cy="65" r="4" fill="currentColor" />
    </svg>
  ),
};

export function ConfigurationGallery() {
  const { profile, isLoading } = useProfile();
  const [selectedConfig, setSelectedConfig] = useState<AspectConfiguration | null>(null);

  if (isLoading) {
    return <LoadingSkeleton variant="cards" count={8} />;
  }

  // Get personal configurations
  const personalConfigs = profile?.configurations || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-serif text-4xl font-medium text-theme-text-primary mb-3">
          Configuration Gallery
        </h1>
        <p className="text-theme-text-secondary max-w-2xl mx-auto">
          Aspect configurations are sacred geometries formed when multiple aspects combine into powerful patterns.
          These cosmic mandalas represent unique gifts and challenges in your chart.
        </p>
      </div>

      {/* Personal Configurations */}
      {personalConfigs.length > 0 && (
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/20 mb-8">
          <h2 className="font-serif text-xl text-theme-text-primary mb-4">Your Configurations</h2>
          <div className="space-y-4">
            {personalConfigs.map((config) => {
              const configType = configurations.get(config.configurationId);
              const colors = configColors[config.configurationId] || { bg: 'bg-surface-interactive', border: 'border-theme-border', text: 'text-white' };
              const involvedPlanets = config.placementIds
                .map(id => {
                  const placement = profile?.placements.find(p => p.id === id);
                  return placement ? planets.get(placement.planetId) : null;
                })
                .filter(Boolean);

              if (!configType) return null;

              return (
                <div
                  key={config.id}
                  className={`${colors.bg} ${colors.border} border rounded-lg p-4`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={colors.text}>
                        {configShapes[config.configurationId]}
                      </div>
                      <div>
                        <h3 className={`font-medium ${colors.text}`}>{config.fullName}</h3>
                        <div className="flex gap-2 mt-1">
                          {involvedPlanets.map((planet) => (
                            <span key={planet!.id} className="text-lg" title={planet!.name}>
                              {planet!.symbol}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedConfig(configType)}
                      className="px-3 py-1.5 bg-surface-raised hover:bg-surface-interactive text-theme-text-primary text-sm rounded transition-colors"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Configuration Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from(configurations.values()).map((config) => {
          const colors = configColors[config.id] || { bg: 'bg-surface-interactive', border: 'border-theme-border', text: 'text-white' };
          const isSelected = selectedConfig?.id === config.id;

          return (
            <motion.div
              key={config.id}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`${colors.bg} ${colors.border} border rounded-xl p-5 cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-white' : ''
              }`}
              onClick={() => setSelectedConfig(isSelected ? null : config)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={colors.text}>
                  {configShapes[config.id]}
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  config.nature === 'Harmonious' ? 'bg-emerald-500/20 text-emerald-400' :
                  config.nature === 'Challenging' ? 'bg-rose-500/20 text-rose-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {config.nature}
                </span>
              </div>
              <h3 className="font-serif text-lg text-theme-text-primary mb-1">{config.name}</h3>
              <p className={`text-sm ${colors.text} mb-2`}>{config.keyword}</p>
              <p className="text-xs text-theme-text-secondary line-clamp-2">{config.shape}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Configuration Detail */}
      <AnimatePresence>
        {selectedConfig && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8"
          >
            {(() => {
              const colors = configColors[selectedConfig.id] || { bg: 'bg-surface-interactive', border: 'border-theme-border', text: 'text-white' };

              return (
                <div className={`${colors.bg} ${colors.border} border rounded-xl p-6`}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`${colors.text}`}>
                        {configShapes[selectedConfig.id]}
                      </div>
                      <div>
                        <h2 className="font-serif text-2xltext-theme-text-primary">{selectedConfig.name}</h2>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-sm ${colors.text}`}>{selectedConfig.keyword}</span>
                          <span className="text-theme-text-tertiary">•</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            selectedConfig.nature === 'Harmonious' ? 'bg-emerald-500/20 text-emerald-400' :
                            selectedConfig.nature === 'Challenging' ? 'bg-rose-500/20 text-rose-400' :
                            'bg-amber-500/20 text-amber-400'
                          }`}>
                            {selectedConfig.nature}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedConfig(null)}
                      className="text-theme-text-secondary hover:text-theme-text-primary transition-colors text-xl"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className={`font-medium ${colors.text} mb-2`}>The Sacred Meaning</h3>
                      <p className="text-theme-text-secondary text-sm leading-relaxed">
                        {selectedConfig.explanation}
                      </p>
                    </div>
                    <div>
                      <h3 className={`font-medium ${colors.text} mb-2`}>Life Impact</h3>
                      <p className="text-theme-text-secondary text-sm leading-relaxed">
                        {selectedConfig.impact}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-theme-border-subtle/50">
                    <h3 className={`font-medium ${colors.text} mb-2`}>Integration Practice</h3>
                    <p className="text-theme-text-secondary text-sm leading-relaxed">
                      {selectedConfig.integrationPractice}
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-theme-border-subtle/50 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-xs text-theme-text-tertiary uppercase tracking-wide">Shape</span>
                      <p className="text-sm text-theme-text-secondary mt-1">{selectedConfig.shape}</p>
                    </div>
                    <div>
                      <span className="text-xs text-theme-text-tertiary uppercase tracking-wide">Required Aspects</span>
                      <p className="text-sm text-theme-text-secondary mt-1">{selectedConfig.requiredAspectIds.join(', ')}</p>
                    </div>
                    <div>
                      <span className="text-xs text-theme-text-tertiary uppercase tracking-wide">Aspect Count</span>
                      <p className="text-sm text-theme-text-secondary mt-1">{selectedConfig.requiredAspectCount}</p>
                    </div>
                    <div>
                      <span className="text-xs text-theme-text-tertiary uppercase tracking-wide">Orb Range</span>
                      <p className="text-sm text-theme-text-secondary mt-1">{selectedConfig.orbRange}</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-surface-overlay rounded-lg">
                    <span className="text-xs text-theme-text-tertiary uppercase tracking-wide">Elemental Pattern</span>
                    <p className="text-sm text-theme-text-secondary mt-1">{selectedConfig.elementalPattern}</p>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Understanding Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle">
          <div className="text-2xl mb-3 text-emerald-400">△</div>
          <h3 className="font-serif text-lg text-emerald-400 mb-2">Harmonious Patterns</h3>
          <p className="text-theme-text-secondary text-sm">
            Grand Trine, Kite, Mystic Rectangle, and Cradle bring natural talents and flow.
            They represent areas where energy moves easily and gifts emerge naturally.
          </p>
        </div>
        <div className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle">
          <div className="text-2xl mb-3 text-rose-400">□</div>
          <h3 className="font-serif text-lg text-rose-400 mb-2">Challenging Patterns</h3>
          <p className="text-theme-text-secondary text-sm">
            Grand Cross and T-Square create tension that drives growth.
            They represent life's crucibles that forge strength and character through friction.
          </p>
        </div>
        <div className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle">
          <div className="text-2xl mb-3 text-purple-400">✧</div>
          <h3 className="font-serif text-lg text-purple-400 mb-2">Destiny Patterns</h3>
          <p className="text-theme-text-secondary text-sm">
            Yod and Stellium point to areas of concentrated purpose.
            They represent cosmic appointments and special callings that require conscious development.
          </p>
        </div>
      </div>

      {/* Link to Profile */}
      <div className="mt-8 text-center">
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
export default ConfigurationGallery;
