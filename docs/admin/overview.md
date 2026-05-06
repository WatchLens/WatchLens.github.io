---
sidebar_position: 1
title: Admin Console Overview
---

# Admin Console Overview

Researchers run studies through the admin console at `/admin`. This
page walks the navigation, the experiment lifecycle, and what each
tab does. Most tabs have a dedicated deep-dive page. The cross-links
at the bottom of every section take you there.

## Navigation

The admin console exposes three top-level routes.

| Route | Purpose |
|-------|---------|
| `/admin` (Dashboard) | Quick view of every experiment plus aggregate counts (total experiments, active count, total users, total videos) |
| `/admin/experiments` | Full experiment list. Create, edit, or delete an experiment from here |
| `/admin/ui-custom` | UI template library (visual or code track) shared across experiments |

Open an experiment from either Dashboard or Experiments and you land
on `/admin/experiments/<id>`, which is the per-experiment workspace.
The remaining tabs all live there.

## Experiment lifecycle

An experiment moves through three statuses. The admin flips them
manually with the dropdown at the top of the experiment page.

| Status | What it means | What is allowed |
|--------|---------------|-----------------|
| `draft` | Setup stage. Edit groups, users, videos, UI configuration freely | Everything |
| `active` | Participants log in and stream events into the database | Algorithm and group config can still be edited (researchers iterate). UI config and device assignment are frozen so layout-driven confounds do not appear mid-study |
| `completed` | Study has ended. Data is read-only | Group, user, and video edits are blocked. Stats and exports still work |

Post-study surveys (see [Designing Surveys](../guides/designing-surveys))
trigger only when `status='completed'` AND the survey is
`is_active=true`.

## Per-experiment tabs

Once you open an experiment, seven tabs run across the top.

### Overview

Three counters (user groups, total users, total videos). It is the
landing tab and is intentionally light. The detail lives in the
other tabs.

### Groups

The list of user groups in this experiment. Each row carries a
device class, an algorithm config (one key per surface, feed and
watch), a UI config, and the user count.

Adding a group is one form. Pick a name, a device class, an
algorithm pair, and a UI config. The platform validates that the UI
keys you pick support the group's device, so a tablet group cannot
silently land on a desktop-only built-in.

The Edit button on each row opens the algorithm config modal. UI
config and device assignment freeze the moment the experiment goes
`active`, so the modal switches to algorithm-only mode after that
point.

### Users

Per-experiment participant list. Each row carries the participant's
login id, group name, last-login timestamp, and a Status button that
opens a modal with the participant's full event trajectory grouped
by day.

Bulk Create generates participants under a chosen group with random
passwords. The credentials are shown once. Download the CSV before
closing the modal.

Download CSV exports the participant list (without passwords) for
record-keeping.

### Videos

The video pool. Two import paths.

1. **Manual CSV upload.** The CSV header is documented in
   [Adding a Recommender](../guides/adding-a-recommender). Rows in
   the CSV become videos in the experiment.
2. **Auto-import from a dataset folder.** Drop a dataset folder
   under `data/<name>/` on the host. The Auto-import button on this
   tab reads the videos CSV plus the comments CSV plus the videos
   and thumbnails subfolders.

Edit mode flips the table into bulk-select. Pagination handles
larger video pools (100 per page).

### Surveys

CRUD for the experiment's surveys. Three sections (Pre-study,
Inter-session, Post-study) match the three timing kinds. The full
data model and the priority dispatcher are documented in
[Survey System](../concepts/survey-system). The admin-side authoring
flow is in [Designing Surveys](../guides/designing-surveys).

### Stats

Aggregate metrics for the experiment. CTR, average watch time,
watch ratio (median), session length (median videos), session
duration (median seconds), and per-group comparison. The metric
definitions plus the low-confidence threshold are in
[Stats Tab](./stats-tab).

The Export Events CSV button on this tab streams every event in the
experiment as a UTF-8 CSV with BOM (Excel-friendly). One row per
event, with the policy and feed position attached. This is the
artifact used for downstream analysis.

### RecBole

Visible only when at least one group's algorithm config sets `feed`
or `watch` to `recbole`. Shows training status, coverage, fallback
stage usage, and training history. The full reference is in
[RecBole Tab](./recbole-tab).

## What does not have a tab

A few admin actions are reachable but not tab-shaped.

- **Recommender registry** sits at `/admin/recommenders` (not yet
  tabbed). Use it to register an external HTTP recommender. See
  [Adding an External Service](../guides/adding-an-external-recommender).
- **UI templates** live at `/admin/ui-custom` and are shared across
  experiments. Each experiment references templates by id from its
  groups' UI config.

## Where to go next

- [**Stats Tab**](./stats-tab). Read the metric definitions used in
  the Stats tab.
- [**RecBole Tab**](./recbole-tab). Read about training cadence,
  coverage, and the fallback chain.
- [**Quick Start**](../intro/quick-start). Bring the platform up
  locally and click through the lifecycle once.
