import type { Platform } from "@/v1/config";
import type { IUser } from "@v1/modules/user/user";

export type {
	IUser,
	IEmailSentResult,
	IUserUpdatedResult,
} from "@v1/modules/user/user";
/**
 * ####  The email subject JWT token format
 * This type represents the possible email subjects for JWT tokens.
 *
 * #####  Possible Values:
 * - `forgotPassword`: Page for resetting password.
 * - `activateAccount`: Page for validating the new email.
 * - `activateAccountInvite`: Page for setting a password.
 *
 * @example
 * ```tsx
 * const subject: IEmailSubject = "forgotPassword";
 * ```
 *
 * @since v1.0.0
 */
export declare type IEmailSubject =
	| "forgotPassword"
	| "activateAccount"
	| "activateAccountInvite";

/**
 * This type represents the response type of a check token request.
 *
 * @since v1.0.13
 */
export declare type ICheckTokenResponseType =
	| {
			/**
			 * the token is not valid...
			 */
			tokenIsValid: false;
			/**
			 * ...so the user response is `null`
			 */
			user: null;
	  }
	| {
			/**
			 * the token is valid...
			 */
			tokenIsValid: true;
			/**
			 * ...so the user object contain the user important information
			 */
			user: Pick<
				IUser<Platform.APPLICATION>,
				"firstName" | "lastName" | "email"
			>;
	  };

/**
 * A unique symbol used to brand instances as `Logged`.
 *
 * @since v1.0.0
 */
declare const loggedBrand: unique symbol;

/**
 * Interface representing an instance with the `Logged` brand.
 * This can be used to mark class instances as logged.
 *
 * @since v1.0.0
 */
export declare interface ILogged {
	[loggedBrand]?: true;
}

/**
 * Type utility to check if a class instance contains the `Logged` brand.
 *
 * @template T - The type to check for the `Logged` brand.
 *
 * @since v1.0.0
 */
export declare type IIsLogged<T> = import("@v1/types/utils").IIsBranded<
	T,
	typeof loggedBrand
>;

/**
 * The list of strategy names used to authenticate users with SSO.
 * - `google` *(implemented)* : the strategy used to authenticate with [Google SSO](https://console.developers.google.com/).
 * - `facebook` *(implemented)* : the strategy used to authenticate with [Facebook SSO](https://developers.facebook.com/).
 * - `apple` *(not implemented)* : the strategy used to authenticate with [Apple SSO](https://developer.apple.com/account/).
 */
export declare type IStrategyName = "google" | "facebook" | "apple";

/**
 * ####  ✨ List of {@link NabiiV1} authentication module types ✨:
 * - {@link IEmailSubject}
 * - {@link IStrategyName}
 * ---------------------------
 * Do you have ideas or recommendations for improvement?
 *  * @author Ulysse Dupont -->
 *  [Email](mailto:ulyssedupont2707@gmail.com)
 *  | [Github](https://github.com/Dulysse)
 *  | [LinkedIn](https://www.linkedin.com/in/ulysse-dupont)
 * @since v1.0.0
 */
export declare namespace IAuthTypes {
	export { IEmailSubject };
	export { IStrategyName };
}
