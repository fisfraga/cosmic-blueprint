import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchBar } from './SearchBar';
import { Breadcrumb } from './Breadcrumb';
import { AccountMenu } from './AccountMenu';
import { ThemeToggle } from './ThemeToggle';
import { useRouteAnnouncer } from '../hooks/useRouteAnnouncer';

// Profile submenu - methodology-specific pages
const profileItems = [
  { path: '/profile', label: 'Overview', icon: '✦', description: 'Your cosmic blueprint' },
  { path: '/profile/placements', label: 'My Placements', icon: '⚝', description: 'All personal placements' },
  { path: '/profile/astrology', label: 'Astrology', icon: '☉', description: 'Full natal chart' },
  { path: '/profile/gene-keys', label: 'Gene Keys', icon: '✧', description: 'Golden Path journey' },
  { path: '/profile/human-design', label: 'Human Design', icon: '⬡', description: 'Body graph & type' },
];

// Explore Tools - Interactive visualizations
const exploreItems = [
  { path: '/wheel', label: 'Celestial Wheel', icon: '☉', description: 'Zodiac mandala' },
  { path: '/graph', label: 'Cosmic Graph', icon: '⚭', description: 'Relationship map' },
  { path: '/weaver', label: 'Aspect Weaver', icon: '⟁', description: 'Aspect explorer' },
  { path: '/realms', label: 'Element Realms', icon: '🜂', description: 'Elemental views' },
  { path: '/transits', label: 'Cosmic Weather', icon: '🌙', description: 'Current transits' },
  { path: '/life-areas', label: 'Life Areas', icon: '⌂', description: 'Transit → life area bridge' },
  { path: '/pathways', label: 'Guided Pathways', icon: '✨', description: 'Journey guides' },
  { path: '/sessions', label: 'Sessions', icon: '🌀', description: 'Past contemplations' },
];

// Astrology Library
const astrologyItems = [
  { path: '/planets', label: 'Planets', icon: '☿' },
  { path: '/signs', label: 'Signs', icon: '♈︎' },
  { path: '/houses', label: 'Houses', icon: '⌂' },
  { path: '/aspects', label: 'Aspects', icon: '△' },
  { path: '/elements', label: 'Elements', icon: '◇' },
  { path: '/decans', label: 'Decans', icon: '◔' },
  { path: '/dignities', label: 'Dignities', icon: '⚖' },
  { path: '/configurations', label: 'Patterns', icon: '✡' },
];

// Human Design Library
const humanDesignItems = [
  { path: '/human-design', label: 'Gates', icon: '⬡' },
  { path: '/human-design/centers', label: 'Centers', icon: '⚬' },
  { path: '/human-design/channels', label: 'Channels', icon: '⎯' },
  { path: '/human-design/types', label: 'Types', icon: '◉' },
  { path: '/human-design/authorities', label: 'Authority', icon: '⌖' },
  { path: '/human-design/profiles', label: 'Profiles', icon: '⟁' },
  { path: '/human-design/lines', label: 'Lines', icon: '▵' },
  { path: '/human-design/variables', label: 'Variables', icon: '⚡' },
];

// Gene Keys Library
const geneKeysItems = [
  { path: '/gene-keys', label: '64 Keys', icon: '✧' },
  { path: '/gene-keys/spheres', label: 'Spheres', icon: '◎' },
  { path: '/gene-keys/sequences', label: 'Sequences', icon: '◇' },
  { path: '/gene-keys/codon-rings', label: 'Codon Rings', icon: '⬡' },
  { path: '/gene-keys/lines', label: 'Lines', icon: '--' },
  { path: '/gene-keys/amino-acids', label: 'Amino Acids', icon: '🧬' },
  { path: '/gene-keys/trigrams', label: 'Trigrams', icon: '☰' },
];

// Wisdom Traditions (cross-system bridge)
const wisdomTraditionItems = [
  { path: '/numerology', label: 'Numerology', icon: '∞' },
  { path: '/chakras', label: 'Chakras', icon: '◎' },
  { path: '/hermetic', label: 'Hermetic Laws', icon: '⚚' },
];

// Mobile nav - quick access
const mobileNavItems = [
  { path: '/', label: 'Home', icon: '✧' },
  { path: '/profile', label: 'Profile', icon: '✦' },
  { path: '/contemplate', label: 'Contemplate', icon: '🕯' },
  { path: '/wheel', label: 'Wheel', icon: '☉' },
];

function NavDropdown({
  label,
  icon,
  items,
  isOpen,
  onToggle
}: {
  label: string;
  icon: string;
  items: Array<{ path: string; label: string; icon: string; description?: string; soon?: boolean }>;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const location = useLocation();
  const isActive = items.some(item => location.pathname === item.path || location.pathname.startsWith(item.path + '/'));

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
          isActive
            ? 'bg-surface-raised text-theme-text-primary'
            : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-surface-overlay'
        }`}
      >
        <span className="mr-1" aria-hidden="true">{icon}</span>
        {label}
        <svg
          className={`w-3 h-3 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 py-2 bg-surface-base border border-theme-border-subtle rounded-lg shadow-xl min-w-[200px] z-50"
          >
            {items.map((item) => (
              item.soon ? (
                <div
                  key={item.path + item.label}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-theme-text-muted cursor-not-allowed"
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                  <span className="ml-auto text-xs bg-surface-raised px-1.5 py-0.5 rounded">Soon</span>
                </div>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onToggle}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-surface-raised text-theme-text-primary'
                        : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-surface-overlay'
                    }`
                  }
                >
                  <span className="text-lg" aria-hidden="true">{item.icon}</span>
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    {item.description && (
                      <span className="text-theme-text-tertiary text-xs">{item.description}</span>
                    )}
                  </div>
                </NavLink>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Library Mega Dropdown with 3 columns
function LibraryDropdown({
  isOpen,
  onToggle
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  const location = useLocation();
  const allItems = [...astrologyItems, ...humanDesignItems, ...geneKeysItems, ...wisdomTraditionItems];
  const isActive = allItems.some(item =>
    location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  );

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
          isActive
            ? 'bg-surface-raised text-theme-text-primary'
            : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-surface-overlay'
        }`}
      >
        <span className="mr-1" aria-hidden="true">📚</span>
        Library
        <svg
          className={`w-3 h-3 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-1 py-4 px-4 bg-surface-base border border-theme-border-subtle rounded-lg shadow-xl z-50"
          >
            <div className="flex gap-8">
              {/* Astrology Column */}
              <div className="min-w-[140px]">
                <p className="text-xs text-theme-text-tertiary uppercase tracking-wider mb-2 px-2">Astrology</p>
                <div className="space-y-0.5">
                  {astrologyItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onToggle}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                          isActive
                            ? 'bg-surface-raised text-theme-text-primary'
                            : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-surface-overlay'
                        }`
                      }
                    >
                      <span className="w-4 text-center" aria-hidden="true">{item.icon}</span>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Human Design Column */}
              <div className="min-w-[140px]">
                <p className="text-xs text-theme-text-tertiary uppercase tracking-wider mb-2 px-2">Human Design</p>
                <div className="space-y-0.5">
                  {humanDesignItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onToggle}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                          isActive
                            ? 'bg-surface-raised text-theme-text-primary'
                            : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-surface-overlay'
                        }`
                      }
                    >
                      <span className="w-4 text-center" aria-hidden="true">{item.icon}</span>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Gene Keys Column */}
              <div className="min-w-[140px]">
                <p className="text-xs text-theme-text-tertiary uppercase tracking-wider mb-2 px-2">Gene Keys</p>
                <div className="space-y-0.5">
                  {geneKeysItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onToggle}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                          isActive
                            ? 'bg-surface-raised text-theme-text-primary'
                            : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-surface-overlay'
                        }`
                      }
                    >
                      <span className="w-4 text-center" aria-hidden="true">{item.icon}</span>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Wisdom Traditions Column */}
              <div className="min-w-[140px]">
                <p className="text-xs text-theme-text-tertiary uppercase tracking-wider mb-2 px-2">Wisdom</p>
                <div className="space-y-0.5">
                  {wisdomTraditionItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onToggle}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                          isActive
                            ? 'bg-surface-raised text-theme-text-primary'
                            : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-surface-overlay'
                        }`
                      }
                    >
                      <span className="w-4 text-center" aria-hidden="true">{item.icon}</span>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Layout() {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Announce route changes to screen readers and manage focus
  useRouteAnnouncer();

  const handleDropdownToggle = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Close dropdown when clicking outside
  const handleBackdropClick = () => {
    setOpenDropdown(null);
  };

  // Close mobile menu when navigating
  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-surface-base text-theme-text-primary">
      {/* Skip navigation link — visible only on keyboard focus */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-surface-base focus:text-white focus:rounded-lg focus:border focus:border-theme-border focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        Skip to main content
      </a>

      {/* Live region for screen reader route-change announcements */}
      <div
        id="route-announcer"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Backdrop for closing dropdowns */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleBackdropClick}
        />
      )}

      {/* Header */}
      <header className="border-b border-theme-border-subtle bg-surface-base/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3">
              <span className="text-2xl">✦</span>
              <span className="font-serif text-xl font-medium tracking-wide">
                Cosmic Temple
              </span>
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {/* Profile Dropdown */}
              <NavDropdown
                label="Profile"
                icon="✦"
                items={profileItems}
                isOpen={openDropdown === 'profile'}
                onToggle={() => handleDropdownToggle('profile')}
              />

              {/* Contemplation - Direct Link */}
              <NavLink
                to="/contemplate"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-surface-raised text-theme-text-primary'
                      : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-surface-overlay'
                  }`
                }
              >
                <span className="mr-2" aria-hidden="true">🕯</span>
                Contemplate
              </NavLink>

              {/* Divider */}
              <div className="w-px h-6 bg-surface-raised mx-2" />

              {/* Explore Dropdown */}
              <NavDropdown
                label="Explore"
                icon="⚭"
                items={exploreItems}
                isOpen={openDropdown === 'explore'}
                onToggle={() => handleDropdownToggle('explore')}
              />

              {/* Library Mega Dropdown */}
              <LibraryDropdown
                isOpen={openDropdown === 'library'}
                onToggle={() => handleDropdownToggle('library')}
              />

            </nav>

            {/* Right Side: Journal + Profile Selector + User Menu + Search */}
            <div className="hidden md:flex items-center gap-3">
              <NavLink
                to="/insights"
                title="Contemplation Journal"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                    isActive
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                      : 'border-theme-border/50 text-theme-text-tertiary hover:text-theme-text-secondary hover:border-theme-border'
                  }`
                }
              >
                ✧ Journal
              </NavLink>
              <ThemeToggle />
              <AccountMenu />
              <SearchBar />
            </div>

            {/* Mobile: Just Search */}
            <div className="md:hidden">
              <SearchBar />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-b border-theme-border-subtle bg-surface-base/30 overflow-x-auto">
        <div className="flex gap-1 px-4 py-2">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-surface-raised text-theme-text-primary'
                    : 'text-theme-text-secondary hover:text-theme-text-primary'
                }`
              }
            >
              <span className="mr-1.5" aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap text-theme-text-tertiary hover:text-theme-text-primary"
          >
            More...
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-surface-base border-l border-theme-border-subtle z-50 md:hidden overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-lg">Menu</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-theme-text-secondary hover:text-theme-text-primary p-1"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Profile Section */}
                <div className="mb-6">
                  <p className="text-xs text-theme-text-tertiary uppercase tracking-wider mb-2">Your Profile</p>
                  <div className="space-y-1">
                    {profileItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleMobileNavClick}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? 'bg-surface-raised text-theme-text-primary'
                              : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-surface-overlay'
                          }`
                        }
                      >
                        <span aria-hidden="true">{item.icon}</span>
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>

                {/* Contemplation + Journal Direct Links */}
                <div className="mb-6 space-y-2">
                  <NavLink
                    to="/contemplate"
                    onClick={handleMobileNavClick}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-amber-900/50 text-amber-300 border border-amber-500/30'
                          : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-surface-raised/50 border border-theme-border'
                      }`
                    }
                  >
                    <span aria-hidden="true">🕯</span>
                    Contemplation Chamber
                  </NavLink>
                  <NavLink
                    to="/insights"
                    onClick={handleMobileNavClick}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-amber-900/50 text-amber-300 border border-amber-500/30'
                          : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-surface-raised/50 border border-theme-border'
                      }`
                    }
                  >
                    <span aria-hidden="true">✧</span>
                    Contemplation Journal
                  </NavLink>
                </div>

                {/* Explore Section */}
                <div className="mb-6">
                  <p className="text-xs text-theme-text-tertiary uppercase tracking-wider mb-2">Explore</p>
                  <div className="space-y-1">
                    {exploreItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleMobileNavClick}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? 'bg-surface-raised text-theme-text-primary'
                              : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-surface-overlay'
                          }`
                        }
                      >
                        <span aria-hidden="true">{item.icon}</span>
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>

                {/* Astrology Section */}
                <div className="mb-6">
                  <p className="text-xs text-theme-text-tertiary uppercase tracking-wider mb-2">Astrology</p>
                  <div className="space-y-1">
                    {astrologyItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleMobileNavClick}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? 'bg-surface-raised text-theme-text-primary'
                              : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-surface-overlay'
                          }`
                        }
                      >
                        <span aria-hidden="true">{item.icon}</span>
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>

                {/* Human Design Section */}
                <div className="mb-6">
                  <p className="text-xs text-theme-text-tertiary uppercase tracking-wider mb-2">Human Design</p>
                  <div className="space-y-1">
                    {humanDesignItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleMobileNavClick}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? 'bg-surface-raised text-theme-text-primary'
                              : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-surface-overlay'
                          }`
                        }
                      >
                        <span aria-hidden="true">{item.icon}</span>
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>

                {/* Gene Keys Section */}
                <div className="mb-6">
                  <p className="text-xs text-theme-text-tertiary uppercase tracking-wider mb-2">Gene Keys</p>
                  <div className="space-y-1">
                    {geneKeysItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleMobileNavClick}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? 'bg-surface-raised text-theme-text-primary'
                              : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-surface-overlay'
                          }`
                        }
                      >
                        <span aria-hidden="true">{item.icon}</span>
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>

                {/* Wisdom Traditions Section */}
                <div className="mb-6">
                  <p className="text-xs text-theme-text-tertiary uppercase tracking-wider mb-2">Wisdom Traditions</p>
                  <div className="space-y-1">
                    {wisdomTraditionItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleMobileNavClick}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? 'bg-surface-raised text-theme-text-primary'
                              : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-surface-overlay'
                          }`
                        }
                      >
                        <span aria-hidden="true">{item.icon}</span>
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer — hidden on contemplation page for full-screen experience */}
      {!location.pathname.startsWith('/contemplate') && (
        <footer className="border-t border-theme-border-subtle py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-theme-text-tertiary text-sm">
            <p className="font-serif italic">
              "The stars don't determine our destiny—they illuminate the path."
            </p>
            <p className="mt-2">Cosmic Temple - A digital temple for self-discovery</p>
          </div>
        </footer>
      )}
    </div>
  );
}
