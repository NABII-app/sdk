import * as stackTraceParser from "stacktrace-parser";
import en from "@v1/lang/en/error.json";
import fr from "@v1/lang/fr/error.json";
import { AxiosError } from "axios";
import type { INabiiCustomError, ILanguage } from "@v1/types/nabii";

/**
 * ####  🏴‍☠️ Nabii SDK object of errors 🏴‍☠️
 */
export const errors = (<const>{ fr, en }) satisfies {
	readonly [key in ILanguage]: Record<string, string>;
};

/**
 * ####  🏴‍☠️ Nabii SDK error object 🏴‍☠️
 * @example
 * ```tsx
 * import { NabiiError } from "nabii-sdk";
 *
 * try {
 * 	// do some nabii stuff!
 * } catch (err) {
 * 	if (err instanceof NabiiError) {
 * 		if (err.response) {
 * 			// get error message!
 * 			console.log(err.response.data);
 * 		} else {
 * 			console.log("No internet connection!");
 * 		}
 * 	}
 * }
 * ```
 */
export class NabiiError extends AxiosError<string, string> {
	constructor(error: AxiosError<string, string>) {
		super(
			error.message,
			error.code,
			error.config,
			error.request,
			error.response,
		);
		Object.setPrototypeOf(this, NabiiError.prototype);
		this.name = "NabiiError";
	}
}

/**
 * ####  Parse the error key as string message
 * @param key the key of the error: {@link INabiiCustomError}
 * @param lang the language of the error message: {@link ILanguage}
 * @param payload the error message `payloads`
 * @returns {Error} the matching error
 */
export function errorParser(
	key: INabiiCustomError,
	lang: ILanguage,
	payload: Record<string, unknown> = {},
): Error {
	const error = new Error();
	let data = errors[lang][key];
	Object.entries(payload).forEach(([key, value]) => {
		data = data.replaceAll(`{${key}}`, `${value}`);
	});
	const stacks = stackTraceParser.parse(error.stack!);
	for (let i = 0; i < stacks.length; i++) {
		const stack = stacks[i]!;
		if (!stack?.file?.includes("sdk\\dist\\.")) {
			const file = stack
				? ` (file:"${stack.file}:${stack.lineNumber}:${stack?.column}")`
				: "";
			return new Error(`${data}${file}`);
		}
	}
	return new Error(key);
}
