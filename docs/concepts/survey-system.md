---
sidebar_position: 5
title: Survey System
---

# Survey System

Self-report data sits next to behavioural data, not bolted on. WatchLens
ships a survey runtime that supports **three timing kinds** through one
schema and one server-side dispatcher. Admins author surveys; the
dispatcher decides which (if any) is due for each participant on each
session.

## Three timing kinds

| Kind             | When it appears                                                                              | Dismissable | Response unit                |
|------------------|-----------------------------------------------------------------------------------------------|:-----------:|------------------------------|
| `pre`            | First sign-in. The feed is gated until the participant responds.                               | ❌          | Once per user                |
| `post`           | After the experiment is set to `status='completed'` and the survey is `is_active=true`.        | ⭕          | Once per user                |
| `inter_session`  | On every new session start, asking about the **previous** session.                             | ⭕          | Once per (user, prior session) |

The dispatcher returns at most one pending survey per call (priority:
pre → post → inter-session), so participants never juggle multiple
modals at once.

## Why three timings, not just one

Each captures a different question:

- **Pre-study** is forced because some answers (demographics, prior
  exposure) need to come before the participant has interacted with
  the platform — otherwise the data is post-hoc rationalisation.
- **Post-study** is dismissable because by then the participant has
  given enough behavioural data for the study to be useful regardless;
  forcing a final survey turns a long-running experiment into a hostage
  scenario.
- **Inter-session** is the WatchLens-specific contribution. Video
  studies usually run across multiple sessions; asking about a session
  before the participant has had time to step away from it produces
  thin answers. Asking on the **next** session start, before they
  re-engage, captures reflection without breaking the current session.

## Schema invariants

Three partial unique indexes (Alembic migration `020_surveys`) keep the
data clean even under concurrent submissions:

```sql
-- At most one active survey per (experiment, kind)
uq_surveys_one_active_per_kind: (experiment_id, kind) WHERE is_active

-- Pre / post: at most one response per (survey, user)
uq_responses_pre_post: (survey_id, user_id) WHERE about_session_id IS NULL

-- Inter-session: at most one response per (survey, user, session)
uq_responses_inter_session: (survey_id, user_id, about_session_id) WHERE about_session_id IS NOT NULL
```

A duplicate submission is caught at the database level and returns
HTTP 409, so the client can hide its modal cleanly without race
conditions.

## Question shapes

Three kinds, all stored as JSONB:

| Type     | Widget                                  | Quantisable |
|----------|------------------------------------------|:-----------:|
| `single` | Radio. `answers: [{id, text, value}, …]` | ⭕ via `value` |
| `multi`  | Checkbox. `answers` + `minSelect` + `maxSelect` (`maxSelect=0` = unlimited) | ⭕ via `value` |
| `text`   | Free-form textarea                       | ❌          |

`value: float` exists so admins can quantise Likert-style answers
(`1.0 / 0.75 / 0.5 / 0.25 / 0`) for downstream analysis without a
secondary mapping table. Each answer's text is **snapshotted** into the
response, so editing the survey later doesn't retroactively change old
answers' wording.

## Compared to other platforms

| Aspect                           | WatchLens                                   | Informfully                                 |
|----------------------------------|---------------------------------------------|---------------------------------------------|
| Timing kinds                     | 3 (pre / post / inter-session)              | 1 onboarding + per-article like             |
| Trigger enforcement              | Server-side dispatcher with priority        | Client flag (`hasAnsweredSurvey`)           |
| Forced gating                    | Pre-study only                              | Onboarding always                           |
| About-session tracking           | ⭕ (inter-session's `about_session_id`)      | ❌                                          |
| Conditional questions            | ❌ (deliberate scope cut)                    | ⭕ (selectionsFrom / withAtLeast)            |
| Per-question quantisation        | ⭕ (`answers[i].value`)                      | ⭕                                          |
| Question text snapshot           | ⭕                                          | ⭕                                          |
| Per-article like-survey          | ❌                                          | ⭕                                          |

The per-article like-survey is Informfully's strength. Inter-session
reflection is WatchLens's. Both are domain-shaped: news articles ask
"did you like this one"; video studies ask "what was your session
like".

## Where to go next

- [**Designing Surveys**](../guides/designing-surveys) — admin guide
  with screenshots and CSV export details.
