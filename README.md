# Open Source Contribution Dashboard

Production-ready full-stack dashboard to fetch and visualize GitHub contribution analytics.

## Features

- Real GitHub data (user profile, repositories, pull requests, activity, languages)
- Clean backend architecture: `Routes -> Controllers -> Services -> GitHub API`
- Reusable frontend component system
- Interactive charts for language distribution, activity trend, and PR success rate
- Strong error handling for invalid users, GitHub API errors, and rate limits
- Responsive SaaS-style dashboard UI

## Tech Stack

- Backend: Node.js, Express, Axios, CORS, Helmet, dotenv
- Frontend: React (Vite), React Router, Axios, Recharts

## Project Structure

```text
open-source-contribution-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── README.md
```

## API Endpoints

- `GET /api/health`
- `GET /api/user/:username`
- `GET /api/repos/:username`
- `GET /api/contributions/:username`

### Example Contributions Response

```json
{
  "success": true,
  "data": {
    "user": {
      "login": "octocat",
      "name": "The Octocat"
    },
    "metrics": {
      "totalRepos": 8,
      "totalStars": 140,
      "totalPRs": 32,
      "mergedPRs": 21,
      "prSuccessRate": 65.63
    },
    "languages": [
      { "name": "JavaScript", "value": 42.5 }
    ],
    "activityByDate": [
      { "date": "2026-04-01", "contributions": 3 }
    ],
    "topRepositories": []
  }
}
```

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Environment Variables

### Backend (`backend/.env`)

- `PORT=5000`
- `FRONTEND_ORIGIN=http://localhost:5173`
- `GITHUB_API_BASE_URL=https://api.github.com`
- `GITHUB_TOKEN=` (optional but recommended to avoid low rate limits)
- `CACHE_TTL_SECONDS=300`

### Frontend (`frontend/.env`)

- `VITE_API_BASE_URL=http://localhost:5000`

## Notes

- If you hit GitHub rate limits, add a personal access token to `GITHUB_TOKEN`.
- The backend includes in-memory TTL caching to reduce repeated GitHub API calls.
- UI includes loading, empty, and error states for production resilience.
