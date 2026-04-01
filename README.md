# cf_ai_interview_copilot

## Overview

Interview Copilot is an AI-powered mock interview coach built on Cloudflare Workers.  
It simulates a structured interview experience, providing real-time feedback, rubric-based scoring, answer improvement, and a final coaching report.

The goal is to move beyond a generic chatbot and create a stateful, role-aware interview system that feels like a real product.

---

## Features

- Role-based mock interviews:
  - Software Engineer  
  - Product Manager  
  - Data Scientist  

- Structured interview flow:
  - 5 questions per session  
  - Progress tracking ("Question X of 5")  

- Rubric-based evaluation:
  - Role-specific scoring dimensions  
  - Real-time feedback after each answer  

- AI-powered answer improvement:
  - Uses Workers AI (Llama 3.3)  
  - Rewrites weak answers into stronger, structured responses  

- Interview debrief report:
  - Strengths  
  - Weaknesses  
  - Missed opportunities  
  - Action plan  
  - Average score  

---

## Architecture

This project uses Cloudflare’s platform as follows:

### Workers (Core API + UI)
Handles all API routes and serves the frontend using Hono and Chanfana.

### Workers AI (LLM)
Used in `/api/answer/improve` with the model `@cf/meta/llama-3.3-70b-instruct` to generate feedback and improved answers.

### State / Memory
Session-based interview state stored in memory, tracking progress, answers, and scores.

### Workflow Logic
Handled through API endpoints controlling the interview lifecycle.

---

## API Endpoints

- POST /api/session/start  
- POST /api/chat  
- POST /api/answer/improve  
- GET /api/session/:sessionId  
- GET /api/session/:sessionId/report  

---

## Local Development

Install dependencies:

npm install

Run locally:

npm run dev

Open:

http://localhost:8787

---

## Deployment

npx wrangler deploy

---

## Design Decisions

- Structured interview flow instead of chat UX  
- Role-specific rubrics for realism  
- Combination of deterministic scoring and AI enhancement  
- Single-page UI served directly from the Worker  

---

## Repository Requirement

Repository name: cf_ai_interview_copilot

---

## Notes

This project focuses on building a realistic AI-powered interview coaching experience using Cloudflare’s edge infrastructure.
