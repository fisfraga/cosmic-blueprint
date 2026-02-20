# Story TD-L-03: User Data Export Feature
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** L
**Status:** Ready
**Points:** 5
**Agent:** @dev (Dex)

---

## Description

Users store their birth data, insights, and contemplation sessions in Cosmic Blueprint — but have no way to export or back up their data. This creates a data lock-in risk and blocks GDPR/privacy compliance. This story adds a "Export My Data" feature that downloads all user data as a structured JSON file.

## Acceptance Criteria

- [ ] An "Export My Data" button exists on the Profile Settings page (or equivalent settings area)
- [ ] Clicking the button triggers a browser JSON file download
- [ ] Downloaded file name: `cosmic-blueprint-export-{YYYY-MM-DD}.json`
- [ ] Export includes all data from localStorage:
  - [ ] All profiles (full `CosmicProfile` objects)
  - [ ] All saved insights (full `SavedInsight` objects)
  - [ ] Pathway progress for all pathways
  - [ ] App settings/preferences if stored
- [ ] Export is a single flat JSON with a `version: "1.0"` field and `exportedAt` ISO timestamp
- [ ] Export completes instantly (client-side only — no server roundtrip)
- [ ] A success notification ("Data exported successfully") is shown after download
- [ ] The feature works correctly when Supabase is disabled (localStorage-only mode)

### Optional (if Supabase is enabled)
- [ ] If user is authenticated, contemplation sessions from Supabase are merged into the export

## Tasks

- [ ] Read the Profile page and settings area to determine where to place the button
- [ ] Create `src/services/dataExport.ts` with `exportUserData(): void` function
- [ ] Implement data collection from all localStorage keys
- [ ] Implement JSON blob creation and download trigger
- [ ] Add export button to Profile Settings UI
- [ ] Show success toast/notification after export
- [ ] Run `npm run verify`

## Scope

**IN:** Client-side JSON export, all localStorage data, download trigger
**OUT:** Import/restore functionality, CSV export, server-side export (GDPR portal), Supabase-only export (cloud users only)

## Dependencies

TD-L-01 recommended first (ensures exported insights have proper `profileId` structure).

## Technical Notes

```typescript
// dataExport.ts pattern
function exportUserData(): void {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    profiles: getAllProfiles(), // from src/services/profiles.ts
    insights: getAllInsights(), // from src/services/insights.ts
    pathwayProgress: getPathwayProgress(), // from src/services/pathways.ts
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cosmic-blueprint-export-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
```

- No third-party library needed — `Blob` + `URL.createObjectURL` is native
- Keep `dataExport.ts` as a pure utility (no React hooks)

## Definition of Done

"Export My Data" button downloads a complete JSON file. Export includes all localStorage data. `npm run verify` passes.
