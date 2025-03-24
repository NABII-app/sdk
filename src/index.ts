// Nabii axios error
export { NabiiError } from "@v1/error";

// Export nabii v1
import { NabiiV1 } from "./v1";
export type { INabiiV1 } from "@v1/modules/types";

/**
 * ####  🏴‍☠️ Nabii SDK 🏴‍☠️
 * - Project: <https://github.com/NABII-app/sdk>
 * ######  Dependencies:
 * `@capacitor-firebase/messaging` `@capacitor/core` `@capacitor/push-notifications` `@dulysse1/ts-branding` `@dulysse1/ts-helper` `axios` `firebase` `form-data` `socket.io-client` `stacktrace-parser` `zod`
 * @author Ulysse Dupont <https://github.com/Dulysse>
 * @example
 * ```tsx
 * import { nabii } from "nabii-sdk";
 *
 * const NABIIV1 = nabii.v1;
 * ```
 */
const nabii = <const>{
	/**
	 * @version 1.0.x
	 * ####  Welcome to {@link NabiiV1} SDK !
	 * - Project: <https://github.com/NABII-app/sdk>
	 * - API: <https://github.com/NABII-app/NABII_api>
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const NABIIV1 = nabii.v1;
	 * ```
	 * @author Ulysse Dupont <https://github.com/Dulysse>
	 * ####  ---------------------------
	 * ####  [Click for more information](https://github.com/NABII-app/sdk/blob/master/README.md)
	 * ####  ---------------------------
	 */
	v1: new NabiiV1(),
};

/**
 * ####  ✨ Nabii SDK existing `version` type ✨
 * @example
 * ```tsx
 * import { nabii } from "nabii-sdk";
 *
 * export function loadInstance<
 * 	const IVersion extends INabiiVersion
 * >(version: IVersion) {
 *		return nabii[version];
	}
 * ```
 */
export declare type INabiiVersion = keyof typeof nabii;

export default nabii;
