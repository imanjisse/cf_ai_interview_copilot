import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { getSession } from "../sessionStore";

export class SessionFetch extends OpenAPIRoute {
	schema = {
		tags: ["Interview"],
		summary: "Get a saved interview session",
		request: {
			params: z.object({
				sessionId: z.string(),
			}),
		},
		responses: {
			"200": {
				description: "Session found",
			},
			"404": {
				description: "Session not found",
			},
		},
	};

	async handle(c: any) {
		const data = await this.getValidatedData<typeof this.schema>();
		const sessionId = data.params.sessionId;

		const session = getSession(sessionId);

		if (!session) {
			return c.json(
				{
					error: "Session not found",
				},
				404,
			);
		}

		return c.json(session);
	}
}
