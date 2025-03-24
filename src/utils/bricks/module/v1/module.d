import type { Platform } from "@v1/config";
import type { Brand } from "@dulysse1/ts-branding";
/**
 * `[BRICK]` {@link NabiiV1} model type
 * @template TPlatform the platform currently in use
 * @since v[version]
 */
export declare type I[Brick]<TPlatform extends Platform> = {
	[Platform.APPLICATION]: {
		/**
		 * - The [brickName] `primary key`
		 */
		id: Brand.Pk<number>;
		// TODO: Add [brickName] fields!
	};
	[Platform.ADMIN]: {
		/**
		 * - The [brickName] `primary key`
		 */
		id: Brand.Pk<number>;
		// TODO: Add [brickName] fields!
		/**
		 * The [brickName] `creation` date
		 */
		createdAt: string;
		/**
		 * The [brickName] `last edit` date
		 */
		updatedAt: string;
		/**
		 * The [brickName] `delete` date will always be `null`
		 */
		deletedAt: null;
	};
}[TPlatform];

/**
 * `[BRICK]` {@link NabiiV1} model creation fields type
 * @template TPlatform the platform currently in use
 * @since v[version]
 */
export declare type ICreate[Brick]Form<
	TPlatform extends Platform
> = {
	[Platform.APPLICATION]: {
		// TODO: Add [brickName] create fields!
	};
	[Platform.ADMIN]: {
		// TODO: Add [brickName] create fields!
	};
}[TPlatform];

/**
 * `[BRICK]` {@link NabiiV1} model edition fields type
 * @template TPlatform the platform currently in use
 * @since v[version]
 */
export declare type IUpdate[Brick]Form<
	TPlatform extends Platform
> = {
	[Platform.APPLICATION]: Omit<Partial<ICreate[Brick]Form<TPlatform>>, never>;
	[Platform.ADMIN]: Omit<Partial<ICreate[Brick]Form<TPlatform>>, never>;
}[TPlatform];

/**
 * `[BRICK]` {@link NabiiV1} model `GET` field parameters type
 * @template TPlatform the platform currently in use
 * @template TSearch the generic request `search` value (optional)
 * @template TLimit the generic request `limit` value (optional)
 * @template TPage the generic request `page` value (optional)
 * @since v[version]
 */
export declare type I[Brick]Params<
	TPlatform extends Platform,
	TSearch extends string | undefined = string | undefined,
	TLimit extends number = number,
	TPage extends number = number,
> = import("@v1/types/nabii").IPaginateOptions<
	{
		[Platform.APPLICATION]: "id";
		[Platform.ADMIN]: "id";
	}[TPlatform], TSearch, TLimit, TPage
>;

/**
 * ### ✨ List of {@link NabiiV1} `[BRICK]` model types ✨:
 * - {@link I[Brick]}
 * - {@link ICreate[Brick]Form}
 * - {@link IUpdate[Brick]Form}
 * - {@link I[Brick]Params}
 * ---------------------------
 * Do you have ideas or recommendations for improvement?
 *  * @author Ulysse Dupont -->
 *  [Email](mailto:ulyssedupont2707@gmail.com)
 *  | [Github](https://github.com/Dulysse)
 *  | [LinkedIn](https://www.linkedin.com/in/ulysse-dupont)
 * @since v[version]
 */
export declare namespace I[Brick]Types {
	export { I[Brick] };
	export { ICreate[Brick]Form };
	export { IUpdate[Brick]Form };
	export { I[Brick]Params };
}
