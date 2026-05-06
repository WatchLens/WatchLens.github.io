---
sidebar_position: 4
title: Per-Group Device Routing
---

# Per-Group Device Routing

A user group is bound to one **device class** — desktop, tablet, or
mobile. Every UI a participant in that group could see (built-in
preset or admin-authored template) must match. If the participant's
viewport doesn't match, the dispatcher returns a notice page asking
them to switch devices rather than scaling the layout silently.

This is a deliberate design choice: in a study where the UI is the
treatment, having the layout silently change at a viewport breakpoint
is a confound the researcher did not configure.

## How it shapes the data model

Three pieces of state cooperate:

| Where                      | Field                                                      | Holds                                                              |
|----------------------------|------------------------------------------------------------|--------------------------------------------------------------------|
| `user_groups.device`        | `'desktop' \| 'tablet' \| 'mobile'`                        | The device class the group's participants are expected to use      |
| `user_groups.ui_config`     | `{ feed: <key>, watch: <key> }` (flat per surface)         | Built-in key (must support that device) or `ui_templates.id` UUID  |
| `ui_templates.device`       | `'desktop' \| 'tablet' \| 'mobile'`                        | The single device the template was authored for                    |

Validation runs at group create / update: a built-in key must list the
group's device in its supported set, a template UUID must match the
group's device exactly, otherwise the request returns 422.

## Built-in presets are device-tagged

Six device variants of the bundled YouTube and TikTok presets ship,
plus a `none` preset for experiments that skip the feed:

| Preset key          | Devices                  | Notes                                                                   |
|---------------------|--------------------------|-------------------------------------------------------------------------|
| `youtube-desktop`   | desktop                  | 4-col 16:9 grid + aspect-video player + 400px sidebar of related cards  |
| `youtube-tablet`    | tablet                   | 2-col grid (matches the YouTube iPad layout) + 280px sidebar             |
| `youtube-mobile`    | mobile                   | Single-column full-width cards + no-sidebar watch                       |
| `tiktok-desktop`    | desktop                  | 9:16 thumbnail grid + full-screen vertical pager watch                  |
| `tiktok-tablet`     | tablet                   | 4-col 9:16 grid + split-screen watch (player + tabbed comments / related) |
| `tiktok-mobile`     | mobile                   | 2-col 9:16 grid + full-screen 9:16 watch with action stack overlay      |
| `none`              | desktop, tablet, mobile  | No feed; redirects to the first watchable video                         |

`none` is the only one that supports all three devices — it has no UI
to render in the first place.

## Mismatch handling

When a participant arrives:

1. The frontend's `useDevice()` hook reads `window.innerWidth` and
   matches it to one of `mobile` (<768px), `tablet` (<1024px),
   `desktop` (≥1024px) — the Tailwind-standard breakpoints.
2. If the detected device doesn't equal the group's `device`, the
   dispatcher returns `<DeviceMismatchNotice>` instead of the UI:

   > **Please use a desktop for this study.**
   > You arrived on a mobile (phone) browser, but this study is
   > configured for desktop users. Open the study link on a desktop
   > device to continue.

3. If they match, the regular built-in / template dispatcher runs.

## Why not just scale the UI

A 1280px-authored layout scaled to 375px is a different UI: column
counts change, hit targets change, attention surfaces change. None of
these are the layout the researcher chose. So the dispatcher refuses
to render that combination at all.

The cost is asking some participants to switch devices. The benefit is
that "this group ran on desktop YouTube" stays a true statement for
every event in their session.

## Where to go next

- [**Device Routing reference**](../reference/device-routing) — full
  data model and the dispatcher branches.
- [**Authoring a UI**](../guides/authoring-a-ui) — how device tagging
  applies to admin-authored templates.
