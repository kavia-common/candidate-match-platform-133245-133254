# Environment configuration

Set the backend API base URL for the Next.js frontend by defining:
- NEXT_PUBLIC_API_BASE_URL

Example `.env.local`:
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

This enables the frontend to call the Express mock API endpoints:
- POST /login
- POST /register
- GET /jobs
- GET /jobs/match?candidateId=...
- POST /assessments

Applicant routes implemented:
- /applicant/dashboard
- /applicant/login
- /applicant/register
- /applicant/jobs
- /applicant/assessments
