import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { createSession, type Role } from "../sessionStore";
import { ROLE_QUESTIONS } from "../types";

export class SessionStart extends OpenAPIRoute {
  schema = {
    tags: ["Interview"],
    summary: "Start a new interview session",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              role: z.enum(["Software Engineer", "Product Manager", "Data Scientist"]),
            }),
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Session started successfully",
        content: {
          "application/json": {
            schema: z.object({
              sessionId: z.string(),
              role: z.string(),
              message: z.string(),
              firstQuestion: z.string(),
            }),
          },
        },
      },
    },
  };

  async handle(c: any) {
    const data = await this.getValidatedData<typeof this.schema>();
    const body = data.body as { role: Role };

    const sessionId = crypto.randomUUID();
    const firstQuestion = ROLE_QUESTIONS[body.role][0];

    createSession(sessionId, body.role, firstQuestion);

    return c.json({
      sessionId,
      role: body.role,
      message: "Interview session started successfully.",
      firstQuestion,
    });
  }
}