---
sidebar_position: 2
title: System Requirements
---

# System Requirements

WatchLens runs as a four-container Docker Compose stack. Everything
the platform needs (PostgreSQL, the FastAPI backend with RecBole, the
Vite-built frontend, and the data nginx) is packaged inside images,
so the host machine only needs Docker plus enough resources to run
the four containers together.

## Host machine

| Resource | Minimum | Recommended | Notes |
|----------|---------|-------------|-------|
| OS | Linux, macOS, or Windows with WSL2 | Same | Anything that runs Docker Engine 24+ and Compose v2 works |
| CPU | 2 cores | 4 cores | RecBole training benefits from extra cores |
| RAM | 4 GB | 8 GB (16 GB when training) | RecBole plus PyTorch are the heaviest pieces |
| Disk | 5 GB free | 20 GB free or more | Docker images take about 3 GB. Video data is separate |
| Network | Any | Stable broadband when participants connect remotely | LAN-only studies have no network constraint |

The platform does not require Python, Node, or PostgreSQL on the
host. They live inside the Docker images.

## Tooling

| Tool | Required version |
|------|------------------|
| Docker Engine | 24 or newer |
| Docker Compose | v2 (`docker compose ...`) |
| Git | Any recent version |

The bundled images use Python 3.11, PostgreSQL 15, and Node 20.
Upgrading these means rebuilding the corresponding image, not
upgrading anything on the host.

## Experiment scale guidance

The defaults in `.env.example` and `app/config.py` are tuned for a
small lab study. The values below show where the comfort zone ends.

| Concern | Comfortable | Watch out beyond |
|---------|-------------|------------------|
| Concurrent participants on one server | About 30 | Around 100 with a slightly bigger host. Past that you want a load balancer plus replicated containers |
| Videos per experiment | 100 to 10,000 | 100k or more. RecBole training time and the item-to-item similarity matrix start to grow |
| Events per experiment | A few million | Tens of millions. Postgres still handles it, but the events CSV export streams for several minutes |
| RecBole training cadence | `RECBOLE_FIT_PERIOD_MINUTES=60` (default) | Setting this very low (under 10 minutes) on a small host can saturate the CPU |
| Minimum interactions before training | `RECBOLE_MIN_INTERACTIONS=50` (default) | Lower values produce noisier predictions. Higher values delay the first useful learned policy |

The defaults are safe. Tune the env variables only after you have
measured actual usage.

## Participant device

Each user group is bound to a single device class (desktop, tablet,
or mobile). A participant whose viewport does not match sees a
mismatch notice rather than a scaled-down UI. See
[Per-Group Device Routing](../concepts/device-routing) for the
rationale.

| Concern | Required |
|---------|----------|
| Browser | Recent Chrome, Firefox, Safari, or Edge |
| JavaScript | Enabled. The frontend is a single-page React app |
| Cookies | Enabled. Auth uses an HttpOnly cookie |
| Network | Anything that can stream the video files. The data nginx supports range requests |

There is no mobile app. Mobile participants run the responsive web
build in their browser.

## Production deployment

The Compose stack listens on plain HTTP on `127.0.0.1` by default.
Real participants reaching the platform from their own devices need
TLS plus matching cookie and CORS settings.

| Variable | Production value | Reason |
|----------|------------------|--------|
| `HOST_BIND` | `0.0.0.0` | Listen on every interface, or pair with a reverse proxy |
| `HOST_PORT` | `80` (or whatever the proxy expects) | Port the host binds |
| `COOKIE_SECURE` | `true` | Required for the auth cookie to survive over HTTPS |
| `CORS_ORIGINS` | `["https://your-study.example.org"]` | Allow-list the public origin participants will hit |
| `SECRET_KEY` | Strong random value | Generate with `openssl rand -hex 32` |
| `ADMIN_PASSWORD` | Strong random value | Used for the seeded admin account |

Put a TLS-terminating reverse proxy (nginx, Caddy, or Cloudflare
Tunnel) in front of the frontend container. Do not expose the backend
container directly. The frontend's nginx already proxies `/api` to
it.

A cloud VM with 1 vCPU and 4 GB RAM (DigitalOcean, Linode, AWS
t3.medium, equivalent elsewhere) handles a 30-participant study
comfortably. Studies above that scale should bump the VM tier.

## Where to go next

- [**Quick Start**](./quick-start). Bring the stack up locally in
  five minutes.
- [**Per-Group Device Routing**](../concepts/device-routing). Read
  why participant viewport must match the group's device class.
- [**Architecture Overview**](../concepts/architecture). Read what
  each of the four containers does.
