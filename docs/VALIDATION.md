# Release validation

## Current local baseline - 26 October 2026

The site uses server-backed Next.js, MongoDB articles and public Blob images. This baseline supersedes earlier static-export and loader-era checks. The owner-removed loader, art gallery and games must remain absent.

### Release and content checks

`npm run check` passed: deployment guards, 4,000 generated-palette cases, article/studio validation, backup-format checks, route type generation, TypeScript, Prettier, the default Turbopack production build, and the HTTP audit. The audit covered 27 public routes and 47 unique internal references, including structured data, metadata, RSS, legacy image redirects and the local noindex configuration. A further production build passed after tightening the notebook header spacing.

### Maintained browser checks

All seven Playwright checks passed against the local production server in Chrome:

- One article per row at 320px, 390px and 1280px, no horizontal page overflow, readable cards and reloads without a loader; no browser page errors in these checks.
- Keyboard topic selection, search, empty results, clear filters and archive pagination.
- Failed search retains archive cards and succeeds after retry.
- Reduced motion, mobile navigation, palette Escape/focus restoration and persistence through reload.
- Archive and article reading with JavaScript disabled.

Desktop and mobile article screenshots were visually inspected. Screenshots and traces stay outside the repository. Run `npm run check:browser` after a production build; the helper starts and stops an isolated local server on a free port. Use the same BLOG_SOURCE for building and checking. CI uses the file snapshot, installs Chromium and runs the maintained checks; a local pass does not prove the remote GitHub workflow has run.

### Studio and recovery drill

`npm run check:studio:integration` passed with uniquely named temporary databases using the existing configured database user. It verified unauthenticated rejection, origin protection, 20-record sidebar pagination, summary-only list responses, direct article retrieval, publication/search membership, optimistic conflict rejection, saved-version retrieval without accidental saving, Trash exclusion, restoration as draft and logout.

The same drill exported the temporary content, validated a dry-run restore, restored into a separate empty database, verified saved history, and refused both an occupied target and the active test database. Temporary databases and export files were removed. Production articles were not modified. CI uses an isolated MongoDB service for this test, without production secrets.

The Blob upload UI was not changed in this pass. Earlier real-upload checks verified image compression, dimensions, owner authorization and publication; this pass verified the production build still integrates the SDK.

### Dependencies

The dependency audit reported zero known vulnerabilities after a scoped override updated the Zod dependency used by `@vercel/cli-config` to 4.6.6. The Blob SDK was not downgraded. Keep the override until the upstream dependency includes the fix, and review it during upgrades. An audit is not proof that no security issues exist.

## What remains external

- The owner must push and deploy the code. No production deployment was performed in this pass.
- Atlas scheduled backups and retention require account configuration; the export tool and in-database history do not provide that service. Blob bytes are not in article exports.
- CI execution, Vercel headers/network access, real upload availability, production Core Web Vitals and search-engine indexing need verification on the deployed revision.
- No Lighthouse score, traffic increase, ranking or indexing guarantee is claimed. Follow DEPLOYMENT.md and SEO.md after deployment.

## Commands

```sh
npm run check
npx playwright install chromium
npm run check:browser
npm run check:studio:integration
```

The integration check needs permission to create disposable MongoDB databases. It must never be adapted to seed or delete the active portfolio database. Review the backup workflow in BLOG_DATABASE.md and studio recovery controls in STUDIO.md before substantial article edits.
