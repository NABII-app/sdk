import type { Platform } from "@v1/config";
import type { Brand } from "@dulysse1/ts-branding";
/**
 * `Version` {@link NabiiV1} model type
 * @template TPlatform the platform currently in use
 * @since v1.0.0
 */
export declare type IVersion<TPlatform extends Platform> = {
	[Platform.APPLICATION]: {
		/**
		 * - The version `primary key`
		 */
		id: Brand.Pk<number>;
		/**
		 * - The name of the version
		 * @example
		 * ```
		 * 1.0.0
		 * ```
		 */
		name: string;
		/**
		 * - The type of the version
		 * @default "patch"
		 */
		type: IVersionType;
		/**
		 * - The notes of the version
		 */
		note: string | null;
		/**
		 * The version `creation` date
		 */
		createdAt: string;
	};
	[Platform.ADMIN]: {
		/**
		 * - The version `primary key`
		 */
		id: Brand.Pk<number>;
		/**
		 * - The name of the version
		 * @example
		 * ```
		 * 1.0.0
		 * ```
		 */
		name: string;
		/**
		 * - The type of the version
		 * @default "patch"
		 */
		type: IVersionType;
		/**
		 * - The notes of the version
		 */
		note: string | null;
		/**
		 * The version `creation` date
		 */
		createdAt: string;
		/**
		 * The version `last edit` date
		 */
		updatedAt: string;
		/**
		 * The version `delete` date will always be `null`
		 */
		deletedAt: null;
	};
}[TPlatform];

/**
 * `Version` {@link NabiiV1} check object type
 * @since v1.0.0
 */
export declare type ICheckVersionResult = {
	/**
	 * - `true` if the version is the latest, `false` otherwise.
	 */
	isLatest: boolean;
	/**
	 * - The current version
	 */
	current: IVersion<Platform.APPLICATION>;
	/**
	 * - The latest version
	 */
	latest: IVersion<Platform.APPLICATION>;
};

/**
 * List of version types.
 *
 * *This interface defines the various types a version can have in the system.
 * Each type is associated with a specific string value.*
 *
 * @since v1.0.0
 */
export declare interface IVersionTypes {
	/**
	 * a patched version
	 *
	 * @type {string}
	 * @readonly
	 */
	readonly PATCH: "patch";
	/**
	 * a minor version
	 *
	 * @type {string}
	 * @readonly
	 */
	readonly MINOR: "minor";
	/**
	 * a major version
	 *
	 * @type {string}
	 * @readonly
	 */
	readonly MAJOR: "major";
}

/**
 * List of version type values.
 *
 * *This type represents the possible type values for versions.*
 *
 * @since v1.0.0
 */
export declare type IVersionType = IVersionTypes[keyof IVersionTypes];

/**
 * `Version` {@link NabiiV1} model creation fields type
 * @template TPlatform the platform currently in use
 * @since v1.0.0
 */
export declare type ICreateVersionForm<TPlatform extends Platform> = {
	[Platform.APPLICATION]: never;
	[Platform.ADMIN]: Partial<Pick<IVersion<TPlatform>, "note" | "type">>;
}[TPlatform];

/**
 * `Version` {@link NabiiV1} model `GET` field parameters type
 * @template TPlatform the platform currently in use
 * @template TSearch the generic request `search` value (optional)
 * @template TLimit the generic request `limit` value (optional)
 * @template TPage the generic request `page` value (optional)
 * @since v1.0.0
 */
export declare type IVersionParams<
	TPlatform extends Platform,
	TSearch extends string | undefined = string | undefined,
	TLimit extends number = number,
	TPage extends number = number,
> = import("@v1/types/nabii").IPaginateOptions<
	{
		[Platform.APPLICATION]: "id" | "name";
		[Platform.ADMIN]: "id" | "name";
	}[TPlatform],
	TSearch,
	TLimit,
	TPage
>;

/**
 * ####  ✨ List of {@link NabiiV1} `Version` model types ✨:
 * - {@link IVersion}
 * - {@link ICreateVersionForm}
 * - {@link IVersionParams}
 * ---------------------------
 * Do you have ideas or recommendations for improvement?
 *  * @author Ulysse Dupont -->
 *  [Email](mailto:ulyssedupont2707@gmail.com)
 *  | [Github](https://github.com/Dulysse)
 *  | [LinkedIn](https://www.linkedin.com/in/ulysse-dupont)
 * @since v1.0.0
 */
export declare namespace IVersionTypes {
	export { IVersion };
	export { ICreateVersionForm };
	export { IVersionParams };
}
