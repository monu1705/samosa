# ResumeSensei — AI-style Resume Checker Prototype

ResumeSensei is a classroom-friendly static website that demonstrates an “AI” resume helper entirely in the browser. It ingests plain-text resumes, runs deterministic heuristics, surfaces improvement opportunities, and offers suggested rewrites students can auto-apply or download.

## Quick start

1. Open `index.html` in a modern desktop browser (Chrome, Edge, Firefox, Safari).
2. Navigate to the Demo page and paste resume text or upload a `.txt/.md` file.
3. Select a target role, click **Analyze**, explore grouped issues, and apply suggested rewrites.
4. Download or copy the fixed resume for further editing.

> ℹ️ PDF uploads are intentionally mocked in this prototype. For live PDF parsing you would integrate a client-side library such as `pdf.js` or move processing to a server.

## File structure

- `index.html` — Landing page with hero, feature overview, and classroom demo flow.
- `demo.html` — Interactive analyzer with score ring, grouped issues, and export tools.
- `templates.html` — Downloadable starter templates along with bullet examples and keyword tips.
- `how-it-works.html` — Transparent breakdown of the heuristic checks.
- `about.html` — Project overview and team credits placeholder.
- `styles/style.css` — Shared styling, layout, and animations (CSS only, no build step).
- `scripts/app.js` — Navigation helpers, hero typewriter effect, resume analysis heuristics, and export logic.
- `assets/` — SVG icon sprites, sample resume, and downloadable templates.

## Heuristic checks

The analyzer simulates AI behaviour using explainable, deterministic rules:

- **Contact** — Regex detection for email, phone, and LinkedIn/GitHub links plus a name-format check.
- **Structure** — Word count → estimated length, heading presence, and section coverage.
- **Impact & metrics** — Bullet lines must start with action verbs, avoid weak openers, and include numbers.
- **Language & clarity** — Flags repeated spaces, common misspellings, and fragment-length lines.
- **Keywords** — Compares resume text against curated keyword lists for each target role.
- **Formatting** — Detects mixed date formats and all-caps headings.

Each issue includes a short explanation, optional inline suggestion toggle, and (when possible) an auto-apply rewrite. The **Auto-apply** button rewrites all applicable bullet suggestions into the fixed preview, ready for download.

## Accessibility & presentation notes

- All results updates use `aria-live` regions for assistive technologies.
- Buttons and links include keyboard focus outlines and hover micro-interactions.
- Animations stay subtle (fade, float, small confetti) to remain classroom-friendly.

## Customization ideas

- Adjust keyword lists or add new roles in `ROLE_KEYWORDS` within `scripts/app.js`.
- Expand the heuristics with additional regular expressions, dictionary checks, or date rules.
- Swap in new templates or sample resumes under the `assets/` folder.
- Integrate a real AI service by replacing `analyzeResume` with API calls (clearly label the change for honesty).

## License

This prototype is free to adapt for educational demos. If you share it publicly, please credit the ResumeSensei project and explain its heuristic nature.

