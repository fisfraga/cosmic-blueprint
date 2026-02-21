import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getCosmicWeather, type TransitPosition } from '../services/transits';
import {
  LIFE_AREAS,
  computeTransitActivations,
  getActivationsForHouse,
  type LifeAreaElement,
} from '../services/lifeAreas';
import { useProfile } from '../context';

// Element → color mappings (matches tailwind theme)
const ELEMENT_COLORS: Record<LifeAreaElement, {
  border: string;
  bg: string;
  icon: string;
  badge: string;
  active: string;
}> = {
  fire:  { border: 'border-fire-700/40',        bg: 'bg-fire-900/20',        icon: 'text-fire-400',    badge: 'bg-fire-800/50 text-fire-300',    active: 'border-fire-500/60 bg-fire-900/30' },
  earth: { border: 'border-earth-700/40',       bg: 'bg-earth-900/20',       icon: 'text-earth-400',   badge: 'bg-earth-800/50 text-earth-300',   active: 'border-earth-500/60 bg-earth-900/30' },
  air:   { border: 'border-air-700/40',         bg: 'bg-air-900/20',         icon: 'text-air-400',     badge: 'bg-air-800/50 text-air-300',     active: 'border-air-500/60 bg-air-900/30' },
  water: { border: 'border-water-700/40',       bg: 'bg-water-900/20',       icon: 'text-water-400',   badge: 'bg-water-800/50 text-water-300',   active: 'border-water-500/60 bg-water-900/30' },
};

function PlanetPill({ planet }: { planet: TransitPosition }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-surface-raised text-theme-text-secondary border border-theme-border-subtle">
      <span>{planet.symbol}</span>
      <span>{planet.planetName}</span>
      {planet.isRetrograde && <span className="text-amber-400">℞</span>}
    </span>
  );
}

function LifeAreaCard({
  area,
  transitPlanets,
  natalPlanetNames,
  index,
}: {
  area: typeof LIFE_AREAS[number];
  transitPlanets: TransitPosition[];
  natalPlanetNames: string[];
  index: number;
}) {
  const navigate = useNavigate();
  const isActive = transitPlanets.length > 0;
  const colors = ELEMENT_COLORS[area.element];

  const handleContemplate = () => {
    navigate('/contemplate', {
      state: {
        seed: `life area ${area.name} — ${area.archetype}`,
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={`relative rounded-xl p-5 border transition-colors ${
        isActive
          ? colors.active
          : `${colors.border} ${colors.bg} hover:border-theme-border-subtle`
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className={`text-2xl ${colors.icon}`}>{area.icon}</span>
          <div>
            <p className="text-xs text-theme-text-tertiary mb-0.5">Area {area.house}</p>
            <h3 className="text-theme-text-primary font-medium leading-tight">{area.name}</h3>
          </div>
        </div>
        {isActive && (
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors.badge}`}>
            {transitPlanets.length} active
          </span>
        )}
      </div>

      {/* Archetype & Themes */}
      <p className="text-xs text-theme-text-tertiary mb-1">{area.archetype}</p>
      <p className="text-xs text-theme-text-muted mb-3 leading-relaxed">{area.themes}</p>

      {/* Active transit planets */}
      {isActive && (
        <div className="mb-3">
          <p className="text-xs text-theme-text-tertiary mb-1.5">Transiting now</p>
          <div className="flex flex-wrap gap-1.5">
            {transitPlanets.map((planet) => (
              <PlanetPill key={planet.planetId} planet={planet} />
            ))}
          </div>
        </div>
      )}

      {/* Natal planets (if profile loaded) */}
      {natalPlanetNames.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-theme-text-tertiary mb-1.5">Your natal placements</p>
          <div className="flex flex-wrap gap-1">
            {natalPlanetNames.map((name) => (
              <span
                key={name}
                className="text-xs px-2 py-0.5 rounded-full bg-surface-base text-theme-text-secondary border border-theme-border-subtle"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contemplate CTA */}
      <button
        onClick={handleContemplate}
        className="w-full mt-1 py-1.5 text-xs rounded-lg border border-theme-border-subtle text-theme-text-secondary hover:text-theme-text-primary hover:border-theme-border hover:bg-surface-overlay transition-colors"
      >
        🕯 Contemplate this area
      </button>
    </motion.div>
  );
}

export default function LifeAreas() {
  const { cosmicProfile } = useProfile();

  const { weather, activations } = useMemo(() => {
    const w = getCosmicWeather();
    const a = computeTransitActivations(w.positions, cosmicProfile?.housePositions);
    return { weather: w, activations: a };
  }, [cosmicProfile?.housePositions]);

  // Build a map of house → natal planet names (from CosmicProfile.placements)
  const natalByHouse = useMemo((): Map<number, string[]> => {
    const map = new Map<number, string[]>();
    const placements = cosmicProfile?.placements;
    if (!placements) return map;

    for (const placement of placements) {
      // houseId format: "house-N"
      const match = placement.houseId?.match(/(\d+)/);
      if (!match) continue;
      const houseNum = parseInt(match[1], 10);
      if (!map.has(houseNum)) map.set(houseNum, []);
      // Use the placement name or derive from planetId
      const label = placement.shortName || placement.planetId;
      map.get(houseNum)!.push(label);
    }
    return map;
  }, [cosmicProfile?.placements]);

  const activeCount = LIFE_AREAS.filter(
    (area) => getActivationsForHouse(area.house, activations).length > 0,
  ).length;

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-serif font-medium text-theme-text-primary mb-2">
              Your 12 Life Areas
            </h1>
            <p className="text-theme-text-secondary text-sm max-w-2xl">
              The 12 astrological houses map directly to 12 key areas of your lived experience.
              Each area is currently influenced by the transiting planets passing through it.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="px-3 py-1.5 bg-surface-base border border-theme-border-subtle rounded-lg text-theme-text-secondary">
              {weather.moonPhase.emoji} {weather.moonPhase.name}
            </span>
            {activeCount > 0 && (
              <span className="px-3 py-1.5 bg-purple-900/30 border border-purple-700/40 rounded-lg text-purple-300">
                {activeCount} areas activated
              </span>
            )}
          </div>
        </div>

        {!cosmicProfile && (
          <div className="mt-4 p-3 rounded-lg bg-amber-900/20 border border-amber-700/40 text-amber-300/80 text-xs">
            ✦ No profile loaded — house positions use the natural zodiac (Aries = Area 1).
            Load a profile for your personal house cusps.
          </div>
        )}
      </div>

      {/* 12 Area Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LIFE_AREAS.map((area, index) => {
          const transitPlanets = getActivationsForHouse(area.house, activations);
          const natalPlanetNames = natalByHouse.get(area.house) ?? [];

          return (
            <LifeAreaCard
              key={area.house}
              area={area}
              transitPlanets={transitPlanets}
              natalPlanetNames={natalPlanetNames}
              index={index}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 p-4 rounded-xl bg-surface-base/50 border border-theme-border-subtle">
        <p className="text-xs text-theme-text-tertiary mb-2 font-medium uppercase tracking-wider">
          How to read this
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-theme-text-tertiary">
          <p>
            <span className="text-theme-text-secondary">Transiting now</span> — planets currently moving
            through this area of your chart, bringing their archetypal energy to this life domain.
          </p>
          <p>
            <span className="text-theme-text-secondary">Natal placements</span> — planets that were in this
            house at birth, permanently colouring how you experience this area.
          </p>
        </div>
      </div>
    </div>
  );
}
