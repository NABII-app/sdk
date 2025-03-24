import { z } from "zod";
import { logger } from "@utils/logger";
import dotenv from "dotenv";

dotenv.config();

const googlePassword = z.string().regex(/^[a-z]{4}( [a-z]{4}){3}$/, {
	message:
		"Invalid Google App password format. It should follow the format: 'xxxx xxxx xxxx xxxx', please follow the README .env instructions",
});

const envVariables = z.object({
	// ------ REQUIRED ENVIRONMENT ------
	npm_package_version: z.string(),
	NABII_URL_V1: z.string().url(),
	LOGIN_EMAIL_V1: z.string().email(),
	LOGIN_PASSWORD_V1: z.string(),
	// ------ OPTIONAL EMAIL SMTP ENVIRONMENT ------
	GOOGLE_EMAIL_V1: z.string().optional(),
	GOOGLE_PASSWORD_V1: googlePassword.optional(),
	SMTP_EMAIL_V1: z.string().optional(),
	GOOGLE_EMAIL_BIS_V1: z.string().email().optional(),
	GOOGLE_PASSWORD_BIS_V1: googlePassword.optional(),
});

const output = envVariables.safeParse(process.env);
if (!output.success) {
	const { path, code, message } = output.error.issues[0] as z.ZodIssue;
	logger.error(
		`Incorrect environment variable: "${path[0]}", code: "${code}", message: "${message}"`,
	);
	process.kill(process.pid);
} else {
	process.env = output.data;
}

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof envVariables> {}
	}
}

export const { env } = process;

export function hasV1EnvironmentSMTP() {
	return (
		env.GOOGLE_EMAIL_V1 &&
		env.GOOGLE_PASSWORD_V1 &&
		env.SMTP_EMAIL_V1 &&
		env.GOOGLE_EMAIL_BIS_V1 &&
		env.GOOGLE_PASSWORD_BIS_V1
	);
}
