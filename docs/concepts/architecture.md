---
sidebar_position: 1
title: Architecture Overview
---

# Architecture Overview

WatchLens is built around a single architectural idea: the **hybrid
registry pattern**. The recommendation policy and the UI a participant
sees are both registered through the same kind of plug-in interface,
which means new policies and new UIs are first-class additions —
neither requires forking the platform.

## The two registries are parallel

| Concern                | Recommender registry                                            | UI registry                                                       |
|------------------------|-----------------------------------------------------------------|-------------------------------------------------------------------|
| Built-in entries       | `BUILTIN_INSTANCES` — Python class instances (5 baselines)      | `BUILTIN_UIS` — React presets (`youtube-{desktop,tablet,mobile}`, `tiktok-{desktop,tablet,mobile}`, `none`) |
| External / DB-driven   | `recommender_registry` table (`kind='external_http'` rows)      | `ui_templates` table (`status='published'` rows)                  |
| Registration entry     | `POST /admin/recommenders`                                      | Visual / Code editor in the admin UI → **Save + Publish**         |
| Dispatcher             | `get_recommender(key)` returns `BaseRecommender`                | Inline branch in `Feed.tsx` / `VideoWatch.tsx`                    |
| Capability flags       | `supports_feed`, `supports_watch`                               | `supports_feed`, `supports_watch`, `devices`                      |
| Validator              | `is_registered(key)` + `get_capability(key)`                    | `BUILTIN_*_KEYS` set + `_is_valid_template_for_device(key)`       |
| Live propagation       | One worker → cache; siblings refresh on miss via DB lookup      | One admin publish → DB; frontend fetches templates on dropdown    |

The two columns differ only in surface vocabulary. The dispatcher logic
is the same: **try the built-in map first, fall through to a DB lookup,
self-heal the cache on miss, raise (or render a "not configured"
notice) if neither resolves**.

## Why this matters

Both axes are user-extensible **without forking the platform**:

- A new **recommendation policy** is one Python file (subclass
  `BaseRecommender`, register an instance), or zero code at all if the
  service already runs over HTTP elsewhere.
- A new **UI** is one TSX file (drop in `ui-presets/<key>/feed.tsx`),
  or zero code at all if it can be composed in the visual editor.

Researchers reuse the platform — they don't fork it. That keeps studies
running on different policies and UIs comparable, because the data
plane underneath is unchanged.

## What sits underneath both registries

The platform is a four-container Compose stack:

- **`db`** — PostgreSQL 15. Holds users, groups, videos, sessions, the
  events table (wide-table + JSONB payload), `recommender_registry`,
  `ui_templates`, training caches.
- **`backend`** — FastAPI + SQLAlchemy 2.0 + Alembic. Wires the
  recommender registry, the auth surface (HttpOnly cookie + bcrypt),
  the events ingest, and the admin API.
- **`frontend`** — React 18 + TypeScript + Vite + Tailwind. Hosts the
  three UI authoring tracks plus the admin console and serves the
  built bundle through nginx.
- **`data-nginx`** — A second nginx that range-serves video / thumbnail
  files mounted from `data/`.

Both the recommender and the UI track read from the same data plane.
The events table is the **single point of measurement** — every
authoring track lands events through `EventContext` (5 s / 20-event
batching), so 33 events × 6 categories show up identically regardless
of which dispatcher branch produced the rendered page.

## What's intentionally not in scope

- **No native mobile app.** Three device-tagged variants of the bundled
  presets cover desktop / tablet / mobile via responsive HTML; per-group
  device assignment ensures participants don't silently slide into a
  different variant.
- **No A/B traffic split.** Allocation is by group membership at
  account-creation time. Mid-experiment reassignment is not modelled.
- **No real-time online learning loop.** RecBole training runs on a
  scheduler (default 60 min) and writes pre-computed predictions into a
  cache. Request-time policies (HTTP recommenders) can do whatever they
  want internally.

## Where to go next

- [**Configurable Execution**](./configurable-execution) — the
  recommender and UI plug-in axes in more detail.
- [**Standardized Measurement**](./standardized-measurement) — what
  the 33-event schema enforces.
- [**Adding a Recommender**](../guides/adding-a-recommender) — the
  practical walk-through.
