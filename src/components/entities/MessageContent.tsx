// ============================================
// Message Content Parser Component
// ============================================
// Parses chat messages and replaces entity references with clickable links
// Simple markdown-like rendering with entity link integration

import React from 'react';
import { EntityLink } from './EntityLink';
import type { EntityInfo } from '../../services/entities';

interface MessageContentProps {
  content: string;
  onEntityClick?: (entity: EntityInfo) => void;
  className?: string;
}

interface ParsedSegment {
  type: 'text' | 'entity';
  content: string;
  entityId?: string;
  displayName?: string;
}

/**
 * Parse a text string and extract entity references
 * Handles both formats: [[entity-id|Display Name]] and [[entity-id]]
 */
function parseEntityReferences(text: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  let lastIndex = 0;

  // Combined regex that handles both formats
  const combinedRegex = /\[\[([^|\]]+)(?:\|([^\]]+))?\]\]/g;
  let match;

  while ((match = combinedRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex, match.index),
      });
    }

    // Add the entity reference
    const entityId = match[1].trim();
    const displayName = match[2]?.trim() || entityId; // Use ID as display if no name provided

    segments.push({
      type: 'entity',
      content: match[0],
      entityId,
      displayName,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.slice(lastIndex),
    });
  }

  return segments;
}

/**
 * Simple markdown-like text processing
 * Handles: **bold**, *italic*, `code`, and newlines
 */
function processMarkdownLine(
  line: string,
  onEntityClick?: (entity: EntityInfo) => void,
  lineIndex: number = 0
): React.ReactNode {
  // First parse entity references
  const entitySegments = parseEntityReferences(line);

  // Process each text segment for markdown
  const processedSegments = entitySegments.map((segment, segIndex) => {
    if (segment.type === 'entity') {
      return (
        <EntityLink
          key={`line-${lineIndex}-entity-${segIndex}`}
          entityId={segment.entityId!}
          displayName={segment.displayName!}
          onClick={onEntityClick}
        />
      );
    }

    // Process text for markdown formatting
    const text = segment.content;
    const elements: React.ReactNode[] = [];
    let key = 0;

    // Simple regex-based markdown parsing
    const patterns = [
      { regex: /\*\*([^*]+)\*\*/g, render: (match: string) => <strong key={key++} className="font-semibold text-theme-text-primary">{match}</strong> },
      { regex: /\*([^*]+)\*/g, render: (match: string) => <em key={key++} className="italic">{match}</em> },
      { regex: /`([^`]+)`/g, render: (match: string) => <code key={key++} className="bg-surface-raised px-1.5 py-0.5 rounded text-sm font-mono text-purple-300">{match}</code> },
    ];

    // Apply patterns in order
    const allMatches: Array<{ start: number; end: number; node: React.ReactNode }> = [];

    for (const { regex, render } of patterns) {
      let match;
      const localRegex = new RegExp(regex.source, 'g');
      while ((match = localRegex.exec(text)) !== null) {
        allMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          node: render(match[1]),
        });
      }
    }

    // Sort matches by position
    allMatches.sort((a, b) => a.start - b.start);

    // Build result, avoiding overlaps
    let currentPos = 0;
    for (const match of allMatches) {
      if (match.start >= currentPos) {
        if (match.start > currentPos) {
          elements.push(text.slice(currentPos, match.start));
        }
        elements.push(match.node);
        currentPos = match.end;
      }
    }

    // Add remaining text
    if (currentPos < text.length) {
      elements.push(text.slice(currentPos));
    }

    return elements.length > 0 ? elements : text;
  });

  return <>{processedSegments}</>;
}

/**
 * Process a paragraph that may contain multiple lines and entities
 */
function processParagraph(
  text: string,
  onEntityClick?: (entity: EntityInfo) => void,
  paraIndex: number = 0
): React.ReactNode {
  // Split into lines and process each
  const lines = text.split('\n');

  return (
    <>
      {lines.map((line, lineIndex) => (
        <React.Fragment key={`para-${paraIndex}-line-${lineIndex}`}>
          {processMarkdownLine(line, onEntityClick, lineIndex)}
          {lineIndex < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
}

/**
 * Main MessageContent component
 * Renders content with entity link support and basic markdown
 */
export function MessageContent({
  content,
  onEntityClick,
  className = '',
}: MessageContentProps): React.ReactElement {
  // Split content into paragraphs (double newlines)
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());

  return (
    <div className={`text-theme-text-secondary space-y-3 ${className}`}>
      {paragraphs.map((paragraph, index) => {
        const trimmed = paragraph.trim();

        // Check for headers (# ## ###)
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={index} className="text-base font-semibold text-theme-text-primary mt-2">
              {processParagraph(trimmed.slice(4), onEntityClick, index)}
            </h3>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={index} className="text-lg font-semibold text-theme-text-primary mt-3">
              {processParagraph(trimmed.slice(3), onEntityClick, index)}
            </h2>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={index} className="text-xl font-bold text-theme-text-primary mt-4">
              {processParagraph(trimmed.slice(2), onEntityClick, index)}
            </h1>
          );
        }

        // Check for blockquotes
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote
              key={index}
              className="border-l-2 border-purple-500/50 pl-4 italic text-theme-text-secondary"
            >
              {processParagraph(trimmed.slice(2), onEntityClick, index)}
            </blockquote>
          );
        }

        // Check for bullet lists
        if (trimmed.match(/^[-*•]\s/)) {
          const items = trimmed.split(/\n/).filter(line => line.match(/^[-*•]\s/));
          return (
            <ul key={index} className="list-disc list-inside space-y-1">
              {items.map((item, itemIndex) => (
                <li key={itemIndex} className="leading-relaxed">
                  {processParagraph(item.replace(/^[-*•]\s/, ''), onEntityClick, itemIndex)}
                </li>
              ))}
            </ul>
          );
        }

        // Check for numbered lists
        if (trimmed.match(/^\d+\.\s/)) {
          const items = trimmed.split(/\n/).filter(line => line.match(/^\d+\.\s/));
          return (
            <ol key={index} className="list-decimal list-inside space-y-1">
              {items.map((item, itemIndex) => (
                <li key={itemIndex} className="leading-relaxed">
                  {processParagraph(item.replace(/^\d+\.\s/, ''), onEntityClick, itemIndex)}
                </li>
              ))}
            </ol>
          );
        }

        // Regular paragraph
        return (
          <p key={index} className="leading-relaxed">
            {processParagraph(trimmed, onEntityClick, index)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Utility function to check if content contains entity references
 */
/* eslint-disable react-refresh/only-export-components */
export function hasEntityReferences(content: string): boolean {
  return /\[\[([^|\]]+)(?:\|[^\]]+)?\]\]/.test(content);
}

/**
 * Utility function to extract all entity IDs from content
 */
export function extractEntityIds(content: string): string[] {
  const ids: string[] = [];
  const combinedRegex = /\[\[([^|\]]+)(?:\|[^\]]+)?\]\]/g;
  let match;

  while ((match = combinedRegex.exec(content)) !== null) {
    ids.push(match[1].trim());
  }

  return [...new Set(ids)]; // Remove duplicates
}

export default MessageContent;
