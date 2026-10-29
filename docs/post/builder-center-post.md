I run a small self-hosted home server called **baner**. For this challenge I wanted a portfolio that felt like it belonged to me rather than to a template, so I designed the whole site as a live server dashboard for baner, and added a terminal you can actually "SSH" into.

🔗 **Live site:** https://main.d2srve4h92m9bu.amplifyapp.com/
💻 **Source code:** https://github.com/pabi9625/pabilan-aws-portfolio

![Hero section with my name typed as a terminal command, my photo and a live server status panel](https://raw.githubusercontent.com/pabi9625/pabilan-aws-portfolio/main/docs/post/01-hero.jpg)

## About me

I'm a third-year Computer Science undergraduate at the University of Colombo School of Computing (UCSC) in Sri Lanka, with a prior Diploma in Software Engineering. I build and ship full-stack applications end to end, and my research focus is machine learning, applying data-driven models to practical, real-world problems. I'm looking for internships where I can combine solid software engineering with ML.

## The concept: a server dashboard

Every section is styled as part of the server:

- **Hero:** my name types itself out after `whoami`, next to a status panel showing `status: open to internships`, my location, and an uptime counter that started when I joined UCSC in May 2024.
- **About:** `cat about.txt` in a terminal window.
- **Skills (Tech Superpowers):** a system monitor (`top`), with each skill group as a CPU panel and each skill as a running process. There are no fake percentage ratings; the activity bars are decorative.
- **Projects:** `systemctl` services, each with a status dot (live, in progress, or source on GitHub). Hovering or focusing a card reveals its status readout.
- **Education:** a `git log --graph`, with commit hashes, dates and messages.
- **Certifications:** `apt list --installed`, grouped by provider in collapsible lists, with each certificate linking to its credential.

![Skills shown as a system monitor](https://raw.githubusercontent.com/pabi9625/pabilan-aws-portfolio/main/docs/post/02-skills.jpg)

![Projects shown as deployed services](https://raw.githubusercontent.com/pabi9625/pabilan-aws-portfolio/main/docs/post/03-projects.jpg)

![Education shown as a git log](https://raw.githubusercontent.com/pabi9625/pabilan-aws-portfolio/main/docs/post/04-education.jpg)

## Creative feature: SSH into baner

Press the backtick key (`` ` ``), or click the floating **>_ Open terminal** button, and the site opens an SSH-style session into baner (`pabilan@baner:~$`), complete with a short, skippable login and message of the day.

![The terminal running help and ls](https://raw.githubusercontent.com/pabi9625/pabilan-aws-portfolio/main/docs/post/05-terminal-help.jpg)

What you can do in it:

- `whoami`, `about`, `skills`, `projects`, `education`, `certs`, `contact` print my information in terminal style.
- `ls` lists the page's sections as directories, and `cd projects` closes the terminal and scrolls the page to that section, so the terminal doubles as a way to navigate the site.
- `open stridetrack` opens a live project or repo in a new tab, and `cv` opens my CV.
- It behaves like a real shell: ↑/↓ command history, Tab autocomplete for commands, sections, project and file names, and a friendly "command not found" message.

There are a few easter eggs too:

- `sudo` politely denies you root access.
- `neofetch` shows a system-info card about me, with my photo as the logo.
- `play asteroids` launches a small Asteroids game inside the terminal, a nod to the Boot.dev course where I built Asteroids in Python and Pygame.

![neofetch card in the terminal](https://raw.githubusercontent.com/pabi9625/pabilan-aws-portfolio/main/docs/post/06-terminal-neofetch.jpg)

![Asteroids mini-game inside the terminal](https://raw.githubusercontent.com/pabi9625/pabilan-aws-portfolio/main/docs/post/07-terminal-asteroids.jpg)

I wanted the feature to be fun without ever getting in the way:

- **Optional:** everything the terminal shows is also on the normal page. It's an overlay that closes with Esc, the × button or a click outside, and focus returns to where you were.
- **Mobile:** it opens full-screen with tappable command chips under the input, and the game gets on-screen touch controls.
- **Accessible:** focus stays inside the dialog while it's open, and with reduced motion turned on the boot animation is skipped.

![The terminal on mobile with tappable command chips](https://raw.githubusercontent.com/pabi9625/pabilan-aws-portfolio/main/docs/post/08-mobile-terminal.jpg)

## How I built and deployed it on AWS

The site is a static single-page app built with **React, TypeScript and Vite**, styled with plain CSS and no UI libraries. It's hosted on **AWS Amplify Hosting**:

- **CI/CD from GitHub:** Amplify is connected to the `main` branch of my public repo, so every push triggers a new build and deploy. Each one takes about two minutes.
- **Build configuration in code:** an `amplify.yml` file in the repo defines the build:
  - `preBuild` installs Node 22 and runs `npm ci`;
  - `build` runs `npm run build`;
  - `artifacts` publishes the `dist/` folder.
- **Global delivery over HTTPS:** the site's response headers show it served from Amazon S3 through the Amazon CloudFront CDN, on an HTTPS `amplifyapp.com` domain with no certificate setup needed.
- **Safe deploys:** a failed build never replaces the live site, and earlier builds can be redeployed from the console.

I also use AWS beyond this portfolio: one of the featured projects, **StrideTrack**, a walking and weight-loss tracker, runs on AWS Amplify with **Amazon Cognito** for sign-in and **AWS AppSync** for data synced across devices.

## Challenges and how I solved them

1. **Build environment version.** Vite 8 needs Node.js 20.19 or newer, so I pinned Node 22 in `amplify.yml` instead of relying on the build image's default.
2. **Layout overflow on phones.** At 375px wide the page scrolled sideways because a long line (my university's name) was set not to wrap. Checking the site at 375, 768 and 1440px found it, and letting the text wrap fixed it.
3. **Keyboard conflicts in the terminal.** Several keys needed two jobs:
   - **Esc** both quits the game and closes the terminal, so the game handles it first.
   - **Tab** both autocompletes and moves focus, so it only autocompletes after you've typed something.
   - The backtick shortcut is ignored while you're typing in a text field.
4. **Accessibility beyond the score.** Lighthouse gave Accessibility 100, but it only checks what's visible on first load. A closer check of the whole page found:
   - text below WCAG AA contrast;
   - text smaller than 12px;
   - project links only 18px tall;
   - sections that stayed blank in full-page screenshots until scrolled into view.

   I fixed all of them.

## What I learned

- **Configuring Amplify with `amplify.yml`.** This was my second time hosting a site on AWS Amplify, and this time I learned much more about its build configuration. Keeping the build steps in `amplify.yml` means they're versioned with the code, and every push builds the same way.
- **A memorable feature must never block the basics.** The terminal is the fun part, but visitors who never open it can still find everything.
- **Automated scores aren't the whole story.** Testing real interactions, real screen widths and every link found issues a perfect score missed.
- **Accessibility belongs in the design from the start.** Reduced-motion support, keyboard focus and contrast were much easier to get right as part of the theme than to add afterwards.

## How it was built

I built this with Claude Code as an AI pair programmer. The concept, content and decisions are mine. Claude helped write and test the code and draft this write-up.

Thanks for reading! Open the terminal on the live site and try `neofetch` or `play asteroids`. 🚀
