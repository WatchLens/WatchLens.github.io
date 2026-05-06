---
sidebar_position: 3
title: RecBole Tab
---

# RecBole Tab

The RecBole tab is visible only when at least one group's
`algorithm_config` selects `recbole` for the feed surface or the
watch surface. The tab surfaces what the learned policy is doing in
near real time so admins can tell whether the model is trained, how
fresh the predictions are, and which fallback stage is serving each
request.

## Status banner

Top of the tab. Confirms the runtime that backs the learned policy.

| Field | Meaning |
|-------|---------|
| RecBole | RecBole library version installed in the backend image |
| PyTorch | torch version |
| Device | `CPU` or `CUDA`. Green if CUDA is available |
| Scheduler | Frequency of automatic training cycles. Default is every 60 minutes |

If RecBole is not installed (the image was built without the ML
extra), the banner says so and the rest of the tab stays visible
but inert.

## Group Model Status

A card per group whose feed or watch surface is on `recbole`. Each
card carries.

- The group name and assigned user count
- Feed model (one of `BPR`, `NeuMF`, `LightGCN`, `SASRec`, `GRU4Rec`)
- Watch model (one of `ItemKNN`, `EASE`)
- Last training run status per surface (Pending, Running, Completed,
  Failed) plus how long ago it finished
- A Train Now button per surface, disabled while another training
  run is in flight for the experiment

A group can be on `recbole` for both surfaces or just one. Surfaces
not set to `recbole` do not appear here.

## Coverage cards

Four numbers describing how much of the experiment the cache
currently covers.

| Card | Definition |
|------|------------|
| User Coverage | `users_with_recommendation_cache_rows / total_users` for the experiment |
| Item Coverage (I2I) | `videos_with_item_similarity_rows / total_videos` |
| Cache | Total rows in `recommendation_cache` plus `item_similarity` for the experiment |
| Last Training | Time since the most recent successful training run completed. Includes a Clear cache button if rows exist |

Low user coverage means many participants will hit the popularity
fallback rather than learned recommendations. The fallback chain is
documented below.

## Import Rec Graph

A CSV upload button. Imports a precomputed item-to-item graph
generated outside the platform (for example, by an offline RecBole
job, by a graph database, or by a colleague). The CSV header is.

```
source_video_id,recommended_video_id,position
```

Each row becomes an `item_similarity` row with `algorithm='auto'`
and `score = 1 / (position + 1)`. The auto channel is the watch-tab
fallback when the model-specific I2I cache is empty, so this gives
the platform a useful cold-start signal even before any training
has happened.

Existing `algorithm='auto'` rows for the experiment are deleted
before the new ones load, so the import is idempotent.

## Recommendation Serving Status

Two horizontal bar charts (one for feed, one for watch) showing
which fallback stage actually fulfilled each request since the
backend last started.

### Feed fallback chain

```
Stage 1: CF (RecBole)        ← recommendation_cache
Stage 2: Popularity          ← view_count desc
Stage 3: Recency             ← created_at desc
```

### Watch fallback chain

```
Stage 1: I2I (RecBole)       ← item_similarity, model-specific
                                with internal model -> auto fall-through
Stage 2: Popularity          ← view_count desc
```

Reading the bars tells you whether the learned model is actually
serving requests. If Stage 2 dominates Stage 1, the cache is
underbuilt. If Stage 3 dominates Stage 2 on the feed, the platform
is mostly serving brand-new videos.

The counters reset on every backend restart. They are an in-memory
monitor, not a persisted log.

## Training History

A table at the bottom of the tab lists every training run for the
experiment, newest first.

| Column | Meaning |
|--------|---------|
| Status | Pending, Running, Completed, or Failed |
| Model | Model name as configured on the group |
| Data | Interactions extracted from the events table for this run |
| Recall@K | Test-set Recall at the configured top-K |
| NDCG@K | Test-set NDCG at the configured top-K |
| Recs | Recommendation cache rows produced |
| Duration | Training wall-clock time |
| Started | Time since the run started |

Click a row to expand metric details, hyperparameters, run
statistics, and the error trace if it failed.

## How training is triggered

Two paths.

1. **Scheduler.** Every `RECBOLE_FIT_PERIOD_MINUTES` (default 60),
   the backend checks each active experiment. For each group whose
   feed or watch is on `recbole`, a training run kicks off if the
   cache is empty, expired (`RECBOLE_CACHE_EXPIRE_HOURS`, default
   72), or there are at least `RECBOLE_MIN_INTERACTIONS` (default
   50) new interactions since the last run.
2. **Train Now button.** Manual override on a group card. Useful
   when iterating on hyperparameters mid-study (the `algorithm`
   config of the group is editable while the experiment is
   `active`).

Both paths produce the same TrainingRun row in the database, so the
History table lists scheduler runs and manual runs together.

## What is intentionally not in the RecBole tab

- **A full hyperparameter editor.** The five model-specific
  defaults (epochs, learning rate, batch size, embedding size,
  topk) are saved on the group's `config.recbole_feed` JSONB. To
  change them, edit the group's algorithm config from the Groups
  tab.
- **An online learning loop.** Training is batch and scheduler-
  driven. Request-time policies that need online learning should be
  registered as external HTTP recommenders. See
  [Adding an External Service](../guides/adding-an-external-recommender).

## Where to go next

- [**Adding a Recommender**](../guides/adding-a-recommender). Read
  how a Python class becomes a registered policy.
- [**Adding an External Service**](../guides/adding-an-external-recommender).
  Read how an HTTP service registers without code.
- [**Stats Tab**](./stats-tab). Read the metrics that summarise
  participant behaviour against these models.
