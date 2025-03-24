import { modulesV1 } from "@v1/modules/.";
import { BaseV1 } from "@v1/base";
import { type ILoadModules, WithModules } from "@v1/mixins";
import type { ConfigV1 } from "@v1/config";
import { languageSchema, urlSchema, modeSchema } from "@v1/schemas";
import { errorParser, NabiiError } from "@v1/error";
import type { ILanguage, IMode } from "@v1/types/nabii";
import type { IUnpackEventFunction } from "@v1/types/utils";

/**
 * ####  🏴‍☠️ Nabii API V1 🏴‍☠️
 * @class {@link NabiiV1}
 * @modules {@link modulesV1}
 * @version 1.0.0
 * @extends {BaseV1}
 */
@WithModules(modulesV1)
export class NabiiV1 extends BaseV1 {
	/**
	 * @constructor Initialize axios hooks
	 */
	constructor() {
		super();
		this._initAxiosHooks();
		this._initSocket();
	}
	/**
	 * @public
	 * `🌐 GLOBAL 🌐`
	 * ####  🏓 Attempt to reach {@link NabiiV1} API with current `url`  🏓
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * if (!(await nabii.v1.resolve())) {
	 * 	console.log("Can't reach the server!");
	 * }
	 * ```
	 * @returns the {@link NabiiV1} resolve status
	 * @since v1.0.0
	 */
	public async resolve(): Promise<boolean> {
		try {
			await this._axios.get("/ping");
			return true;
		} catch (error) {
			return error instanceof NabiiError && !!error.response;
		}
	}
	/**
	 * @public
	 * `🌐 GLOBAL 🌐`
	 * ####  ⛔️ Set {@link NabiiV1} error callback function ⛔️
	 * @param callback your callback function that never return (throw an error)
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 *	nabii.v1.onError((_) => {
	 *		if (err.response) {
	 *			console.log(err.response.data);
	 *		} else {
	 *			console.log("No internet connection!");
	 *		}
	 *	});
	 * ```
	 * @default (_) => void 0;
	 * @returns the {@link NabiiV1} instance updated
	 * @since v1.0.0
	 */
	public onError(
		callback: (this: ConfigV1, err: NabiiError) => void | Promise<void>,
	): this {
		this._config.errorHandler = callback;
		return this;
	}
	/**
	 * @public
	 * `🌐 GLOBAL 🌐`
	 * ####  🔠 Get {@link NabiiV1} response `language` 🔠
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const language = nabii.v1.getLang();
	 * console.log(language); // "fr"
	 * ```
	 * @default "fr"
	 * @returns the current {@link NabiiV1} error {@link ILanguage}
	 * @since v1.0.0
	 */
	public getLang(): ILanguage {
		return this._config.lang;
	}
	/**
	 * @public
	 * `🌐 GLOBAL 🌐`
	 * ####  🔠 Set {@link NabiiV1} response `language` 🔠
	 * @param language {@link NabiiV1} {@link ILanguage} to use
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * nabii.v1.setLang("fr");
	 * console.log(nabii.getLang()); // "fr"
	 * ```
	 * @default "fr"
	 * @returns the {@link NabiiV1} instance updated
	 * @since v1.0.0
	 */
	public setLang(language: ILanguage): this {
		try {
			this._config.lang = languageSchema.parse(language);
			return this;
		} catch (_) {
			throw errorParser("invalid_language", this._config.lang, { language });
		}
	}
	/**
	 * @public
	 * `🌐 GLOBAL 🌐`
	 * ####  🖥 Get {@link NabiiV1} server `URL` 🖥
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const url = nabii.v1.getUrl();
	 * console.log(url); // "https://server.com"
	 * ```
	 * @default "http://localhost:1338"
	 * @returns the current {@link NabiiV1} instance `URL`
	 * @since v1.0.0
	 */
	public getUrl(): string {
		return this._config.url;
	}
	/**
	 * @public
	 * `🌐 GLOBAL 🌐`
	 * ####  🖥 Set {@link NabiiV1} server `URL` 🖥
	 * @param url {@link NabiiV1} new server URL
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * nabii.v1.setUrl("https://server2.com");
	 * console.log(nabii.getUrl()); // "https://server2.com"
	 * ```
	 * @default "http://localhost:1338"
	 * @returns the {@link NabiiV1} instance updated
	 * @since v1.0.0
	 */
	public setUrl(url: string): this {
		try {
			this._config.url = urlSchema.parse(url);
			this._resetSocket();
			return this;
		} catch (_) {
			throw errorParser("invalid_url", this._config.lang, { url });
		}
	}
	/**
	 * @public
	 * `🌐 GLOBAL 🌐`
	 * ####  🔧 Get {@link NabiiV1} header `mode` 🔧
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const mode = nabii.v1.getMode();
	 * console.log(mode); // "production"
	 * ```
	 * @default "production"
	 * @returns the current {@link NabiiV1} instance {@link IMode}
	 * @since v1.0.0
	 */
	public getMode(): IMode {
		return this._config.mode;
	}
	/**
	 * @public
	 * `🌐 GLOBAL 🌐`
	 * ####  🔧 Set {@link NabiiV1} headers `mode` for unit test 🔧
	 * @param mode {@link NabiiV1} API {@link IMode}
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * nabii.v1.setMode("test");
	 * console.log(nabii.getMode()); // "test"
	 * ```
	 * @default "production"
	 * @returns the {@link NabiiV1} instance updated
	 * @since v1.0.0
	 */
	public setMode(mode: IMode): this {
		try {
			this._config.mode = modeSchema.parse(mode);
			return this;
		} catch (_) {
			throw errorParser("invalid_mode", this._config.lang, { mode });
		}
	}
	/**
	 * @public
	 * `🌐 GLOBAL 🌐`
	 * ####  📳 Add a custom {@link NabiiV1} `event` listener 📳
	 * @param eventName the target {@link TEventName}
	 * @default "login" | "refresh" | "logout"
	 * @param callback the callback `function` linked to the {@link TEventName}
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * nabii.v1.addEventListener("login", ({ user }) => {
	 * 	 console.log(`Hello ${user.email}!`);
	 * });
	 * ```
	 * @returns the {@link NabiiV1} instance updated
	 * @since v1.0.0
	 */
	public addEventListener<
		T extends ConfigV1["eventListener"] = ConfigV1["eventListener"],
		TEventName extends keyof T = keyof T,
	>(
		eventName: TEventName,
		callback: IUnpackEventFunction<T[TEventName]>,
	): this {
		this._config.eventListener[
			eventName as keyof typeof this._config.eventListener
		].push(callback as () => void | Promise<void>);
		return this;
	}
	/**
	 * @public
	 * `🌐 GLOBAL 🌐`
	 * ####  📴 Remove a custom {@link NabiiV1} `event` listener 📴
	 * @param eventName the target {@link TEventName}
	 * @default "login" | "refresh" | "logout"
	 * @param callback the callback function linked to the {@link TEventName}
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * nabii.v1.removeEventListener("login", ({ user }) => {
	 * 	 console.log(`Hello ${user.email}!`);
	 * });
	 * ```
	 * @returns the {@link NabiiV1} instance updated
	 * @since v1.0.0
	 */
	public removeEventListener<
		T extends ConfigV1["eventListener"] = ConfigV1["eventListener"],
		TEventName extends keyof T = keyof T,
	>(
		eventName: TEventName,
		callback: IUnpackEventFunction<T[TEventName]>,
	): this {
		this._config.eventListener[
			eventName as keyof typeof this._config.eventListener
		].splice(
			this._config.eventListener[
				eventName as keyof typeof this._config.eventListener
			].indexOf(callback as () => void | Promise<void>),
			1,
		);
		return this;
	}
	/**
	 * @public
	 * `🌐 GLOBAL 🌐`
	 * ####  📚 Get all custom {@link NabiiV1} `event` listener} 📚
	 * @param eventName the target {@link TEventName}
	 * @default "login" | "refresh" | "logout"
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const events = nabii.v1.listEventListener("login"); // [...]
	 * ```
	 * @returns the array of all event `functions` from {@link TEventName}
	 * @since v1.0.0
	 */
	public listEventListeners<
		T extends ConfigV1["eventListener"] = ConfigV1["eventListener"],
		TEventName extends keyof T = keyof T,
	>(eventName: TEventName): T[TEventName] {
		return this._config.eventListener[
			eventName as keyof typeof this._config.eventListener
		] as T[TEventName];
	}
}

export declare interface NabiiV1 extends ILoadModules<typeof modulesV1> {}
