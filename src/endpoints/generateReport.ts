import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { getSession } from "../sessionStore";

export class GenerateReport extends OpenAPIRoute {
	schema = {
		tags: ["Interview"],
		summary: "Generate interview coaching report",
		request: {
			params: z.object({
				sessionId: z.string(),
			}),
		},
		responses: {
			"200": {
				description: "Interview report",
				content: {
					"application/json": {
						schema: z.object({
							strengths: z.array(z.string()),
							weaknesses: z.array(z.string()),
							missedOpportunities: z.array(z.string()),
							actionPlan: z.array(z.string()),
							averageScore: z.number(),
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
		const { sessionId } = c.req.param();

		const session = getSession(sessionId);

		if (!session) {
			return c.json(
				{ error: "Session not found." },
				404
			);
		}

		const history = session.history || [];

		const totalAnswers = history.length;

		const totalScore = history.reduce((sum, item) => sum + item.score, 0);

		const averageScore =
			totalAnswers > 0 ? Math.round(totalScore / totalAnswers) : 0;

		// Simple logic for now (we'll improve later with AI)
		const strengths: string[] = [];
		const weaknesses: string[] = [];
		const missedOpportunities: string[] = [];

		if (averageScore >= 7) {
			strengths.push("Strong overall communication");
		} else {
			weaknesses.push("Answers lack clarity or depth");
		}

		if (history.some((h) => h.answer.length < 100)) {
			missedOpportunities.push("Some answers were too brief");
		}

		const actionPlan = [
			"Use structured answers (e.g. STAR method)",
			"Include measurable outcomes",
			"Highlight your individual contribution clearly",
		];

		return c.json({
			strengths,
			weaknesses,
			missedOpportunities,
			actionPlan,
			averageScore,
		});
	}
}