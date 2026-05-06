---
sidebar_position: 3
title: Why WatchLens
---

# Why WatchLens

Several platforms already host online recommendation studies. WatchLens
is purpose-built for **video recommendation research where the UI, the
policy, and the event measurement need to be varied independently**.
This page situates the design against the alternatives.

## What other platforms optimise for

| Platform                              | Optimised for                                                  |
|---------------------------------------|----------------------------------------------------------------|
| [**Informfully**](https://informfully.com/) | News articles. UI is a hard-coded React Native client; recommendations are pushed into the platform's database by an external service. |
| [**RecBole**](https://recbole.io/)    | Offline benchmarking. 70+ algorithms, but no UI, no event capture, no live participants. |
| **One-off platforms** authored per study | Whatever the study needs. Reusability and cross-study comparability are not goals. |

These tools are excellent at what they target. They are not designed
for a study where the question is **"does this UI change participant
behaviour under this policy?"** — because in each, the UI is fixed, or
the runtime is fixed, or the event schema is fixed.

## Where WatchLens fits

WatchLens is for studies where you want to **vary one axis at a time
without rewriting the rest of the stack**:

- The policy is a plug-in (Python class **or** external HTTP). A baseline
  swap is one config change; a custom policy is one file.
- The UI is a plug-in (bundled preset **or** in-browser TSX **or**
  visual block tree). All three emit the same event schema.
- The event schema is fixed (33 events across 6 categories). A study
  using policy A on UI X compares cleanly against a study using policy
  B on UI Y because the data shapes are identical.

## Concrete differences from Informfully

The closest comparison is Informfully — both target online studies with
real participants and real recommendations. The differences come from
WatchLens' video-domain focus:

| Concern                  | Informfully                              | WatchLens                                                                                        |
|--------------------------|------------------------------------------|--------------------------------------------------------------------------------------------------|
| Recommendation runtime   | External services push ranked lists into the platform DB | First-class **in-process Python** *and* **external HTTP**, both behind the same dispatcher       |
| UI authoring             | React Native, hard-coded variants        | Bundled presets *and* in-browser TSX track *and* visual block-tree editor                        |
| Event schema             | Per-article like-survey; generic events  | 33 video-aware events with policy + position attached to every row                               |
| Survey timings           | Onboarding survey + per-article like     | Pre-study (forced) + post-study + inter-session reflection on the prior session                  |
| Domain                   | News articles                            | Video — playback events, watch ratio, view counts, embedded YouTube/TikTok-style presets         |

If you are running a **news article** study, Informfully is probably
better. If you are running a **video** study where one axis (policy,
UI, or measurement) needs to be varied while the others stay fixed,
WatchLens is the closer fit.

## When WatchLens is the wrong choice

- You only need offline benchmarking — use RecBole directly.
- You need a fully customised UI that doesn't fit the
  feed-/watch-page abstraction — write your own platform; the
  abstraction will get in your way.
- Your participants need a native mobile app — WatchLens ships a
  responsive web app with three device-tagged variants. There is no
  iOS / Android client.

## Where to go next

- [**Architecture Overview**](../concepts/architecture) — the hybrid
  registry pattern that holds the plug-in axes together.
- [**Configurable Execution**](../concepts/configurable-execution) —
  the recommender and UI plug-in axes in detail.
- [**Standardized Measurement**](../concepts/standardized-measurement) —
  what the 33-event schema captures and why.
