---
sidebar_position: 1
title: What is WatchLens
---

# What is WatchLens

WatchLens is a **configurable, open-source platform for online video
recommendation experiments**. It lets researchers vary three things
independently — the recommendation policy, the user interface, and the
content pool — while every interface emits the same exposure-aware event
schema, so behavioural data stays comparable across treatments.

## Two design axes

The platform is organised around two ideas that are often coupled in
practice but should not be:

1. **Configurable execution.** The recommendation policy and the UI a
   participant sees are both **plug-ins**, registered through the same
   hybrid interface. A policy can be a Python class shipped with the
   platform or an external HTTP service registered at runtime; a UI can
   be a bundled preset, a TSX file pasted into the in-browser editor, or
   a tree of 19 composable visual blocks. All four authoring routes
   resolve through one dispatcher.

2. **Standardized measurement.** Whatever combination an experiment runs
   produces the same **33-event schema** across six categories (session,
   navigation, playback, impressions, interactions, browser state). The
   policy that produced each recommendation and the position the
   participant saw it in attach to every row, so the data plane stays
   policy-aware without the UI having to think about it.

These two axes are the platform's core claim: separating **what you
study** (the policy and UI you vary) from **what you measure** (the
event schema you depend on) keeps studies comparable across
experiments and across labs.

## What ships out of the box

- **Five recommender baselines.** `random`, `popularity`, `recency`,
  `similarity` (TF-IDF cosine, watch-only), and `recbole` (a learned
  policy backed by 70+ algorithms in the [RecBole](https://recbole.io/)
  library).
- **Six device-tagged UI presets.** YouTube and TikTok layouts authored
  per device (desktop / tablet / mobile), plus a `none` redirect for
  experiments that bypass the feed.
- **Three UI authoring tracks.** Bundled presets (React TSX in the
  source tree), an in-browser code editor (sucrase-compiled TSX at
  runtime), and a visual block-tree editor with 19 composable blocks
  that ejects to TSX.
- **Built-in metrics.** CTR, average watch time, watch-ratio median,
  session length (median videos), session duration (median seconds),
  with per-group breakdown and a CSV export of the full event log.
- **Built-in surveys.** Pre-study (forced gate), post-study, and
  inter-session timings with quantised answer values for analysis.
- **Single-server deploy.** Docker Compose: `db`, `backend`, `frontend`,
  `data-nginx`. No external services required.

## Where to go next

- [**Quick Start**](./quick-start) — bring up the platform locally in
  five minutes and create your first experiment.
- [**Why WatchLens**](./why-watchlens) — what existing platforms do
  differently and where WatchLens fits.
- [**Architecture Overview**](../concepts/architecture) — the hybrid
  registry pattern that links the recommender and UI plug-in axes.
- [**Event Schema**](../reference/event-schema) — the 33-event contract
  every UI track honours.
