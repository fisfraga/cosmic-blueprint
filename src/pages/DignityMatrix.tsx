import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { planets, signs, getDignity, getSignsInOrder } from '../data';
import type { DignityEntry } from '../data';

const dignityColors = {
  Domicile: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', label: 'Domicile' },
  Exaltation: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', label: 'Exaltation' },
  Detriment: { bg: 'bg-rose-500/20', border: 'border-rose-500/50', text: 'text-rose-400', label: 'Detriment' },
  Fall: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400', label: 'Fall' },
};

const dignitySymbols = {
  Domicile: '⌂',
  Exaltation: '↑',
  Detriment: '⌂̶',
  Fall: '↓',
};

// Main planets for the matrix (excluding points)
const matrixPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

export function DignityMatrix() {
  const [selectedCell, setSelectedCell] = useState<DignityEntry | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ planetId: string; signId: string } | null>(null);

  const orderedSigns = getSignsInOrder();
  const orderedPlanets = matrixPlanets.map(id => planets.get(id)).filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-serif text-4xl font-medium text-white mb-3">
          Dignity Matrix
        </h1>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          Essential dignities show how planets express themselves in different signs.
          A planet in its domicile or exaltation is strengthened; in detriment or fall, it faces challenges.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {Object.entries(dignityColors).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded ${colors.bg} ${colors.border} border flex items-center justify-center`}>
              <span className={colors.text}>{dignitySymbols[type as keyof typeof dignitySymbols]}</span>
            </div>
            <span className="text-neutral-300 text-sm">{colors.label}</span>
          </div>
        ))}
      </div>

      {/* Matrix */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Header Row - Signs */}
          <div className="flex">
            <div className="w-24 shrink-0" /> {/* Empty corner */}
            {orderedSigns.map((sign) => (
              <Link
                key={sign.id}
                to={`/signs/${sign.id}`}
                className="flex-1 min-w-[60px] p-2 text-center hover:bg-neutral-800/50 rounded-t transition-colors"
              >
                <div className="text-xl mb-1">{sign.symbol}</div>
                <div className="text-xs text-neutral-400 hidden md:block">{sign.name}</div>
              </Link>
            ))}
          </div>

          {/* Planet Rows */}
          {orderedPlanets.map((planet) => (
            <div key={planet!.id} className="flex border-t border-neutral-800">
              {/* Planet Label */}
              <Link
                to={`/planets/${planet!.id}`}
                className="w-24 shrink-0 p-3 flex items-center gap-2 hover:bg-neutral-800/50 transition-colors"
              >
                <span className="text-xl">{planet!.symbol}</span>
                <span className="text-sm text-neutral-300 hidden md:block">{planet!.name}</span>
              </Link>

              {/* Dignity Cells */}
              {orderedSigns.map((sign) => {
                const dignity = getDignity(planet!.id, sign.id);
                const isHovered = hoveredCell?.planetId === planet!.id && hoveredCell?.signId === sign.id;
                const colors = dignity ? dignityColors[dignity.dignityType] : null;

                return (
                  <div
                    key={`${planet!.id}-${sign.id}`}
                    className={`flex-1 min-w-[60px] p-2 border-l border-neutral-800 flex items-center justify-center cursor-pointer transition-all ${
                      dignity
                        ? `${colors!.bg} ${isHovered ? colors!.border + ' border' : ''}`
                        : 'hover:bg-neutral-800/30'
                    }`}
                    onMouseEnter={() => setHoveredCell({ planetId: planet!.id, signId: sign.id })}
                    onMouseLeave={() => setHoveredCell(null)}
                    onClick={() => dignity && setSelectedCell(dignity)}
                  >
                    {dignity && (
                      <span className={`text-lg ${colors!.text}`}>
                        {dignitySymbols[dignity.dignityType]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Cell Detail */}
      <AnimatePresence>
        {selectedCell && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 max-w-lg w-full mx-4 z-50"
          >
            <div className={`${dignityColors[selectedCell.dignityType].bg} ${dignityColors[selectedCell.dignityType].border} border rounded-xl p-5 backdrop-blur-sm`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{planets.get(selectedCell.planetId)?.symbol}</span>
                  <span className="text-xl text-neutral-400">in</span>
                  <span className="text-2xl">{signs.get(selectedCell.signId)?.symbol}</span>
                </div>
                <button
                  onClick={() => setSelectedCell(null)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <h3 className={`font-serif text-xl ${dignityColors[selectedCell.dignityType].text} mb-2`}>
                {planets.get(selectedCell.planetId)?.name} in {selectedCell.dignityType}
              </h3>
              <p className="text-neutral-300 text-sm">
                {selectedCell.description}
              </p>
              <div className="flex gap-2 mt-4">
                <Link
                  to={`/planets/${selectedCell.planetId}`}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm rounded transition-colors"
                >
                  View {planets.get(selectedCell.planetId)?.name}
                </Link>
                <Link
                  to={`/signs/${selectedCell.signId}`}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm rounded transition-colors"
                >
                  View {signs.get(selectedCell.signId)?.name}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interpretation Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="bg-neutral-900/50 rounded-xl p-5 border border-neutral-800">
          <h3 className="font-serif text-lg text-emerald-400 mb-2">Dignified Planets</h3>
          <p className="text-neutral-400 text-sm mb-3">
            <strong className="text-emerald-400">Domicile:</strong> The planet is "at home" and expresses its nature freely and powerfully.
          </p>
          <p className="text-neutral-400 text-sm">
            <strong className="text-amber-400">Exaltation:</strong> The planet is "honored guest" and its best qualities are elevated.
          </p>
        </div>
        <div className="bg-neutral-900/50 rounded-xl p-5 border border-neutral-800">
          <h3 className="font-serif text-lg text-rose-400 mb-2">Challenged Planets</h3>
          <p className="text-neutral-400 text-sm mb-3">
            <strong className="text-rose-400">Detriment:</strong> The planet is in the sign opposite its domicile, requiring extra effort.
          </p>
          <p className="text-neutral-400 text-sm">
            <strong className="text-purple-400">Fall:</strong> The planet is in the sign opposite its exaltation, inviting deeper growth.
          </p>
        </div>
      </div>

      {/* Personal Chart Connection */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl text-white mb-2">See Your Dignities</h3>
            <p className="text-neutral-400 text-sm">
              Check which of your natal planets have essential dignities in your personal chart.
            </p>
          </div>
          <Link
            to="/profile"
            className="px-5 py-2.5 bg-white text-neutral-900 font-medium rounded-lg hover:bg-neutral-200 transition-colors"
          >
            View My Chart
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
export default DignityMatrix;
