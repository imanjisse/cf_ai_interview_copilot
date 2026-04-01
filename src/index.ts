import { fromHono } from "chanfana";
import { Hono } from "hono";
import { GenerateReport } from "./endpoints/generateReport";
import { ImproveAnswer } from "./endpoints/improveAnswer";
import { SessionStart } from "./endpoints/sessionStart";
import { ChatReply } from "./endpoints/chatReply";
import { SessionFetch } from "./endpoints/sessionFetch";

const app = new Hono<{ Bindings: Env }>();

const openapi = fromHono(app, {
  docs_url: "/docs",
});

openapi.post("/api/session/start", SessionStart);
openapi.post("/api/chat", ChatReply);
openapi.get("/api/session/:sessionId", SessionFetch);
openapi.get("/api/session/:sessionId/report", GenerateReport);
openapi.post("/api/answer/improve", ImproveAnswer);

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    app: "interview-copilot",
  });
});

app.get("/", (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Interview Copilot</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 900px;
      margin: 40px auto;
      padding: 0 20px;
      background: #f7f7f8;
      color: #111;
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
    }
    h1, h2 {
      margin-top: 0;
    }
    select, textarea, button {
      width: 100%;
      padding: 12px;
      margin-top: 10px;
      margin-bottom: 12px;
      border-radius: 10px;
      border: 1px solid #ccc;
      font-size: 14px;
      box-sizing: border-box;
    }
    textarea {
      min-height: 140px;
      resize: vertical;
      position: relative;
      z-index: 1;
    }
    button {
      cursor: pointer;
      border: none;
      position: relative;
      z-index: 2;
      background: #111;
      color: white;
    }
    button.secondary {
      background: #444;
    }
    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 10px;
    }
    .pill {
      display: inline-block;
      padding: 6px 10px;
      border-radius: 999px;
      background: #eee;
      margin: 4px 6px 0 0;
      font-size: 13px;
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      background: #f1f1f1;
      padding: 12px;
      border-radius: 10px;
    }
  </style>
</head>
<body>
  <h1>Interview Copilot</h1>

  <div class="card">
    <h2>Start Mock Interview</h2>
    <label for="role">Choose a role</label>
    <select id="role">
      <option>Software Engineer</option>
      <option>Product Manager</option>
      <option>Data Scientist</option>
    </select>
    <button type="button" id="startBtn">Start Interview</button>
  </div>

  <div class="card">
    <h2>Interview Session</h2>
    <div><strong>Session ID:</strong> <span id="sessionId">Not started</span></div>
    <div><strong>Progress:</strong> <span id="progress">Question 0 of 5</span></div>
    <div><strong>Current Question:</strong></div>
    <pre id="question">Start a session to begin.</pre>
  </div>

  <div class="card">
    <h2>Your Answer</h2>
    <textarea id="answer" placeholder="Type your interview answer here..."></textarea>
    <div class="row">
      <button type="button" id="submitBtn">Submit Answer</button>
      <button type="button" class="secondary" id="improveBtn">Improve My Answer</button>
    </div>
  </div>

  <div class="card">
    <h2>Feedback</h2>
    <pre id="feedback">No feedback yet.</pre>
    <div><strong>Score:</strong> <span id="score">-</span></div>
    <div><strong>Total Score:</strong> <span id="totalScore">-</span></div>
    <div><strong>Rubric Scores:</strong></div>
    <div id="rubricScores"></div>
  </div>

  <div class="card">
    <h2>Improved Answer</h2>
    <pre id="improvedAnswer">No improved answer yet.</pre>
  </div>

  <div class="card">
    <h2>Interview Debrief</h2>
    <button type="button" id="reportBtn">Generate Report</button>
    <pre id="report">No report yet.</pre>
  </div>

  <script>
    let currentSessionId = "";
    let currentRole = "";
    let currentQuestion = "";
    let questionCount = 0;
    const maxQuestions = 5;

    const sessionIdEl = document.getElementById("sessionId");
    const progressEl = document.getElementById("progress");
    const questionEl = document.getElementById("question");
    const answerEl = document.getElementById("answer");
    const feedbackEl = document.getElementById("feedback");
    const scoreEl = document.getElementById("score");
    const totalScoreEl = document.getElementById("totalScore");
    const rubricScoresEl = document.getElementById("rubricScores");
    const improvedAnswerEl = document.getElementById("improvedAnswer");
    const reportEl = document.getElementById("report");

    function formatLabel(key) {
      return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
    }

    document.getElementById("startBtn").addEventListener("click", async () => {
      const roleEl = document.getElementById("role");
      const role = roleEl.value;
      currentRole = role;

      const res = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (!res.ok) {
        feedbackEl.textContent = "Failed to start session: " + JSON.stringify(data, null, 2);
        return;
      }

      currentSessionId = data.sessionId;
      currentQuestion = data.firstQuestion;
      questionCount = 1;

      sessionIdEl.textContent = currentSessionId;
      progressEl.textContent = "Question " + questionCount + " of " + maxQuestions;
      questionEl.textContent = currentQuestion;
      feedbackEl.textContent = "Session started. Submit your first answer.";
      scoreEl.textContent = "-";
      totalScoreEl.textContent = "0";
      rubricScoresEl.innerHTML = "";
      improvedAnswerEl.textContent = "No improved answer yet.";
      reportEl.textContent = "No report yet.";
      answerEl.value = "";
    });

    document.getElementById("submitBtn").addEventListener("click", async () => {
      if (!currentSessionId) {
        alert("Start a session first.");
        return;
      }

      const answer = answerEl.value.trim();
      if (!answer) {
        alert("Write an answer first.");
        return;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: currentSessionId,
          role: currentRole,
          answer,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        feedbackEl.textContent = "Submit failed: " + JSON.stringify(data, null, 2);
        return;
      }

      feedbackEl.textContent = data.feedback;
      scoreEl.textContent = String(data.score);
      totalScoreEl.textContent = String(data.totalScore);
      currentQuestion = data.nextQuestion;
      questionCount = data.questionCount;
      questionEl.textContent = currentQuestion;

      if (questionCount <= maxQuestions) {
        progressEl.textContent = "Question " + questionCount + " of " + maxQuestions;
      } else {
        progressEl.textContent = "Mock interview complete";
      }

      rubricScoresEl.innerHTML = "";
      if (data.rubricScores) {
        Object.entries(data.rubricScores).forEach(([key, value]) => {
          const pill = document.createElement("span");
          pill.className = "pill";
          pill.textContent = formatLabel(key) + ": " + value;
          rubricScoresEl.appendChild(pill);
        });
      }

      answerEl.value = "";
    });

    document.getElementById("improveBtn").addEventListener("click", async () => {
      if (!currentRole) {
        alert("Start a session first.");
        return;
      }

      const answer = answerEl.value.trim();
      if (!answer) {
        alert("Write an answer first.");
        return;
      }

      improvedAnswerEl.textContent = "Improving your answer...";

      try {
        const res = await fetch("/api/answer/improve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: currentRole,
            question: currentQuestion,
            answer,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          improvedAnswerEl.textContent = "Error: " + JSON.stringify(data, null, 2);
          return;
        }

        improvedAnswerEl.textContent =
          "Feedback:\\n" +
          data.feedback +
          "\\n\\nImproved Answer:\\n" +
          data.improvedAnswer;
      } catch (error) {
        improvedAnswerEl.textContent = "Request failed. Check the improve answer endpoint.";
        console.error(error);
      }
    });

    document.getElementById("reportBtn").addEventListener("click", async () => {
      if (!currentSessionId) {
        alert("Start a session first.");
        return;
      }

      const res = await fetch("/api/session/" + currentSessionId + "/report");
      const data = await res.json();

      if (!res.ok) {
        reportEl.textContent = "Report failed: " + JSON.stringify(data, null, 2);
        return;
      }

      reportEl.textContent = JSON.stringify(data, null, 2);
    });
  </script>
</body>
</html>`);
});

export default app;