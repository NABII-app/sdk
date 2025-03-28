import { Axios, SocketIo } from "@/instances";
import { NabiiError, errorParser } from "@v1/error";
import { Platform, configV1 } from "@v1/config";
import { credentialSchema } from "@v1/schemas";
import { PushNotifications } from "@capacitor/push-notifications";
import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import type { ICredentials, IRefreshTokenResult } from "@v1/types/nabii";
import type { IUnpackEventParam } from "@v1/types/utils";
import { AxiosError } from "axios";

/**
 * ####  🏴‍☠️ {@link BaseV1} class for {@link NabiiV1} 🏴‍☠️
 * - List of `global` and `protected` SDK `methods` and `properties` of {@link NabiiV1}
 */
export abstract class BaseV1 {
	protected readonly _axios = Axios.v1;
	protected readonly _config = configV1;
	protected _initAxiosHooks(): void {
		this._axios.interceptors.request.use(config => {
			config.url = `${this._config.url}${config.url}`;
			config.responseType = "json";
			if ("accessToken" in this._config.credentials) {
				config.headers["Authorization"] =
					`Bearer ${this._config.credentials.accessToken}`;
			}
			config.headers.lang = this._config.lang;
			config.headers.mode = this._config.mode;
			return config;
		});
		this._axios.interceptors.response.use(
			response => response.data, //*ON SUCCESS*
			async err => {
				if (
					err instanceof AxiosError &&
					err.response?.status !== 401 &&
					err.config?.url !== `${this._config.url}/`
				) {
					return this._throwError(err);
				}
				throw err instanceof AxiosError ? new NabiiError(err) : err;
			}, //!ON ERROR!
		);
	}
	protected async _throwError(err: NabiiError): Promise<never> {
		await this._config.errorHandler(err);
		throw err instanceof AxiosError ? new NabiiError(err) : err;
	}
	protected _initSocket(): void {
		this._config.socket = SocketIo.v1(this._config.url, {
			withCredentials: true,
			secure: true,
			auth: {
				token: null,
				platform: this._config.platform,
			},
			autoConnect: false,
		});
	}
	protected _updateSocketConnection(): Promise<void> {
		if ("accessToken" in this._config.credentials) {
			this._config.socket.auth = {
				token: `Bearer ${this._config.credentials.accessToken}`,
				platform: this._config.platform,
			};
			if (!this._config.allowSocket) return Promise.resolve(void 0);
			return this._connectSocket();
		} else {
			throw errorParser("missing_credentials", this._config.lang);
		}
	}
	protected _connectSocket(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this._config.socket.connect();
			this._config.socket.on("connect_error", reject);
			if (this._config.socket.connected) {
				resolve();
			} else {
				this._config.socket.on("connect_success", resolve);
			}
		});
	}
	protected _disconnectSocket(): Promise<void> {
		return new Promise(resolve => {
			this._config.socket.disconnect();
			if (this._config.socket.connected) {
				this._config.socket.on("disconnect", () => resolve());
			} else {
				resolve();
			}
		});
	}
	protected async _resetSocket(): Promise<void> {
		if (this._config.socket.connected) {
			await this._disconnectSocket();
		}
		this._initSocket();
		if (this._config.isLogged) {
			await this._updateSocketConnection();
		}
	}
	protected async _triggerEventListener<
		T extends InstanceType<IBaseV1>["_config"]["eventListener"],
		TKey extends keyof T = keyof T,
	>(eventName: TKey, ...payload: IUnpackEventParam<T[TKey]>): Promise<void> {
		const params = payload.map(p => p) as [ICredentials];
		for (const trigger of this._config.eventListener[
			eventName as keyof typeof this._config.eventListener
		]) {
			await trigger(...params);
		}
	}
	protected _refresh(): Promise<IRefreshTokenResult> {
		return new Promise((resolve, reject) => {
			const { refreshToken, accessToken } = this._config.credentials;
			if (!refreshToken || !accessToken) {
				throw errorParser("missing_credentials", this._config.lang);
			}
			this._axios
				.post<unknown, IRefreshTokenResult>("/auth/refresh", {
					refreshToken,
				})
				.then(credentials => {
					this._config.credentials = {
						...this._config.credentials,
						...credentials,
					} as ICredentials;
					this._config.isLogged = true;
					Promise.all([
						this._updateSocketConnection(),
						this._triggerEventListener("refresh", this._config.credentials),
					]).then(() => resolve(credentials));
				})
				.catch(err => {
					this._logout().then(() =>
						reject(err instanceof Error ? err : new Error(`${err}`)),
					);
				});
		});
	}
	protected async _logout(): Promise<void> {
		if (
			this._config.isLogged &&
			this._config.platform === Platform.APPLICATION
		) {
			if (this._config.allowFirebaseToken) {
				await this._disableFirebaseToken();
			}
			this._config.credentials = {};
			this._config.isLogged = false;
			this._config.socket.off();
			await this._disconnectSocket();
		}
		await this._triggerEventListener("logout");
	}
	protected async _setCredentials(
		credentials: Partial<ICredentials>,
	): Promise<IRefreshTokenResult> {
		try {
			this._config.credentials = {
				...this._config.credentials,
				...credentialSchema.partial().parse(credentials),
			} as ICredentials;
		} catch (err) {
			throw errorParser("invalid_credentials", this._config.lang, { err });
		}
		const result = await this._refresh();
		await this._checkEnableFirebaseToken();
		return result;
	}
	protected async _checkEnableFirebaseToken(): Promise<void> {
		if (this._config.allowFirebaseToken) {
			await this._enableFirebaseToken();
		}
	}
	protected async _enableFirebaseToken(): Promise<void> {
		try {
			const { receive } = await PushNotifications.requestPermissions();
			if (receive === "granted") {
				await PushNotifications.register();
				const { token: firebaseToken } = await FirebaseMessaging.getToken();
				await this._axios.patch("/user/add-token", { firebaseToken });
				this._config.firebaseToken = firebaseToken;
			} else {
				throw errorParser("firebase_granted", this._config.lang);
			}
		} catch (err) {
			if (err instanceof NabiiError) {
				throw err;
			} else {
				throw errorParser("firebase_platform", this._config.lang);
			}
		}
	}
	protected async _disableFirebaseToken(): Promise<void> {
		await this._axios.patch("/user/remove-token");
		this._config.firebaseToken = undefined;
	}
}

export declare type IBaseV1 = typeof BaseV1;
