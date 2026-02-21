import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfile } from '../context';
import { planets, signs, geneKeys, numerologyNumbers, chakras, hermeticPrinciples } from '../data';
import { CosmicWeatherWidget } from '../components/CosmicWeatherWidget';
import { useAuth } from '../context/AuthContext';
import { loadInsights } from '../services/insights';
import type { SavedInsight } from '../services/insights';

// ─── Tradition configuration ──────────────────────────────────────────────────
interface TraditionConfig {
  id: string;
  name: string;
  tagline: string;
  path: string;
  icon: string;
  colorFrom: string;
  colorTo: string;
  borderColor: string;
  hoverBorder: string;
  textColor: string;
  getCount: () => number;
}

const traditions: TraditionConfig[] = [
  {
    id: 'astrology',
    name: 'Astrology',
    tagline: 'The celestial language of WHO you are',
    path: '/planets',
    icon: '☉',
    colorFrom: 'from-air-500/15',
    colorTo: 'to-air-600/5',
    borderColor: 'border-air-500/25',
    hoverBorder: 'hover:border-air-400/50',
    textColor: 'text-air-300',
    getCount: () => 10 + 12 + 12, // planets + signs + houses
  },
  {
    id: 'human-design',
    name: 'Human Design',
    tagline: 'The mechanics of HOW you operate',
    path: '/human-design',
    icon: '⬡',
    colorFrom: 'from-amber-500/15',
    colorTo: 'to-amber-600/5',
    borderColor: 'border-amber-500/25',
    hoverBorder: 'hover:border-amber-400/50',
    textColor: 'text-humandesign-300',
    getCount: () => 64 + 36 + 9, // gates + channels + centers
  },
  {
    id: 'gene-keys',
    name: 'Gene Keys',
    tagline: 'The path of TRANSFORMATION — Shadow to Siddhi',
    path: '/gene-keys',
    icon: '✧',
    colorFrom: 'from-genekey-500/15',
    colorTo: 'to-genekey-600/5',
    borderColor: 'border-genekey-500/25',
    hoverBorder: 'hover:border-genekey-400/50',
    textColor: 'text-genekey-300',
    getCount: () => geneKeys.size,
  },
  {
    id: 'numerology',
    name: 'Numerology',
    tagline: 'Numbers as dimensional frequencies of consciousness',
    path: '/numerology',
    icon: '∞',
    colorFrom: 'from-cyan-500/15',
    colorTo: 'to-cyan-600/5',
    borderColor: 'border-cyan-500/25',
    hoverBorder: 'hover:border-cyan-400/50',
    textColor: 'text-cyan-300',
    getCount: () => numerologyNumbers.size,
  },
  {
    id: 'chakras',
    name: 'Chakras',
    tagline: 'The energy column mapping body, emotion, and spirit',
    path: '/chakras',
    icon: '◎',
    colorFrom: 'from-emerald-500/15',
    colorTo: 'to-emerald-600/5',
    borderColor: 'border-emerald-500/25',
    hoverBorder: 'hover:border-emerald-400/50',
    textColor: 'text-emerald-300',
    getCount: () => chakras.size,
  },
  {
    id: 'hermetic',
    name: 'Hermetic Laws',
    tagline: 'The seven axioms that underpin all wisdom traditions',
    path: '/hermetic',
    icon: '⚚',
    colorFrom: 'from-amber-500/15',
    colorTo: 'to-yellow-600/5',
    borderColor: 'border-amber-500/25',
    hoverBorder: 'hover:border-amber-400/50',
    textColor: 'text-amber-300',
    getCount: () => hermeticPrinciples.size,
  },
];

// ─── Exploration tools ─────────────────────────────────────────────────────────
const explorationTools = [
  { title: 'Celestial Wheel', path: '/wheel', icon: '☉', description: 'Interactive zodiac mandala', color: 'purple' },
  { title: 'Cosmic Graph', path: '/graph', icon: '⚭', description: 'Force-directed relationship map', color: 'blue' },
  { title: 'Aspect Weaver', path: '/weaver', icon: '⟁', description: 'Geometric aspect explorer', color: 'cyan' },
  { title: 'Element Realms', path: '/realms', icon: '🜂', description: 'Journey through the four elements', color: 'orange' },
  { title: 'Cosmic Weather', path: '/transits', icon: '🌙', description: 'Live transit readings', color: 'teal' },
  { title: 'Guided Pathways', path: '/pathways', icon: '✨', description: 'Step-by-step contemplation journeys', color: 'rose' },
];

const toolColors: Record<string, string> = {
  purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-400/40',
  blue: 'from-air-500/10 to-air-600/5 border-air-500/20 hover:border-air-400/40',
  cyan: 'from-cyan-500/10 to-cyan-600/5 border-cyan-500/20 hover:border-cyan-400/40',
  orange: 'from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-400/40',
  teal: 'from-teal-500/10 to-teal-600/5 border-teal-500/20 hover:border-teal-400/40',
  rose: 'from-rose-500/10 to-rose-600/5 border-rose-500/20 hover:border-rose-400/40',
};

// Profile names for HD
const profileNames: Record<string, string> = {
  '1/3': 'Investigator / Martyr', '1/4': 'Investigator / Opportunist',
  '2/4': 'Hermit / Opportunist', '2/5': 'Hermit / Heretic',
  '3/5': 'Martyr / Heretic', '3/6': 'Martyr / Role Model',
  '4/6': 'Opportunist / Role Model', '4/1': 'Opportunist / Investigator',
  '5/1': 'Heretic / Investigator', '5/2': 'Heretic / Hermit',
  '6/2': 'Role Model / Hermit', '6/3': 'Role Model / Martyr',
};

// ─── TraditionCard component ───────────────────────────────────────────────────
function TraditionCard({ tradition, index }: { tradition: TraditionConfig; index: number }) {
  const count = tradition.getCount();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
    >
      <Link
        to={tradition.path}
        className={`group block bg-gradient-to-br ${tradition.colorFrom} ${tradition.colorTo} rounded-xl p-5 border ${tradition.borderColor} ${tradition.hoverBorder} transition-all hover:bg-neutral-900/70`}
      >
        <div className="flex items-start justify-between mb-3">
          <span className={`text-2xl ${tradition.textColor}`}>{tradition.icon}</span>
          <span className="text-xs text-neutral-600">{count} entities</span>
        </div>
        <h3 className={`font-serif text-lg font-medium ${tradition.textColor} group-hover:brightness-125 transition-all mb-1`}>
          {tradition.name}
        </h3>
        <p className="text-neutral-500 text-sm leading-relaxed">{tradition.tagline}</p>
        <div className={`mt-3 text-xs ${tradition.textColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
          Explore →
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main Home component ───────────────────────────────────────────────────────
export function Home() {
  const { profile, hasProfile } = useProfile();
  const { user, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [expandedIdentity, setExpandedIdentity] = useState(false);
  const [recentInsights, setRecentInsights] = useState<SavedInsight[]>([]);

  useEffect(() => {
    const all = loadInsights();
    setRecentInsights(all.slice(0, 3));
  }, []);

  const sunSign = hasProfile && profile?.placements
    ? signs.get(profile.placements.find(p => p.planetId === 'sun')?.signId || '')
    : null;
  const moonSign = hasProfile && profile?.placements
    ? signs.get(profile.placements.find(p => p.planetId === 'moon')?.signId || '')
    : null;
  const risingSign = hasProfile && profile?.placements
    ? signs.get(profile.placements.find(p => p.planetId === 'ascendant' || p.planetId === 'asc')?.signId || '')
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-14"
    >
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative text-center py-12 overflow-hidden">
        {/* Background sacred geometry decoration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[18rem] text-neutral-900/30 font-serif leading-none">✦</span>
        </div>

        <motion.div
          initial={{ scale: 0.93, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-2xl text-neutral-600">—</span>
            <span className="text-neutral-500 text-sm uppercase tracking-[0.3em]">A Digital Temple</span>
            <span className="text-2xl text-neutral-600">—</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-medium mb-4 bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Cosmic Blueprint
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto leading-relaxed">
            Bridging six ancient wisdom traditions through a single birth moment —
            from the stars above to the sacred geometry within.
          </p>

          {!hasProfile && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex items-center justify-center gap-4 flex-wrap"
            >
              <button
                onClick={() => navigate('/onboarding')}
                className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-cyan-500/20"
              >
                Begin Your Journey ✦
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="px-8 py-3 border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white rounded-xl transition-all"
              >
                Enter Birth Data
              </button>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ── COSMIC IDENTITY (profile exists) ──────────────────────────────────── */}
      {hasProfile && profile && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="text-xl text-neutral-400">✦</span>
              <h2 className="font-serif text-xl text-white">
                {profile.name ? `${profile.name}'s Blueprint` : 'Your Cosmic Blueprint'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpandedIdentity(!expandedIdentity)}
                className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {expandedIdentity ? 'Less' : 'More'}
              </button>
              <Link to="/profile" className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors">
                Full profile →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Astrology */}
            <div className="bg-gradient-to-br from-air-500/10 to-air-600/5 rounded-xl p-5 border border-air-500/20">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg text-air-400">☉</span>
                <h3 className="font-serif text-base text-air-300">Astrology</h3>
              </div>
              <div className="space-y-2">
                {sunSign && (
                  <Link to={`/signs/${sunSign.id}`} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-air-500/10 transition-colors group">
                    <span className="w-7 h-7 flex items-center justify-center text-base bg-air-500/20 text-air-400 rounded-full">{planets.get('sun')?.symbol}</span>
                    <div><p className="text-neutral-500 text-xs">Sun</p><p className="text-white text-sm">{sunSign.name}</p></div>
                  </Link>
                )}
                {moonSign && (
                  <Link to={`/signs/${moonSign.id}`} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-air-500/10 transition-colors group">
                    <span className="w-7 h-7 flex items-center justify-center text-base bg-air-500/20 text-air-400 rounded-full">{planets.get('moon')?.symbol}</span>
                    <div><p className="text-neutral-500 text-xs">Moon</p><p className="text-white text-sm">{moonSign.name}</p></div>
                  </Link>
                )}
                {risingSign && (
                  <Link to={`/signs/${risingSign.id}`} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-air-500/10 transition-colors group">
                    <span className="w-7 h-7 flex items-center justify-center text-xs bg-air-500/20 text-air-400 rounded-full font-medium">AC</span>
                    <div><p className="text-neutral-500 text-xs">Rising</p><p className="text-white text-sm">{risingSign.name}</p></div>
                  </Link>
                )}
              </div>
              <Link to="/profile/astrology" className="mt-3 block text-xs text-air-400 hover:text-air-300 transition-colors">
                Full chart →
              </Link>
            </div>

            {/* Gene Keys */}
            <div className="bg-gradient-to-br from-genekey-500/10 to-genekey-600/5 rounded-xl p-5 border border-genekey-500/20">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg text-genekey-400">✧</span>
                <h3 className="font-serif text-base text-genekey-300">Gene Keys</h3>
              </div>
              {profile.geneKeysProfile ? (
                <div className="space-y-2">
                  {[
                    { sphere: profile.geneKeysProfile.lifesWork, label: "Life's Work" },
                    { sphere: profile.geneKeysProfile.evolution, label: 'Evolution' },
                    { sphere: profile.geneKeysProfile.radiance, label: 'Radiance' },
                  ].map(({ sphere, label }) => {
                    const gk = geneKeys.get(sphere.geneKeyId);
                    return (
                      <Link key={sphere.geneKeyId} to={`/gene-keys/${sphere.geneKeyId}`} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-genekey-500/10 transition-colors group">
                        <span className="w-7 h-7 flex items-center justify-center text-xs font-medium bg-genekey-500/20 text-genekey-400 rounded-full">{sphere.geneKeyNumber}</span>
                        <div className="min-w-0"><p className="text-neutral-500 text-xs">{label}</p><p className="text-white text-sm truncate">{gk?.gift.name}</p></div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-neutral-400 text-sm">Your Gene Keys journey awaits.</p>
              )}
              <Link to="/profile/gene-keys" className="mt-3 block text-xs text-genekey-400 hover:text-genekey-300 transition-colors">
                Golden Path →
              </Link>
            </div>

            {/* Human Design */}
            <div className="bg-gradient-to-br from-humandesign-500/10 to-humandesign-600/5 rounded-xl p-5 border border-humandesign-500/20">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg text-humandesign-400">⬡</span>
                <h3 className="font-serif text-base text-humandesign-300">Human Design</h3>
              </div>
              {profile.humanDesignProfile ? (
                <div className="space-y-2">
                  {[
                    { label: 'Type', value: profile.humanDesignProfile.type, icon: '◉' },
                    { label: 'Strategy', value: profile.humanDesignProfile.strategy, icon: '→' },
                    { label: 'Authority', value: profile.humanDesignProfile.authority, icon: '⌖' },
                    { label: 'Profile', value: profileNames[profile.humanDesignProfile.profile] || profile.humanDesignProfile.profile, icon: '⟁' },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="flex items-center gap-3 p-2 -mx-2">
                      <span className="w-7 h-7 flex items-center justify-center text-xs bg-humandesign-500/20 text-humandesign-400 rounded-full">{icon}</span>
                      <div><p className="text-neutral-500 text-xs">{label}</p><p className="text-white text-sm">{value}</p></div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-400 text-sm">Discover your energy type and authority.</p>
              )}
              <Link to="/profile/human-design" className="mt-3 block text-xs text-humandesign-400 hover:text-humandesign-300 transition-colors">
                Body graph →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── COSMIC WEATHER ───────────────────────────────────────────────────── */}
      <section className="max-w-lg">
        <CosmicWeatherWidget />
      </section>

      {/* ── SIX TRADITIONS ────────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-neutral-600 text-sm uppercase tracking-[0.2em]">The Six Traditions</span>
        </div>
        <h2 className="font-serif text-2xl text-white mb-1">Wisdom Gateway</h2>
        <p className="text-neutral-500 text-sm mb-6 max-w-2xl">
          Each tradition is a complete language for self-knowledge. Together they form a unified map of consciousness.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {traditions.map((tradition, i) => (
            <TraditionCard key={tradition.id} tradition={tradition} index={i} />
          ))}
        </div>
      </section>

      {/* ── EXPLORATION TOOLS ─────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-neutral-600 text-sm uppercase tracking-[0.2em]">Interactive Tools</span>
        </div>
        <h2 className="font-serif text-2xl text-white mb-1">Explore & Visualize</h2>
        <p className="text-neutral-500 text-sm mb-6">
          See the connections. Feel the patterns. Navigate the cosmic web.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {explorationTools.map((tool, index) => (
            <motion.div
              key={tool.path}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.06 }}
            >
              <Link
                to={tool.path}
                className={`group block p-5 rounded-xl border bg-gradient-to-br transition-all ${toolColors[tool.color]}`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{tool.icon}</span>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-neutral-200 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-neutral-500 text-sm mt-0.5">{tool.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── RECENT INSIGHTS ───────────────────────────────────────────────────── */}
      {recentInsights.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-neutral-600 text-sm uppercase tracking-[0.2em]">Your Journal</span>
              <h2 className="font-serif text-2xl text-white mt-0.5">Recent Insights</h2>
            </div>
            <Link to="/insights" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentInsights.map((insight) => {
              const categoryColors: Record<string, string> = {
                astrology: 'border-air-500/30 text-air-400',
                humanDesign: 'border-amber-500/30 text-amber-400',
                geneKeys: 'border-purple-500/30 text-purple-400',
                crossSystem: 'border-cyan-500/30 text-cyan-400',
                lifeOS: 'border-emerald-500/30 text-emerald-400',
              };
              const colors = categoryColors[insight.category] || 'border-neutral-700 text-neutral-400';
              const dateStr = new Date(insight.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric',
              });
              return (
                <div
                  key={insight.id}
                  className={`p-4 rounded-xl bg-neutral-900/50 border border-l-2 border-neutral-800 ${colors.split(' ')[0]} transition-colors`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className={`text-xs font-medium uppercase tracking-wide ${colors.split(' ')[1]}`}>
                      {insight.category === 'humanDesign' ? 'Human Design' :
                       insight.category === 'geneKeys' ? 'Gene Keys' :
                       insight.category === 'crossSystem' ? 'Cross-System' :
                       insight.category === 'lifeOS' ? 'Life OS' :
                       insight.category}
                    </span>
                    <span className="text-xs text-neutral-600 flex-shrink-0">{dateStr}</span>
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed line-clamp-3">
                    {insight.content}
                  </p>
                  {insight.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {insight.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-xs text-neutral-600 bg-neutral-800 px-1.5 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-center">
            <Link to="/insights" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
              ✧ Open Contemplation Journal
            </Link>
          </div>
        </section>
      )}

      {/* ── CONTEMPLATION CTA ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-900/50 border border-neutral-800 p-8 text-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <span className="text-[12rem] font-serif">🕯</span>
        </div>
        <div className="relative">
          <p className="text-neutral-500 text-sm uppercase tracking-[0.2em] mb-3">AI-Guided Reflection</p>
          <h2 className="font-serif text-3xl mb-3">Contemplation Chamber</h2>
          <p className="text-neutral-400 max-w-xl mx-auto mb-6 text-sm leading-relaxed">
            Enter a sacred space for dialogue with your cosmic blueprint. Six AI personas —
            each a different lens for exploring your placements, transits, and evolutionary path.
          </p>
          <Link
            to="/contemplate"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-600/80 to-amber-500/80 hover:from-amber-500 hover:to-amber-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-amber-500/10"
          >
            <span>🕯</span>
            Enter the Chamber
          </Link>
        </div>
      </section>

      {/* ── AUTH INVITATION (Supabase configured, not signed in) ──────────────── */}
      {isConfigured && !user && (
        <section className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-cyan-600/0 p-6 flex items-center gap-5">
          <span className="text-3xl text-cyan-400 flex-shrink-0">✦</span>
          <div className="flex-1">
            <h3 className="font-serif text-base text-white mb-1">Save Your Blueprint Across Devices</h3>
            <p className="text-neutral-400 text-sm">Sign in with your email to sync your cosmic profile and contemplation journal.</p>
          </div>
          <Link
            to="/profile"
            className="flex-shrink-0 px-5 py-2 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 rounded-lg text-sm transition-colors"
          >
            Sign In
          </Link>
        </section>
      )}

      {/* ── FOOTER QUOTE ──────────────────────────────────────────────────────── */}
      <section className="text-center py-6 border-t border-neutral-900">
        <blockquote className="font-serif text-lg italic text-neutral-500 max-w-2xl mx-auto">
          "The stars don't determine our destiny — they illuminate the path."
        </blockquote>
      </section>
    </motion.div>
  );
}

export default Home;
