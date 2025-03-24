/**
 * List of default server {@link NabiiV1} event listeners for `on` and `off` socket methods
 */
export declare interface IDefaultEventListeners {
	connect: () => void;
	connect_error: () => void;
	connect_success: () => void;
	disconnect: (data: "io client disconnect") => void;
}
/**
 * List of event `emitter` for server {@link NabiiV1} for `emit` socket method
 */
export declare interface IEmitEvents {
	ping: (data: {
		/**
		 * the actual date to get delay in milliseconds with the server for `pong` event response.
		 * {@link IOnEvents.pong}
		 */
		now: Date;
	}) => void;
}
/**
 * List of server {@link NabiiV1} event listeners for `on` and `off` socket methods
 */
export declare interface IOnEvents extends IDefaultEventListeners {
	pong: (data: {
		/**
		 * The response delay to join the server in milliseconds
		 * {@link IEmitEvents.ping}
		 */
		responseTime: number;
	}) => void;
}

/**
 * ####  ✨ List of {@link NabiiV1} socket module types ✨:
 * - {@link IDefaultEventListeners}
 * - {@link IEmitEvents}
 * - {@link IOnEvents}
 * ---------------------------
 * Do you have ideas or recommendations for improvement?
 *  * @author Ulysse Dupont -->
 *  [Email](mailto:ulyssedupont2707@gmail.com)
 *  | [Github](https://github.com/Dulysse)
 *  | [LinkedIn](https://www.linkedin.com/in/ulysse-dupont)
 * @since v1.0.0
 */
export declare namespace ISocketTypes {
	export { IDefaultEventListeners, IEmitEvents, IOnEvents };
}
