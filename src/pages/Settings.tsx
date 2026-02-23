import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useFeatureFlags } from '../context';
import {
  FLAG_METADATA,
  type FeatureFlagId,
} from '../services/featureFlags';

// Group flags by domain for display
const FLAG_GROUPS: { title: string; domain: string; description: string }[] = [
  {
    title: 'Contemplation Chamber',
    domain: 'contemplation',
    description: 'Control which themed categories appear in the chamber\'s category selector.',
  },
  {
    title: 'Knowledge Base Teachers',
    domain: 'kb',
    description: 'Toggle types contributed by specific teachers and methodologies.',
  },
  {
    title: 'Library Navigation',
    domain: 'library',
    description: 'Show or hide sections in the Library mega-menu.',
  },
];

function ToggleRow({
  flagId,
  label,
  description,
  enabled,
  onToggle,
}: {
  flagId: FeatureFlagId;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-theme-border-subtle last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-theme-text-primary">{label}</p>
        <p className="text-xs text-theme-text-tertiary mt-0.5">{description}</p>
        <p className="text-xs text-theme-text-muted mt-0.5 font-mono opacity-50">{flagId}</p>
      </div>
      <button
        role="switch"
        aria-checked={enabled}
        aria-label={`Toggle ${label}`}
        onClick={onToggle}
        className={`relative flex-shrink-0 w-10 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
          enabled ? 'bg-purple-500' : 'bg-theme-border'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            enabled ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { isEnabled, setFlag, resetAll } = useFeatureFlags();

  const flagsByDomain = (domain: string): FeatureFlagId[] =>
    (Object.keys(FLAG_METADATA) as FeatureFlagId[]).filter(
      id => FLAG_METADATA[id].domain === domain,
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="font-serif text-3xl mb-2 text-theme-text-primary">Settings</h1>
      <p className="text-theme-text-secondary mb-8">
        Customize your Cosmic Temple experience.
      </p>

      {/* App Preferences */}
      <section className="bg-surface-raised rounded-xl p-6 border border-theme-border mb-6">
        <h2 className="font-serif text-lg text-theme-text-primary mb-4">App Preferences</h2>
        <div className="flex items-start justify-between gap-4 py-3">
          <div>
            <p className="text-sm font-medium text-theme-text-primary">Theme</p>
            <p className="text-xs text-theme-text-tertiary mt-0.5">Choose between dark and light mode.</p>
          </div>
          <div className="flex gap-2">
            {(['dark', 'light'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                  theme === t
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                    : 'border-theme-border-subtle text-theme-text-secondary hover:border-theme-border'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Flag Groups */}
      {FLAG_GROUPS.map((group) => {
        const ids = flagsByDomain(group.domain);
        if (ids.length === 0) return null;
        return (
          <section
            key={group.domain}
            className="bg-surface-raised rounded-xl p-6 border border-theme-border mb-6"
          >
            <h2 className="font-serif text-lg text-theme-text-primary mb-1">{group.title}</h2>
            <p className="text-xs text-theme-text-tertiary mb-4">{group.description}</p>
            <div>
              {ids.map((id) => (
                <ToggleRow
                  key={id}
                  flagId={id}
                  label={FLAG_METADATA[id].label}
                  description={FLAG_METADATA[id].description}
                  enabled={isEnabled(id)}
                  onToggle={() => setFlag(id, !isEnabled(id))}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* Reset */}
      <section className="bg-surface-raised rounded-xl p-6 border border-theme-border mb-8">
        <h2 className="font-serif text-lg text-theme-text-primary mb-1">Reset All Flags</h2>
        <p className="text-xs text-theme-text-tertiary mb-4">
          Restore all feature flags to their defaults (all enabled). This clears your local overrides.
        </p>
        <button
          onClick={resetAll}
          className="px-4 py-2 rounded-lg text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
        >
          Reset to defaults
        </button>
      </section>
    </motion.div>
  );
}
