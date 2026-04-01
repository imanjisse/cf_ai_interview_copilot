import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

type Role = "Software Engineer" | "Product Manager" | "Data Scientist";

export class ImproveAnswer extends OpenAPIRoute {
  schema = {
    tags: ["Interview"],
    summary: "Improve user answer with Workers AI",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              role: z.enum(["Software Engineer", "Product Manager", "Data Scientist"]),
              question: z.string(),
              answer: z.string(),
            }),
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Improved answer + feedback",
        content: {
          "application/json": {
            schema: z.object({
              feedback: z.string(),
              improvedAnswer: z.string(),
            }),
          },
        },
      },
    },
  };

  private getFallbackImprovedAnswer(role: Role, question: string): string {
    if (role === "Software Engineer") {
      if (question.includes("technical project")) {
        return "In one technical project, I worked on a system that required both structured problem-solving and careful implementation. I began by understanding the requirements and breaking the challenge into smaller parts so I could prioritise the most important issues first. The hardest part was solving a reliability problem without making the solution unnecessarily complex. I addressed this by testing different approaches, refining the implementation, and validating the result step by step. As a result, the final solution was more stable, easier to maintain, and better aligned with the project goals.";
      } else if (question.includes("debug")) {
        return "In one situation, I had to debug a problem that was affecting the reliability and performance of a system. I began by narrowing down the source of the issue, checking logs, reproducing the problem, and isolating the part of the workflow that was causing the bottleneck. Once I identified the root cause, I made targeted changes to improve efficiency and then tested the system again to confirm the fix. This improved performance, reduced errors, and gave the team more confidence in the stability of the solution.";
      } else if (question.includes("trade-off")) {
        return "In this case, I had to balance speed, simplicity, and scalability when deciding how to implement a solution. I started by identifying the immediate requirements and the likely future demands on the system. Instead of over-engineering the design, I chose an approach that was simple enough to deliver efficiently while still leaving room for future extension. I explained the trade-offs clearly, implemented the most practical option, and made sure the design could be improved later if needed. As a result, the team delivered on time without losing sight of longer-term maintainability.";
      } else if (question.includes("collaborated")) {
        return "In one project, I worked closely with others to deliver a technical solution under time and quality constraints. I made sure the team had a shared understanding of the problem, communicated progress clearly, and contributed where my technical input could unblock others. When challenges came up, I focused on keeping discussions practical and aligned with the end goal. By combining clear communication with technical ownership, we were able to deliver a solution that met the project requirements and worked effectively for the wider team.";
      } else {
        return "In this situation, I had to learn a new tool or concept quickly in order to solve a technical problem effectively. I approached it by first understanding the core principles, then applying them directly to the task rather than learning in the abstract. I tested my understanding through small experiments, asked focused questions where needed, and incorporated the new knowledge into the project step by step. As a result, I was able to adapt quickly, solve the problem successfully, and strengthen my ability to learn new technologies under pressure.";
      }
    }

    if (role === "Product Manager") {
      if (question.includes("balance user needs")) {
        return "In one situation, I had to balance user needs, business priorities, and technical constraints when shaping a product decision. I started by clarifying the problem from the user’s perspective, then considered the commercial priorities and the practical limits of implementation. I worked with stakeholders to identify the most important trade-offs and focused on the option that delivered the most value while remaining realistic for the team to execute. As a result, we moved forward with a clearer direction and a more balanced product decision.";
      } else if (question.includes("prioritise competing feature requests")) {
        return "When faced with competing feature requests, I would begin by evaluating them against user impact, business value, strategic fit, and implementation effort. I would then discuss the trade-offs with relevant stakeholders so that priorities are transparent rather than assumed. From there, I would rank the requests according to the value they create relative to their cost and urgency. This approach helps ensure that prioritisation is structured, defensible, and aligned with both product goals and delivery constraints.";
      } else if (question.includes("used data")) {
        return "In one product decision, I used data to move the discussion from opinion to evidence. I first identified the key metric that best captured the problem, then analysed relevant user behaviour to understand where the biggest opportunity or friction point lay. I used those findings to shape a recommendation and explained both the insight and its implications for the product. As a result, the team was able to make a more informed decision and focus effort where it was most likely to create impact.";
      } else if (question.includes("disagreement")) {
        return "In a situation with stakeholder disagreement, I focused first on understanding why each side held its position rather than jumping straight to a decision. I clarified the core goals, surfaced the trade-offs involved, and reframed the discussion around shared product outcomes rather than individual preferences. By grounding the conversation in evidence, user value, and delivery reality, I was able to align stakeholders on a practical path forward. This helped reduce friction and kept the team moving with greater clarity.";
      } else {
        return "If I were proposing a product improvement, I would start by identifying a clear user or business problem rather than jumping straight to a feature idea. I would define the expected benefit, assess feasibility, and explain why the change should matter to both users and the product strategy. I would also specify how success would be measured, for example through engagement, retention, conversion, or reduced friction. This creates a stronger answer because it shows problem framing, prioritisation, and outcome-focused thinking rather than just feature suggestion.";
      }
    }

    if (question.includes("used data to solve")) {
      return "In one data project, I started by defining the problem clearly and understanding what decision or outcome the analysis needed to support. I then collected and cleaned the relevant data, checked its quality, and selected an approach that was appropriate for the objective. Throughout the process, I paid attention not only to technical accuracy but also to whether the results would be meaningful and usable in practice. As a result, the final analysis produced stronger insight and supported a more informed decision.";
    } else if (question.includes("accuracy and interpretability")) {
      return "When explaining the trade-off between model accuracy and interpretability, I would frame it in terms of decision-making rather than technical detail alone. I would explain that a more complex model may achieve higher predictive performance, but a simpler model can be easier to understand, trust, and communicate to stakeholders. I would then link the choice back to the actual use case, because in some settings transparency matters more than small gains in accuracy. This demonstrates both technical understanding and the ability to communicate appropriately to a non-technical audience.";
    } else if (question.includes("messy or incomplete data")) {
      return "In one project, I had to work with messy or incomplete data before any meaningful analysis could take place. I began by identifying missing values, inconsistencies, and potential sources of bias, then applied cleaning and validation steps to improve the reliability of the dataset. Rather than treating preprocessing as a routine step, I viewed it as central to the credibility of the final result. As a result, the analysis became more robust and the eventual conclusions were much more defensible.";
    } else if (question.includes("multiple modelling approaches")) {
      return "When choosing between multiple modelling approaches, I would start by defining the objective clearly and deciding which criteria matter most, such as predictive performance, interpretability, speed, or robustness. I would compare candidate models using appropriate evaluation methods and consider not only how well they perform, but also how suitable they are for the real context in which they will be used. By making the trade-offs explicit, I can justify the final choice more effectively. This leads to a stronger answer because it shows judgement rather than simply naming techniques.";
    } else {
      return "When communicating a data-driven recommendation to a business audience, I would avoid leading with technical detail and instead focus on the decision, the evidence, and the implication. I would explain what the analysis suggests, why it matters, and what action should follow, while keeping the assumptions and limitations clear but concise. This approach makes the recommendation more persuasive and easier for non-technical stakeholders to act on. It also shows that I can translate analytical work into business value rather than leaving it at the level of technical output.";
    }
  }

  async handle(c: any) {
    const body = await c.req.json();
    const { role, question, answer } = body as {
      role: Role;
      question: string;
      answer: string;
    };

    const cleanedAnswer = answer.trim().replace(/\s+/g, " ");

    const fallbackFeedback =
      cleanedAnswer.length < 100
        ? "Your answer is too brief. Add clearer structure, explain the actions you personally took, and end with a stronger outcome."
        : "Good foundation. To improve further, make your ownership clearer, tighten the structure, and highlight the result more explicitly.";

    const fallbackImprovedAnswer = this.getFallbackImprovedAnswer(role, question);

    const prompt = `
You are an expert interview coach.

Role: ${role}
Interview question: ${question}
User's answer: ${cleanedAnswer}

Your task:
1. Give concise, specific feedback in 2-3 sentences.
2. Rewrite the answer so it is stronger, better structured, and tailored specifically to BOTH the role and the exact interview question.

Requirements for the improved answer:
- It must be different depending on the role and the exact question.
- It must sound realistic for an internship or early-career candidate.
- It should clearly show structure, ownership, and impact.
- It should not be generic or reusable across all questions.
- It should directly answer the specific question asked.

Return valid JSON only in this exact format:
{
  "feedback": "string",
  "improvedAnswer": "string"
}
`;

    try {
      const result = await c.env.AI.run("@cf/meta/llama-3.3-70b-instruct", {
        prompt,
      });

      let rawText = "";

      if (typeof result === "string") {
        rawText = result;
      } else if (result?.response) {
        rawText = result.response;
      } else {
        rawText = JSON.stringify(result);
      }

      const parsed = JSON.parse(rawText);

      return c.json({
        feedback: parsed.feedback ?? fallbackFeedback,
        improvedAnswer: parsed.improvedAnswer ?? fallbackImprovedAnswer,
      });
    } catch (error) {
      console.error("Workers AI improve answer failed:", error);

      return c.json({
        feedback: fallbackFeedback,
        improvedAnswer: fallbackImprovedAnswer,
      });
    }
  }
}
