# INFOLAPLATA presentation redesign

## Objective
Build a polished, responsive local news homepage demo for presentation to INFOLAPLATA's owner, retaining its recognizable identity while improving readability and navigation.

## Problem and approach
The existing homepage truncates headlines, overflows narrow viewports, and gives promotions excessive visual weight. Preserve red, black, white, and restrained blue accents with subtle gradients, strong editorial typography, readable news cards, and deliberate whitespace.

## Scope and authorization
- User authorized implementation and cloning `git@github.com:Nuhe/laplata-noticias.git` with configured SSH authentication.
- User subsequently authorized uploading the demo and explicitly requested a direct push to `main` in `Nuhe/laplata-noticias`, using the already approved SSH authentication. No force push, website deployment, remote execution, or unrelated production changes are authorized.
- Spanish UI follows the existing Spanish publication; code, tests, and developer documentation use English.
- Buildless HTML/CSS/JavaScript with local article fixtures, local public editorial images, and no production CMS integration.
- Search is local deterministic filtering, not an AI service. Demonstration content must be identified; do not fabricate live news, weather, or audience metrics.
- Effects must preserve readable text, keyboard navigation, touch access, and reduced-motion preferences.

## Work unit
- [ ] T1 — Implement and verify the presentation-ready homepage and interactive demo.
  - Implementation and functional verification complete; direct-main delivery authorized, commit and native review remain pending.
  - Route: delegated direct; empty repository requires multi-file implementation, tests, and visual QA.
  - Acceptance: complete headlines; no horizontal overflow at 390/768/1440px; recognizable gradients and news hierarchy; responsive navigation; dynamic accent-insensitive search with empty states and keyboard dismissal; article interaction; back-to-top; subtle hover/reveal effects; reduced-motion support.
  - Checks: deterministic search tests with observed RED then GREEN; JavaScript syntax; browser checks of navigation/search/article dialog/back-to-top and narrow viewport layout; screenshot readback.
  - Passive presentation markup has no useful RED test; structural and browser checks cover it.
  - Commit: pending native review preflight; direct-main delivery explicitly authorized, Conventional Commit with no AI attribution.

## Verification plan
- `npm test` (Node built-in test runner; no dependency installation required).
- `node --check dist/app.js` and `node --check dist/data.js`.
- Local HTTP preview plus installed Chromium, with observed interactions and desktop/mobile screenshots.
- Native review mode: on (global). Assessment returned `high` / `unassessable`: the new repository contains only untracked files and no HEAD. Native review entry remains pending the work-unit delivery boundary; no review approval is claimed.
- Independent verifier required if risk is high/unassessable or native review is unavailable/declined.

## Delivery
- Feature branch: `feat/infolaplata-redesign`; repository has no initial commit.
- Forecast: approximately 800–1200 authored lines, generated/downloaded assets excluded; advisory estimate, never a reason to compress code.
- Strategy: exception-ok for this initial coherent prototype, following the user's explicit direct-main push instruction instead of PR chaining. Keep tests and documentation with the behavior; the size heuristic does not justify artificial splitting or compression. No PR or website deployment requested.
- Native review of an empty-root repository may need provider-supported bootstrap; do not invent a base or receipt.
- Running committed authored lines: 0. Reviewed boundary: none.

## Progress
- Repository cloned and confirmed empty; feature branch created.
- Implemented a buildless editorial homepage with seven local reference images (~747 KB), responsive navigation, local search, category filters, article dialogs, demo newsletter, and motion-aware effects.
- Writer observed deterministic RED (`ERR_MODULE_NOT_FOUND`) before adding the search implementation, then 7/7 GREEN tests.
- Writer and independent verifier passed `npm test`, both JavaScript syntax checks, and `npm run test:browser` at 390/768/1440px; no JavaScript runtime exceptions or tested viewport overflow. Independent verifier confirmed `npm run dev` serves HTTP 200 and cleans up.
- Independent verifier found regional Spanish UI copy. Writer corrected it to neutral Spanish and reran all checks successfully. Parent reran `npm test` (7/7 PASS) and spot-checked corrected strings.
- Parent inspected full desktop/mobile screenshots. Temporary images: `/tmp/infolaplata-1440.png`, `/tmp/infolaplata-768.png`, `/tmp/infolaplata-390.png`.
- Approximately 1,025 authored implementation/test/doc lines, plus this task document. No minification or artificial size reductions.
- Final independent pre-push verification passed all four required commands; a bounded scan of 17 intended files found no credential/private-key/sensitive-filename patterns. This is not a comprehensive security guarantee.
- No dependencies installed, commits created, or remote writes performed. Preview and test browser processes are stopped; run `npm run dev` to view at `http://127.0.0.1:4173`.
- Engram mirror: `odd/infolaplata-redesign/tasks` pending. Host-session-resolution hook blocks writes after clone; project detection now sees both portal_noticias and laplata-noticias. Exact original session identity was retained, never re-registered or replaced.
- Remaining verification limits: no real-device, screen-reader, exhaustive contrast, Lighthouse, or production CMS checks; browser interactions primarily use DOM click. Image reuse rights need confirmation before any publication.

## Next step
Follow native review preflight using the provider-supported empty-repository lifecycle, then commit and push directly to main as explicitly authorized. Never force push or overwrite an unexpected remote history. Website deployment remains unauthorized. Recover the pending Engram mirror only through confirmed runtime project/session binding.
