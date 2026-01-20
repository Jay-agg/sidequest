# Learn8

Learn8 is a calm, local-first learning companion that helps you pick a hobby and focus on *just the few techniques that matter most* (usually 5–8). Instead of sending you down endless rabbit holes, it nudges you toward practice, progress, and mastery.


## UI Video Demo

Add a link to a short screen recording of the UI here:

[Watch the UI demo](https://youtu.be/9qrtgTYt3Rc)

## What it does 

- **Creates a focused learning plan** for your hobby and goal (powered by AI).
- **Keeps the plan intentionally small** so you don’t accumulate an overwhelming list.
- **Helps you practice and track mastery**, not just consume content.
- **Stays local-first**: your progress is stored in the browser (IndexedDB), so it feels fast and works well even with spotty connectivity.


## Main features

- **AI-generated “5–8 technique” plan**
  You provide a hobby, a goal, and how many minutes you can practice per day. Learn8 generates a short plan designed to fit that commitment.

- **Explainable selection (no mystery plans)**
  The app aims to show *why* each technique made the cut, so it feels like a plan you can trust and follow.

- **Replace-not-add workflow**
  If something doesn’t fit, you replace or refine items instead of piling on more.

- **Anti-rabbit-hole reader mode**
  Encourages short, intentional learning sessions with gentle nudges to stop when you’ve gotten what you need.

- **Mastery tracking**
  Techniques move through a clear progression (from starting out to mastered) so you always know what to practice next.

- **Optional video enrichment**
  Techniques can be enriched with a couple focused YouTube resources (if a YouTube API key is configured).


## Tech overview 

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS + Radix primitives
- **State**: Zustand
- **AI**: OpenAI SDK with Zod-validated structured outputs
- **Storage**: IndexedDB (via `idb-keyval`)


## Project setup

### Prerequisites

- **Node.js**: 20.19+ or 22.12+
- **npm**: 10+

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a file named `.env.local` in the project root:

```bash
OPENAI_API_KEY=your_openai_key_here
# Optional (enables YouTube video enrichment)
YOUTUBE_API_KEY=your_youtube_key_here
```

Notes:
- The app **requires** `OPENAI_API_KEY` to generate plans.
- If `YOUTUBE_API_KEY` is not set, the app should still work, but video resources may be missing.

### 3) Run the dev server

```bash
npm run dev
```

Then open:

- `http://localhost:3000`


## Common scripts

- **Development**: `npm run dev`
- **Production build**: `npm run build`
- **Start production server**: `npm run start`

## Where the important stuff lives

If you’re new to the codebase, these are good starting points:

- `src/app/` — Routes and pages (Next.js App Router)
- `src/app/api/` — API routes (plan generation lives here)
- `src/lib/llm/` — The multi-stage LLM pipeline
- `src/stores/` — Zustand stores for plans and UI state


