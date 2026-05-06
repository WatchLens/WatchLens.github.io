---
sidebar_position: 1
title: Architecture Overview
---

# Architecture Overview

WatchLens is built around a single architectural idea, which is the
**hybrid registry pattern**. The recommendation policy and the UI a
participant sees are both registered through the same kind of plug-in
interface. New policies and new UIs are first-class additions, and
neither requires forking the platform.

## The two registries are parallel

| Concern                | Recommender registry                                            | UI registry                                                       |
|------------------------|-----------------------------------------------------------------|-------------------------------------------------------------------|
| Built-in entries       | `BUILTIN_INSTANCES`, Python class instances (5 baselines)       | `BUILTIN_UIS`, React presets (`youtube-{desktop,tablet,mobile}`, `tiktok-{desktop,tablet,mobile}`, `none`) |
| External / DB-driven   | `recommender_registry` table (`kind='external_http'` rows)      | `ui_templates` table (`status='published'` rows)                  |
| Registration entry     | `POST /admin/recommenders`                                      | Visual or Code editor in the admin UI, then **Save + Publish**    |
| Dispatcher             | `get_recommender(key)` returns `BaseRecommender`                | Inline branch in `Feed.tsx` and `VideoWatch.tsx`                  |
| Capability flags       | `supports_feed`, `supports_watch`                               | `supports_feed`, `supports_watch`, `devices`                      |
| Validator              | `is_registered(key)` and `get_capability(key)`                  | `BUILTIN_*_KEYS` set and `_is_valid_template_for_device(key)`     |
| Live propagation       | One worker writes the cache, and siblings refresh on miss via DB lookup | One admin publish writes the DB, and the frontend fetches templates on dropdown |

The two columns differ only in surface vocabulary. The dispatcher
logic is the same. The platform tries the built-in map first, falls
through to a DB lookup, self-heals the cache on miss, and either
raises (or renders a "not configured" notice) if neither resolves.

## Why this matters

Both axes are user-extensible **without forking the platform**.

- A new **recommendation policy** is one Python file (subclass
  `BaseRecommender`, register an instance), or zero code at all if the
  service already runs over HTTP elsewhere.
- A new **UI** is one TSX file (drop in `ui-presets/<key>/feed.tsx`),
  or zero code at all if it can be composed in the visual editor.

Researchers reuse the platform. They do not fork it. That keeps
studies running on different policies and UIs comparable, because the
data plane underneath is unchanged.

## What sits underneath both registries

The platform is a four-container Compose stack.

- **`db`**, PostgreSQL 15. Holds users, groups, videos, sessions, the
  events table (wide-table plus JSONB payload), `recommender_registry`,
  `ui_templates`, and the training caches.
- **`backend`**, FastAPI plus SQLAlchemy 2.0 plus Alembic. Wires the
  recommender registry, the auth surface (HttpOnly cookie plus bcrypt),
  the events ingest, and the admin API.
- **`frontend`**, React 18 plus TypeScript plus Vite plus Tailwind.
  Hosts the three UI authoring tracks plus the admin console and
  serves the built bundle through nginx.
- **`data-nginx`**, a second nginx that range-serves video and
  thumbnail files mounted from `data/`.

Both the recommender and the UI track read from the same data plane.
The events table is the **single point of measurement**. Every
authoring track lands events through `EventContext` (5 s and 20-event
batching), so 33 events across 6 categories show up identically
regardless of which dispatcher branch produced the rendered page.

## What is intentionally not in scope

- **No native mobile app.** Three device-tagged variants of the
  bundled presets cover desktop, tablet, and mobile via responsive
  HTML. Per-group device assignment ensures participants do not
  silently slide into a different variant.
- **No A/B traffic split.** Allocation is by group membership at
  account-creation time. Mid-experiment reassignment is not modelled.
- **No real-time online learning loop.** RecBole training runs on a
  scheduler (default 60 min) and writes pre-computed predictions into
  a cache. Request-time policies (HTTP recommenders) can do whatever
  they want internally.

## Where to go next

- [**Configurable Execution**](./configurable-execution). Read about
  the recommender and UI plug-in axes in more detail.
- [**Standardized Measurement**](./standardized-measurement). See
  what the 33-event schema enforces.
- [**Adding a Recommender**](../guides/adding-a-recommender). Read
  the practical walk-through.
