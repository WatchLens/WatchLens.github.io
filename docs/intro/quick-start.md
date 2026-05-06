---
sidebar_position: 2
title: Quick Start
---

# Quick Start

Five-minute local setup. You'll have an admin console, a participant
view, and the event pipeline running by the end.

## Prerequisites

- **Docker** with Docker Compose v2.
- **Git** to clone the repository.
- That's it — the platform packages PostgreSQL, the FastAPI backend,
  the Vite frontend, and an nginx data server into one Compose stack.
  No external services are required for local use.

## 1. Clone

```bash
git clone https://github.com/WatchLens/WatchLens.git
cd WatchLens
```

## 2. Configure

```bash
cp .env.example .env
```

Open `.env` and set at minimum:

| Variable | Required | Notes |
|----------|----------|-------|
| `POSTGRES_PASSWORD` | yes | Any string. |
| `SECRET_KEY` | yes | Use `openssl rand -hex 32`. |
| `ADMIN_PASSWORD` | yes | The seeded admin account password. |
| `HOST_PORT` | no | Defaults to `8080`. |

## 3. Bring the stack up

```bash
docker compose up -d --build
```

The first build takes about a minute (Python + Node images + RecBole
wheels). Migrations run automatically on backend startup.

## 4. Sign in

Open `http://localhost:8080` and sign in with `admin` /
`<your ADMIN_PASSWORD>`. You'll land on the admin console.

## 5. Create your first experiment

In order, from the admin nav:

1. **Experiments** → "New Experiment". Give it a name.
2. Open the new experiment → **Videos** tab → upload a CSV (see
   [the recommender guide](../guides/adding-a-recommender) for the
   schema), or drop a dataset folder under `data/<name>/` and use the
   "Auto-import" button.
3. **Groups** tab → "Add Group". Pick a device (desktop / tablet /
   mobile), an algorithm (one per surface — feed and watch), and a UI
   preset.
4. **Users** tab → "Bulk Create" — generates participants assigned to
   the group with random passwords. The credentials are shown once;
   download the CSV.
5. Back at the top of the page, flip the experiment's status from
   `draft` to `active`. Events start streaming the moment a participant
   signs in.

## 6. Observe

Open the participant view in another browser (or an incognito window)
with one of the credentials you just generated. Every interaction lands
in the **events** table; the **Stats** tab on the experiment page
exposes CTR, watch time, watch ratio, session length, and session
duration with per-group comparison.

When the study ends, set the experiment to `completed` and use **Export
Events CSV** for the full event log.

## Where to go next

- [**Architecture Overview**](../concepts/architecture) — how the
  recommender and UI plug-ins fit together.
- [**Adding a Recommender**](../guides/adding-a-recommender) — write
  your own policy in Python.
- [**Authoring a UI**](../guides/authoring-a-ui) — three authoring
  tracks, all sharing the same event contract.
