---
sidebar_position: 3
title: Why WatchLens
---

# Why WatchLens

Several platforms already host online recommendation studies.
WatchLens is purpose-built for **video recommendation research where
the UI, the policy, and the event measurement need to be varied
independently**. This page situates the design against the
alternatives.

## What other platforms optimise for

| Platform                              | Optimised for                                                  |
|---------------------------------------|----------------------------------------------------------------|
| [**Informfully**](https://informfully.com/) | News articles. UI is a hard-coded React Native client, and recommendations are pushed into the platform's database by an external service. |
| [**RecBole**](https://recbole.io/)    | Offline benchmarking. 70+ algorithms, but no UI, no event capture, no live participants. |
| **One-off platforms** authored per study | Whatever the study needs. Reusability and cross-study comparability are not goals. |

These tools are excellent at what they target. They are not designed
for a study where the question is **"does this UI change participant
behaviour under this policy?"**. In each one, either the UI is fixed,
or the runtime is fixed, or the event schema is fixed.

## Where WatchLens fits

WatchLens is for studies where you want to vary one axis at a time
without rewriting the rest of the stack.

- The policy is a plug-in (Python class **or** external HTTP). A
  baseline swap is one config change. A custom policy is one file.
- The UI is a plug-in (bundled preset **or** in-browser TSX **or**
  visual block tree). All three emit the same event schema.
- The event schema is fixed (33 events across 6 categories). A study
  using policy A on UI X compares cleanly against a study using
  policy B on UI Y because the data shapes are identical.

## When WatchLens is the wrong choice

- You only need offline benchmarking. Use RecBole directly.
- You need a fully customised UI that does not fit the
  feed-page-and-watch-page abstraction. Write your own platform,
  because the abstraction will get in your way.
- Your participants need a native mobile app. WatchLens ships a
  responsive web app with three device-tagged variants. There is no
  iOS or Android client.

## Where to go next

- [**Architecture Overview**](../concepts/architecture). Read about
  the hybrid registry pattern that holds the plug-in axes together.
- [**Configurable Execution**](../concepts/configurable-execution).
  See the recommender and UI plug-in axes in detail.
- [**Standardized Measurement**](../concepts/standardized-measurement).
  Read what the 33-event schema captures and why.
