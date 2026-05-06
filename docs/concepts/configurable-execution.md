---
sidebar_position: 2
title: Configurable Execution
---

# Configurable Execution

WatchLens treats the recommendation policy and the UI as **two
independent axes**, both authored as plug-ins. This page walks the
two axes side by side.

## Axis 1 — Recommendation policy

Each user group has an `algorithm_config` JSONB:

```json
{
  "feed":  "<policy key for the feed page>",
  "watch": "<policy key for the watch page>"
}
```

The dispatcher (`backend/app/api/v1/feed.py`) resolves the key:

```
GET /feed              → algorithm_config.feed
                       → get_recommender(key).get_recommendations(...)
GET /feed/{id}/related → algorithm_config.watch
                       → get_recommender(key).get_recommendations(current_video_id=id, ...)
```

A policy can come from any of three places:

1. **A built-in Python class.** Five ship today: `random`, `popularity`,
   `recency`, `similarity`, `recbole`. Each subclasses
   `BaseRecommender`, sets capability flags (`supports_feed`,
   `supports_watch`), and registers an instance in
   `BUILTIN_INSTANCES`.
2. **An external HTTP service.** Registered through `POST
   /admin/recommenders` with a `config` describing the URL, body
   template, and where the video IDs live in the response. The
   in-process `HTTPRecommender` adapter substitutes runtime values
   (`{user_id}`, `{limit}`, etc.) into the body and parses the response.
3. **A learned RecBole model.** Trained on a schedule by reading the
   events table; the predictions land in `recommendation_cache`
   (user → video) or `item_similarity` (video → video) and are served
   through a four-stage fallback (CF → popularity → recency for feed,
   I2I → popularity for watch).

All three paths converge on the same `BaseRecommender` interface. The
dispatcher does not know which it called.

## Axis 2 — User interface

Each user group also has a `ui_config` JSONB:

```json
{
  "feed":  "<ui key for the feed page>",
  "watch": "<ui key for the watch page>"
}
```

The dispatcher (`frontend/src/pages/user/Feed.tsx` /
`VideoWatch.tsx`) resolves the key:

```
ui.feed === 'none'              → redirect to first watch video
ui.feed in BUILTIN_UI_KEYS_FEED  → render the bundled preset component
ui.feed is a UUID                → fetch ui_templates row, render by template_type
```

A UI can come from any of three authoring tracks:

1. **Bundled preset.** A React TSX file in
   `frontend/src/ui-presets/<key>/{feed,watch}.tsx`. Six device-tagged
   variants ship: `youtube-{desktop,tablet,mobile}`,
   `tiktok-{desktop,tablet,mobile}`. Plus the special `none` for
   experiments that bypass the feed entirely.
2. **In-browser code track.** Researcher pastes a TSX module into the
   admin Code editor. It is compiled at runtime by sucrase, with imports
   resolved against `window.__watchlens__` (so `import { useFeed }
   from '@watchlens/data'` works without a build step).
3. **Visual block tree.** A tree of 19 composable blocks (Page, Stack,
   Grid, SplitColumn, Tabs, VideoList, Thumbnail, Title, Channel,
   Views, Likes, Description, Tags, Actions, Comments, …) authored in
   the admin Visual editor. The renderer walks the tree at runtime;
   the editor exports the same tree as standalone TSX when the
   researcher needs to leave the visual track.

All three tracks render through the same set of **surface
primitives** (`<FeedSurface>`, `<WatchSurface>`, `<VideoSurface>`)
that emit the standardized event schema. The surface contract is
the single point of behavioural data capture; the authoring track
chooses the visual layout but not the events.

## What this buys you

The two axes are **independent**. Vary one without rewriting the
other:

| If you change…                    | …you don't have to touch                           |
|-----------------------------------|----------------------------------------------------|
| The recommendation policy         | The UI track, the event schema, or the data plane  |
| The UI track                      | The policy, the event schema, or the data plane    |
| The pool of videos                | Anything else                                      |

This is the part of the platform a paper case study leans on — running
the same policy under two UIs (or two policies under one UI) is
configuration, not code.

## Where to go next

- [**Standardized Measurement**](./standardized-measurement) — what the
  33-event schema captures across both axes.
- [**Adding a Recommender**](../guides/adding-a-recommender) — Python
  plug-in walk-through.
- [**Adding an External Service**](../guides/adding-an-external-recommender)
  — HTTP plug-in walk-through.
- [**Authoring a UI**](../guides/authoring-a-ui) — the three UI tracks
  side by side.
