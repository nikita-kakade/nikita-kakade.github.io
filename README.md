# Knowledge Atlas

A static technical platform shell for organizing user-provided content across science, technology, mathematics, and interdisciplinary topics.

## What is included

- Homepage, topic navigation, library, article display template, resources, FAQ, changelog, account dashboard, and HTML/XML sitemap.
- Responsive light/dark interface with system preference detection and manual theme toggle.
- Metadata-driven sample article cards with search, difficulty filtering, estimated read time, prerequisites, related article ranking, bookmarks, and progress tracking.
- Local browser storage for prototype account features.
- Placeholder newsletter, analytics, authentication, and content-rendering integration points.

## Edit the site

- Main structure: `index.html`
- Styling and responsive design: `styles.css`
- Platform interactions and sample metadata: `script.js`
- XML sitemap: `sitemap.xml`

Replace the sample article objects in `script.js` with user-provided metadata, then connect article links to real content pages or a content renderer.

## Deployment

Because this repository is named `nikita-kakade.github.io`, GitHub Pages can serve it as a user site from the repository root once Pages is enabled for the branch.

Production account features, analytics, newsletter signup, and saved progress should be connected to real services before relying on them across devices.
