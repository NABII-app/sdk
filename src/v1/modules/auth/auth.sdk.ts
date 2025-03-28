import { Platform } from "@v1/config";
import { BaseV1 } from "@v1/base";
import { Refresh, Permission, Logged } from "@v1/decorators";
import { credentialSchema } from "@v1/schemas";
import { errorParser } from "@v1/error";
import type {
	IUser,
	IEmailSentResult,
	IEmailSubject,
	IUserUpdatedResult,
	ILogged,
	IIsLogged,
	IStrategyName,
	ICheckTokenResponseType,
} from "./auth";
import type {
	ICredentials,
	IEmptyCredentials,
	IRefreshTokenResult,
} from "@v1/types/nabii";
import type { ICreateUserForm } from "@/v1/modules/user/user";
import { useFormData } from "@/form";

/**
 * @class {@link AuthV1}
 * @since v1.0.0
 * @extends {BaseV1}
 */
export class AuthV1 extends BaseV1 {
	/**
	 * @public
	 * `📱 SOCLE 📱`
	 * ####  🔑 Get the login `href` URL to {@link NabiiV1} Oauth SSO strategy 🔑
	 * @description this URL will redirect you to the SSO provider login page, on success, the callback will be called and open the application
	 * page `/login/cb` with query params `{accessToken, refreshToken, strategy}`, then you will have to call the SDK method {@link AuthV1.setCredentials} method with the query params and finally redirect to the home page to be connected.
	 * @example
	 * ```tsx
	 * <a href={nabii.v1.Auth.strategy("google")}>Sign in with Google</a>
	 * <a href={nabii.v1.Auth.strategy("apple")}>Sign in with Apple</a>
	 * <a href={nabii.v1.Auth.strategy("facebook")}>Sign in with Facebook</a>
	 * ```
	 * @param name The strategy names used to authenticate users with SSO.
	 * - `google` *(implemented)* : the strategy used to authenticate with [Google SSO](https://console.developers.google.com/).
	 * - `facebook` *(not implemented)* : the strategy used to authenticate with [Facebook SSO](https://developers.facebook.com/).
	 * - `apple` *(not implemented)* : the strategy used to authenticate with [Apple SSO](https://developer.apple.com/account/).
	 * @returns the server URL to handle SSO login request
	 * @since v1.5.0
	 */
	public strategy(name: IStrategyName): string {
		return `${this._config.url}/auth/${name}`;
	}
	/**
	 * @public
	 * `📱 SOCLE 📱`
	 * ####  🆕 Create a new {@link NabiiV1} {@link IUser} 🆕
	 * @param data user data to create
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const user = await nabii.v1.User.Admin.create({
	 * 	firstName : "MyName",
	 *		lastName: "MyLastName",
	 *		email: "email@domain.com",
	 *		password: "my_password",
	 * }); // {...}
	 * ```
	 * @returns the created {@link IUser} object
	 * @since v1.0.0
	 */
	public async register(
		data: ICreateUserForm<Platform.APPLICATION>,
	): Promise<IUser<Platform.APPLICATION>> {
		const formData = await useFormData(data, [
			"email",
			"password",
			"firstName",
			"lastName",
			"avatar",
		]);
		return this._axios.post("/user", formData);
	}
	/**
	 * @public
	 * `📱 SOCLE 📱`
	 * ### ♻️ Callback email creation to get another email sent ♻️
	 * @param email your email address to receive an email
	 * @example
	 * ```ts
	 * await nabii.v1.Auth.callbackActivateAccount("email@domain.com"); // {...}
	 * ```
	 * @returns the object result of email receive
	 * @since v1.0.12
	 */
	public callbackActivateAccount(email: string): Promise<IEmailSentResult> {
		return this._axios.post("/auth/activate-account/callback", {
			email,
		});
	}
	/**
	 * @public
	 * `📱 SOCLE 📱`
	 * ####  🔐 Login to {@link NabiiV1} 🔐
	 * *ℹ If you are already logged in from storage, use the {@link AuthV1.setCredentials} method instead. ℹ*
	 * @param email Your {@link NabiiV1} email address
	 * @param password Your {@link NabiiV1} account password
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const { accessToken } = await nabii.v1.Auth.login(
	 * 	"email@domain.com",
	 * 	"my_password"
	 * );
	 * console.log("I am logged!");
	 * ```
	 * @returns the {@link ICredentials} object
	 * @since v1.0.0
	 */
	public login(email: string, password: string): Promise<ICredentials> {
		return new Promise((resolve, reject) => {
			this._axios
				.post<unknown, ICredentials>("/auth/login", {
					email,
					password,
				})
				.then(credentials => {
					try {
						this._config.credentials = credentialSchema.parse(credentials);
					} catch (err) {
						throw errorParser("invalid_credentials", this._config.lang, {
							err,
						});
					}
					this._config.isLogged = true;
					this._config.platform = Platform.APPLICATION;
					Promise.all([
						this._updateSocketConnection(),
						this._triggerEventListener("login", this._config.credentials),
						this._checkEnableFirebaseToken(),
					])
						.then(() => resolve(credentials))
						.catch(err =>
							this._logout().then(() =>
								reject(err instanceof Error ? err : new Error(`${err}`)),
							),
						);
				})
				.catch(reject);
		});
	}
	/**
	 * @public
	 * `📱 SOCLE 📱`
	 * ####  📡 Set credentials to {@link NabiiV1} when you're already logged in from `storage` 📡
	 * @param credentials app credentials (accessToken, refreshToken and user object: {@link ICredentials})
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const { accessToken, refreshToken, user } = storage;
	 * await nabii.v1.Auth.setCredentials({
	 * 	accessToken,
	 * 	refreshToken,
	 * 	user,
	 * });
	 * ```
	 * @returns the {@link ICredentials} `accessToken` up-to-date
	 * @since v1.0.0
	 */
	public setCredentials(
		credentials: Partial<ICredentials>,
	): Promise<IRefreshTokenResult> {
		return this._setCredentials(credentials);
	}
	/**
	 * @public
	 * `📱 SOCLE 📱`
	 * ####  📡 Get credentials when you're already logged 📡
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * if (!nabii.v1.Auth.isLogged()) {
	 * 	throw new Error("Not logged!");
	 * }
	 * const {
	 * 	accessToken,
	 * 	refreshToken,
	 * 	user
	 * } = await nabii.v1.Auth.getCredentials();
	 * ```
	 * @returns the {@link ICredentials} object
	 * @since v1.0.0
	 */
	public getCredentials(): IIsLogged<this> extends true
		? ICredentials
		: ICredentials | IEmptyCredentials {
		return this._config.credentials as IIsLogged<this> extends true
			? ICredentials
			: ICredentials | IEmptyCredentials;
	}
	/**
	 * @public
	 * `📱 SOCLE 📱`
	 * ####  🔗 Check if your are connected to {@link NabiiV1} API 🔗
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * if (nabii.v1.Auth.isLogged()) {
	 * 	console.log("I am logged!");
	 * 	const { user } = nabii.v1.Auth.getCredentials();
	 * 	console.log(`Hello ${user.firstName}!`);
	 * }
	 * ```
	 * @returns a `boolean` at true if you are logged
	 * @since v1.0.0
	 */
	public isLogged(): this is ILogged {
		return (
			this._config.isLogged && this._config.platform === Platform.APPLICATION
		);
	}
	/**
	 * @public
	 * `📱 SOCLE 📱`
	 * ####  🔗 Check if your are connected to {@link NabiiV1} API as `administrator` 🔗
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * if (nabii.v1.Auth.isAdmin()) {
	 * 	console.log("I am logged as administrator!");
	 *     const { user } = nabii.v1.Auth.getCredentials();
	 * 	console.log(`Hello ${user.firstName}!`);
	 * }
	 * ```
	 * @returns a `boolean` at true if you are logged as administrator
	 * @since v1.0.0
	 */
	public isAdmin(): this is ILogged {
		return (
			this.isLogged() &&
			!!this._config.credentials.user &&
			this._config.credentials.user.role === this._config.roles.ADMIN
		);
	}
	/**
	 * `📱 SOCLE 📱`
	 * ####  ☝️ Get connected {@link IUser} object ☝️
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const { email } = await nabii.v1.Auth.me();
	 * console.log(email); //"my-email@domain.com"
	 * ```
	 * @returns the connected {@link IUser} object
	 * @since v1.0.0
	 */
	@Logged
	@Permission(Platform.APPLICATION)
	@Refresh
	public me(): Promise<IUser<Platform.APPLICATION>> {
		return this._axios.get("/auth/me");
	}
	/**
	 * @public
	 * `📱 SOCLE 📱`
	 * ####  🛌 Logout from {@link NabiiV1} 🛌
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * await nabii.v1.Auth.logout();
	 * ```
	 * @returns a void function
	 * @since v1.0.0
	 */
	public logout(): Promise<void> {
		return this._logout();
	}
	/**
	 * @public
	 * `📱 SOCLE 📱` `🖥️ ADMIN 🖥️`
	 * ####  ♻️ Receive an email to reset your password ♻️
	 * @param email your email address to receive an email
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * await nabii.v1.Auth.forgotPassword(myEmail); // {...}
	 * ```
	 * @returns the {@link IEmailSentResult} object result of email receive
	 * @since v1.0.0
	 */
	public forgotPassword(email: string): Promise<IEmailSentResult> {
		return this._axios.post("/auth/forgot-password", { email });
	}
	/**
	 * `📱 SOCLE 📱`
	 * ####  ♻️ Callback email creation to get another email sent ♻️
	 * @param token your email link `JWT` request token
	 * @param subject the subject of the email: {@link IEmailSubject}
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * // "/auth/reset-password?token={TOKEN}";
	 * const { query } = useRouter();
	 * const { token } = query;
	 * const {tokenIsValid} = await nabii.v1.Auth.checkTokenValidity(token, "forgotPassword"); // true | false
	 * ```
	 * @returns the {@link ICheckTokenResponseType} object representing the token validity and user information.
	 * @since v1.0.0
	 */
	public checkTokenValidity(
		token: string,
		subject: IEmailSubject,
	): Promise<ICheckTokenResponseType> {
		return this._axios.get(
			`/auth/check-token?token=${token}&subject=${subject}`,
		);
	}
	/**
	 * `📱 SOCLE 📱`
	 * ####  ✅ Activate your {@link NabiiV1} account when you have changed your email ✅
	 * @param token your email link `JWT` request token with subject `"activateAccount"`
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * // "/auth/activate-account?token={TOKEN}";
	 * const { query } = useRouter();
	 * const { token } = query;
	 * if (await nabii.v1.Auth.checkTokenValidity(token, "activateAccount")) {
	 * 	 await nabii.v1.Auth.activateAccount(token); // {...}
	 * }
	 * ```
	 * @returns the {@link IUserUpdatedResult} object result of updated user
	 * @since v1.0.0
	 */
	public activateAccount(token: string): Promise<IUserUpdatedResult> {
		return this._axios.patch("/auth/activate-account", { token });
	}
	/**
	 * `📱 SOCLE 📱`
	 * ####  💾 Set your new {@link NabiiV1} account password 💾
	 * @param token your email link `JWT` request token with subject `"activateAccountInvite"`
	 * @param password the new password of your {@link NabiiV1} account
	 * - must contain at least `8 characters`
	 * - must contain a maximum of `64 characters`
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * // "/auth/set-password?token={TOKEN}";
	 * const { query } = useRouter();
	 * const { token } = query;
	 * if (await nabii.v1.Auth.checkTokenValidity(token, "activateAccountInvite")) {
	 * 	 const password = "@TestNabii1";
	 * 	 await nabii.v1.Auth.setPassword(token, password); // {...}
	 * }
	 * ```
	 * @returns the {@link IUserUpdatedResult} object result of updated user
	 * @since v1.0.0
	 */
	public setPassword(
		token: string,
		password: string,
	): Promise<IUserUpdatedResult> {
		return this._axios.patch("/auth/set-password", { token, password });
	}
	/**
	 * `📱 SOCLE 📱`
	 * ####  ♻️ Reset your {@link NabiiV1} account password ♻️
	 * @param token your email link `JWT` request token with subject `"forgotPassword"`
	 * @param newPassword the new password of your {@link NabiiV1} account
	 * - must contain at least `8 characters`
	 * - must contain a maximum of `64 characters`
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * // "/auth/reset-password?token={TOKEN}";
	 * const { query } = useRouter();
	 * const { token } = query;
	 * if (await nabii.v1.Auth.checkTokenValidity(token, "forgotPassword")) {
	 *  	const password = "@TestNabii1";
	 * 	 await nabii.v1.Auth.resetPassword(token, password); // {...}
	 * }
	 * ```
	 * @returns the {@link IUserUpdatedResult} object result of updated user
	 * @since v1.0.0
	 */
	public resetPassword(
		token: string,
		newPassword: string,
	): Promise<IUserUpdatedResult> {
		return this._axios.patch("/auth/reset-password", {
			token,
			password: newPassword,
		});
	}
}
