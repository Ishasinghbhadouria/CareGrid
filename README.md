# CareGrid • Clinical Coordination & Hospital Operations Platform

Role-based digital healthcare platform uniting **Hospital Administrators**, **Doctors**, **Patients**, and **Family Caretakers** with live OPD token queuing, real-time ResQCare ambulance dispatch tracking, EHR vault access, an AI Operations & Health Copilot, and Prometheus + Grafana observability.

## Architecture

- **Frontend (`client/`):** React 19, Vite, Tailwind CSS v4 (served via Nginx in Docker on port `8080`, or Vite dev on `5173`)
- **Backend (`server/`):** Node.js, Express, MongoDB/Mongoose (with in-memory resilience fallback), JWT auth, and `prom-client` Prometheus instrumentation on port `5050`
- **Monitoring (`monitoring/`):** Prometheus scraping `/metrics` every `10s` (`:9090`) and auto-provisioned Grafana dashboards (`:3001`)

---

## Quick Start (Docker Compose)

1. Start Docker Desktop, then run:
   ```sh
   docker compose up --build -d
   ```
2. Open services:
   - **CareGrid App:** http://localhost:8080
   - **API Health & Metrics:** http://localhost:5050/api/health · http://localhost:5050/metrics
   - **Prometheus:** http://localhost:9090
   - **Grafana:** http://localhost:3001 (default login: `admin` / `caregrid`)

---

## Local Development Setup (Without Docker)

1. Copy the backend environment template and add your MongoDB URI and JWT secret:
   ```sh
   cp server/.env.example server/.env
   ```
2. Install dependencies & run both services:
   ```sh
   # Terminal 1 — Backend
   cd server && npm install && npm run dev

   # Terminal 2 — Frontend
   cd client && npm install && npm run dev
   ```
   Open http://localhost:5173.

---

## Collaborator Workflow

Always work on feature branches rather than committing directly to `main`:

```sh
git switch main
git pull origin main
git switch -c feat/<short-description>

# make changes, commit, push branch, and open a Pull Request on GitHub
git add .
git commit -m "Describe change"
git push -u origin feat/<short-description>
```
