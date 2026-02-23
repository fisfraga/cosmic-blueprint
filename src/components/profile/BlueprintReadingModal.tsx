/**
 * BlueprintReadingModal
 *
 * Generates a complete multi-system Integrated Blueprint Reading using Claude Opus.
 * Transitions through four stages:
 *   1. confirm — description + generate button
 *   2. generating — streaming progress display
 *   3. done — formatted reading + export options
 *   4. error — error message + retry
 *
 * Reading is saved to the insights store (type: 'integratedBlueprintReading').
 * Export options: copy to clipboard as markdown, download as .md file.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  formatProfileContext,
  appendILOSContext,
  appendKnowledgeExcerpts,
  type ContemplationSelection,
} from '../../services/contemplation/context';
import {
  buildFullPrompt,
  CATEGORY_PROMPTS,
  CONTEMPLATION_TYPE_PROMPTS,
  getDefaultPersonaForType,
} from '../../services/contemplation/prompts';
import { sendContemplationStream } from '../../services/claude';
import { saveInsight } from '../../services/insights';
import { copyToClipboard } from '../../services/tanaSync';
import type { AstroProfile, CosmicProfile } from '../../types';

interface Props {
  profile: AstroProfile;
  cosmicProfile: CosmicProfile | null;
  onClose: () => void;
}

type Stage = 'confirm' | 'generating' | 'done' | 'error';

export function BlueprintReadingModal({ profile, cosmicProfile, onClose }: Props) {
  const [stage, setStage] = useState<Stage>('confirm');
  const [readingText, setReadingText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Use a ref to accumulate streaming text so the onComplete callback gets the full content
  const accumulatedRef = useRef('');
  const abortRef = useRef<AbortController | null>(null);

  // Cleanup abort on unmount
  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  const buildSystemPrompt = useCallback(() => {
    const selection: ContemplationSelection = {
      category: 'crossSystem',
      type: 'integratedBlueprintReading',
    };
    const rawContext = formatProfileContext(profile, selection);
    const contextWithILOS = appendILOSContext(rawContext, 'crossSystem', cosmicProfile?.personalContext);
    const context = appendKnowledgeExcerpts(contextWithILOS, selection);
    const categoryPrompt = CATEGORY_PROMPTS['crossSystem'] ?? '';
    const typePrompt = CONTEMPLATION_TYPE_PROMPTS['integratedBlueprintReading'] ?? '';
    const persona = getDefaultPersonaForType('integratedBlueprintReading');
    const basePrompt = buildFullPrompt(categoryPrompt, typePrompt, persona, undefined, 'integratedBlueprintReading');
    return `${basePrompt}\n\n${context}`;
  }, [profile, cosmicProfile]);

  const generate = useCallback(async () => {
    setStage('generating');
    setReadingText('');
    setError(null);
    accumulatedRef.current = '';

    const abort = new AbortController();
    abortRef.current = abort;

    const systemPrompt = buildSystemPrompt();
    const userName = profile.name ?? 'the seeker';
    const userMessage = `Please generate my complete Integrated Blueprint Reading. I am ${userName}.`;

    await sendContemplationStream(
      systemPrompt,
      [{ role: 'user', content: userMessage }],
      (chunk) => {
        accumulatedRef.current += chunk;
        setReadingText(prev => prev + chunk);
      },
      () => {
        // Save final reading to insights store
        const reading = accumulatedRef.current;
        if (reading.trim()) {
          saveInsight({
            content: reading,
            category: 'crossSystem',
            contemplationType: 'integratedBlueprintReading',
            tags: ['blueprint-reading', 'integrated'],
          });
        }
        setStage('done');
      },
      (errMsg) => {
        setError(errMsg);
        setStage('error');
      },
      {
        model: 'claude-opus-4-6',
        signal: abort.signal,
      }
    );
  }, [buildSystemPrompt, profile.name]);

  const handleClose = useCallback(() => {
    abortRef.current?.abort();
    onClose();
  }, [onClose]);

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(accumulatedRef.current);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }, []);

  const handleDownload = useCallback(() => {
    const content = accumulatedRef.current;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name ?? 'blueprint'}-reading-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [profile.name]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-surface-base rounded-2xl border border-theme-border-subtle shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-theme-border-subtle flex-shrink-0">
          <div>
            <h2 className="font-serif text-xl text-theme-text-primary">Integrated Blueprint Reading</h2>
            <p className="text-theme-text-secondary text-sm mt-0.5">
              {stage === 'confirm' && 'A complete multi-system synthesis document'}
              {stage === 'generating' && 'Claude Opus is weaving your blueprint…'}
              {stage === 'done' && `${profile.name ?? 'Your'}'s reading is ready`}
              {stage === 'error' && 'Generation failed'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-theme-text-muted hover:text-theme-text-primary transition-colors p-2 rounded-lg hover:bg-surface-overlay"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* Confirm stage */}
          {stage === 'confirm' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-purple-500/10 to-genekey-500/5 rounded-xl p-5 border border-purple-500/20">
                <h3 className="font-medium text-purple-300 mb-2">What you'll receive</h3>
                <p className="text-theme-text-secondary text-sm mb-3">
                  A complete written reading synthesizing your Astrology, Human Design, and Gene Keys into five chapters, using Cosmic Blueprint's own cross-system vocabulary:
                </p>
                <ol className="text-sm text-theme-text-secondary space-y-1.5 list-decimal list-inside">
                  <li><span className="text-amber-300">The Solar Cluster</span> — your four core activation spheres as an integrated identity arc</li>
                  <li><span className="text-emerald-300">The Six Keys</span> — each activation read through its line's chakra and elemental embodiment portal</li>
                  <li><span className="text-rose-300">The Relational Arc</span> — your Venus sequence as a developmental story of heart opening</li>
                  <li><span className="text-violet-300">The Inner Landscape</span> — your developmental imprinting layers (mental gift, emotional defense, inner grounding, ancestral thread)</li>
                  <li><span className="text-blue-300">The Expansion Arc</span> — your Pearl sequence and the trajectory your blueprint is pointing toward</li>
                </ol>
              </div>
              <div className="flex items-center gap-2 text-theme-text-muted text-sm">
                <span className="text-purple-400">⏱</span>
                <span>Estimated generation time: 1–3 minutes using Claude Opus</span>
              </div>
              <p className="text-theme-text-tertiary text-xs">
                The reading will be saved to your insights library and can be exported as a markdown file.
              </p>
            </div>
          )}

          {/* Generating stage */}
          {stage === 'generating' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <span className="text-theme-text-secondary text-sm">Synthesizing your blueprint across all three traditions…</span>
              </div>
              {readingText && (
                <div className="bg-surface-overlay rounded-xl p-4 border border-theme-border-subtle font-mono text-xs text-theme-text-muted overflow-y-auto whitespace-pre-wrap" style={{ maxHeight: '50vh' }}>
                  {readingText}
                </div>
              )}
            </div>
          )}

          {/* Done stage — formatted reading */}
          {stage === 'done' && (
            <div className="text-sm leading-relaxed text-theme-text-primary whitespace-pre-wrap">
              {readingText}
            </div>
          )}

          {/* Error stage */}
          {stage === 'error' && (
            <div className="bg-red-500/10 rounded-xl p-5 border border-red-500/20">
              <p className="text-red-400 font-medium mb-1">Generation failed</p>
              <p className="text-red-400/70 text-sm">{error ?? 'An unexpected error occurred.'}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-theme-border-subtle flex-shrink-0 flex items-center justify-between gap-3 flex-wrap">

          {stage === 'confirm' && (
            <>
              <button
                onClick={handleClose}
                className="text-theme-text-muted hover:text-theme-text-primary text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={generate}
                className="px-5 py-2 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-lg border border-purple-500/30 transition-colors text-sm"
              >
                Generate My Blueprint Reading
              </button>
            </>
          )}

          {stage === 'generating' && (
            <button
              onClick={handleClose}
              className="text-theme-text-muted hover:text-theme-text-primary text-sm transition-colors"
            >
              Cancel generation
            </button>
          )}

          {stage === 'done' && (
            <>
              <button
                onClick={handleClose}
                className="text-theme-text-muted hover:text-theme-text-primary text-sm transition-colors"
              >
                Close
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-1.5 bg-surface-overlay text-theme-text-secondary hover:text-theme-text-primary rounded-lg border border-theme-border-subtle transition-colors text-xs"
                >
                  {copied ? '✓ Copied' : 'Copy Markdown'}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-1.5 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-lg border border-purple-500/30 transition-colors text-xs"
                >
                  Download .md
                </button>
              </div>
            </>
          )}

          {stage === 'error' && (
            <>
              <button
                onClick={handleClose}
                className="text-theme-text-muted hover:text-theme-text-primary text-sm transition-colors"
              >
                Close
              </button>
              <button
                onClick={generate}
                className="px-5 py-2 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-lg border border-purple-500/30 transition-colors text-sm"
              >
                Retry
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
