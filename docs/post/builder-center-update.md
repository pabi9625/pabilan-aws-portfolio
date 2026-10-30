# Builder Center update post

Copy each part below into the matching field. The three arcade images (10, 11, 12) load from GitHub; if Builder Center doesn't show them, upload `docs/post/10-arcade.jpg`, `11-arcade-games.jpg` and `12-mobile-arcade.jpg` and swap in the new image links.

## Title

baner: my portfolio as a self-hosted server dashboard, now with a retro arcade

## Description

My AWS Amplify portfolio is designed as a live dashboard for my home server, baner, with a terminal you can SSH into. This update adds an arcade with six retro mini-games, playable on desktop and mobile.

## Body

I run a small self-hosted home server called **baner**. For this challenge I wanted a portfolio that felt like it belonged to me rather than to a template, so I designed the whole site as a live server dashboard for baner, and added a terminal you can actually "SSH" into.

**Update:** baner now has an arcade. I've added a `~/arcade` section with six retro mini-games you can play right on the page, on a laptop or a phone. Details are in the new section below.

🔗 **Live site:** [https://main.d2srve4h92m9bu.amplifyapp.com/](https://main.d2srve4h92m9bu.amplifyapp.com/)&#x20;

💻 **Source code:** [https://github.com/pabi9625/pabilan-aws-portfolio](https://github.com/pabi9625/pabilan-aws-portfolio)

<Image url="https://prod-assets.cosmic.aws.dev/a/3LNPISRlu9gdj4PyjI50xMoVWWF/00-cover-jpg.webp?imgSize=1600x900" title="00" />

## About me

I'm a third-year Computer Science undergraduate at the University of Colombo School of Computing (UCSC) in Sri Lanka, with a prior Diploma in Software Engineering. I build and ship full-stack applications end to end, and my research focus is machine learning, applying data-driven models to practical, real-world problems. I'm looking for internships where I can combine solid software engineering with ML.

## The concept: a server dashboard

Every section is styled as part of the server:

* **Hero:** my name types itself out after `whoami`, next to a status panel showing `status: open to internships`, my location, and an uptime counter that started when I joined UCSC in May 2024.
* **About:** `cat about.txt` in a terminal window.
* **Skills (Tech Superpowers):** a system monitor (`top`), with each skill group as a CPU panel and each skill as a running process. There are no fake percentage ratings; the activity bars are decorative.
* **Projects:** `systemctl` services, each with a status dot (live, in progress, or source on GitHub). Hovering or focusing a card reveals its status readout.
* **Education:** a `git log --graph`, with commit hashes, dates and messages.
* **Certifications:** `apt list --installed`, grouped by provider in collapsible lists, with each certificate linking to its credential.
* **Arcade (new):** `ls ~/arcade/roms`, six game cartridges that load into an arcade cabinet.

<Image url="https://prod-assets.cosmic.aws.dev/a/3LNPQKAgh6FSvTHuyWIfL2qQtG6/02-skills-jpg.webp?imgSize=1440x900" title="02" />

<Image url="https://prod-assets.cosmic.aws.dev/a/3LNPYpVjO9zXfTmFtkzUdCAzkFP/03-projects-jpg.webp?imgSize=1440x900" title="03" />

<Image url="https://prod-assets.cosmic.aws.dev/a/3LNPdYyqDcMUmBR3kxGCkYPDH6p/04-education-jpg.webp?imgSize=1440x900" title="04" />

## Creative feature: SSH into baner

Press the backtick key (`` ` ``), or click the floating **>\_ Open terminal** button, and the site opens an SSH-style session into baner (`pabilan@baner:~$`), complete with a short, skippable login and message of the day.

<Image url="https://prod-assets.cosmic.aws.dev/a/3LNPmTRDZOqCcnNCnwR957nAYgg/05-terminal-help-jpg.webp?imgSize=1440x900" title="05" />

What you can do in it:

* `whoami`, `about`, `skills`, `projects`, `education`, `certs`, `contact` print my information in terminal style.
* `ls` lists the page's sections as directories, and `cd projects` closes the terminal and scrolls the page to that section, so the terminal doubles as a way to navigate the site.
* `open stridetrack` opens a live project or repo in a new tab, and `cv` opens my CV.
* `play snake` (or `blocks`, `dino`, `astro`, `breakout`, `pong`) jumps to the new arcade and starts that game.
* It behaves like a real shell: ↑/↓ command history, Tab autocomplete for commands, sections, project and file names, and a friendly "command not found" message.

There are a few easter eggs too:

* `sudo` politely denies you root access.
* `neofetch` shows a system-info card about me, with my photo as the logo.
* `play asteroids` launches a small Asteroids game inside the terminal, a nod to the Boot.dev course where I built Asteroids in Python and Pygame.

<Image url="https://prod-assets.cosmic.aws.dev/a/3LNQAl3CVjiQRZub3s1aHxLSw9a/06-t.webp?imgSize=1894x864" title="06" />

<Image url="https://prod-assets.cosmic.aws.dev/a/3LNQGicht8gg5ugS9QuKKMcrZdO/07-terminal-asteroids-jpg.webp?imgSize=1440x900" title="07" />

I wanted the feature to be fun without ever getting in the way:

* **Optional:** everything the terminal shows is also on the normal page. It's an overlay that closes with Esc, the × button or a click outside, and focus returns to where you were.
* **Mobile:** it opens full-screen with tappable command chips under the input, and the game gets on-screen touch controls.
* **Accessible:** focus stays inside the dialog while it's open, and with reduced motion turned on the boot animation is skipped.

<Image url="https://prod-assets.cosmic.aws.dev/a/3LNQkDgZil4fnNuGvgUDIsU0MLO/09-mobile-hero-jpg.webp?imgSize=585x1266" title="09" />

## New: the baner arcade

The Asteroids easter egg was my favourite part of the terminal, so I gave games a home of their own. The new **Arcade** section has six retro mini-games, each written from scratch on an HTML `<canvas>` with no game libraries:

* **Astro Shooter:** a vertical space shooter. Drones, weaving ships and gunships that fire back come in waves, and blue crosses give you a spread shot for ten seconds.
* **Snake:** eat to grow, and the snake speeds up with every bite.
* **Block Drop:** falling blocks with rotation, a landing preview, hard drop, line clears and levels that speed up every ten lines.
* **Dino Dash:** an endless desert runner. Jump the cacti, duck the birds, and hold jump to go higher.
* **Brick Breaker:** where the ball hits your paddle sets its angle, and each cleared wall starts a faster level.
* **Paddle Duel:** table tennis against the CPU, first to seven. The CPU gets quicker as you score.

Pick a cartridge and it loads into the cabinet at the top, with a live score bar and a saved high score for each game.

<Image url="https://raw.githubusercontent.com/pabi9625/pabilan-aws-portfolio/main/docs/post/10-arcade.jpg?imgSize=1120x1019" title="10" />

<Image url="https://raw.githubusercontent.com/pabi9625/pabilan-aws-portfolio/main/docs/post/11-arcade-games.jpg?imgSize=2160x978" title="11" />

The games fit the rest of the site:

* **They don't take over the page.** Keyboard controls only apply while the game screen is focused, so arrow keys and Space still scroll the page normally. Clicking away pauses the game, `P` pauses and `R` restarts.
* **They work on phones.** Each game gets on-screen buttons, with the arrows laid out like a keyboard's arrow keys and a big action button beside them. Some games get gestures too: swipe to steer in Snake, swipe and tap in Block Drop, and tap or hold the screen to jump in Dino Dash.
* **They're connected to the terminal.** Typing `play snake` closes the terminal, scrolls to the arcade and starts the game.
* **They share one small engine.** A fixed-resolution game loop, an input model and a few drawing helpers are shared, so each game is a single file that only handles its own rules and drawing.

<Image url="https://raw.githubusercontent.com/pabi9625/pabilan-aws-portfolio/main/docs/post/12-mobile-arcade.jpg?imgSize=585x996" title="12" />

## How I built and deployed it on AWS

The site is a static single-page app built with **React, TypeScript and Vite**, styled with plain CSS and no UI libraries. It's hosted on **AWS Amplify Hosting**:

* **CI/CD from GitHub:** Amplify is connected to the `main` branch of my public repo, so every push triggers a new build and deploy. Each one takes about two minutes. The arcade went live the same way: merge to `main`, and Amplify built and deployed it.
* **Build configuration in code:** an `amplify.yml` file in the repo defines the build:
  * `preBuild` installs Node 22 and runs `npm ci`;
  * `build` runs `npm run build`;
  * `artifacts` publishes the `dist/` folder.
* **Global delivery over HTTPS:** the site's response headers show it served from Amazon S3 through the Amazon CloudFront CDN, on an HTTPS `amplifyapp.com` domain with no certificate setup needed.
* **Safe deploys:** a failed build never replaces the live site, and earlier builds can be redeployed from the console.

I also use AWS beyond this portfolio: one of the featured projects, **StrideTrack**, a walking and weight-loss tracker, runs on AWS Amplify with **Amazon Cognito** for sign-in and **AWS AppSync** for data synced across devices.

## Challenges and how I solved them

1. **Build environment version.** Vite 8 needs Node.js 20.19 or newer, so I pinned Node 22 in `amplify.yml` instead of relying on the build image's default.
2. **Layout overflow on phones.** At 375px wide the page scrolled sideways because a long line (my university's name) was set not to wrap. Checking the site at 375, 768 and 1440px found it, and letting the text wrap fixed it.
3. **Keyboard conflicts in the terminal.** Several keys needed two jobs:
   * **Esc** both quits the game and closes the terminal, so the game handles it first.
   * **Tab** both autocompletes and moves focus, so it only autocompletes after you've typed something.
   * The backtick shortcut is ignored while you're typing in a text field.
4. **Games and a scrolling page.** Arrow keys and Space both play the games and scroll the page. Listening for keys on the game screen only, instead of the whole window, fixed it: the page scrolls normally until you click into a game, and clicking away pauses it.
5. **Fitting a game on a small phone.** On an iPhone SE, the tall games pushed the score bar under the site's fixed menu. I now size the game screen from the phone's visible height, so the score, the game and the buttons always fit on screen together. Testing all six games on emulated Pixel 5 and iPhone SE screens, including holding two buttons at once, caught it before release.

## What I learned

* **Configuring Amplify with** `amplify.yml`**.** This was my second time hosting a site on AWS Amplify, and this time I learned much more about its build configuration. Keeping the build steps in `amplify.yml` means they're versioned with the code, and every push builds the same way.
* **A memorable feature must never block the basics.** The terminal and the arcade are the fun parts, but visitors who never use them can still find everything.
* **Small games are a great way to practise the fundamentals.** A game loop, frame timing, collision checks and input handling each fit in a few hundred lines, which made them a fun way to practise core programming skills.
* **Accessibility belongs in the design from the start.** Reduced-motion support, keyboard focus and contrast were much easier to get right as part of the theme than to add afterwards.

## How it was built

I built this with Claude Code as an AI pair programmer. The concept, content and decisions are mine. Claude helped write and test the code and draft this write-up.

Thanks for reading! Visit the arcade on the live site and set a high score, or open the terminal and type `play dino`. 🚀
