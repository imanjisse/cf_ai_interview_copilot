import { DateTime, Str } from "chanfana";
import type { Context } from "hono";
import { z } from "zod";

export type AppContext = Context<{ Bindings: Env }>;

export const Task = z.object({
	name: Str({ example: "lorem" }),
	slug: Str(),
	description: Str({ required: false }),
	completed: z.boolean().default(false),
	due_date: DateTime(),
});

export const ROLE_RUBRICS = {
  "Software Engineer": [
    "problemSolving",
    "debugging",
    "ownership",
    "scalability",
  ],
  "Product Manager": [
    "prioritisation",
    "tradeOffs",
    "stakeholderAlignment",
    "metrics",
  ],
  "Data Scientist": [
    "problemFraming",
    "experimentation",
    "modellingDecisions",
    "communication",
  ],
} as const;

export const RUBRIC_LABELS = {
  problemSolving: "Problem Solving",
  debugging: "Debugging",
  ownership: "Ownership",
  scalability: "Scalability",

  prioritisation: "Prioritisation",
  tradeOffs: "Trade-offs",
  stakeholderAlignment: "Stakeholder Alignment",
  metrics: "Metrics",

  problemFraming: "Problem Framing",
  experimentation: "Experimentation",
  modellingDecisions: "Modelling Decisions",
  communication: "Communication",
} as const;


export const ROLE_QUESTIONS = {
  "Software Engineer": [
    "Tell me about a technical project you worked on and the most challenging problem you solved.",
    "Describe a time you had to debug an issue or improve the performance of a system.",
    "Tell me about a time you had to make a trade-off between speed, simplicity, and scalability.",
    "Describe a situation where you collaborated with others to deliver a technical solution.",
    "Tell me about a time you learned a new tool, framework, or concept quickly to solve a problem.",
  ],
  "Product Manager": [
    "Tell me about a time you had to balance user needs, business goals, and technical constraints.",
    "How would you prioritise competing feature requests from different stakeholders?",
    "Describe a time you used data to influence a product decision.",
    "Tell me about a time you handled disagreement between stakeholders or teams.",
    "Describe a product improvement you would propose and how you would measure success.",
  ],
  "Data Scientist": [
    "Tell me about a project where you used data to solve a real problem and explain your approach.",
    "How would you explain the trade-off between model accuracy and interpretability to a non-technical stakeholder?",
    "Describe a time you worked with messy or incomplete data and how you handled it.",
    "Tell me about a time you had to choose between multiple modelling approaches.",
    "Describe how you would communicate a data-driven recommendation to a business audience.",
  ],
} as const;