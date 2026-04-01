import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { getSession, updateSession, type Role } from "../sessionStore";
import { ROLE_RUBRICS, ROLE_QUESTIONS } from "../types";

export class ChatReply extends OpenAPIRoute {
  schema = {
    tags: ["Interview"],
    summary: "Submit an interview answer and get feedback",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              sessionId: z.string(),
              role: z.enum(["Software Engineer", "Product Manager", "Data Scientist"]),
              answer: z.string().min(1),
            }),
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Feedback and next question",
        content: {
          "application/json": {
            schema: z.object({
              feedback: z.string(),
              score: z.number(),
              rubricScores: z.record(z.string(), z.number()),
              nextQuestion: z.string(),
              questionCount: z.number(),
              totalScore: z.number(),
            }),
          },
        },
      },
      "404": {
        description: "Session not found",
      },
    },
  };

  async handle(c: any) {
    const data = await this.getValidatedData<typeof this.schema>();
    const body = data.body as {
      sessionId: string;
      role: Role;
      answer: string;
    };

    const session = getSession(body.sessionId);

    if (!session) {
      return c.json(
        {
          error: "Session not found. Start a session first.",
        },
        404,
      );
    }

    const rubric = ROLE_RUBRICS[body.role];
    const rubricScores = Object.fromEntries(
      rubric.map((item) => [item, Math.floor(Math.random() * 4) + 6]),
    );

    const answerLength = body.answer.trim().length;

    let feedback = "";
    let score = 0;

    if (answerLength < 80) {
      feedback =
        "Your answer is a bit short. Try adding more structure, specific actions you took, and a measurable outcome.";
      score = 5;
    } else if (answerLength < 200) {
      feedback =
        "Solid start. Your answer has some substance, but it would be stronger with clearer detail, stronger ownership, and a sharper result.";
      score = 7;
    } else {
      feedback =
        "Good depth. Your answer shows detail and effort. To improve further, make the impact clearer and tighten the structure.";
      score = 8;
    }

    const questionBank = ROLE_QUESTIONS[body.role];
    const nextQuestionIndex = Math.min(session.questionCount, questionBank.length - 1);
    const nextQuestion = questionBank[nextQuestionIndex];

    const updatedSession = updateSession(body.sessionId, {
      question: session.currentQuestion,
      answer: body.answer,
      feedback,
      score,
      nextQuestion,
    });

    return c.json({
      feedback,
      score,
      rubricScores,
      nextQuestion,
      questionCount: updatedSession?.questionCount ?? session.questionCount,
      totalScore: updatedSession?.totalScore ?? session.totalScore,
    });
  }
}