export type Role = "Software Engineer" | "Product Manager" | "Data Scientist";

export type InterviewTurn = {
	question: string;
	answer: string;
	feedback: string;
	score: number;
};

export type InterviewSession = {
	sessionId: string;
	role: Role;
	currentQuestion: string;
	questionCount: number;
	totalScore: number;
	history: InterviewTurn[];
	createdAt: string;
};

const sessions = new Map<string, InterviewSession>();

export function createSession(sessionId: string, role: Role, firstQuestion: string): InterviewSession {
	const session: InterviewSession = {
		sessionId,
		role,
		currentQuestion: firstQuestion,
		questionCount: 1,
		totalScore: 0,
		history: [],
		createdAt: new Date().toISOString(),
	};

	sessions.set(sessionId, session);
	return session;
}

export function getSession(sessionId: string): InterviewSession | undefined {
	return sessions.get(sessionId);
}

export function updateSession(
	sessionId: string,
	update: {
		question: string;
		answer: string;
		feedback: string;
		score: number;
		nextQuestion: string;
	},
): InterviewSession | undefined {
	const session = sessions.get(sessionId);

	if (!session) {
		return undefined;
	}

	session.history.push({
		question: update.question,
		answer: update.answer,
		feedback: update.feedback,
		score: update.score,
	});

	session.totalScore += update.score;
	session.questionCount += 1;
	session.currentQuestion = update.nextQuestion;

	sessions.set(sessionId, session);
	return session;
}
