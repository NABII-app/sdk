import type { NabiiError } from "@v1/error";
import type * as SocketClient from "socket.io-client";
import type {
	ILanguage,
	ICredentials,
	IEmptyCredentials,
	IMode,
} from "@v1/types/nabii";
import type { IRoles } from "@v1/modules/user/user";

/**
 * ####  List of {@link NabiiV1} platforms
 * *Enum representing the different platforms available in the {@link NabiiV1} system.*
 */
export enum Platform {
	/**
	 * 📱 Application platform for non-administrator {@link NabiiV1} routes. 📱
	 */
	APPLICATION = "application",

	/**
	 * 🖥️ Admin platform for administrator {@link NabiiV1} routes. 🖥️
	 */
	ADMIN = "admin",
}

class ConfigV1 {
	/**
	 * ⚠️ Use `setLang()` to modify the language ⚠️
	 */
	public lang: ILanguage = "fr";
	/**
	 * ⚠️ Use `setUrl()` to modify the url ⚠️
	 */
	public url = "http://localhost:1338";
	/**
	 * ⚠️ Use `setMode()` to modify the mode ⚠️
	 */
	public mode: IMode = "production";
	public isLogged = false;
	public platform: Platform = Platform.APPLICATION;
	public allowSocket = true;
	public firebaseToken?: string;
	public allowFirebaseToken = false;
	public credentials: ICredentials | IEmptyCredentials = {};
	public errorHandler: (err: NabiiError) => void | Promise<void> = () => void 0;
	public socket!: SocketClient.Socket;
	public readonly eventListener = {
		login: [] as ((credentials: ICredentials) => void | Promise<void>)[],
		logout: [] as (() => void | Promise<void>)[],
		refresh: [] as ((credentials: ICredentials) => void | Promise<void>)[],
	};
	public get roles(): IRoles {
		return <const>{
			BANNED: 0,
			USER: 100,
			SUPERVISOR: 150,
			ADMIN: 200,
		};
	}
}

/**
 * {@link NabiiV1} configuration
 */
export const configV1 = new ConfigV1();
export type { ConfigV1 };

/**
 * ####  List of allowed {@link NabiiV1} languages
 * *An object representing the supported languages in the {@link NabiiV1} system.*
 */
export const languages = <const>{
	/**
	 * French language.
	 * @default
	 */
	FR: "fr",
	/**
	 * English language.
	 */
	EN: "en",
};

/**
 * ####  List of allowed {@link NabiiV1} languages as type
 */
export declare type ILanguages = typeof languages;

/**
 * {@link NabiiV1} API header mode for unit testing rate limiter, only test mode allowed on `localhost`
 */
export const modes = <const>{
	/**
	 * {@link modes}:
	 * - `test` mode for unit testing
	 */
	TEST: "test",
	/**
	 * {@link modes}:
	 * - `production` mode
	 * @default
	 */
	PRODUCTION: "production",
};

/**
 * {@link NabiiV1} API header mode for unit testing rate limiter, only test mode allowed on `localhost` as type
 */
export declare type IModes = typeof modes;
