import { z } from "zod";
import { languages, modes, configV1 } from "@v1/config";
/**
 * Zod schema with all allowed languages
 */
export const languageSchema = z.nativeEnum(languages);

function transformUrl(url: string): string {
	const newUrl = url.replace(/\\/g, "/");
	if (newUrl.endsWith("/") || newUrl.endsWith("\\")) {
		return transformUrl(newUrl.slice(0, -1));
	}
	return newUrl;
}

/**
 * Zod schema for url format
 */
export const urlSchema = z.string().url().transform(transformUrl);

/**
 * Zod schema with all allowed modes
 */
export const modeSchema = z.nativeEnum(modes);
/**
 * Zod credentials schema for safe credential validation
 */
export const credentialSchema = z.object({
	accessToken: z.string().trim(),
	refreshToken: z.string().trim(),
	user: z.object({
		id: z.number(),
		firstName: z.string(),
		lastName: z.string(),
		avatar: z.string().url(),
		email: z.string().trim().email(),
		role: z.nativeEnum({ ...configV1.roles }),
		firebaseToken: z.string().trim().nullable(),
		lastConnection: z.string().datetime().nullable(),
		isActivated: z.boolean(),
	}),
});
