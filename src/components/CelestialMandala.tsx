import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import { getSignsInOrder } from '../data';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { ZodiacSign } from '../types';

interface CelestialMandalaProps {
  size?: number;
  onSignSelect?: (sign: ZodiacSign) => void;
  selectedSignId?: string;
}

const elementColors = {
  fire: { fill: '#FF6B35', stroke: '#FFB088', glow: 'rgba(255, 107, 53, 0.4)' },
  earth: { fill: '#2D5016', stroke: '#5D8A3D', glow: 'rgba(45, 80, 22, 0.4)' },
  air: { fill: '#4A90D9', stroke: '#7BB3E8', glow: 'rgba(74, 144, 217, 0.4)' },
  water: { fill: '#1A5F7A', stroke: '#3D8A9A', glow: 'rgba(26, 95, 122, 0.4)' },
};

export function CelestialMandala({
  size = 500,
  onSignSelect,
  selectedSignId,
}: CelestialMandalaProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();
  const [hoveredSign, setHoveredSign] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const signs = getSignsInOrder();

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

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
      .attr('fill', 'rgba(13, 13, 21, 0.8)')
      .attr('stroke', 'rgba(255, 255, 255, 0.1)')
      .attr('stroke-width', 1);

    // Inner circle
    g.append('circle')
      .attr('r', innerRadius - 10)
      .attr('fill', 'rgba(13, 13, 21, 0.9)')
      .attr('stroke', 'rgba(255, 255, 255, 0.1)')
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
      .style('cursor', 'pointer');

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
      .attr('fill', 'white')
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
      .attr('fill', 'rgba(255, 255, 255, 0.5)')
      .attr('font-family', 'Inter, sans-serif')
      .text((d) => d.data.name);

    // Add center text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-family', 'Cinzel, serif')
      .attr('font-size', size / 20)
      .attr('fill', 'rgba(255, 255, 255, 0.7)')
      .text('Zodiac');

  }, [signs, size, hoveredSign, selectedSignId, onSignSelect, navigate, prefersReducedMotion]);

  const hoveredSignData = hoveredSign ? signs.find((s) => s.id === hoveredSign) : null;

  return (
    <div className="relative inline-block">
      <svg
        ref={svgRef}
        width={size}
        height={size}
        className="transition-all duration-300"
      />
      {/* Tooltip */}
      {hoveredSignData && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-neutral-900/95 backdrop-blur-sm px-4 py-2 rounded-lg border border-neutral-700 text-center whitespace-nowrap">
          <div className="flex items-center gap-2 justify-center">
            <span className="text-xl">{hoveredSignData.symbol}</span>
            <span className="font-serif text-lg">{hoveredSignData.name}</span>
          </div>
          <p className="text-neutral-400 text-sm">{hoveredSignData.keyPhrase}</p>
        </div>
      )}
    </div>
  );
}
