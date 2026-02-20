// ============================================
// Entity Link Component
// ============================================
// Renders a clickable entity reference in chat messages
// Styled by system (Astrology, Human Design, Gene Keys)
// Includes hover preview tooltip

import React, { useState, useRef, useEffect } from 'react';
import { getEntity, getProfileEntity, type EntityInfo, type EntitySystem } from '../../services/entities';

interface EntityLinkProps {
  entityId: string;
  displayName: string;
  onClick?: (entity: EntityInfo) => void;
  className?: string;
  showPreview?: boolean; // Enable/disable hover preview (default: true)
}

// System labels for display
const SYSTEM_LABELS: Record<EntitySystem, string> = {
  astrology: 'Astrology',
  humanDesign: 'Human Design',
  geneKeys: 'Gene Keys',
  shared: 'Reference',
};

// Type labels for display
const TYPE_LABELS: Record<string, string> = {
  planet: 'Planet',
  sign: 'Zodiac Sign',
  house: 'House',
  element: 'Element',
  aspect: 'Aspect',
  configuration: 'Configuration',
  point: 'Astro Point',
  decan: 'Decan',
  dignity: 'Dignity',
  'hd-type': 'HD Type',
  'hd-authority': 'Authority',
  'hd-center': 'Center',
  'hd-gate': 'Gate',
  'hd-channel': 'Channel',
  'hd-profile': 'Profile',
  'hd-line': 'Line',
  'incarnation-cross': 'Incarnation Cross',
  'gene-key': 'Gene Key',
  'gk-sphere': 'Sphere',
  'gk-sequence': 'Sequence',
  'codon-ring': 'Codon Ring',
  // Profile entity types
  'profile-placement': 'My Placement',
  'profile-aspect': 'My Aspect',
  'profile-configuration': 'My Configuration',
  'profile-gk-placement': 'My Gene Key',
  'profile-hd-placement': 'My Gate',
  'profile-hd-channel': 'My Channel',
};

// Hover preview tooltip component
function EntityPreviewTooltip({
  entity,
  visible,
  position,
}: {
  entity: EntityInfo;
  visible: boolean;
  position: { x: number; y: number };
}): React.ReactElement | null {
  if (!visible) return null;

  const styles = SYSTEM_STYLES[entity.system];
  const descriptionPreview = entity.description
    ? entity.description.slice(0, 120) + (entity.description.length > 120 ? '...' : '')
    : null;

  return (
    <div
      className="fixed z-[100] pointer-events-none animate-fade-in"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
        marginTop: '-8px',
      }}
    >
      <div
        className={`
          max-w-xs p-3 rounded-lg shadow-xl border
          bg-cosmic-900/95 backdrop-blur-sm
          ${styles.border}
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          {entity.symbol && (
            <span className="text-lg">{entity.symbol}</span>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white text-sm truncate">
              {entity.name}
            </h4>
            <div className="flex gap-1.5 mt-0.5">
              <span className={`text-xs px-1.5 py-0.5 rounded ${styles.bg} ${styles.text}`}>
                {SYSTEM_LABELS[entity.system]}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-cosmic-700 text-gray-400">
                {TYPE_LABELS[entity.type] || entity.type}
              </span>
            </div>
          </div>
        </div>

        {/* Description preview */}
        {descriptionPreview && (
          <p className="text-xs text-gray-400 leading-relaxed mb-2">
            {descriptionPreview}
          </p>
        )}

        {/* Keywords */}
        {entity.keywords && entity.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {entity.keywords.slice(0, 4).map((keyword, idx) => (
              <span
                key={idx}
                className="text-xs px-1.5 py-0.5 rounded bg-cosmic-800 text-gray-500"
              >
                {String(keyword)}
              </span>
            ))}
          </div>
        )}

        {/* Click hint */}
        <p className="text-xs text-gray-600 mt-2 text-center">
          Click to view details
        </p>
      </div>

      {/* Arrow */}
      <div
        className={`
          absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full
          w-0 h-0 border-l-8 border-r-8 border-t-8
          border-transparent border-t-cosmic-900/95
        `}
      />
    </div>
  );
}

// System-based styling
const SYSTEM_STYLES: Record<EntitySystem, {
  bg: string;
  bgHover: string;
  border: string;
  text: string;
  textHover: string;
}> = {
  astrology: {
    bg: 'bg-purple-500/10',
    bgHover: 'hover:bg-purple-500/20',
    border: 'border-purple-500/30',
    text: 'text-purple-300',
    textHover: 'hover:text-purple-200',
  },
  humanDesign: {
    bg: 'bg-amber-500/10',
    bgHover: 'hover:bg-amber-500/20',
    border: 'border-amber-500/30',
    text: 'text-amber-300',
    textHover: 'hover:text-amber-200',
  },
  geneKeys: {
    bg: 'bg-emerald-500/10',
    bgHover: 'hover:bg-emerald-500/20',
    border: 'border-emerald-500/30',
    text: 'text-emerald-300',
    textHover: 'hover:text-emerald-200',
  },
  shared: {
    bg: 'bg-blue-500/10',
    bgHover: 'hover:bg-blue-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-300',
    textHover: 'hover:text-blue-200',
  },
};

// Element-based styling (for signs and elements)
const ELEMENT_STYLES: Record<string, {
  bg: string;
  bgHover: string;
  border: string;
  text: string;
  textHover: string;
}> = {
  fire: {
    bg: 'bg-fire-500/10',
    bgHover: 'hover:bg-fire-500/20',
    border: 'border-fire-500/30',
    text: 'text-fire-400',
    textHover: 'hover:text-fire-300',
  },
  earth: {
    bg: 'bg-earth-500/10',
    bgHover: 'hover:bg-earth-500/20',
    border: 'border-earth-500/30',
    text: 'text-earth-400',
    textHover: 'hover:text-earth-300',
  },
  air: {
    bg: 'bg-sky-500/10',
    bgHover: 'hover:bg-sky-500/20',
    border: 'border-sky-500/30',
    text: 'text-sky-400',
    textHover: 'hover:text-sky-300',
  },
  water: {
    bg: 'bg-blue-500/10',
    bgHover: 'hover:bg-blue-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    textHover: 'hover:text-blue-300',
  },
};

// Helper to get element-based styles for signs and elements
function getElementStyles(entity: EntityInfo): typeof SYSTEM_STYLES[EntitySystem] | null {
  // For element entities, use their ID directly
  if (entity.type === 'element') {
    const elementId = entity.id;
    if (elementId in ELEMENT_STYLES) {
      return ELEMENT_STYLES[elementId];
    }
  }

  // For sign entities, look up their elementId from the data
  if (entity.type === 'sign') {
    const signData = entity.data as { elementId?: string };
    if (signData?.elementId && signData.elementId in ELEMENT_STYLES) {
      return ELEMENT_STYLES[signData.elementId];
    }
  }

  return null;
}

// Category icons (optional visual indicator)
const CATEGORY_ICONS: Record<string, string> = {
  // Astrology
  planet: '',
  sign: '',
  house: '',
  element: '',
  aspect: '',
  configuration: '',
  point: '',
  decan: '',
  dignity: '',
  // Human Design
  'hd-type': '',
  'hd-strategy': '',
  'hd-authority': '',
  'hd-center': '',
  'hd-gate': '',
  'hd-channel': '',
  'hd-profile': '',
  'hd-line': '',
  'hd-variable': '',
  // Gene Keys
  'gene-key': '',
  'gk-sphere': '',
  'gk-line': '',
  'gk-sequence': '',
  'codon-ring': '',
  'amino-acid': '',
  trigram: '',
};

export function EntityLink({
  entityId,
  displayName,
  onClick,
  className = '',
  showPreview = true,
}: EntityLinkProps): React.ReactElement {
  // Look up entity in universal registry first, then fall back to profile entities
  const entity = getEntity(entityId) || getProfileEntity(entityId);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Entity not found - render as plain text with subtle styling
  if (!entity) {
    return (
      <span
        className={`inline-flex items-center gap-0.5 text-gray-400 ${className}`}
        title={`Entity not found: ${entityId}`}
      >
        {displayName}
      </span>
    );
  }

  // Use element-based styles for signs and elements, fall back to system styles
  const styles = getElementStyles(entity) || SYSTEM_STYLES[entity.system];
  const icon = CATEGORY_ICONS[entity.type] || '';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTooltip(false); // Hide tooltip on click
    if (onClick) {
      onClick(entity);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setShowTooltip(false);
      if (onClick) {
        onClick(entity);
      }
    }
  };

  const handleMouseEnter = () => {
    if (!showPreview) return;

    // Delay showing tooltip to avoid flashing on quick mouse movements
    hoverTimeoutRef.current = setTimeout(() => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setTooltipPosition({
          x: rect.left + rect.width / 2,
          y: rect.top,
        });
        setShowTooltip(true);
      }
    }, 400); // 400ms delay before showing
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setShowTooltip(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          inline-flex items-center gap-1 px-1.5 py-0.5 rounded
          border transition-all duration-150 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-cosmic-900
          ${styles.bg} ${styles.bgHover} ${styles.border}
          ${styles.text} ${styles.textHover}
          focus:ring-purple-500/50
          ${className}
        `}
        aria-label={`View details for ${entity.name}`}
      >
        {/* Symbol if available */}
        {entity.symbol && (
          <span className="text-xs opacity-80" aria-hidden="true">
            {entity.symbol}
          </span>
        )}
        {/* Category icon if no symbol */}
        {!entity.symbol && icon && (
          <span className="text-xs opacity-60" aria-hidden="true">
            {icon}
          </span>
        )}
        {/* Display name */}
        <span className="text-sm font-medium">{displayName}</span>
      </button>

      {/* Hover preview tooltip */}
      {showPreview && (
        <EntityPreviewTooltip
          entity={entity}
          visible={showTooltip}
          position={tooltipPosition}
        />
      )}
    </>
  );
}

// Variant for inline text (less prominent)
export function EntityLinkInline({
  entityId,
  displayName,
  onClick,
  className = '',
}: EntityLinkProps): React.ReactElement {
  // Look up entity in universal registry first, then fall back to profile entities
  const entity = getEntity(entityId) || getProfileEntity(entityId);

  if (!entity) {
    return <span className={`text-gray-400 ${className}`}>{displayName}</span>;
  }

  // Use element-based styles for signs and elements, fall back to system styles
  const styles = getElementStyles(entity) || SYSTEM_STYLES[entity.system];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(entity);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        inline underline decoration-dotted decoration-1 underline-offset-2
        cursor-pointer transition-colors
        ${styles.text} ${styles.textHover}
        hover:decoration-solid
        ${className}
      `}
      title={`View ${entity.name}`}
    >
      {entity.symbol && <span className="mr-0.5">{entity.symbol}</span>}
      {displayName}
    </button>
  );
}

export default EntityLink;
