import { BaseV1 } from "@v1/base";
import { errorParser } from "@v1/error";
import { PushNotifications } from "@capacitor/push-notifications";

/**
 * @class {@link NotificationV1}
 * @since v1.0.0
 * @extends {BaseV1}
 */
export class NotificationV1 extends BaseV1 {
	/**
	 * `📱 SOCLE 📱`
	 * `🖥️ ADMIN 🖥️`
	 * ####  💬 Current firebase messaging push token 💬
	 * @since v1.0.0
	 * @default undefined
	 */
	public get token(): string | undefined {
		return this._config.firebaseToken;
	}
	public get addEventListener(): (typeof PushNotifications)["addListener"] {
		if (!this._config.allowFirebaseToken) {
			throw errorParser("firebase_platform", this._config.lang);
		}
		return PushNotifications.addListener;
	}
	public get removeAllListeners(): (typeof PushNotifications)["removeAllListeners"] {
		if (!this._config.allowFirebaseToken) {
			throw errorParser("firebase_platform", this._config.lang);
		}
		return PushNotifications.removeAllListeners;
	}
	/**
	 * `📱 SOCLE 📱`
	 * `🖥️ ADMIN 🖥️`
	 * ####  💬 Enable firebase messaging instance to get a push token 💬
	 * #####  *if you are working with a phone platform*
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 * import { Capacitor } from "@capacitor/core";
	 *
	 * const platform = Capacitor.getPlatform();
	 * if (platform === "ios" || platform === "android") {
	 *  await nabii.v1.Notification.enable();
	 * }
	 * ```
	 * @returns a void function
	 * @since v1.0.0
	 * @default enable=false
	 */
	public async enable(): Promise<void> {
		this._config.allowFirebaseToken = true;
		if (this._config.isLogged) {
			return this._enableFirebaseToken();
		}
	}
	/**
	 * `📱 SOCLE 📱`
	 * `🖥️ ADMIN 🖥️`
	 * ####  💬 Disabled firebase messaging 💬
	 * #####  *if you are working with a web platform*
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * // disabled notification for WEB platform!
	 * await nabii.v1.Notification.disable();
	 * ```
	 * @returns a void function
	 * @since v1.0.0
	 * @default enable=false
	 */
	public async disable(): Promise<void> {
		this._config.allowFirebaseToken = false;
		if (this._config.isLogged) {
			await this._disableFirebaseToken();
		}
	}
}
