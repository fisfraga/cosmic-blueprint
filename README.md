# 🌟 Cosmic Copilot

Astrology Knowledge Graph Explorer - An interactive web application for exploring astrological entities and their relationships.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **D3.js** - Data visualization
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Router** - Navigation
- **Anthropic Claude API** - AI integration

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
cosmic-copilot/
├── src/
│   ├── components/     # React components
│   ├── data/          # JSON data files
│   ├── hooks/         # Custom React hooks
│   ├── stores/        # Zustand state stores
│   ├── styles/        # Global styles and themes
│   ├── types/         # TypeScript definitions
│   └── utils/         # Helper functions
├── public/            # Static assets
└── [data files]       # JSON data files (planets.json, signs.json, etc.)
```

## Documentation

- [System Architecture](./cosmic-copilot-system-architecture.md)
- [Data Schema](./cosmic-copilot-data-schema.md)

## Development

This project is designed for Claude Code development. The architecture document provides comprehensive guidance for implementation.

## CI/CD

Every push and pull request to `main` triggers the **CI** workflow (`.github/workflows/ci.yml`):

1. `npm ci` — install dependencies
2. `npm run lint` — ESLint (fails on any lint error)
3. `npm run test:run` — Vitest (fails on any test failure)
4. `npm run build` — TypeScript check + Vite build

Deployment (`.github/workflows/deploy.yml`) runs **only after CI passes** on `main` (uses `workflow_run: [CI]` with `if: conclusion == 'success'`).

To run quality checks locally:
```bash
npm run verify   # test:run + build
npm run lint     # ESLint only
```
