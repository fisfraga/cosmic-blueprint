import { useState } from 'react';
import { hdCenters, hdGates } from '../data';
import type { HDCenter } from '../types';
import {
  CENTER_POSITIONS,
  CENTER_COLORS,
  CHANNEL_PATHS,
  GATE_POSITIONS,
  type ChannelPath,
} from '../data/bodygraph-layout';

// Gate type for coloring (personality = conscious, design = unconscious)
export type GateType = 'personality' | 'design';

interface BodyGraphProps {
  width?: number;
  height?: number;
  definedCenters?: string[];
  definedChannels?: string[];
  personalityGates?: number[];
  designGates?: number[];
  showLabels?: boolean;
  showGates?: boolean;
  showChannels?: boolean;
  interactive?: boolean;
  onCenterClick?: (centerId: string) => void;
  onGateClick?: (gateNumber: number) => void;
  onChannelClick?: (channelId: string) => void;
}

export function BodyGraph({
  width = 400,
  height = 600,
  definedCenters = [],
  definedChannels = [],
  personalityGates = [],
  designGates = [],
  showLabels = true,
  showGates = true,
  showChannels = true,
  interactive = true,
  onCenterClick,
  onGateClick,
  onChannelClick,
}: BodyGraphProps) {
  const [hoveredCenter, setHoveredCenter] = useState<string | null>(null);
  const [hoveredGate, setHoveredGate] = useState<number | null>(null);
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);

  // Quick lookup sets
  const definedCentersSet = new Set<string>(definedCenters);
  const definedChannelsSet = new Set<string>(definedChannels);
  const personalityGatesSet = new Set<number>(personalityGates);
  const designGatesSet = new Set<number>(designGates);
  const allDefinedGates = new Set<number>([...personalityGates, ...designGates]);

  // Convert normalized coordinates to SVG coordinates
  const toSvgX = (x: number) => (x / 100) * width;
  const toSvgY = (y: number) => (y / 100) * height;

  // Render a channel line
  const renderChannel = (channelId: string, channel: ChannelPath) => {
    const isDefined = definedChannelsSet.has(channelId);
    const isHovered = hoveredChannel === channelId;

    // Only show defined channels (or all if none defined for preview)
    if (!isDefined && definedChannels.length > 0) return null;

    // Transform path coordinates to SVG scale
    const transformedPath = channel.path
      .split(/([MLQC])/)
      .map(part => {
        if (/^[MLQC]$/.test(part)) return part;
        return part.split(/[,\s]+/).map((coord, i) => {
          const num = parseFloat(coord);
          if (isNaN(num)) return coord;
          // Scale based on width/height
          return i % 2 === 0 ? toSvgX(num) : toSvgY(num);
        }).join(',');
      })
      .join('');

    const strokeColor = isDefined ? '#F59E0B' : '#4B5563';
    const strokeWidth = isHovered ? 4 : isDefined ? 3 : 1;

    return (
      <path
        key={channelId}
        d={transformedPath}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        opacity={isDefined ? 1 : 0.3}
        cursor={interactive ? 'pointer' : 'default'}
        onClick={() => interactive && onChannelClick?.(channelId)}
        onMouseEnter={() => interactive && setHoveredChannel(channelId)}
        onMouseLeave={() => setHoveredChannel(null)}
      />
    );
  };

  // Render center shape with HD colors
  const renderCenterShape = (center: HDCenter) => {
    const pos = CENTER_POSITIONS[center.id];
    if (!pos) return null;

    const x = toSvgX(pos.x);
    const y = toSvgY(pos.y);
    const isDefined = definedCentersSet.has(center.id);
    const isHovered = hoveredCenter === center.id;

    const baseSize = width * 0.08;
    const colors = CENTER_COLORS[center.id] || { defined: '#F59E0B', undefined: 'transparent' };
    const fill = isDefined ? colors.defined : colors.undefined;
    const stroke = isDefined ? colors.defined : isHovered ? '#F59E0B' : '#4B5563';
    const strokeWidth = isHovered ? 2.5 : isDefined ? 2 : 1;
    const opacity = isDefined ? 0.9 : 1;

    const handleClick = () => {
      if (interactive && onCenterClick) {
        onCenterClick(center.id);
      }
    };

    const commonProps = {
      fill,
      stroke,
      strokeWidth,
      opacity,
      cursor: interactive ? 'pointer' : 'default',
      onClick: handleClick,
      onMouseEnter: () => interactive && setHoveredCenter(center.id),
      onMouseLeave: () => setHoveredCenter(null),
    };

    switch (pos.shape) {
      case 'triangle': {
        const h = baseSize * 0.866;
        return (
          <polygon
            key={center.id}
            points={`${x},${y - h / 2} ${x - baseSize / 2},${y + h / 2} ${x + baseSize / 2},${y + h / 2}`}
            {...commonProps}
          />
        );
      }
      case 'square':
        return (
          <rect
            key={center.id}
            x={x - baseSize / 2}
            y={y - baseSize / 2}
            width={baseSize}
            height={baseSize}
            {...commonProps}
          />
        );
      case 'diamond': {
        const d = baseSize * 0.7;
        return (
          <polygon
            key={center.id}
            points={`${x},${y - d} ${x + d},${y} ${x},${y + d} ${x - d},${y}`}
            {...commonProps}
          />
        );
      }
      default:
        return null;
    }
  };

  // Render gate number
  const renderGate = (gateNumber: number) => {
    const pos = GATE_POSITIONS[gateNumber];
    if (!pos) return null;

    const x = toSvgX(pos.x);
    const y = toSvgY(pos.y);

    const isPersonality = personalityGatesSet.has(gateNumber);
    const isDesign = designGatesSet.has(gateNumber);
    const isDefined = isPersonality || isDesign;
    const isHovered = hoveredGate === gateNumber;

    // Only show defined gates (or all if none defined for preview mode)
    if (!isDefined && (personalityGates.length > 0 || designGates.length > 0)) return null;

    const radius = width * 0.02;

    // Color based on gate type: personality = black, design = red, both = half and half
    let fillColor = '#6B7280'; // Default gray for undefined
    if (isPersonality && isDesign) {
      fillColor = '#9333EA'; // Purple for both
    } else if (isPersonality) {
      fillColor = '#1F2937'; // Dark/Black for personality (conscious)
    } else if (isDesign) {
      fillColor = '#DC2626'; // Red for design (unconscious)
    }

    return (
      <g key={`gate-${gateNumber}`}>
        <circle
          cx={x}
          cy={y}
          r={isHovered ? radius * 1.3 : radius}
          fill={fillColor}
          stroke={isHovered ? '#F59E0B' : isDefined ? fillColor : '#4B5563'}
          strokeWidth={isHovered ? 2 : 1}
          cursor={interactive ? 'pointer' : 'default'}
          onClick={() => interactive && onGateClick?.(gateNumber)}
          onMouseEnter={() => interactive && setHoveredGate(gateNumber)}
          onMouseLeave={() => setHoveredGate(null)}
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={radius * 1.2}
          fill={isDefined ? 'white' : '#9CA3AF'}
          pointerEvents="none"
          fontWeight={isDefined ? 'bold' : 'normal'}
        >
          {gateNumber}
        </text>
      </g>
    );
  };

  // Get tooltip content
  const getTooltipContent = () => {
    if (hoveredGate) {
      const gate = hdGates.get(`gate-${hoveredGate}`);
      if (gate) {
        const isPersonality = personalityGatesSet.has(hoveredGate);
        const isDesign = designGatesSet.has(hoveredGate);
        const typeLabel = isPersonality && isDesign
          ? 'Personality & Design'
          : isPersonality
            ? 'Personality (Conscious)'
            : isDesign
              ? 'Design (Unconscious)'
              : 'Undefined';

        return (
          <div className="bg-neutral-800 px-3 py-2 rounded-lg shadow-lg border border-neutral-700 max-w-xs">
            <div className="font-medium text-humandesign-400">Gate {hoveredGate}</div>
            <div className="text-sm text-neutral-200">{gate.name.replace(`Gate ${hoveredGate}: `, '')}</div>
            <div className="text-xs text-neutral-400 mt-1">{typeLabel}</div>
          </div>
        );
      }
    }

    if (hoveredChannel) {
      const channel = CHANNEL_PATHS[hoveredChannel];
      if (channel) {
        return (
          <div className="bg-neutral-800 px-3 py-2 rounded-lg shadow-lg border border-neutral-700 max-w-xs">
            <div className="font-medium text-humandesign-400">
              Channel {channel.gate1}-{channel.gate2}
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              {definedChannelsSet.has(hoveredChannel) ? 'Defined' : 'Undefined'}
            </div>
          </div>
        );
      }
    }

    if (hoveredCenter) {
      const center = hdCenters.get(hoveredCenter);
      if (center) {
        const isDefined = definedCentersSet.has(center.id);
        return (
          <div className="bg-neutral-800 px-3 py-2 rounded-lg shadow-lg border border-neutral-700 max-w-xs">
            <div className="font-medium text-humandesign-400">{center.name}</div>
            <div className="text-xs text-neutral-400 mt-1">
              {isDefined ? center.definedMeaning : center.undefinedMeaning}
            </div>
          </div>
        );
      }
    }
    return null;
  };

  // Get all gates to render
  const gatesToRender = showGates
    ? (allDefinedGates.size > 0
        ? Array.from(allDefinedGates)
        : Object.keys(GATE_POSITIONS).map(Number))
    : [];

  return (
    <div className="relative">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto"
        role="img"
        aria-label="Human Design body graph showing defined and undefined centers, channels, and gates"
      >
        {/* Background */}
        <rect width={width} height={height} fill="transparent" />

        {/* Channels (rendered first, behind centers) */}
        {showChannels && (
          <g className="channels">
            {Object.entries(CHANNEL_PATHS).map(([id, channel]) =>
              renderChannel(id, channel)
            )}
          </g>
        )}

        {/* Centers */}
        <g className="centers">
          {Array.from(hdCenters.values()).map(renderCenterShape)}
        </g>

        {/* Gates */}
        {showGates && (
          <g className="gates">
            {gatesToRender.map(renderGate)}
          </g>
        )}

        {/* Center labels */}
        {showLabels && (
          <g className="center-labels">
            {Array.from(hdCenters.values()).map((center) => {
              const pos = CENTER_POSITIONS[center.id];
              if (!pos) return null;
              return (
                <text
                  key={`label-${center.id}`}
                  x={toSvgX(pos.x)}
                  y={toSvgY(pos.y) + width * 0.06}
                  textAnchor="middle"
                  fontSize={width * 0.025}
                  fill="#6B7280"
                  pointerEvents="none"
                >
                  {center.name.replace(' Center', '')}
                </text>
              );
            })}
          </g>
        )}
      </svg>

      {/* Visually hidden summary for screen readers */}
      <div className="sr-only" role="status">
        Human Design body graph.
        {definedCenters.length > 0
          ? ` Defined centers: ${Array.from(hdCenters.values())
              .filter((c) => definedCentersSet.has(c.id))
              .map((c) => c.name)
              .join(', ')}.`
          : ' No defined centers.'}
        {definedChannels.length > 0
          ? ` ${definedChannels.length} defined channel${definedChannels.length > 1 ? 's' : ''}.`
          : ''}
        {personalityGates.length > 0
          ? ` ${personalityGates.length} personality gate${personalityGates.length > 1 ? 's' : ''}.`
          : ''}
        {designGates.length > 0
          ? ` ${designGates.length} design gate${designGates.length > 1 ? 's' : ''}.`
          : ''}
      </div>

      {/* Tooltip */}
      {interactive && (hoveredCenter || hoveredGate || hoveredChannel) && (
        <div className="absolute top-2 left-2 z-10">{getTooltipContent()}</div>
      )}
    </div>
  );
}

// Compact version for use in cards/lists
export function BodyGraphMini({
  definedCenters = [],
  definedChannels = [],
  personalityGates = [],
  designGates = [],
  interactive = false,
  onCenterClick,
}: {
  definedCenters?: string[];
  definedChannels?: string[];
  personalityGates?: number[];
  designGates?: number[];
  interactive?: boolean;
  onCenterClick?: (centerId: string) => void;
}) {
  return (
    <BodyGraph
      width={120}
      height={180}
      definedCenters={definedCenters}
      definedChannels={definedChannels}
      personalityGates={personalityGates}
      designGates={designGates}
      showLabels={false}
      showGates={false}
      showChannels={true}
      interactive={interactive}
      onCenterClick={onCenterClick}
    />
  );
}

// Responsive version that adapts to container
export function BodyGraphResponsive({
  definedCenters = [],
  definedChannels = [],
  personalityGates = [],
  designGates = [],
  showGates = true,
  interactive = true,
  onCenterClick,
  onGateClick,
}: {
  definedCenters?: string[];
  definedChannels?: string[];
  personalityGates?: number[];
  designGates?: number[];
  showGates?: boolean;
  interactive?: boolean;
  onCenterClick?: (centerId: string) => void;
  onGateClick?: (gateNumber: number) => void;
}) {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Mobile: smaller graph */}
      <div className="sm:hidden">
        <BodyGraph
          width={280}
          height={420}
          definedCenters={definedCenters}
          definedChannels={definedChannels}
          personalityGates={personalityGates}
          designGates={designGates}
          showLabels={true}
          showGates={showGates}
          showChannels={true}
          interactive={interactive}
          onCenterClick={onCenterClick}
          onGateClick={onGateClick}
        />
      </div>
      {/* Desktop: larger graph */}
      <div className="hidden sm:block">
        <BodyGraph
          width={350}
          height={520}
          definedCenters={definedCenters}
          definedChannels={definedChannels}
          personalityGates={personalityGates}
          designGates={designGates}
          showLabels={true}
          showGates={showGates}
          showChannels={true}
          interactive={interactive}
          onCenterClick={onCenterClick}
          onGateClick={onGateClick}
        />
      </div>
    </div>
  );
}

// Interactive version with navigation
export function BodyGraphInteractive() {
  const handleCenterClick = (centerId: string) => {
    window.location.href = `/human-design/centers/${centerId}`;
  };

  const handleGateClick = (gateNumber: number) => {
    window.location.href = `/human-design/${gateNumber}`;
  };

  return (
    <div className="bg-neutral-900/50 rounded-xl p-4 sm:p-6 border border-neutral-800">
      <h3 className="font-serif text-lg mb-4 text-center">Human Design Body Graph</h3>
      <BodyGraphResponsive
        interactive={true}
        showGates={false}
        onCenterClick={handleCenterClick}
        onGateClick={handleGateClick}
      />
      <p className="text-xs text-neutral-500 text-center mt-4">
        Click on centers to view details
      </p>
    </div>
  );
}

/**
 * Centers-only Body Graph variant
 * - Larger centers for better visibility
 * - No gates or channels displayed
 * - Click to select center and open entity panel
 */
export function BodyGraphCentersOnly({
  width = 350,
  height = 450,
  definedCenters = [],
  selectedCenterId,
  onCenterClick,
}: {
  width?: number;
  height?: number;
  definedCenters?: string[];
  selectedCenterId?: string | null;
  onCenterClick?: (centerId: string) => void;
}) {
  const definedCentersSet = new Set<string>(definedCenters);

  // Convert normalized coordinates to SVG coordinates
  const toSvgX = (x: number) => (x / 100) * width;
  const toSvgY = (y: number) => (y / 100) * height;

  // Larger base size for centers-only view (75% larger than standard)
  const baseSize = width * 0.14;

  // Render center shape with HD colors
  const renderCenterShape = (center: HDCenter) => {
    const pos = CENTER_POSITIONS[center.id];
    if (!pos) return null;

    const x = toSvgX(pos.x);
    const y = toSvgY(pos.y);
    const isDefined = definedCentersSet.has(center.id);
    const isSelected = selectedCenterId === center.id;

    const colors = CENTER_COLORS[center.id] || { defined: '#F59E0B', undefined: 'transparent' };
    const fill = isDefined ? colors.defined : colors.undefined;
    const stroke = isSelected
      ? '#FBBF24' // Amber highlight for selected
      : isDefined
        ? colors.defined
        : '#4B5563';
    const strokeWidth = isSelected ? 4 : isDefined ? 2.5 : 1.5;

    const handleClick = () => {
      if (onCenterClick) {
        onCenterClick(center.id);
      }
    };

    const commonProps = {
      fill,
      stroke,
      strokeWidth,
      opacity: isDefined ? 0.9 : 1,
      cursor: 'pointer',
      onClick: handleClick,
      className: 'transition-all duration-200 hover:opacity-80',
    };

    switch (pos.shape) {
      case 'triangle': {
        const h = baseSize * 0.866;
        return (
          <polygon
            key={center.id}
            points={`${x},${y - h / 2} ${x - baseSize / 2},${y + h / 2} ${x + baseSize / 2},${y + h / 2}`}
            {...commonProps}
          />
        );
      }
      case 'square':
        return (
          <rect
            key={center.id}
            x={x - baseSize / 2}
            y={y - baseSize / 2}
            width={baseSize}
            height={baseSize}
            {...commonProps}
          />
        );
      case 'diamond': {
        const d = baseSize * 0.7;
        return (
          <polygon
            key={center.id}
            points={`${x},${y - d} ${x + d},${y} ${x},${y + d} ${x - d},${y}`}
            {...commonProps}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto"
      >
        {/* Background */}
        <rect width={width} height={height} fill="transparent" />

        {/* Centers only - no channels, no gates */}
        <g className="centers">
          {Array.from(hdCenters.values()).map(renderCenterShape)}
        </g>

        {/* Center labels */}
        <g className="center-labels">
          {Array.from(hdCenters.values()).map((center) => {
            const pos = CENTER_POSITIONS[center.id];
            if (!pos) return null;
            const isDefined = definedCentersSet.has(center.id);
            const isSelected = selectedCenterId === center.id;
            return (
              <text
                key={`label-${center.id}`}
                x={toSvgX(pos.x)}
                y={toSvgY(pos.y) + baseSize * 0.7}
                textAnchor="middle"
                fontSize={width * 0.032}
                fill={isSelected ? '#FBBF24' : isDefined ? '#D4D4D4' : '#6B7280'}
                pointerEvents="none"
                fontWeight={isDefined ? '500' : 'normal'}
              >
                {center.name.replace(' Center', '')}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
