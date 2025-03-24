import { Platform } from "@v1/config";
import { BaseV1 } from "@v1/base";
import { Permission } from "@v1/decorators";
import type { IEmitEvents, IOnEvents } from "./socket";

/**
 * @class {@link SocketV1}
 * @since v1.0.0
 * @extends {BaseV1}
 */
export class SocketV1 extends BaseV1 {
	/**
	 * `📱 SOCLE 📱`
	 * ####  ⬆️ Send a socket to the server ⬆️
	 * @param evName the name of the target socket event refer to {@link IEmitEvents}
	 * @param payload the payload to send to socket server refer to {@link IEmitEvents}
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * import { nabii } from "nabii-sdk";
	 *
	 * nabii.v1.Socket.emit("ping", "payload!");
	 * ```
	 * @returns a void function
	 * @since v1.0.0
	 */
	@Permission(Platform.APPLICATION)
	public emit<TEmitEv extends IEmitEvents, TEvName extends keyof IEmitEvents>(
		evName: TEvName,
		...payload: Parameters<TEmitEv[TEvName]>
	): void {
		this._config.socket.emit(evName.toString(), ...payload);
	}
	/**
	 *  @public
	 * `📱 SOCLE 📱`
	 * ####  ⬇️ Receive a socket from the server ⬇️
	 * @param evName the name of the target socket event refer to {@link IOnEvents}
	 * @param listener the listener to apply to this event refer to {@link IOnEvents}
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * import { nabii } from "nabii-sdk";
	 *
	 * nabii.v1.Socket.on("pong", msg => {
	 * 	console.log("Message:", msg);
	 * });
	 * ```
	 * @returns a void function
	 * @since v1.0.0
	 */
	public on<TOnEv extends IOnEvents, TEvName extends keyof IOnEvents>(
		evName: TEvName,
		listener: TOnEv[TEvName],
	): void {
		this._config.socket.on(evName.toString(), listener);
	}
	/**
	 *  @public
	 * `📱 SOCLE 📱`
	 * ####  🗑️ Kill a socket event from the server 🗑️
	 * @param evName the name of the target socket event refer to {@link IOnEvents}
	 * @param listener the listener to apply to this event refer to {@link IOnEvents}
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * import { nabii } from "nabii-sdk";
	 *
	 * nabii.v1.Socket.off("pong", msg => {
	 * 	console.log("Message:", msg);
	 * });
	 * nabii.v1.Socket.off("pong");
	 * ```
	 * @returns a void function
	 * @since v1.0.0
	 */
	public off<TOnEv extends IOnEvents, TEvName extends keyof IOnEvents>(
		evName: TEvName,
		listener?: TOnEv[TEvName],
	): void {
		this._config.socket.off(evName.toString(), listener);
	}
	/**
	 * @public
	 * `📱 SOCLE 📱`
	 * ####  🔗 Check if socket is connected to {@link NabiiV1} (you must call the `login` or `setCredential`  method before) 🔗
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * import { nabii } from "nabii-sdk";
	 *
	 * if (nabii.v1.Socket.isLogged()) {
	 * 	console.log("Socket is up!");
	 * }
	 * ```
	 * @returns the login as socket state
	 * @since v1.0.0
	 */
	public isLogged(): boolean {
		return (
			this._config.socket.connected &&
			this._config.isLogged &&
			this._config.platform === Platform.APPLICATION
		);
	}
	/**
	 * @public
	 * `📱 SOCLE 📱`
	 * ####  ✅ Enable socket connection to {@link NabiiV1} ✅
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * import { nabii } from "nabii-sdk";
	 *
	 * await nabii.v1.Socket.enable();
	 * console.log("Socket is up!");
	 * ```
	 * @returns a void function
	 * @since v1.0.0
	 */
	public enable(): Promise<void> {
		this._config.allowSocket = true;
		return this._connectSocket();
	}
	/**
	 * @public
	 * `📱 SOCLE 📱`
	 * ####  ❌ Disable socket connection to {@link NabiiV1} ❌
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * import { nabii } from "nabii-sdk";
	 *
	 * await nabii.v1.Socket.disable();
	 * console.log("Socket is down!");
	 * ```
	 * @returns a void function
	 * @since v1.0.0
	 */
	public disable(): Promise<void> {
		this._config.allowSocket = false;
		return this._disconnectSocket();
	}
}
