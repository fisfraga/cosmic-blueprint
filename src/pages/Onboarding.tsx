import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '../context';
import { useAuth } from '../context/AuthContext';
import { generateProfileId } from '../services/profiles';
import { calculateProfilesFromBirthData } from '../services/chartCalculation';
import { AuthModal } from '../components/AuthModal';
import type { AstroProfile, BirthData } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'Eastern (US)' },
  { value: 'America/Chicago', label: 'Central (US)' },
  { value: 'America/Denver', label: 'Mountain (US)' },
  { value: 'America/Los_Angeles', label: 'Pacific (US)' },
  { value: 'America/Sao_Paulo', label: 'Brazil — São Paulo' },
  { value: 'America/Buenos_Aires', label: 'Argentina' },
  { value: 'Europe/London', label: 'UK — London' },
  { value: 'Europe/Paris', label: 'Central Europe' },
  { value: 'Europe/Lisbon', label: 'Portugal — Lisbon' },
  { value: 'Africa/Johannesburg', label: 'South Africa' },
  { value: 'Asia/Dubai', label: 'Gulf — Dubai' },
  { value: 'Asia/Kolkata', label: 'India' },
  { value: 'Asia/Tokyo', label: 'Japan' },
  { value: 'Australia/Sydney', label: 'Australia — Sydney' },
  { value: 'Pacific/Auckland', label: 'New Zealand' },
];

function getSunSign(dateStr: string): string {
  const d = new Date(dateStr);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) return 'Aries ♈';
  if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) return 'Taurus ♉';
  if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) return 'Gemini ♊';
  if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) return 'Cancer ♋';
  if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) return 'Leo ♌';
  if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) return 'Virgo ♍';
  if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return 'Libra ♎';
  if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return 'Scorpio ♏';
  if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return 'Sagittarius ♐';
  if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) return 'Capricorn ♑';
  if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) return 'Aquarius ♒';
  return 'Pisces ♓';
}

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4 | 5;

interface RevealData {
  sunSign: string;
  hdType: string | null;
  lifesWorkKey: number | null;
}

// ─── Step indicator ──────────────────────────────────────────────────────────

function StepDots({ current }: { current: Step }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {([1, 2, 3, 4, 5] as Step[]).map((s) => (
        <div
          key={s}
          className={[
            'rounded-full transition-all duration-300',
            s === current
              ? 'h-2 w-6 bg-amber-400'
              : s < current
              ? 'h-2 w-2 bg-amber-600/60'
              : 'h-2 w-2 bg-surface-interactive',
          ].join(' ')}
        />
      ))}
    </div>
  );
}

// ─── Step 1: Welcome ─────────────────────────────────────────────────────────

function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center px-6 py-16 min-h-[70vh]"
    >
      {/* Animated sacred symbol */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
        className="relative mb-10"
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-[spin_20s_linear_infinite]" style={{ width: '160px', height: '160px', top: '-12px', left: '-12px' }} />
        {/* Inner ring */}
        <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-[spin_12s_linear_infinite_reverse]" style={{ width: '130px', height: '130px', top: '3px', left: '3px' }} />
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-amber-950/60 via-neutral-900/80 to-purple-950/60 border border-theme-border-subtle/50 shadow-2xl shadow-amber-900/20">
          <span className="text-5xl leading-none select-none">✦</span>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mb-4 font-serif text-4xl md:text-5xl font-bold tracking-tight"
      >
        <span className="bg-gradient-to-r from-amber-300 via-white to-purple-300 bg-clip-text text-transparent">
          Your Cosmic Blueprint Awaits
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mb-3 max-w-md text-lg text-theme-text-secondary leading-relaxed"
      >
        The moment you arrived holds an encoded map of your nature,
        gifts, and life's purpose.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, duration: 0.6 }}
        className="mb-12 max-w-sm text-sm text-theme-text-tertiary leading-relaxed"
      >
        Six ancient wisdom traditions — Astrology, Human Design, Gene Keys,
        Numerology, Chakras, and Hermetic Philosophy — decoded from your birth data.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        onClick={onNext}
        className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-600 to-purple-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-amber-900/30 transition-all hover:shadow-amber-600/30 hover:from-amber-500 hover:to-purple-500 active:scale-[0.98]"
      >
        Begin Your Journey
        <span className="transition-transform group-hover:translate-x-1">✦</span>
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.4 }}
        className="mt-5 text-xs text-theme-text-muted"
      >
        No account required · Your data stays on your device
      </motion.p>
    </motion.div>
  );
}

// ─── Step 2: Birth Data ───────────────────────────────────────────────────────

interface StepBirthDataProps {
  onSuccess: (data: RevealData) => void;
}

function StepBirthData({ onSuccess }: StepBirthDataProps) {
  const { saveProfile } = useProfile();
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [cityOfBirth, setCityOfBirth] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!name.trim() || !dateOfBirth || !timeOfBirth || !cityOfBirth.trim()) {
        setError('Please fill in all fields above.');
        return;
      }
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        setError('Enter a valid latitude (−90 to 90).');
        return;
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        setError('Enter a valid longitude (−180 to 180).');
        return;
      }

      setIsSubmitting(true);
      try {
        const profileId = generateProfileId(name);
        const birthData: BirthData = {
          dateOfBirth,
          timeOfBirth,
          timezone,
          latitude: lat,
          longitude: lng,
          cityOfBirth: cityOfBirth.trim(),
        };

        let geneKeysProfile;
        let humanDesignProfile;
        try {
          const calculated = calculateProfilesFromBirthData(birthData);
          geneKeysProfile = calculated.geneKeysProfile;
          humanDesignProfile = calculated.humanDesignProfile;
        } catch (calcErr) {
          console.warn('Chart calculation error:', calcErr);
        }

        const newProfile: AstroProfile = {
          id: profileId,
          name: name.trim(),
          relationship: 'Me',
          dateOfBirth,
          timeOfBirth,
          cityOfBirth: cityOfBirth.trim(),
          coordinates: { latitude: lat, longitude: lng, timezone },
          placements: [],
          housePositions: [],
          aspects: { planetary: [], other: [] },
          configurations: [],
          elementalAnalysis: {
            id: `${profileId}-elemental`,
            profileId,
            fire: 0,
            earth: 0,
            air: 0,
            water: 0,
            firePlanetIds: [],
            earthPlanetIds: [],
            airPlanetIds: [],
            waterPlanetIds: [],
            dominant: '',
            deficient: '',
          },
          chartRulers: { traditional: '', modern: '' },
          geneKeysProfile,
          humanDesignProfile,
          profileVersion: 1,
        };

        saveProfile(newProfile);

        onSuccess({
          sunSign: getSunSign(dateOfBirth),
          hdType: humanDesignProfile?.type ?? null,
          lifesWorkKey: geneKeysProfile?.lifesWork?.geneKeyNumber ?? null,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create profile');
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      name,
      dateOfBirth,
      timeOfBirth,
      cityOfBirth,
      latitude,
      longitude,
      timezone,
      saveProfile,
      onSuccess,
    ]
  );

  const inputClass =
    'w-full rounded-lg border border-theme-border-subtle bg-surface-raised px-4 py-2.5 text-theme-text-primary placeholder-neutral-500 focus:border-amber-500/60 focus:outline-none transition-colors text-sm';

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-lg px-4 py-8"
    >
      <div className="mb-7 text-center">
        <div className="mb-3 text-3xl">🌌</div>
        <h2 className="mb-2 text-2xl font-boldtext-theme-text-primary">Enter Your Birth Moment</h2>
        <p className="text-sm text-theme-text-secondary leading-relaxed">
          The moment you arrived holds everything. Your exact birth time and
          location allow the cosmos to speak.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="mb-1 block text-xs font-medium text-theme-text-secondary uppercase tracking-wide">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className={inputClass}
          />
        </div>

        {/* Date / Time row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-theme-text-secondary uppercase tracking-wide">
              Date of Birth
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-theme-text-secondary uppercase tracking-wide">
              Time of Birth
            </label>
            <input
              type="time"
              value={timeOfBirth}
              onChange={(e) => setTimeOfBirth(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* City of Birth */}
        <div>
          <label className="mb-1 block text-xs font-medium text-theme-text-secondary uppercase tracking-wide">
            City of Birth
          </label>
          <input
            type="text"
            value={cityOfBirth}
            onChange={(e) => setCityOfBirth(e.target.value)}
            placeholder="e.g., São Paulo, Brazil"
            className={inputClass}
          />
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-theme-text-secondary uppercase tracking-wide">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="-23.5505"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-theme-text-secondary uppercase tracking-wide">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="-46.6333"
              className={inputClass}
            />
          </div>
        </div>

        <p className="text-[11px] text-theme-text-tertiary">
          Find your city's coordinates at{' '}
          <a
            href="https://www.latlong.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500/80 hover:text-amber-400 underline"
          >
            latlong.net
          </a>
        </p>

        {/* Timezone */}
        <div>
          <label className="mb-1 block text-xs font-medium text-theme-text-secondary uppercase tracking-wide">
            Timezone
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className={inputClass}
          >
            {TIMEZONE_OPTIONS.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-800/50 bg-red-950/30 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-full bg-gradient-to-r from-amber-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-amber-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Calculating your blueprint…
            </span>
          ) : (
            'Reveal My Blueprint ✦'
          )}
        </button>
      </form>
    </motion.div>
  );
}

// ─── Step 3: Chart Revelation ─────────────────────────────────────────────────

function StepReveal({
  data,
  onNext,
}: {
  data: RevealData;
  onNext: () => void;
}) {
  const signatures = [
    {
      label: 'Sun Sign',
      value: data.sunSign,
      description: 'Your solar essence — the core of who you are',
      color: 'from-amber-600/30 to-amber-900/10',
      border: 'border-amber-700/40',
      icon: '☀️',
    },
    {
      label: 'Human Design Type',
      value: data.hdType ?? 'Calculating…',
      description: 'How your energy operates in the world',
      color: 'from-orange-600/20 to-orange-900/10',
      border: 'border-orange-700/40',
      icon: '⬡',
    },
    {
      label: "Life's Work Gene Key",
      value: data.lifesWorkKey ? `Gene Key ${data.lifesWorkKey}` : 'Calculating…',
      description: "Your soul's primary transformational gift",
      color: 'from-purple-600/20 to-purple-900/10',
      border: 'border-purple-700/40',
      icon: '🔑',
    },
  ];

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-lg px-4 py-10 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-2 text-4xl"
      >
        ✦
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-2 text-2xl font-boldtext-theme-text-primary"
      >
        Your Three Cosmic Signatures
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mb-8 text-sm text-theme-text-secondary"
      >
        Each tradition reveals a different facet of the same infinite you.
      </motion.p>

      <div className="mb-8 flex flex-col gap-4">
        {signatures.map((sig, i) => (
          <motion.div
            key={sig.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.15, duration: 0.4 }}
            className={`rounded-xl border bg-gradient-to-br ${sig.color} ${sig.border} p-5 text-left shadow-sm`}
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xl leading-none">{sig.icon}</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-theme-text-tertiary">
                {sig.label}
              </span>
            </div>
            <p className="text-xl font-boldtext-theme-text-primary">{sig.value}</p>
            <p className="mt-0.5 text-xs text-theme-text-tertiary">{sig.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        onClick={onNext}
        className="w-full rounded-full bg-gradient-to-r from-amber-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-amber-500 hover:to-purple-500 active:scale-[0.99]"
      >
        Explore Your Full Blueprint →
      </motion.button>
    </motion.div>
  );
}

// ─── Step 4: Contemplation Preview ───────────────────────────────────────────

function StepContemplation({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-lg px-4 py-10 text-center"
    >
      <div className="mb-6 text-4xl">🔮</div>
      <h2 className="mb-3 text-2xl font-boldtext-theme-text-primary">
        The Contemplation Chamber
      </h2>
      <p className="mb-8 text-sm leading-relaxed text-theme-text-secondary">
        Your blueprint comes alive through contemplation. The AI guides you
        through personalized readings — from natal chart insight to Gene Keys
        activation and Human Design strategy.
      </p>

      {/* Preview card */}
      <div className="mb-8 rounded-2xl border border-amber-800/30 bg-gradient-to-br from-amber-950/40 via-neutral-900/60 to-purple-950/30 p-6 text-left shadow-xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-amber-500/70">
          32 contemplation types · 6 AI personas
        </p>
        <div className="mb-3 space-y-2 text-sm text-theme-text-secondary">
          {[
            '✦ Soul Blueprint Overview',
            '✦ Natal Chart Deep Dive',
            '✦ Gene Key Activation',
            '✦ Human Design Strategy',
            '✦ Life Area Alignment',
            '✦ Cross-System Synthesis',
          ].map((item) => (
            <p key={item} className="leading-relaxed">
              {item}
            </p>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          to="/contemplate"
          className="w-full rounded-full bg-gradient-to-r from-amber-600 to-purple-600 py-3 text-center text-sm font-semibold text-white shadow-lg transition-all hover:from-amber-500 hover:to-purple-500"
        >
          Open the Contemplation Chamber ✦
        </Link>
        <button
          onClick={onNext}
          className="py-2 text-sm text-theme-text-tertiary hover:text-theme-text-secondary transition-colors"
        >
          Continue setup →
        </button>
      </div>
    </motion.div>
  );
}

// ─── Step 5: Save Invitation ──────────────────────────────────────────────────

function StepSave() {
  const navigate = useNavigate();
  const { isConfigured, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // If already signed in, skip invitation
  if (user) {
    return (
      <motion.div
        key="step5-signed-in"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto w-full max-w-md px-4 py-14 text-center"
      >
        <div className="mb-4 text-5xl">✨</div>
        <h2 className="mb-3 text-2xl font-boldtext-theme-text-primary">You're All Set</h2>
        <p className="mb-8 text-sm text-theme-text-secondary">
          Your blueprint is saved and synced. The temple awaits.
        </p>
        <button
          onClick={() => navigate('/profile')}
          className="w-full rounded-full bg-gradient-to-r from-amber-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-amber-500 hover:to-purple-500"
        >
          Enter the Temple →
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="step5"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-md px-4 py-10 text-center"
    >
      <div className="mb-4 text-4xl">🕯</div>
      <h2 className="mb-3 text-2xl font-boldtext-theme-text-primary">
        Your Reading Is Ready
      </h2>
      <p className="mb-2 text-base text-theme-text-secondary">
        Save it for any device. Access your blueprint anywhere.
      </p>
      <p className="mb-8 text-sm text-theme-text-tertiary">
        We use Magic Link — no password needed, just your email.
      </p>

      <div className="mb-8 flex flex-col gap-3">
        {isConfigured ? (
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full rounded-full bg-gradient-to-r from-amber-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-amber-500 hover:to-purple-500"
          >
            Save My Blueprint ✦
          </button>
        ) : (
          <div className="rounded-xl border border-theme-border-subtle bg-surface-base p-4 text-left">
            <p className="text-xs text-theme-text-secondary">
              Cloud sync is coming soon. Your blueprint is safely stored on this
              device for now.
            </p>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="py-2 text-sm text-theme-text-tertiary hover:text-theme-text-secondary transition-colors"
        >
          Continue without saving →
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-theme-text-muted">
          Your data is stored locally and never shared without your consent.
        </p>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function Onboarding() {
  const [step, setStep] = useState<Step>(1);
  const [revealData, setRevealData] = useState<RevealData | null>(null);

  const handleBirthSuccess = (data: RevealData) => {
    setRevealData(data);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Subtle starfield background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Radial gradient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(217,119,6,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_110%,rgba(124,58,237,0.06),transparent)]" />
      </div>

      <div className="relative mx-auto max-w-2xl">
        {/* Step dots — hidden on step 1 */}
        {step !== 1 && <StepDots current={step} />}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepWelcome key="s1" onNext={() => setStep(2)} />
          )}
          {step === 2 && (
            <StepBirthData key="s2" onSuccess={handleBirthSuccess} />
          )}
          {step === 3 && revealData && (
            <StepReveal key="s3" data={revealData} onNext={() => setStep(4)} />
          )}
          {step === 4 && (
            <StepContemplation key="s4" onNext={() => setStep(5)} />
          )}
          {step === 5 && <StepSave key="s5" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Onboarding;
