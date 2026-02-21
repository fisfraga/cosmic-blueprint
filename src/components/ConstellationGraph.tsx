import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import {
  getAllEntities,
  relationships,
  getEntityById,
  planets,
  signs,
} from '../data';
import { useTheme } from '../context';
import { d3ElementFlatColors, d3EntityTypeColors, d3RelationshipColors, getD3ThemeColors } from '../styles/colors';
import type { UniversalEntity, Relationship, RelationshipType, EntityType } from '../types';

interface ConstellationGraphProps {
  width?: number;
  height?: number;
  selectedEntityId?: string;
  onSelectEntity?: (entity: UniversalEntity) => void;
  filterRelationshipTypes?: RelationshipType[];
  filterEntityTypes?: EntityType[];
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  entity: UniversalEntity;
  radius: number;
  color: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  id: string;
  relationship: Relationship;
  color: string;
}

// Element colors - used for elements and signs
const elementColors = d3ElementFlatColors;

const entityTypeColors = d3EntityTypeColors as Record<EntityType, string>;

const relationshipColors = d3RelationshipColors as Record<RelationshipType, string>;

function getNodeColor(entity: UniversalEntity): string {
  // Elements use their own element color
  if (entity.type === 'element') {
    return elementColors[entity.id] || entityTypeColors.element;
  }

  // Signs use their element's color
  if (entity.type === 'sign') {
    const sign = signs.get(entity.id);
    if (sign) {
      return elementColors[sign.elementId] || entityTypeColors.sign;
    }
  }

  // Planets and houses use their category color
  return entityTypeColors[entity.type] || '#FFFFFF';
}

function getNodeRadius(entity: UniversalEntity): number {
  switch (entity.type) {
    case 'planet': {
      const planet = planets.get(entity.id);
      return planet ? 8 + planet.planetImportance * 3 : 12;
    }
    case 'sign':
      return 14;
    case 'house':
      return 12;
    case 'element':
      return 16;
    case 'aspect':
      return 10;
    default:
      return 8;
  }
}

function getEntityPath(entity: UniversalEntity): string {
  switch (entity.type) {
    case 'planet':
      return `/planets/${entity.id}`;
    case 'sign':
      return `/signs/${entity.id}`;
    case 'house':
      return `/houses/${entity.id}`;
    case 'element':
      return `/elements/${entity.id}`;
    case 'aspect':
      return `/aspects/${entity.id}`;
    default:
      return '/';
  }
}

export function ConstellationGraph({
  width = 900,
  height = 700,
  selectedEntityId,
  onSelectEntity,
  filterRelationshipTypes,
  filterEntityTypes,
}: ConstellationGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    selectedEntityId || null
  );
  const { theme } = useTheme();
  const d3Colors = useMemo(() => getD3ThemeColors(theme), [theme]);

  const selectedId = selectedEntityId !== undefined ? selectedEntityId : internalSelectedId;

  const handleNodeClick = useCallback(
    (entity: UniversalEntity) => {
      if (onSelectEntity) {
        onSelectEntity(entity);
      } else {
        setInternalSelectedId((prev) => (prev === entity.id ? null : entity.id));
      }
    },
    [onSelectEntity]
  );

  const handleNodeDoubleClick = useCallback(
    (entity: UniversalEntity) => {
      navigate(getEntityPath(entity));
    },
    [navigate]
  );

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Get all entities and filter if needed
    let allEntities = getAllEntities();
    if (filterEntityTypes && filterEntityTypes.length > 0) {
      allEntities = allEntities.filter((e) => filterEntityTypes.includes(e.type));
    }

    // Create nodes from entities
    const nodes: GraphNode[] = allEntities.map((entity) => ({
      id: entity.id,
      entity,
      radius: getNodeRadius(entity),
      color: getNodeColor(entity),
    }));

    const nodeIds = new Set(nodes.map((n) => n.id));

    // Filter relationships
    let filteredRelationships = relationships.filter(
      (r) => nodeIds.has(r.sourceId) && nodeIds.has(r.targetId)
    );

    if (filterRelationshipTypes && filterRelationshipTypes.length > 0) {
      filteredRelationships = filteredRelationships.filter((r) =>
        filterRelationshipTypes.includes(r.relationshipType)
      );
    }

    // Create links from relationships
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const links: GraphLink[] = filteredRelationships
      .filter((r) => nodeMap.has(r.sourceId) && nodeMap.has(r.targetId))
      .map((relationship) => ({
        id: relationship.id,
        source: nodeMap.get(relationship.sourceId)!,
        target: nodeMap.get(relationship.targetId)!,
        relationship,
        color:
          relationshipColors[relationship.relationshipType as RelationshipType] || '#666666',
      }));

    // Create the force simulation
    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(80)
          .strength(0.5)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'collision',
        d3.forceCollide<GraphNode>().radius((d) => d.radius + 5)
      );

    // Create container groups
    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Add defs for glow filters
    const defs = svg.append('defs');

    // Glow filter for selected/hovered nodes
    const glowFilter = defs.append('filter').attr('id', 'glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Arrow markers for directed edges
    defs
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', d3Colors.labelTextSecondary);

    // Draw links
    const linkGroup = g.append('g').attr('class', 'links');

    const link = linkGroup
      .selectAll<SVGLineElement, GraphLink>('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', (d) => d.color)
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5);

    // Draw nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');

    const node = nodeGroup
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node circles
    node
      .append('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => d.color)
      .attr('stroke', d3Colors.nodeStroke)
      .attr('stroke-width', 2);

    // Node symbols
    node
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', (d) => Math.max(10, d.radius * 0.8))
      .attr('fill', d3Colors.textPrimary)
      .attr('pointer-events', 'none')
      .text((d) => d.entity.symbol || d.entity.name.charAt(0));

    // Event handlers
    node
      .on('mouseenter', function (_event, d) {
        setHoveredNode(d.id);

        // Highlight this node
        d3.select(this).select('circle').attr('filter', 'url(#glow)');

        // Highlight connected links and nodes
        const connectedNodeIds = new Set<string>();
        link.each(function (l) {
          const sourceId = typeof l.source === 'object' ? (l.source as GraphNode).id : String(l.source);
          const targetId = typeof l.target === 'object' ? (l.target as GraphNode).id : String(l.target);
          if (sourceId === d.id || targetId === d.id) {
            connectedNodeIds.add(sourceId);
            connectedNodeIds.add(targetId);
            d3.select(this).attr('stroke-opacity', 1).attr('stroke-width', 2.5);
          }
        });

        // Dim non-connected nodes
        node.each(function (n) {
          if (!connectedNodeIds.has(n.id) && n.id !== d.id) {
            d3.select(this).attr('opacity', 0.3);
          }
        });
      })
      .on('mouseleave', function () {
        setHoveredNode(null);

        // Reset highlights
        d3.select(this).select('circle').attr('filter', null);
        link.attr('stroke-opacity', 0.4).attr('stroke-width', 1.5);
        node.attr('opacity', 1);
      })
      .on('click', (_event, d) => {
        handleNodeClick(d.entity);
      })
      .on('dblclick', (_event, d) => {
        handleNodeDoubleClick(d.entity);
      });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as GraphNode).x!)
        .attr('y1', (d) => (d.source as GraphNode).y!)
        .attr('x2', (d) => (d.target as GraphNode).x!)
        .attr('y2', (d) => (d.target as GraphNode).y!);

      node.attr('transform', (d) => `translate(${d.x}, ${d.y})`);
    });

    // Highlight selected node and its connections
    function updateSelection(selectedId: string | null) {
      if (!selectedId) {
        // Reset all
        node.attr('opacity', 1).select('circle').attr('filter', null);
        link.attr('stroke-opacity', 0.4).attr('stroke-width', 1.5);
        return;
      }

      const connectedNodeIds = new Set<string>([selectedId]);
      link.each(function (l) {
        const sourceId = typeof l.source === 'object' ? (l.source as GraphNode).id : String(l.source);
        const targetId = typeof l.target === 'object' ? (l.target as GraphNode).id : String(l.target);
        if (sourceId === selectedId || targetId === selectedId) {
          connectedNodeIds.add(sourceId);
          connectedNodeIds.add(targetId);
          d3.select(this).attr('stroke-opacity', 1).attr('stroke-width', 2.5);
        } else {
          d3.select(this).attr('stroke-opacity', 0.15).attr('stroke-width', 1);
        }
      });

      node.each(function (n) {
        if (connectedNodeIds.has(n.id)) {
          d3.select(this).attr('opacity', 1);
          if (n.id === selectedId) {
            d3.select(this).select('circle').attr('filter', 'url(#glow)');
          }
        } else {
          d3.select(this).attr('opacity', 0.2);
        }
      });
    }

    updateSelection(selectedId);

    return () => {
      simulation.stop();
    };
  }, [
    width,
    height,
    selectedId,
    filterRelationshipTypes,
    filterEntityTypes,
    handleNodeClick,
    handleNodeDoubleClick,
    d3Colors,
  ]);

  const hoveredEntity = hoveredNode ? getEntityById(hoveredNode) : null;
  const selectedEntity = selectedId ? getEntityById(selectedId) : null;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bg-surface-base/50 rounded-lg border border-theme-border-subtle"
      />

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-surface-base/90 backdrop-blur-sm rounded-lg p-3 border border-theme-border-subtle">
        <h4 className="text-sm font-semibold text-theme-text-primary mb-2">Categories</h4>
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entityTypeColors.planet }} />
            <span className="text-xs text-theme-text-secondary">Planets</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entityTypeColors.house }} />
            <span className="text-xs text-theme-text-secondary">Houses</span>
          </div>
        </div>
        <h4 className="text-sm font-semibold text-theme-text-primary mb-2">Elements</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: elementColors.fire }} />
            <span className="text-xs text-theme-text-secondary">Fire (Signs & Element)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: elementColors.earth }} />
            <span className="text-xs text-theme-text-secondary">Earth (Signs & Element)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: elementColors.air }} />
            <span className="text-xs text-theme-text-secondary">Air (Signs & Element)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: elementColors.water }} />
            <span className="text-xs text-theme-text-secondary">Water (Signs & Element)</span>
          </div>
        </div>
      </div>

      {/* Tooltip for hovered node */}
      {hoveredEntity && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface-base/95 backdrop-blur-sm px-4 py-2 rounded-lg border border-theme-border-subtle text-center whitespace-nowrap">
          <div className="flex items-center gap-2 justify-center">
            <span className="text-xl">{hoveredEntity.symbol}</span>
            <span className="font-serif text-lg text-theme-text-primary">{hoveredEntity.name}</span>
          </div>
          <p className="text-theme-text-secondary text-sm capitalize">{hoveredEntity.type}</p>
          <p className="text-theme-text-tertiary text-xs mt-1">Click to select, double-click to view</p>
        </div>
      )}

      {/* Selected entity info */}
      {selectedEntity && !hoveredNode && (
        <div className="absolute bottom-4 right-4 bg-surface-base/95 backdrop-blur-sm px-4 py-3 rounded-lg border border-theme-border-subtle max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{selectedEntity.symbol}</span>
            <div>
              <h4 className="font-serif text-lg text-theme-text-primary">{selectedEntity.name}</h4>
              <p className="text-theme-text-secondary text-sm capitalize">{selectedEntity.type}</p>
            </div>
          </div>
          <button
            onClick={() => navigate(getEntityPath(selectedEntity))}
            className="w-full mt-2 px-3 py-1.5 bg-surface-raised hover:bg-surface-interactive text-theme-text-primary text-sm rounded transition-colors"
          >
            View Details
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-surface-base/90 backdrop-blur-sm rounded-lg p-3 border border-theme-border-subtle">
        <h4 className="text-sm font-semibold text-theme-text-primary mb-2">Controls</h4>
        <ul className="text-xs text-theme-text-secondary space-y-1">
          <li>Scroll to zoom</li>
          <li>Drag to pan</li>
          <li>Drag nodes to move</li>
          <li>Click to select</li>
          <li>Double-click to view</li>
        </ul>
      </div>
    </div>
  );
}
