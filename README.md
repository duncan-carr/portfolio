# Duncan Carr — Portfolio

A light, responsive portfolio built with Next.js App Router, TypeScript, and Tailwind CSS. Manrope is bundled locally. The layout uses charcoal typography on white, generous whitespace, and plain text rows without cards, badges, or decorative panels.

## Develop

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:3000. The imported profile is already included, so the original export is not needed to run or deploy the app.

## Refresh LinkedIn data

```sh
npm run import:linkedin
# Or choose another extracted export folder:
npm run import:linkedin -- "/absolute/path/to/export"
```

The default checks `~/Downloads/LinkedIn_Data_Export_11_1_2026`, then the extracted directory with the `.zip` suffix found on this machine. Alternatively set the `LINKEDIN_EXPORT_DIR` environment variable. Actual ZIP archives must be extracted first.

The importer writes `src/data/linkedin.json`. It reads an explicit allowlist of professional CSVs, handles quoted/multiline fields, and sorts dated experience newest first. `Profile.csv` is required; other files are optional. Invalid imports fail without replacing the previous snapshot.

The initial import includes seven positions, two education entries, one certification, eleven skills, one organization, and two actuarial exams. Projects, honors, languages, and volunteering sections appear when corresponding files contain records. Dormly is included under experience because that is how it is recorded in this export.

Only normalized portfolio fields are retained. Birth dates, street addresses, postcodes, phone numbers, private email addresses, connections, messages, account data, and exam scores are excluded. The generated JSON is public website content. Do not put a raw export in `public/`.

## Customize

- `src/lib/portfolio.ts`: introductory copy and optional email, LinkedIn, and GitHub links. Empty links are hidden. The export has no summary, so editable introductory copy based on your experience is provided.
- `src/data/linkedin.json`: generated profile snapshot; replaced on re-import.
- `src/app/page.tsx`: sections and content presentation.
- `src/app/globals.css`: spacing, colors, responsive layout, and typography.
- `src/app/layout.tsx`: metadata and bundled font.

Education dates are displayed as exported; a future end date is not presented as completed graduation. Exams appear by name/date without publishing scores or inferring completion of a credential. Contact addresses and social handles are not guessed.

## Choosing featured experience

The main Experience list shows the first three positions in date order whose `hideFromMain` setting is omitted or `false`. Set `"hideFromMain": true` on any position in `src/data/linkedin.json` to move it into the collapsed **Other Experiences** section. That section also includes positions beyond the first three visible entries, preserving their date order.

```json
{
  "company": "Example company",
  "title": "Past role",
  "description": "What you did in this role.",
  "location": "Remote",
  "startDate": "Jan 2024",
  "endDate": "Dec 2024",
  "hideFromMain": true
}
```

For CSV imports, add a `Hide From Main` column to `Positions.csv`. Values `true`, `yes`, and `1` move that row into Other Experiences. Leave it blank to allow the role into the main list. A re-import replaces manual JSON settings, so keep the flag in your CSV when using the importer. The date-based current role and introduction use the full position history.

## Future positions

Add positions to your export's `Positions.csv` and run the importer, or edit the `positions` array in `src/data/linkedin.json` directly. A re-import replaces that JSON snapshot. For example, these fields describe your upcoming role.

```json
{
  "company": "AAIS (American Association of Insurance Services)",
  "title": "Actuarial Analyst",
  "description": "",
  "location": "Remote",
  "startDate": "Jan 2027",
  "endDate": ""
}
```

Dates accept `Jan 2027`, `January 2027`, `2027-01`, `2027-01-15`, or a year such as `2027`. Existing `Starting: Jan 2027` dates also work. A month-only start takes effect on its first day, and a month-only end includes its last day. A year-only date covers that calendar year. Use an ISO day when you need a precise transition.

Future positions appear as **Upcoming** with their start date. An active position displays **Present**, including when its recorded end date is still ahead. After that end date it displays the recorded end. The most recently started active position supplies **Currently** and the main introduction. With your current data, the internship remains current through December 31, 2026, and the analyst role becomes current on January 1, 2027. If there is a gap between positions, the sidebar shows latest experience until the next role begins.

The date is evaluated on each homepage request in `America/Chicago`, so transitions take effect on the next visit or refresh without a rebuild. An already-open tab updates when refreshed. This requires the Next.js server deployment used by `npm start`. `site.introduction` in `src/lib/portfolio.ts` is empty to derive the main introduction automatically. Set it to nonempty text to use fixed editorial copy instead.

## Projects and Markdown pages

For a project with a full page, create `content/projects/my-project.md`. The filename determines the URL `/projects/my-project`. Use lowercase words separated by hyphens. The file contains YAML front matter between `---` lines followed by the page's Markdown body.

```markdown
---
name: "My project"
description: "A short summary for the homepage and page introduction."
startDate: "Jan 2027"
endDate: ""
url: "https://github.com/your-account/your-project"
---

## Overview

Describe the problem, your role, and what you built.

## Implementation

Use paragraphs, **emphasis**, lists, links, tables, and fenced code blocks.

## Results

Explain the outcome and lessons learned.

![Screenshot of the project](/projects/my-project/screenshot.png)
```

`name` and `description` are required nonempty strings. `startDate`, `endDate`, and `url` are optional strings. Quote date values. The body must contain Markdown content. The page already displays the project name as its main heading, so begin body sections with `##`. Put images under `public/projects/my-project/` and reference them with URLs starting with `/projects/my-project/`. Markdown supports headings, lists, quotes, images, code, links, and GitHub-style tables. Raw HTML and executable MDX are excluded.

Each Markdown project automatically appears in the homepage Projects section with a link to its full page. The optional HTTP/HTTPS `url` adds an external project link. Markdown files persist across LinkedIn imports. If a Markdown project has the same name as an imported project, its entry takes precedence on the homepage. Files appear alphabetically by filename, followed by other imported projects. Rebuild and redeploy after adding or editing files. During development, restart `npm run dev` after changing Markdown files to clear the content cache.

For projects that only need a homepage entry and external link, the existing `projects` array in `src/data/linkedin.json` uses this structure.

```json
{
  "name": "My project",
  "description": "A short description, optionally with bullet lines.",
  "url": "https://example.com/my-project",
  "startDate": "Jan 2027",
  "endDate": ""
}
```

The importer maps `Projects.csv` columns `Title` (or `Name`), `Description`, `Url` (or `URL`), `Started On` (or `Start Date`), and `Finished On` (or `End Date`) to these fields. Only the title is required in the CSV, and omitted fields become empty strings.

## Validate and deploy

```sh
npm test
npm run lint
npm run typecheck
npm run build
npm start
```

Deploy as a standard Next.js project (for example, on Vercel), using `npm run build`. Builds use the included JSON snapshot and never read your Downloads directory. Re-import, rebuild, and redeploy to publish profile changes.

## Dependency status

The production dependency audit is clean. The generated Next.js starter's ESLint dependency tree currently reports moderate `minimatch` development dependency advisories. These are confined to development tooling; npm's suggested forced fixes downgrade core lint packages across major versions, so those incompatible changes have not been applied.
