import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useProfile } from '../context';
import { generateProfileId } from '../services/profiles';
import { calculateProfilesFromBirthData } from '../services/chartCalculation';
import {
  parseAstroSeekData,
  parseHumanDesignData,
  toHumanDesignProfile,
} from '../services/profileDataParser';
import type { AstroProfile, BirthData } from '../types';
import { LocationAutocomplete } from './LocationAutocomplete';
import type { GeocodingResult } from '../services/geocoding';
import { getTimezoneForLocation } from '../services/timezoneResolver';

// Common timezone options
const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'Eastern Time (US)' },
  { value: 'America/Chicago', label: 'Central Time (US)' },
  { value: 'America/Denver', label: 'Mountain Time (US)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
  { value: 'America/Sao_Paulo', label: 'Brazil (Sao Paulo)' },
  { value: 'America/Buenos_Aires', label: 'Argentina' },
  { value: 'Europe/London', label: 'UK (London)' },
  { value: 'Europe/Paris', label: 'Central Europe (Paris)' },
  { value: 'Europe/Berlin', label: 'Central Europe (Berlin)' },
  { value: 'Europe/Rome', label: 'Central Europe (Rome)' },
  { value: 'Europe/Madrid', label: 'Spain (Madrid)' },
  { value: 'Europe/Lisbon', label: 'Portugal (Lisbon)' },
  { value: 'Europe/Moscow', label: 'Russia (Moscow)' },
  { value: 'Asia/Tokyo', label: 'Japan (Tokyo)' },
  { value: 'Asia/Shanghai', label: 'China (Shanghai)' },
  { value: 'Asia/Kolkata', label: 'India (Kolkata)' },
  { value: 'Asia/Dubai', label: 'UAE (Dubai)' },
  { value: 'Australia/Sydney', label: 'Australia (Sydney)' },
  { value: 'Australia/Melbourne', label: 'Australia (Melbourne)' },
  { value: 'Pacific/Auckland', label: 'New Zealand' },
  { value: 'Africa/Cairo', label: 'Egypt (Cairo)' },
  { value: 'Africa/Johannesburg', label: 'South Africa' },
];

const RELATIONSHIP_OPTIONS = ['Me', 'Partner', 'Child', 'Parent', 'Friend', 'Sibling', 'Client', 'Other'];

interface ProfileCreationFormProps {
  onCancel?: () => void;
  isNewProfile?: boolean;
}

export function ProfileCreationForm({ onCancel, isNewProfile = false }: ProfileCreationFormProps) {
  const navigate = useNavigate();
  const { saveProfile, allProfiles, profile: currentProfile } = useProfile();

  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Me');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [cityOfBirth, setCityOfBirth] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculationStatus, setCalculationStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showChartData, setShowChartData] = useState(false);

  // Pasted chart data
  const [astrologyData, setAstrologyData] = useState('');
  const [humanDesignData, setHumanDesignData] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }
    if (!dateOfBirth) {
      setError('Please enter date of birth');
      return;
    }
    if (!timeOfBirth) {
      setError('Please enter time of birth');
      return;
    }
    if (!cityOfBirth.trim()) {
      setError('Please enter city of birth');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setError('Please enter a valid latitude (-90 to 90)');
      return;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setError('Please enter a valid longitude (-180 to 180)');
      return;
    }

    setIsSubmitting(true);
    setCalculationStatus(null);

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

      // Calculate Gene Keys and Human Design profiles (local calculation)
      setCalculationStatus('Calculating Gene Keys & Human Design...');
      let geneKeysProfile;
      let humanDesignProfile;

      try {
        const calculated = calculateProfilesFromBirthData(birthData);
        geneKeysProfile = calculated.geneKeysProfile;
        humanDesignProfile = calculated.humanDesignProfile;
      } catch (calcError) {
        console.error('Error calculating profiles:', calcError);
        // Continue without calculated data - user can regenerate later
      }

      // Initialize profile with empty astrology data
      const newProfile: AstroProfile = {
        id: profileId,
        name: name.trim(),
        relationship,
        dateOfBirth,
        timeOfBirth,
        cityOfBirth: cityOfBirth.trim(),
        coordinates: {
          latitude: lat,
          longitude: lng,
          timezone,
        },
        // Initialize empty arrays for astrology data (to be calculated via API)
        placements: [],
        housePositions: [],
        aspects: { planetary: [], other: [] },
        configurations: [],
        elementalAnalysis: {
          id: `${profileId}-elemental`,
          profileId: profileId,
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
        // Add calculated profiles if available
        geneKeysProfile,
        humanDesignProfile,
        profileVersion: 1,
      };

      // Parse pasted astrology data if provided
      if (astrologyData.trim()) {
        setCalculationStatus('Parsing astrology data...');
        try {
          // Split pasted data into sections
          const sections = astrologyData.split(/(?=Planet positions:|House positions:|Planet aspects:|Other aspects:)/i);

          let planetPositions = '';
          let housePositions = '';
          let planetAspects = '';
          let otherAspects = '';

          for (const section of sections) {
            const trimmed = section.trim();
            if (/^planet positions:/i.test(trimmed)) {
              planetPositions = trimmed.replace(/^planet positions:\s*/i, '');
            } else if (/^house positions:/i.test(trimmed)) {
              housePositions = trimmed.replace(/^house positions:\s*/i, '');
            } else if (/^planet aspects:/i.test(trimmed)) {
              planetAspects = trimmed.replace(/^planet aspects:\s*/i, '');
            } else if (/^other aspects:/i.test(trimmed)) {
              otherAspects = trimmed.replace(/^other aspects:\s*/i, '');
            } else if (!planetPositions) {
              // If no header found, assume it's all planet positions followed by other data
              planetPositions = trimmed;
            }
          }

          // If headers weren't found, try to parse everything as planet positions
          if (!planetPositions) {
            planetPositions = astrologyData;
          }

          const parsed = parseAstroSeekData(
            planetPositions,
            housePositions,
            planetAspects,
            otherAspects,
            profileId
          );

          if (parsed.placements.length > 0) {
            newProfile.placements = parsed.placements;
            newProfile.housePositions = parsed.housePositions;
            newProfile.aspects = parsed.aspects;
            newProfile.elementalAnalysis = parsed.elementalAnalysis;
            newProfile.chartRulers = parsed.chartRulers;
            console.log(`Parsed ${parsed.placements.length} placements, ${parsed.housePositions.length} houses`);
          }
        } catch (parseError) {
          console.warn('Error parsing astrology data:', parseError);
        }
      }

      // Parse pasted Human Design data if provided
      if (humanDesignData.trim()) {
        setCalculationStatus('Parsing Human Design data...');
        try {
          const parsedHD = parseHumanDesignData(humanDesignData);
          if (parsedHD) {
            newProfile.humanDesignProfile = toHumanDesignProfile(parsedHD);
            console.log(`Parsed HD: ${parsedHD.type}, ${parsedHD.personalityGates.length} personality gates`);
          }
        } catch (parseError) {
          console.warn('Error parsing Human Design data:', parseError);
        }
      }

      setCalculationStatus('Saving profile...');
      saveProfile(newProfile);
      navigate('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setIsSubmitting(false);
    }
  }, [name, relationship, dateOfBirth, timeOfBirth, cityOfBirth, latitude, longitude, timezone, astrologyData, humanDesignData, saveProfile, navigate]);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (allProfiles.length > 0) {
      navigate('/profile');
    } else {
      navigate('/');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      <div className="bg-surface-base/50 rounded-xl border border-theme-border-subtle p-6">
        <div className="text-center mb-6">
          <span className="text-4xl block mb-3">✦</span>
          <h2 className="font-serif text-2xl text-theme-text-primary">
            {isNewProfile ? 'Add New Profile' : 'Create Your Cosmic Profile'}
          </h2>
          <p className="text-theme-text-secondary text-sm mt-2">
            Enter birth details to generate your cosmic blueprint
          </p>
        </div>

        {/* Current Active Profile Indicator */}
        {currentProfile && allProfiles.length > 0 && (
          <div className="mb-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">
                  Active Profile: <span className="text-theme-text-primary">{currentProfile.name}</span>
                </p>
                <p className="text-theme-text-secondary text-xs mt-1">
                  {allProfiles.length} profile{allProfiles.length !== 1 ? 's' : ''} saved
                </p>
              </div>
              <Link
                to="/profile"
                className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors text-sm"
              >
                Switch Profile
              </Link>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-theme-text-secondary mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="w-full px-4 py-2 bg-surface-raised border border-theme-border-subtle rounded-lg text-theme-text-primary placeholder-neutral-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Relationship */}
          <div>
            <label className="block text-sm text-theme-text-secondary mb-1">Relationship</label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-4 py-2 bg-surface-raised border border-theme-border-subtle rounded-lg text-theme-text-primary focus:outline-none focus:border-purple-500"
            >
              {RELATIONSHIP_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm text-theme-text-secondary mb-1">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-4 py-2 bg-surface-raised border border-theme-border-subtle rounded-lg text-theme-text-primary focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Time of Birth */}
          <div>
            <label className="block text-sm text-theme-text-secondary mb-1">Time of Birth</label>
            <input
              type="time"
              value={timeOfBirth}
              onChange={(e) => setTimeOfBirth(e.target.value)}
              className="w-full px-4 py-2 bg-surface-raised border border-theme-border-subtle rounded-lg text-theme-text-primary focus:outline-none focus:border-purple-500"
            />
            <p className="text-xs text-theme-text-tertiary mt-1">
              Accurate birth time is important for precise calculations
            </p>
          </div>

          {/* City of Birth — with geocoding autocomplete */}
          <div>
            <label className="block text-sm text-theme-text-secondary mb-1">City of Birth</label>
            <LocationAutocomplete
              initialValue={cityOfBirth}
              placeholder="e.g., New York, USA"
              onSelect={(result: GeocodingResult) => {
                const label = result.city
                  ? `${result.city}, ${result.country}`
                  : result.displayName;
                setCityOfBirth(label);
                setLatitude(String(result.latitude));
                setLongitude(String(result.longitude));
                // Auto-detect timezone from coordinates
                const detectedTz = getTimezoneForLocation(result.latitude, result.longitude);
                setTimezone(detectedTz);
              }}
            />
            <p className="text-xs text-theme-text-tertiary mt-1">
              Type a city name to search — coordinates will be filled automatically
            </p>
          </div>

          {/* Coordinates Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <svg
                className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {showAdvanced ? 'Hide' : 'Show'} coordinates & timezone
            </button>
          </div>

          {/* Coordinates Section (collapsible) */}
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 border-t border-theme-border-subtle pt-4"
            >
              <p className="text-xs text-theme-text-tertiary">
                Look up coordinates at{' '}
                <a
                  href="https://www.latlong.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:underline"
                >
                  latlong.net
                </a>
              </p>

              <div className="grid grid-cols-2 gap-4">
                {/* Latitude */}
                <div>
                  <label className="block text-sm text-theme-text-secondary mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="-22.9068"
                    className="w-full px-4 py-2 bg-surface-raised border border-theme-border-subtle rounded-lg text-theme-text-primary placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Longitude */}
                <div>
                  <label className="block text-sm text-theme-text-secondary mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="-43.1729"
                    className="w-full px-4 py-2 bg-surface-raised border border-theme-border-subtle rounded-lg text-theme-text-primary placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-sm text-theme-text-secondary mb-1">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-raised border border-theme-border-subtle rounded-lg text-theme-text-primary focus:outline-none focus:border-purple-500"
                >
                  {TIMEZONE_OPTIONS.map((tz) => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}

          {/* Required fields notice */}
          {!showAdvanced && (
            <p className="text-xs text-amber-400/80 bg-amber-500/10 p-3 rounded-lg">
              Note: You must enter coordinates and timezone for accurate calculations.
              Click "Show coordinates & timezone" above.
            </p>
          )}

          {/* Chart Data Paste Section */}
          <div className="border-t border-theme-border-subtle pt-4 mt-4">
            <button
              type="button"
              onClick={() => setShowChartData(!showChartData)}
              className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <svg
                className={`w-4 h-4 transition-transform ${showChartData ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {showChartData ? 'Hide' : 'Paste'} chart data (from astro-seek / mybodygraph)
            </button>
          </div>

          {/* Chart Data Textareas */}
          {showChartData && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <p className="text-xs text-purple-300 mb-2">
                  Paste chart data from external sources for accurate calculations.
                  This overrides the local calculation for astrology and Human Design.
                </p>
              </div>

              {/* Astrology Data */}
              <div>
                <label className="block text-sm text-theme-text-secondary mb-1">
                  Astrology Data (from astro-seek.com)
                </label>
                <textarea
                  value={astrologyData}
                  onChange={(e) => setAstrologyData(e.target.value)}
                  placeholder={`Paste from astro-seek.com "Copy Positions" buttons:

Planet positions:
Sun in Libra 24°48', in 12th House
Moon in Aries 12°47', in 5th House
...

House positions:
1st House in Scorpio 26°52'
2nd House in Sagittarius 23°32'
...

Planet aspects:
Sun Conjunction Mercury (Orb: 6°11', Applying)
...`}
                  rows={8}
                  className="w-full px-4 py-2 bg-surface-raised border border-theme-border-subtle rounded-lg text-theme-text-primary placeholder-neutral-600 focus:outline-none focus:border-purple-500 font-mono text-xs"
                />
                <p className="text-xs text-theme-text-tertiary mt-1">
                  Go to{' '}
                  <a
                    href="https://horoscopes.astro-seek.com/birth-chart-horoscope-online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:underline"
                  >
                    astro-seek.com
                  </a>
                  {' '}→ enter birth data → use "Copy Positions" buttons
                </p>
              </div>

              {/* Human Design Data */}
              <div>
                <label className="block text-sm text-theme-text-secondary mb-1">
                  Human Design Data (from mybodygraph.com or similar)
                </label>
                <textarea
                  value={humanDesignData}
                  onChange={(e) => setHumanDesignData(e.target.value)}
                  placeholder={`Paste Human Design chart data:

Personality
- 32.5
- 42.5
...

Design
- 56.1
- 60.1
...

Type: Generator
Strategy: To Respond
Inner Authority: Emotional - Solar Plexus
Profile: 5 / 1
Incarnation Cross: Left Angle Cross of Limitation
...

Defined Centers:
- Ajna
- Throat
...`}
                  rows={8}
                  className="w-full px-4 py-2 bg-surface-raised border border-theme-border-subtle rounded-lg text-theme-text-primary placeholder-neutral-600 focus:outline-none focus:border-purple-500 font-mono text-xs"
                />
                <p className="text-xs text-theme-text-tertiary mt-1">
                  Go to{' '}
                  <a
                    href="https://mybodygraph.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:underline"
                  >
                    mybodygraph.com
                  </a>
                  {' '}or{' '}
                  <a
                    href="https://www.jovianarchive.com/get_your_chart"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:underline"
                  >
                    jovianarchive.com
                  </a>
                  {' '}for your chart
                </p>
              </div>
            </motion.div>
          )}

          {/* Calculation Status */}
          {isSubmitting && calculationStatus && (
            <div className="flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <div className="animate-spin w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full" />
              <span className="text-sm text-purple-400">{calculationStatus}</span>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-surface-raised text-theme-text-secondary rounded-lg hover:bg-surface-interactive transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !showAdvanced}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default ProfileCreationForm;
