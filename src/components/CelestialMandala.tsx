import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import { getSignsInOrder } from '../data';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useTheme } from '../context';
import { d3ElementColors, getD3ThemeColors } from '../styles/colors';
import type { ZodiacSign } from '../types';

interface CelestialMandalaProps {
  size?: number;
  onSignSelect?: (sign: ZodiacSign) => void;
  selectedSignId?: string;
}

const elementColors = d3ElementColors;

export function CelestialMandala({
  size = 500,
  onSignSelect,
  selectedSignId,
}: CelestialMandalaProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();
  const [hoveredSign, setHoveredSign] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { theme } = useTheme();
  const d3Colors = useMemo(() => getD3ThemeColors(theme), [theme]);
  const signs = getSignsInOrder();

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Embed title + desc for SVG-aware screen readers
    svg.append('title').text('Zodiac wheel — twelve astrological signs');
    svg.append('desc').text(
      `Zodiac wheel showing all twelve signs: ${signs.map(s => `${s.name} (${s.elementId} — ${s.keyPhrase})`).join('; ')}`
    );

    const width = size;
    const height = size;
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(width, height) / 2 - 40; // Increased margin to accommodate sign names
    const innerRadius = outerRadius * 0.6;
    const symbolRadius = outerRadius * 0.8;

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    // Add background circle
    g.append('circle')
      .attr('r', outerRadius + 10)
      .attr('fill', d3Colors.backgroundAlpha80)
      .attr('stroke', d3Colors.borderSubtle)
      .attr('stroke-width', 1);

    // Inner circle
    g.append('circle')
      .attr('r', innerRadius - 10)
      .attr('fill', d3Colors.backgroundAlpha90)
      .attr('stroke', d3Colors.borderSubtle)
      .attr('stroke-width', 1);

    // Create arc generator
    const arc = d3
      .arc<d3.PieArcDatum<ZodiacSign>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .padAngle(0.02);

    // Create pie generator
    // Rotated 15° clockwise from horizon for proper alignment
    const pie = d3
      .pie<ZodiacSign>()
      .value(1)
      .sort(null)
      .startAngle(-Math.PI / 2 + Math.PI / 12) // Start 15° clockwise from horizon
      .endAngle(-Math.PI / 2 + Math.PI / 12 - Math.PI * 2); // Go anti-clockwise (negative direction)

    const arcs = pie(signs);

    // Add defs for filters
    const defs = svg.append('defs');

    // Create glow filters for each element
    Object.entries(elementColors).forEach(([element]) => {
      const filter = defs
        .append('filter')
        .attr('id', `glow-${element}`)
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');

      filter
        .append('feGaussianBlur')
        .attr('stdDeviation', '3')
        .attr('result', 'coloredBlur');

      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    // Draw segments
    const segments = g
      .selectAll('.segment')
      .data(arcs)
      .enter()
      .append('g')
      .attr('class', 'segment')
      .attr('role', 'button')
      .attr('tabindex', '0')
      .attr('aria-label', (d) => `${d.data.name} — ${d.data.elementId} sign — ${d.data.keyPhrase}`)
      .style('cursor', 'pointer')
      .on('keydown', (event: KeyboardEvent, d) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (onSignSelect) {
            onSignSelect(d.data);
          } else {
            navigate(`/signs/${d.data.id}`);
          }
        }
      })
      .on('focus', function (_event, d) {
        setHoveredSign(d.data.id);
        const pathEl = d3.select(this).select('path');
        if (prefersReducedMotion) {
          pathEl.attr('opacity', 1)
            .attr('filter', `url(#glow-${d.data.elementId})`);
        } else {
          pathEl.transition().duration(200)
            .attr('opacity', 1)
            .attr('filter', `url(#glow-${d.data.elementId})`);
        }
      })
      .on('blur', function (_event, d) {
        setHoveredSign(null);
        const pathEl = d3.select(this).select('path');
        if (prefersReducedMotion) {
          pathEl.attr('opacity', selectedSignId === d.data.id ? 1 : 0.8)
            .attr('filter', selectedSignId === d.data.id ? `url(#glow-${d.data.elementId})` : 'none');
        } else {
          pathEl.transition().duration(200)
            .attr('opacity', selectedSignId === d.data.id ? 1 : 0.8)
            .attr('filter', selectedSignId === d.data.id ? `url(#glow-${d.data.elementId})` : 'none');
        }
      });

    segments
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => {
        const colors = elementColors[d.data.elementId as keyof typeof elementColors];
        return colors?.fill || '#333';
      })
      .attr('stroke', (d) => {
        const colors = elementColors[d.data.elementId as keyof typeof elementColors];
        return colors?.stroke || '#555';
      })
      .attr('stroke-width', 2)
      .attr('opacity', (d) => {
        if (selectedSignId && d.data.id !== selectedSignId) return 0.4;
        if (hoveredSign && d.data.id !== hoveredSign) return 0.6;
        return 0.9;
      })
      .attr('filter', (d) => {
        if (selectedSignId === d.data.id || hoveredSign === d.data.id) {
          return `url(#glow-${d.data.elementId})`;
        }
        return 'none';
      })
      .on('mouseenter', function (_event, d) {
        setHoveredSign(d.data.id);
        const sel = d3.select(this);
        if (prefersReducedMotion) {
          sel.attr('opacity', 1)
            .attr('filter', `url(#glow-${d.data.elementId})`);
        } else {
          sel.transition().duration(200)
            .attr('opacity', 1)
            .attr('filter', `url(#glow-${d.data.elementId})`);
        }
      })
      .on('mouseleave', function (_event, d) {
        setHoveredSign(null);
        const sel = d3.select(this);
        if (prefersReducedMotion) {
          sel.attr('opacity', selectedSignId === d.data.id ? 1 : 0.8)
            .attr('filter', selectedSignId === d.data.id ? `url(#glow-${d.data.elementId})` : 'none');
        } else {
          sel.transition().duration(200)
            .attr('opacity', selectedSignId === d.data.id ? 1 : 0.8)
            .attr('filter', selectedSignId === d.data.id ? `url(#glow-${d.data.elementId})` : 'none');
        }
      })
      .on('click', (_event, d) => {
        if (onSignSelect) {
          onSignSelect(d.data);
        } else {
          navigate(`/signs/${d.data.id}`);
        }
      });

    // Add symbols
    segments
      .append('text')
      .attr('transform', (d) => {
        const angle = (d.startAngle + d.endAngle) / 2;
        const x = Math.sin(angle) * symbolRadius;
        const y = -Math.cos(angle) * symbolRadius;
        return `translate(${x}, ${y})`;
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', size / 18)
      .attr('fill', d3Colors.textPrimary)
      .attr('pointer-events', 'none')
      .text((d) => d.data.symbol);

    // Add sign names on outer edge (optional, shown on hover)
    const nameRadius = outerRadius + 25;
    g.selectAll('.sign-name')
      .data(arcs)
      .enter()
      .append('text')
      .attr('class', 'sign-name')
      .attr('transform', (d) => {
        const angle = (d.startAngle + d.endAngle) / 2;
        const x = Math.sin(angle) * nameRadius;
        const y = -Math.cos(angle) * nameRadius;
        const rotation = (angle * 180) / Math.PI;
        return `translate(${x}, ${y}) rotate(${rotation > 90 && rotation < 270 ? rotation + 180 : rotation})`;
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', 10)
      .attr('fill', d3Colors.textMuted)
      .attr('font-family', 'Inter, sans-serif')
      .text((d) => d.data.name);

    // Add center text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-family', 'Cinzel, serif')
      .attr('font-size', size / 20)
      .attr('fill', d3Colors.labelText)
      .text('Zodiac');

  }, [signs, size, hoveredSign, selectedSignId, onSignSelect, navigate, prefersReducedMotion, d3Colors]);

  const hoveredSignData = hoveredSign ? signs.find((s) => s.id === hoveredSign) : null;

  return (
    <div className="relative inline-block">
      <svg
        ref={svgRef}
        width={size}
        height={size}
        className="transition-all duration-300"
        role="img"
        aria-label="Zodiac wheel chart showing twelve astrological signs arranged in a circle"
      />
      {/* Visually hidden summary for screen readers */}
      <div className="sr-only" role="status">
        Zodiac wheel with {signs.length} signs: {signs.map((s) => s.name).join(', ')}.
        {selectedSignId && (() => {
          const selected = signs.find((s) => s.id === selectedSignId);
          return selected ? ` Currently selected: ${selected.name}.` : '';
        })()}
      </div>
      {/* Tooltip */}
      {hoveredSignData && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface-base/95 backdrop-blur-sm px-4 py-2 rounded-lg border border-theme-border-subtle text-center whitespace-nowrap">
          <div className="flex items-center gap-2 justify-center">
            <span className="text-xl">{hoveredSignData.symbol}</span>
            <span className="font-serif text-lg">{hoveredSignData.name}</span>
          </div>
          <p className="text-theme-text-secondary text-sm">{hoveredSignData.keyPhrase}</p>
        </div>
      )}
    </div>
  );
}
