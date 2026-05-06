---
sidebar_position: 2
title: Running an Experiment
---

# Running an Experiment

This page walks the admin actions that take an experiment from
empty to data export. Eight steps. Every step happens inside
`/admin/experiments/<id>` after you create the experiment in step
one.

## Step 1. Create the experiment

Open `/admin/experiments` and click **New Experiment**. Give it a
short name (the slug appears in CSV filenames later) and an
optional description. The new experiment lands in `draft` status.

A draft experiment is invisible to participants. Everything you
configure in the next steps stays editable until you flip it to
`active`.

## Step 2. Add videos

Open the experiment's **Videos** tab. Two import paths.

### Manual CSV upload

Click **Upload CSV** and pick a file. The required columns are.

| Column | Required | Notes |
|--------|----------|-------|
| `video_id` | yes | External id you choose. Stays stable across imports |
| `url` | yes | Full URL, a YouTube watch link, an 11-character YouTube video id, or a relative path like `mydataset/videos/foo.mp4` for files served by the data nginx |
| `duration` | yes | Seconds. Integer |
| `title` | no | Display title |
| `thumbnail` | no | Same URL conventions as `url`. Auto-derives from a `videos/` to `thumbnails/` swap if absent |
| `category` | no | Free-form |
| `tags` | no | Comma-separated. Used by the auto I2I similarity computation |
| `description` | no | Truncated to 5000 characters |
| `like_count`, `dislike_count`, `comment_count` | no | Initial counters. Defaults to 0 |
| `channel_name`, `channel_id` | no | Channel metadata |
| `published_at` | no | ISO timestamp |

Duplicate `video_id` values within the experiment are skipped (not
overwritten). The endpoint returns the count of created and skipped
rows plus the first ten parse errors if any.

### Auto-import from a dataset folder

If you have already laid out a dataset under `data/<name>/` on the
host with the standard shape, the platform discovers it.

```
data/<name>/
  <name>_videos.csv
  <name>_comments.csv          (optional)
  videos/                      (mp4 / webm files, optional)
  thumbnails/                  (jpg / png / webp, optional)
```

Click **Auto-import dataset** on the Videos tab, pick the dataset
from the dropdown, and the platform reads the videos CSV plus the
comments CSV plus the file counts in one shot. Comments are linked
to videos by external `video_id` so the same import produces the
discussion thread that participants see on the watch page.

The MicroLens-100k and YouTube Shorts adapters in `scripts/` show
how to prepare a dataset folder from a raw research corpus. See
[Adding a Recommender](../guides/adding-a-recommender) for what the
recommender side expects.

## Step 3. Define user groups

Open the experiment's **Groups** tab. Each group is the unit of
treatment assignment. Two participants in different groups get
different policies and possibly different UIs. Participants inside
the same group share both.

Click **Add Group** and fill four fields.

| Field | Notes |
|-------|-------|
| Name | Free-form label, for example `Control` or `TikTok-Mobile` |
| Device | `desktop`, `tablet`, or `mobile`. The group's participants must use a viewport that matches |
| Algorithm | One key per surface (`feed` and `watch`). Pulled from the live recommender registry, which includes built-ins plus any registered HTTP services |
| UI | One key per surface. Built-ins (`youtube-{desktop,tablet,mobile}`, `tiktok-{desktop,tablet,mobile}`, `none`) plus any published `ui_templates` whose `device` matches the group's device |

Validation runs at save time. The platform refuses a tablet group
that points at a desktop-only built-in, refuses a UI template UUID
whose `device` does not match the group, and refuses an algorithm
key that the recommender does not advertise as supporting that
surface (for example, `similarity` is watch-only, so trying to put
it on `feed` fails).

A typical comparative study has two to six groups that share videos
and differ on one axis (policy or UI). The platform does not
restrict the number of groups, but the Stats tab grays out groups
with fewer than 30 sessions, so smaller groups need more
participants to produce confident medians.

## Step 4. Allocate participants

Open the **Users** tab and click **Bulk Create**. Three fields.

| Field | Notes |
|-------|-------|
| Group | Pick which group these participants land in |
| Count | How many participants to create. The endpoint caps at 100 per call |
| Prefix | Login id prefix. Bulk create generates `<prefix>001`, `<prefix>002`, and so on |

The response shows every credential (login id and a random
password) **once**. Download the CSV before closing the modal. The
platform does not store passwords in plaintext, so there is no way
to retrieve them later. Lost credentials need a new bulk create.

The Users tab also has a **Download CSV** button that exports the
full participant list (without passwords) for record keeping.
Useful when sharing roll-up data with collaborators.

There is no per-user reassignment between groups in the admin UI.
Allocation is by group at account-creation time, which keeps the
treatment assignment auditable. If you need to move a participant
mid-study, run a SQL update against `users.user_group_id`. The
platform will not stop you, but the resulting events will mix
treatment lineages so analysis becomes harder.

## Step 5. Add surveys (optional)

Open the **Surveys** tab. The page splits into three sections,
matching the three timing kinds.

| Kind | When | Forced |
|------|------|--------|
| Pre-study | First sign-in, before the feed renders | yes |
| Post-study | After you flip the experiment to `completed` | no |
| Inter-session | On every new session start, asking about the prior session | no |

Click **+ New** in the section that matches the timing you want,
fill out the question list, toggle `is_active`, and save. The
authoring flow (single, multi, text question shapes plus the value
quantisation) is documented in detail in
[Designing Surveys](../guides/designing-surveys).

You can save an inactive survey now and activate it later. The
platform enforces at most one active survey per kind per
experiment, so authoring multiple variants and flipping which one
is live is the supported pattern.

## Step 6. Flip the status to active

The status dropdown sits at the top of the experiment page. Change
`draft` to `active`. Three things change at that moment.

- Participants assigned to the experiment's groups can now sign in
  and see the configured UI. Until this point they could
  authenticate but the dispatcher would refuse to render anything.
- The platform freezes the UI config and device assignment on every
  group. Algorithm config and per-group params (RecBole hyperparams,
  for example) stay editable so researchers can iterate the policy
  mid-study without confounding the layout.
- The training scheduler picks up the experiment in its next cycle.
  Any group on `recbole` triggers an initial training run as soon
  as `RECBOLE_MIN_INTERACTIONS` events have accumulated.

Confirm the experiment is live by signing into the participant view
in another browser as one of the bulk-created users.

## Step 7. Monitor

Two tabs cover ongoing supervision.

- The **Stats** tab updates with each batched event flush (5 s for
  ordinary events, 2 s for high-frequency events). CTR, watch time,
  watch ratio median, session length median, and session duration
  median refresh per group, with a low-confidence flag below 30
  sessions. Read [Stats Tab](./stats-tab) for every metric's exact
  formula.
- The **RecBole** tab (visible if any group runs `recbole`) shows
  training cadence, coverage percentages, and which fallback stage
  is actually serving each request. Read
  [RecBole Tab](./recbole-tab) for the fallback chain in full.

The Users tab's per-row **Status** button opens a daily trajectory
view (mouse, scroll, viewport noise filtered out) which is the
quickest way to confirm a single participant's behaviour matches
expectations.

## Step 8. Complete and export

When data collection ends, flip the status to `completed`. Three
things happen.

- Group, user, and video edits are blocked. The experiment is now
  read-only.
- If a post-study survey is active, every participant who signs in
  again sees it. The dispatcher will not auto-mail invitations.
  Reach out to participants through whatever channel you used to
  recruit them.
- The Stats tab continues to work. Nothing in the read pipeline
  changes.

The two artifacts you take to downstream analysis.

| Button | Output |
|--------|--------|
| **Export Events CSV** (Stats tab) | One row per event with policy, position, and the JSONB payload column. UTF-8 with BOM, RFC 5987 filename for non-ASCII names |
| **CSV** per survey (Surveys tab) | One row per (response, question) with the question text snapshot. Same encoding |

Once you have both files, the experiment can stay in `completed`
indefinitely. The platform does not delete data automatically.

## Where to go next

- [**Admin Console Overview**](./overview). Read the tab-level map
  if you arrived here looking for a specific feature instead of the
  full walkthrough.
- [**Stats Tab**](./stats-tab). Read the metric definitions before
  drawing conclusions from the per-group medians.
- [**RecBole Tab**](./recbole-tab). Read the fallback chain to
  understand which stage is actually answering each request.
- [**Designing Surveys**](../guides/designing-surveys). Read the
  survey authoring flow if step 5 is part of your study design.
