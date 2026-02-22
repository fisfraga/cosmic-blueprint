# Story TD-M-01: Decompose `ContemplationChamber.tsx`
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** M
**Status:** Done
**Points:** 13
**Agent:** @dev (Dex)

---

## Description

**CRITICAL ARCHITECTURAL DEBT.** `ContemplationChamber.tsx` is 1,346 lines — a God component containing persona selection, contemplation type routing, streaming AI conversation, insight saving, and session management all in a single file. This makes it impossible to:
- Add new AI personas without touching the streaming logic
- Add new contemplation types without risking UI regressions
- Test AI integration without rendering the full component tree
- Reuse any UI element elsewhere

This story decomposes it into focused components with single responsibilities.

## Acceptance Criteria

### Component Architecture
- [ ] `ContemplationChamber.tsx` acts as an orchestrator only (<200 lines after decomposition)
- [ ] Extracted components:
  - [ ] `src/components/contemplation/PersonaSelector.tsx` — Persona cards, selection UI, persona descriptions
  - [ ] `src/components/contemplation/ContemplationTypeSelector.tsx` — Type grid/list, category filters, 32-type navigation
  - [ ] `src/components/contemplation/ConversationView.tsx` — Message thread display, scroll-to-bottom
  - [ ] `src/components/contemplation/MessageBubble.tsx` — Individual message rendering (user/AI), markdown, timestamps
  - [ ] `src/components/contemplation/StreamingIndicator.tsx` — Typing/streaming animation
  - [ ] `src/components/contemplation/InsightSaver.tsx` — "Save as Insight" button, title input, save confirmation
- [ ] All extracted components receive props only — no direct localStorage or Supabase access
- [ ] Business logic stays in `ContemplationChamber.tsx` or custom hooks

### Custom Hook
- [ ] `src/hooks/useContemplation.ts` extracted with:
  - [ ] `useContemplation(profileId: string)` hook
  - [ ] Manages: streaming state, message history, session state, persona/type selection
  - [ ] Returns: `{ messages, streaming, selectedPersona, setPersona, selectedType, setType, sendMessage, saveInsight }`

### Functional Parity
- [ ] All 6 AI personas still accessible and functional
- [ ] All 32 contemplation types still accessible
- [ ] Streaming still works
- [ ] Save to Insight Library still works
- [ ] No regressions in existing functionality

### Tests
- [ ] Unit test for `useContemplation` hook (mocking AI streaming)
- [ ] Snapshot or render test for `MessageBubble`

## Tasks

- [ ] Read `src/components/ContemplationChamber.tsx` completely
- [ ] Read `src/services/contemplation/context.ts` and `prompts.ts`
- [ ] Map all state variables and their consumers
- [ ] Map all event handlers and their callers
- [ ] Sketch the new component tree on paper/doc before coding
- [ ] Extract `useContemplation` hook first — move state management out
- [ ] Extract `PersonaSelector` component
- [ ] Extract `ContemplationTypeSelector` component
- [ ] Extract `ConversationView` + `MessageBubble`
- [ ] Extract `StreamingIndicator`
- [ ] Extract `InsightSaver`
- [ ] Wire all pieces back through `ContemplationChamber.tsx` as orchestrator
- [ ] Verify: test contemplation end-to-end in dev mode
- [ ] Write hook unit test
- [ ] Run `npm run verify`

## Scope

**IN:** `ContemplationChamber.tsx` decomposition, `useContemplation` hook extraction, unit tests for hook
**OUT:** Prompt/persona content changes (separate), new contemplation types, UI redesign, mobile-first refactor

## Dependencies

None — but TD-L-04 (test coverage) completion would give confidence in the refactor not breaking other services.

## Technical Notes

### Decomposition Strategy

Start with state extraction (hook) before visual decomposition. If you move state and the component still renders, you can safely extract visual pieces.

```typescript
// useContemplation.ts target shape
export function useContemplation(profileId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [selectedPersona, setPersona] = useState<PersonaId>('guide');
  const [selectedType, setType] = useState<ContemplationType | null>(null);

  async function sendMessage(content: string) { /* streaming logic */ }
  async function saveInsight(messageId: string) { /* save logic */ }

  return { messages, streaming, selectedPersona, setPersona, selectedType, setType, sendMessage, saveInsight };
}
```

### Risk Mitigation

- Decompose in a feature branch, not on `main`
- After each extraction, run the dev server and manually test the contemplation flow before extracting the next piece
- Keep the original file around as `ContemplationChamber.tsx.bak` until all tests pass, then delete it

## Definition of Done

`ContemplationChamber.tsx` ≤200 lines. All 6 extracted components exist. `useContemplation` hook extracted. Full contemplation flow works in dev. `npm run verify` passes. No regressions.
