# Open Source Contribution Dashboard

Production-ready full-stack dashboard that fetches and visualizes real GitHub contribution data.

## Highlights

- Clean backend architecture: `Routes -> Controllers -> Services -> GitHub API`
- Fully integrated frontend data layer that consumes all API endpoints
- Reusable UI components with responsive SaaS-style layout
- Advanced charts: language distribution, activity trend, PR success, repo stars
- Robust error handling for invalid users, rate limits, CORS, and unavailable API
- In-memory caching for improved backend performance

## Tech Stack

### Backend

- Node.js
- Express.js
- Axios
- dotenv
- CORS
- Helmet

### Frontend

- React (Vite)
- React Router
- Axios
- Recharts

## Project Structure

```text
open-source-contribution-dashboard/
|- backend/
|  |- src/
|  |  |- config/
|  |  |- controllers/
|  |  |- middleware/
|  |  |- routes/
|  |  |- services/
|  |  |- utils/
|  |- package.json
|- frontend/
|  |- src/
|  |  |- components/
|  |  |- hooks/
|  |  |- layouts/
|  |  |- pages/
|  |  |- services/
|  |  |- utils/
|  |- package.json
|- README.md
```

## API Endpoints

- `GET /api/health`
- `GET /api/user/:username`
- `GET /api/repos/:username`
- `GET /api/contributions/:username`

## Backend Features

- Username validation and normalized response contracts
- Aggregated insights:
  - Total repos, stars, forks, watchers, open issues
  - Total PRs, merged PRs, PR success rate
  - Language percentages and raw language totals
  - Activity timeline (contributions + commits + pushes + PR events)
  - Top and recent repositories
- Caching with configurable TTL
- Centralized error middleware with status, path, timestamp
- Configurable CORS allowlist for local/dev/prod environments

## Frontend Features

- Username search with validation and quick suggestion chips
- Full API integration (`/user`, `/repos`, `/contributions`) via service layer
- Dashboard modules:
  - Profile summary
  - KPI metrics grid
  - Insights strip
  - Language pie chart + legend
  - Activity bar/line chart
  - PR success donut chart
  - Top repository stars chart
  - Recently updated repositories panel
  - Repository explorer table with filtering
- Loading skeletons, error states, and empty-state handling

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Create `.env` from `.env.example` and run:

```bash
npm run dev
```

Backend default URL: `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
```

Create `.env` from `.env.example` and run:

```bash
npm run dev
```

Frontend default URL: `http://localhost:5173`

## Environment Variables

### Backend (`backend/.env`)

- `PORT=5000`
- `FRONTEND_ORIGINS=http://localhost:5173,https://your-vercel-domain.vercel.app`
- `FRONTEND_ORIGIN_PATTERNS=^https:\\/\\/your-project-.*\\.vercel\\.app$` (optional)
- `GITHUB_API_BASE_URL=https://api.github.com`
- `GITHUB_TOKEN=` (recommended for higher API limits)
- `CACHE_TTL_SECONDS=300`
- `ACTIVITY_WINDOW_DAYS=21`

### Frontend (`frontend/.env`)

- `VITE_API_BASE_URL=http://localhost:5000`

For production, set this to your deployed backend URL.

## Deployment Notes

- Frontend can be deployed to Vercel/Netlify
- Backend can be deployed to Render/Railway
- Ensure frontend `VITE_API_BASE_URL` points to deployed backend
- Ensure backend `FRONTEND_ORIGINS` includes deployed frontend URL
