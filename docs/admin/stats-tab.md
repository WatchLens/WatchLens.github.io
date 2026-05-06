---
sidebar_position: 2
title: Stats Tab
---

# Stats Tab

The Stats tab aggregates events into the metrics WatchLens uses to
compare groups. Every metric definition on this page is the literal
formula the backend computes in `app/api/v1/admin/stats.py`. There
is no hidden post-processing.

## Overview cards

Two top-level numbers, computed across the whole experiment.

| Card | Definition |
|------|------------|
| Total Sessions | Distinct `sessions.id` rows owned by participants in this experiment |
| Total Events | Row count in the events table joined to those sessions |

These are sanity numbers. The substantive metrics live in
Recommendation Evaluation below.

## Events by Type

A 2 by 6 grid showing the count of each `event_type` value. Useful
for catching that, for example, `IMPRESSION` is firing while
`FEED_CLICK` is silent (probably a UI track that swallowed the
click). The full event contract is in
[Event Schema](../reference/event-schema).

## Group Comparison

Per-group counts across the whole experiment.

| Column | Definition |
|--------|------------|
| Group | The user group's name |
| Algorithm | `algorithm_config.feed` and `algorithm_config.watch` for the group |
| UI Config | `ui_config.feed` and `ui_config.watch` for the group |
| Users | Participant count assigned to the group |
| Sessions | Distinct sessions owned by those participants |
| Events | Row count in the events table for those sessions |

The five metric medians live in the next collapsible card.

## Recommendation Evaluation

Five aggregates per group. Each is computed over the participants
assigned to the group. These are the numbers that anchor a study's
findings.

### CTR

Mean across sessions of clicks-on-impressed-videos divided by
impressions.

```
per session: | feed_clicks ∩ impression_videos | / | impressions |
overall:     mean of the per-session ratios
```

Sessions with zero impressions contribute nothing (not a synthetic
zero, not NaN). This keeps the average meaningful when a session is
a bounce.

### Avg Watch Time

Mean of `VIDEO_ENDED.watch_duration` across every playback in the
session pool. Replays count as separate playbacks.

### Watch Ratio (median)

Median of `VIDEO_ENDED.watch_ratio` across every playback. The
distribution is heavy-tailed (loops push the right tail past 1.0,
near-zero abandons cluster at 0), so the platform reports the
median rather than the mean.

### Session Length (median)

Median of per-session unique `VIDEO_PLAY` counts. A session that
auto-played one video and bounced contributes 1. A session with
fifteen distinct videos contributes 15.

### Session Duration (median seconds)

Median of per-session `max(server_timestamp) - min(server_timestamp)`.
Single-event sessions contribute 0.

## Low-confidence flag

Each group row carries a `Sessions` count. Groups with fewer than
30 sessions are grayed out and a banner appears under the table.

> Low confidence: fewer than 30 sessions evaluated.

The threshold (30) reflects the rule of thumb for medians of
moderately variable distributions. Studies with smaller samples
should not lean on the medians as ground truth.

## Events CSV export

The Export Events CSV button streams a row per event, ordered by
server timestamp. The schema follows.

| Column | Source |
|--------|--------|
| event_id | events.id |
| user_login_id | users.login_id (joined via session) |
| group_name | user_groups.name |
| algorithm_feed | user_groups.algorithm_config.feed |
| algorithm_watch | user_groups.algorithm_config.watch |
| session_id | events.session_id |
| video_id | The external video_id (not the internal UUID) |
| event_type | events.event_type |
| watch_ratio | events.watch_ratio (nullable) |
| watch_duration | events.watch_duration (nullable) |
| position_in_feed | events.position_in_feed (nullable) |
| client_timestamp | events.client_timestamp |
| server_timestamp | events.server_timestamp |
| payload | events.payload (JSONB serialised as JSON) |

The file starts with a UTF-8 BOM so Excel opens Korean filenames and
content correctly. The filename is RFC 5987 percent-encoded so
non-ASCII experiment names survive the Content-Disposition header.

## What is intentionally not in the Stats tab

- **Statistical significance.** WatchLens does not compute p-values
  or confidence intervals. Run that downstream on the exported CSV
  with the tool of your choice.
- **NDCG and Precision at K.** These were dropped. The platform
  exposes raw events plus the five medians above. Ranking metrics
  belong to a downstream evaluation pass that decides on the
  relevance signal explicitly.
- **avg_watch_ratio (mean).** Median is exposed instead. Mean was
  dropped because heavy-tailed playback distributions made the mean
  uninformative without an outlier policy that researchers should
  set themselves.

## Where to go next

- [**Event Schema**](../reference/event-schema). Read what the rows
  of the events table actually carry.
- [**Phase 1 Verification**](../guides/phase1-verification). Confirm
  the events you expect are firing before reading any metrics.
- [**Admin Console Overview**](./overview). Read about the other
  tabs.
