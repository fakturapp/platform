# Faktur — Developer Platform

The Faktur developer platform (developer portal). A Next.js application that exposes
the public developer experience for Faktur: API explorer, API keys, usage/activity
dashboards, OAuth apps and developer documentation entry points.

> Extracted from the former Faktur monorepo into its own repository. It talks to the
> Faktur backend over HTTP only — there is no shared source code with the other repos.

## Stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS**
- ESLint flat config (`eslint.config.mjs`)

## Prerequisites

- Node.js `>= 24`
- The Faktur **backend** running and reachable (see its repo)

## Getting started

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

The app starts on its configured port (see `package.json` / `.env`).

## Environment

All required variables are listed in `.env.example`. Copy it to `.env` and fill it in.
`.env` is gitignored and must **never** be committed (it holds secrets).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Project structure

```
src/            Application source (App Router pages, components, lib)
public/         Static assets
next.config.ts  Next.js configuration
```

## Deployment

Standard Next.js deployment. Provide the production environment variables from
`.env.example`, run `npm run build`, then `npm run start` (or deploy to your host of
choice). Point it at the production Faktur backend.
