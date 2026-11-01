# Credence AI

**AI-based Credit Risk & Loan Underwriting Platform — portfolio starter**

A polished full-stack demo for reviewing loan applications, exploring risk factors, and managing underwriting decisions.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run install:all
npm run dev
```

Open **http://localhost:5173**. The Express API runs on port **4000**. No API keys or database are required for the demo.

## Features
- Responsive React dashboard with portfolio metrics, charts, application search and filtering
- New loan application form with server-side Zod validation
- Transparent, illustrative risk scoring and factor explanations
- Loan officer review workflow (approve, flag, decline)
- CSV export
- API tests (`npm test --prefix server`)

## Important limitations
**This is a portfolio demonstration, not a deployable lending product.** The starter's risk scoring is a manually authored heuristic, **not a trained ML model**. All applicant records are synthetic, the database is **in memory** (changes disappear on server restart), and the dashboard's activity chart uses illustrative static trend values. The demo user is a placeholder: there is **no authentication, authorization, persistence, regulatory compliance, or audited decision trail**. Do not use this software to evaluate real applicants or make real credit decisions.

## Architecture
- `client/` — React, Vite, Recharts, Lucide icons, responsive CSS
- `server/` — Express, Zod validation, in-memory demo data, risk heuristic
- `ml/` — optional training starter script (see below)

## Next steps toward a serious fintech portfolio project
1. PostgreSQL + Prisma schema, migrations, and persistent application records.
2. Applicant and loan officer authentication, secure sessions, RBAC, and audit logging.
3. Train and evaluate a real credit-risk classifier using a public, appropriately licensed dataset, and expose it with FastAPI.
4. Report ROC-AUC, PR-AUC, calibration, class imbalance, subgroup performance, and feature leakage checks. Use SHAP carefully to explain model output.
5. Implement policy versioning, manual review, robust input validation, tests, Docker, and CI/CD.
6. Review privacy, fair lending, and local regulations before any real-world use.

## API
- `GET /api/health`
- `GET /api/metrics`
- `GET /api/applications`
- `POST /api/applications`
- `POST /api/analyze`
- `PATCH /api/applications/:id/status`

### Example submission
```json
{"applicant":"Alex Morgan","email":"alex@example.com","annualIncome":85000,"monthlyDebt":450,"loanAmount":25000,"termMonths":36,"creditScore":745,"employmentYears":5,"purpose":"Personal"}
```

## License
Educational demo. No warranty or financial advice.
