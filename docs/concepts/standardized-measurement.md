---
sidebar_position: 3
title: Standardized Measurement
---

# Standardized Measurement

The recommendation policy and the UI are configurable; the **event
schema is not**. Every UI track WatchLens supports — bundled presets,
in-browser code, visual block tree — emits the **same 33 events
across the same 6 categories**. The policy that produced each
recommendation and the position the participant saw it in attach to
every row.

This page explains what the schema captures, why it's invariant, and
what behavioural questions it makes answerable.

## The six categories

| Category      | Events                                                                              | What they capture                                              |
|---------------|-------------------------------------------------------------------------------------|----------------------------------------------------------------|
| Session       | `SESSION_START`, `SESSION_END`                                                       | Participant identity + environment + lifetime                  |
| Navigation    | `PAGE_LOAD`, `PAGE_EXIT`, `NAVIGATION`                                               | Where in the app the participant was, with dwell time          |
| Playback      | `VIDEO_PLAY`, `VIDEO_PAUSE`, `VIDEO_SEEK`, `VIDEO_ENDED`, `VIDEO_PROGRESS`, `VIDEO_WATCHED_1S`, `VIDEO_WATCHED_5S`, `VIDEO_BUFFERING`, `VIDEO_META_CAPTURED`, `PLAYBACK_RATE_CHANGE`, `VOLUME_CHANGE`, `FULLSCREEN_CHANGE`, `KEYBOARD_SHORTCUT` | Every measurable thing a video player does            |
| Impressions   | `HOME_FEED`, `RECOMMENDATIONS`, `IMPRESSION`, `VIEWPORT_VISIBILITY`                    | Which videos were on screen and for how long                   |
| Interactions  | `FEED_CLICK`, `LIKE`, `DISLIKE`, `VIDEO_CLICK`, `THUMBNAIL_HOVER`                     | What the participant did with the videos                       |
| Browser state | `MOUSE_MOVEMENT`, `SCROLL`, `VISIBILITY_CHANGE`, `WINDOW_FOCUS`, `WINDOW_BLUR`, `LAYOUT_CHANGE` | Tab focus, scroll, mouse traces — the signal behind attention   |

The full payload contract for each event is in the
[**Event Schema reference**](../reference/event-schema).

## What "exposure-aware" means

Every impression event carries the **`position_in_feed`** the
participant saw it at. Click-through rate is therefore a precise
quantity, not a proxy:

```
CTR per session = | feed_clicks ∩ impression_videos | / | impressions |
```

(Sessions with no impressions contribute nothing — not 0/0 = NaN, and
not a synthetic 0 that would dilute the average.)

Watch ratio (the fraction of the video duration the participant
actually watched) rides on `VIDEO_ENDED`. The platform uses **median**
across all playbacks, since the distribution is heavy-tailed (loops,
replays, near-zero abandons) and means are misleading.

## Why the schema is invariant

The schema is defined by **surface primitives** — three React
components that the platform ships:

- `<FeedSurface>` — wraps a feed page. Wires page-load, scroll, mouse,
  viewport, visibility events. Fires `HOME_FEED` for newly seen videos.
- `<WatchSurface>` — wraps a watch page. Same plus `VIDEO_META_CAPTURED`
  for the current video and `RECOMMENDATIONS` for the related list.
- `<VideoSurface>` — wraps a single card or player. Card mode emits
  `IMPRESSION`, `THUMBNAIL_HOVER`, `FEED_CLICK` / `VIDEO_CLICK`. Watch
  mode produces the playback event family via render-prop handlers.

A UI track **must** mount these surfaces — there is no way to render a
feed page through the platform's data hooks without going through
`<FeedSurface>`. The contract is enforced by where data lives:

- Data hooks (`useFeed`, `useVideo`, `useRelated`, `useComments`,
  `useLikes`, `useUser`) are the only sanctioned reads.
- Surface primitives are the only sanctioned writes.
- Bypassing them (calling axios directly, etc.) breaks the contract
  silently. The platform refuses to do that work, but a determined
  researcher can. The recommended habit is to not.

This is the part of WatchLens that makes data from different studies
comparable. Two studies run on different policies and different UIs
land identical-shape rows in the events table.

## What you can answer with this schema

A short and incomplete list:

- **Position effects.** Did changing the feed layout (e.g. 4-col grid
  → 1-col mobile list) change which positions get clicked?
- **Algorithm comparisons.** With the policy attached to each event,
  CTR/Watch Ratio/Session Length/Session Duration medians are directly
  comparable across groups.
- **UI confounds.** With device assignment per group (see [device
  routing](./device-routing)), a viewport-driven layout difference
  cannot silently confound a treatment.
- **Behaviour patterns.** Mouse / scroll / focus / tab visibility give
  a signal-rich attention proxy without survey overhead.
- **Self-report alignment.** Surveys ([three timings: pre / post /
  inter-session](./survey-system)) attach to the same user identity, so
  behavioural and self-report data sit in the same data model.

## Where to go next

- [**Event Schema reference**](../reference/event-schema) — payload
  contracts for all 33 events.
- [**Phase 1 verification**](../guides/phase1-verification) — the
  click-by-click recipe for confirming events fire correctly.
- [**Authoring a UI**](../guides/authoring-a-ui) — how surfaces enter a
  custom UI without ceremony.
