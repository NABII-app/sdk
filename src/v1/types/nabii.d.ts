import type { Platform } from "@v1/config";
import type { INabiiFile } from "@/form";

/**
 * 🔗 {@link NabiiV1} `application` credentials 🔗
 *
 * This interface defines the credentials required for accessing the
 * {@link NabiiV1} application, including the access token, refresh token,
 * and user data.
 */
export declare interface ICredentials {
	/**
	 * Your {@link NabiiV1} access token.
	 *
	 * *This token is used for authenticating API requests to the NabiiV1 application.*
	 */
	accessToken: string;
	/**
	 * Your {@link NabiiV1} refresh token.
	 *
	 * *This token is used to obtain a new access token once the current one expires.*
	 */
	refreshToken: string;
	/**
	 * Your {@link NabiiV1} user logged data.
	 *
	 * *Contains information about the authenticated user within the application.*
	 *
	 */
	user: import("@v1/modules/user/user").IUser<Platform.APPLICATION>;
}

/**
 * 🔗 {@link NabiiV1} `application` refresh token result object 🔗
 */
export declare type IRefreshTokenResult = Omit<ICredentials, "refreshToken">;

/**
 * 🔗❌ {@link NabiiV1} type definition for an empty credentials object ❌🔗
 *
 * *This type is used for the {@link NabiiV1} application where credentials are required to be an empty object.*
 *
 */
export declare type IEmptyCredentials = Record<string, never>;

/**
 * Type of allowed {@link NabiiV1} language values
 */
export declare type ILanguage =
	import("@v1/config").ILanguages[keyof import("@v1/config").ILanguages];

/**
 * List of {@link NabiiV1} internal SDK error
 */
export declare type INabiiCustomError =
	keyof (typeof import("@v1/error").errors)[keyof typeof import("@v1/error").errors];

/**
 * Generic paginated {@link NabiiV1} API `getAll` result
 * @template TModel the data resource type
 * @template TSearch the generic request `search` value (optional)
 * @template TLimit the generic request `limit` value (optional)
 * @template TPage the generic request `page` value (optional)
 * @since v1.0.0
 */
export declare interface IPaginated<
	TModel extends object,
	TSearch extends string | undefined = string | undefined,
	TLimit extends number = number,
	TPage extends number = number,
> {
	/**
	 * Your generic {@link TModel} data as array for this request
	 * ####  ✅ Good practice usage ✅
	 * #####  🔱React hooks 🔱
	 * - Create a React hook with your SDK {@link IPaginated} method
	 * ```tsx
	 * import nabii, { type INabiiV1 }  from "nabii-sdk";
	 * import { useInfiniteQuery } from "@tanstack/react-query";
	 *
	 * export default function useUser(
	 * 	params?: INabiiV1.IUserTypes.IUserParams<
	 * 		INabiiV1.Platform.APPLICATION
	 * 	>
	 * ) {
	 * 	return useInfiniteQuery({
	 * 		queryKey: ["user", params],
	 * 		initialPageParam: params?.page ?? 1,
	 * 		queryFn: ({ pageParam }) => {
	 * 			return nabii.v1.User.Admin.getAll({
	 * 				page: pageParam,
	 * 				...params,
	 * 			});
	 * 		},
	 * 		getNextPageParam: (lastPage, allPages) => {
	 * 			return lastPage.hasNextPage ? allPages.length + 1 : undefined;
	 * 		},
	 * 	});
	 * };
	 * ```
	 * - Then, use your hook into your component
	 * ```tsx
	 * import React from "react";
	 * import useUser from "../hooks/useUser";
	 *
	 * const MyComponent = () => {
	 * 	const {
	 * 		data,
	 * 		fetchNextPage,
	 * 		hasNextPage,
	 * 		isFetchingNextPage,
	 * 		status,
	 * 		error,
	 * 	} = useUser();
	 *
	 * 	if (status === "loading") {
	 * 		return <div>Loading...</div>;
	 * 	}
	 *
	 * 	if (status === "error") {
	 * 		return <div>Error: {error.message}</div>;
	 * 	}
	 *
	 * 	return (
	 * 	<div>
	 * 		{data.pages.map((page, index) => (
	 * 			<div key={index}>
	 * 				{page.data.map(user => (
	 * 					<div key={user.id}>{user.name}</div>
	 * 				))}
	 * 			</div>
	 * 		))}
	 * 	<button
	 * 		onClick={() => fetchNextPage()}
	 * 		disabled={!hasNextPage || isFetchingNextPage}
	 * 	>
	 * 		{isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load More" : "No more results"}
	 * 	</button>
	 *	</div>);
	 * };
	 * export default MyComponent;
	 * ```
	 */
	data: TModel[];
	/**
	 * Check if there is more {@link TPage} for this request
	 */
	hasNextPage: boolean;
	/**
	 * Get the current {@link TPage} number for this request
	 * @sql
	 * (limit * `page`) - limit + additionalOffset
	 * @default 1
	 */
	currentPage: TPage;
	/**
	 * The amount of `pages` for this request
	 */
	totalPages: number;
	/**
	 * The total count of {@link TModel} for this request
	 */
	totalCount: number;
	/**
	 * The current {@link TPage} size for this request
	 * @sql
	 * (`limit` * page) - `limit` + additionalOffset
	 * @default 15
	 */
	currentLimit: TLimit;
	/**
	 * Your {@link TSearch} value for this request
	 * @default undefined
	 */
	search: TSearch;
	/**
	 * The additional `offset` value
	 * @sql
	 * (limit * page) - limit + `additionalOffset`
	 * @default 0
	 */
	additionalOffset: number;
}

/**
 * ####  Generic paginated {@link NabiiV1} API `getAll` params
 * @template TSortField the `sortField` options for this resource
 * @template TSearch the generic request `search` value (optional)
 * @template TLimit the generic request `limit` value (optional)
 * @template TPage the generic request `page` value (optional)
 * @since v1.0.0
 */
export declare interface IPaginateOptions<
	TSortField extends string,
	TSearch extends string | undefined = string | undefined,
	TLimit extends number = number,
	TPage extends number = number,
> {
	/**
	 * Set the {@link TLimit} of data to get in a single {@link TPage}
	 * @sql
	 * (`limit` * page) - `limit` + additionalOffset
	 * @default 5
	 */
	limit?: TLimit;
	/**
	 * Set the data {@link TPage} index
	 * @sql
	 * (limit * `page`) - limit + additionalOffset
	 * @default 1
	 */
	page?: TPage;
	/**
	 * Set the {@link TSearch} field
	 * @default undefined
	 */
	search?: TSearch;
	/**
	 * Set field for the data sorting
	 * @default "id"
	 */
	sortField?: TSortField;
	/**
	 * Set order for the data sorting
	 * @default "ASC"
	 */
	sortOrder?: "ASC" | "DESC";
	/**
	 * The additional `offset` value
	 * @sql
	 * (limit * page) - limit + `additionalOffset`
	 * @default 0
	 */
	additionalOffset?: number;
}

/**
 * Creation or modification date format allowed for {@link NabiiV1} form
 */
export declare type IDate = string | Date;

/**
 * {@link NabiiV1} API header mode for unit testing rate limiter, only test mode allowed on `localhost`
 */
export declare type IMode =
	import("@v1/config").IModes[keyof import("@v1/config").IModes];

/**
 * ####  ✨ List of {@link NabiiV1} global types ✨:
 * - {@link Platform}
 * - {@link ICredentials}
 * - {@link IRefreshTokenResult}
 * - {@link IEmptyCredentials}
 * - {@link ILanguage}
 * - {@link INabiiFile}
 * - {@link IPaginated}
 * - {@link IPaginateOptions}
 * - {@link IDate}
 * - {@link IMode}
 * ---------------------------
 * Do you have ideas or recommendations for improvement?
 *  * @author Ulysse Dupont -->
 *  [Email](mailto:ulyssedupont2707@gmail.com)
 *  | [Github](https://github.com/Dulysse)
 *  | [LinkedIn](https://www.linkedin.com/in/ulysse-dupont)
 * @since v1.0.0
 */
export declare namespace IGlobalTypes {
	export {
		Platform,
		ICredentials,
		IRefreshTokenResult,
		IEmptyCredentials,
		ILanguage,
		INabiiFile,
		IPaginated,
		IPaginateOptions,
		IDate,
		IMode,
	};
}
