# pabilan-aws-portfolio

Personal portfolio of **Kumarathass Pabilan**, a Computer Science undergraduate at the University of Colombo School of Computing (UCSC) focused on Machine Learning and Full-Stack Development. Built for the AWS Builder Center student portfolio challenge.

The concept: **the whole site is a live server dashboard for `baner`**, my self-hosted home server. Sections are styled as file paths and shell commands, skills appear as a system monitor, projects as deployed services, education as a `git log`, and certifications as installed packages. Press <kbd>`</kbd> (or click the floating `>_` button) to open an interactive SSH-style terminal with commands, history, Tab autocomplete, and a small Asteroids game.

**Live URL:** https://main.d2srve4h92m9bu.amplifyapp.com/

## Tech stack

- React 19 + TypeScript
- Vite (static build, no backend)
- Plain CSS (no UI libraries)
- Hosted on AWS Amplify Hosting

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build
```

## Project structure

```
index.html                # meta + Open Graph tags
amplify.yml               # Amplify build spec (npm ci → npm run build → dist)
public/                   # profile.webp / profile.png, og-image.jpg, favicon
src/
  data.ts                 # ALL site content lives here
  App.tsx, main.tsx, styles.css
  components/             # Nav, Hero (+status panel), About, Skills, Projects,
                          # Education, Certifications, Contact, Footer, CursorGlow
  hooks/                  # reduced-motion, scroll reveal, uptime, active section
  terminal/               # Terminal overlay, commands, Asteroids mini-game
```

To update content, edit `src/data.ts`. If the site moves to a new domain, update `canonical`, `og:url` and `og:image` in `index.html`.

## Accessibility & performance

- Keyboard accessible: skip link, visible focus styles, native `<details>` for certificates, terminal dialog with focus trap, Esc to close, focus returned on close
- Everything respects `prefers-reduced-motion`: typing, reveals, tilt, glow, and boot animation are disabled, and content is never hidden behind an animation
- Responsive down to 375px; on mobile the terminal goes full-screen with tappable command chips and touch controls for the game
- WebP profile image with PNG fallback and explicit dimensions to avoid layout shift

## AWS services used

- **AWS Amplify Hosting**: builds the site from this GitHub repo on every push (see `amplify.yml`) and serves the static `dist/` output over the global CDN with HTTPS
- The projects featured on the site (e.g. StrideTrack) use **AWS Amplify**, **Amazon Cognito**, and **AWS AppSync**

## Deploy to AWS Amplify

1. Push this repo to GitHub as `pabilan-aws-portfolio` (public).
2. AWS Console → **AWS Amplify** → **Create new app** → **GitHub** → authorise and pick the repo and branch.
3. Amplify detects `amplify.yml` automatically (build: `npm ci`, `npm run build`; output: `dist`). Save and deploy.
4. Amplify gives the app a `*.amplifyapp.com` URL; it is used in this README and in `index.html` (`canonical`, `og:url`, `og:image`). Optionally add a custom domain under **Hosting → Custom domains**.

---

© 2026 Kumarathass Pabilan · Hosted on AWS Amplify
