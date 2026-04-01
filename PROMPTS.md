# PROMPTS.md

This file documents how AI was used during the development of the Interview Copilot application.

AI was used selectively to refine ideas, improve clarity, and accelerate specific parts of development.

---

## 1. Product Ideat

AI was used to refine the concept of building a structured interview coaching application, focusing on making it feel like a real product rather than a generic chatbot. This included shaping the idea of role-based interviews, question progression, and session-based state.

---

## 2. Role-Based Rubrics

AI was used to assist in refining evaluation criteria for:
- Software Engineer
- Product Manager
- Data Scientist

The final rubric structure and how it was applied within the application were implemented manually.

---

## 3. Question Bank

AI was used to help generate and refine realistic interview questions for each role. These were then selected, structured, and integrated into the application’s interview flow.

---

## 4. Improve Answer Feature

AI was used to refine the design of the “Improve Answer” feature, including how feedback should be structured and how improved answers should be presented clearly and professionally.

The feature logic, API integration, and UI behaviour were implemented independently.

---

## 5. Workers AI Prompt (Used in Application)

The following prompt is used within the application to generate feedback and improved answers:

You are an expert interview coach.

Role: ${role}  
Interview question: ${question}  
User's answer: ${answer}

Your task:
1. Provide concise feedback (2–3 sentences)
2. Rewrite the answer to be stronger, structured, and tailored to the role

Requirements:
- Must be specific to the role and question
- Must demonstrate structure, ownership, and impact
- Must sound realistic for an early-career candidate
- Do not include extra text outside JSON

Return:
{
  "feedback": "...",
  "improvedAnswer": "..."
}

---
