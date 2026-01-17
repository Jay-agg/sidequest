# Learn8

Learn8 helps users learn a hobby by mastering only the most impactful 5-8 techniques, intentionally avoiding information overload.

## Core Principles

- **Replace, don't add** - users cannot grow the plan arbitrarily
- **Mastery over consumption** - focus on doing, not just watching
- **AI must be explainable** - see why each technique was chosen
- **Calm, friendly UI** - non-overwhelming experience

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: Radix UI primitives, custom components
- **Animations**: Framer Motion
- **State**: Zustand
- **Mobile**: Vaul (bottom sheets)
- **AI**: OpenAI SDK with structured outputs (Zod)
- **Storage**: IndexedDB (idb-keyval) for local-first architecture

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm 10+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```
OPENAI_API_KEY=your-api-key-here
```

## Architecture

### Core Domains

```
src/
  types/          - Zod schemas and TypeScript types
  stores/         - Zustand stores (learningPlan, sync, ui)
  lib/
    llm/          - LLM pipeline (architect, filter, researcher)
    sync/         - Local-first sync engine
    utils.ts      - Utility functions
  components/
    ui/           - Base UI components
    layout/       - Header, navigation
    technique/    - Technique cards, mastery path
    modals/       - Replace, reasoning, decomposition
    commitment/   - Daily time commitment dial
    onboarding/   - Plan creation flow
    reader/       - Anti-rabbit-hole focused reader
  hooks/          - Custom React hooks
  app/            - Next.js App Router pages
```

### LLM Pipeline

The LLM usage follows a multi-stage pipeline:

1. **Architect Stage** - Generate ~20 possible techniques for a hobby
2. **Filter Stage** - Select the best 5-8 techniques based on time/goal constraints
3. **Researcher Stage** - Attach 1-2 focused resources per technique

All outputs are validated with Zod schemas.

### State Management

Uses Zustand with small, focused stores:

- `learningPlanStore` - Current learning plan and techniques
- `syncStore` - Offline action queue
- `uiStore` - UI state (modals, reader, preferences)

### Local-First Architecture

- All user actions are optimistic (UI updates immediately)
- Actions are queued for sync when offline
- Uses IndexedDB via idb-keyval for persistence

## Performance Decisions

- Dynamic imports for heavy components (LLM UI, SVG visualizations)
- Lazy-loading of Framer Motion animations
- Minimal bundle size with tree-shaking
- CSS-first animations where possible

## Testing

### Unit Tests

```bash
npm test
```

### E2E Tests

```bash
npm run test:e2e
```

Tests include:
- Mobile bottom-sheet replace flow
- Learning plan state machine

## Features

### Interactive Mastery Path

SVG-based visualization of learning progress with:
- Desktop: zig-zag/constellation layout
- Mobile: vertical stepper

### Atomic Mastery Tracking

Four states per technique:
- Unstarted
- Learning
- Practicing
- Mastered

### Replace-Not-Add Flow

Users can only replace or decompose techniques, never add more:
- Desktop: Modal/side panel
- Mobile: Bottom sheet

### Anti-Rabbit-Hole Mode

Focused reader view with:
- Session time tracking
- "I've learned enough" CTA
- Gentle warnings for long sessions

### Commitment Dial

Adjustable 10-60 min/day slider that adapts technique depth:
- Basic (10-20 min)
- Intermediate (20-40 min)
- Deep (40-60 min)

## Design System

### Colors

Soft pastel palette:
- Lavender: #E6E0F8
- Peach: #FFE5D9
- Mint: #D4F5E9
- Sky: #D6EEFF
- Warm Yellow: #FFF4CC
- Accent: #8B7FD4

### Typography

- Display: Nunito (headings)
- Body: DM Sans

### Components

Rounded corners (12-20px), soft shadows, subtle gradients.

## License

MIT
