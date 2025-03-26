import type { Platform } from "@v1/config";
import type { Brand } from "@dulysse1/ts-branding";
import type { INabiiFile } from "@/form";
/**
 * User {@link NabiiV1} model type
 * @template TPlatform the platform currently in use
 * @since v1.0.0
 */
export declare type IUser<TPlatform extends Platform> = {
	[Platform.APPLICATION]: {
		/**
		 * - The user `primary key`
		 */
		id: Brand.Pk<number>;
		/**
		 * The `firstName` of the user
		 */
		firstName: string;
		/**
		 * The `lastName` of the user
		 */
		lastName: string;
		/**
		 * The `avatar` URL of the user
		 * @expiredIn 30mn
		 */
		avatar: string;
		/**
		 * The `email` of the user
		 * @unique
		 */
		email: string;
		/**
		 * The `role` of the user with one value from {@link IRoles}
		 * - *To get the values, use `nabii.v1.User.roles`.*
		 */
		role: IRole;
		/**
		 * The `firebaseToken` of the user to receive notification
		 */
		firebaseToken: string | null;
		/**
		 * The `lastConnection` date of the user
		 */
		lastConnection: string | null;
		/**
		 * The value is `false` if the user has not activated their account.
		 */
		isActivated: boolean;
	};
	[Platform.ADMIN]: {
		/**
		 * - The user `primary key`
		 */
		id: Brand.Pk<number>;
		/**
		 * The `firstName` of the user
		 */
		firstName: string;
		/**
		 * The `lastName` of the user
		 */
		lastName: string;
		/**
		 * The `avatar` URL of the user
		 * @expiredIn 30mn
		 */
		avatar: string;
		/**
		 * The `email` of the user
		 * @unique
		 */
		email: string;
		/**
		 * The `role` of the user with one value from {@link IRoles}
		 * - *To get the values, use `nabii.v1.User.roles`.*
		 */
		role: IRole;
		/**
		 * The `firebaseToken` of the user to receive notification
		 */
		firebaseToken: string | null;
		/**
		 * The `lastConnection` date of the user
		 */
		lastConnection: string | null;
		/**
		 * The value is `false` if the user has not activated their account.
		 */
		isActivated: boolean;
		/**
		 * The user `creation` date
		 */
		createdAt: string;
		/**
		 * The user `last edit` date
		 */
		updatedAt: string;
		/**
		 * The user `delete` date will always be `null`
		 */
		deletedAt: null;
	};
}[TPlatform];

/**
 * User {@link NabiiV1} model creation fields type
 * @template TPlatform the platform currently in use
 * @since v1.0.0
 */
export declare type ICreateUserForm<TPlatform extends Platform> = {
	[Platform.APPLICATION]: Pick<
		IUser<TPlatform>,
		"firstName" | "lastName" | "email" | "password"
	> & {
		avatar?: INabiiFile;
	};
	[Platform.ADMIN]: Pick<
		IUser<TPlatform>,
		"firstName" | "lastName" | "email"
	> & {
		avatar?: INabiiFile;
	};
}[TPlatform];

/**
 * User {@link NabiiV1} model edition fields type
 * @template TPlatform the platform currently in use
 * @since v1.0.0
 */
export declare type IUpdateUserForm<TPlatform extends Platform> = {
	[Platform.APPLICATION]: import("@/form").IPartialNonNullable<
		Pick<IUser<TPlatform>, "firstName" | "lastName"> & {
			/**
			 * The `password` of the user
			 * - must contain at least `8 characters`
			 * - must contain a maximum of `64 characters`
			 */
			password?: string;
			avatar?: INabiiFile;
		}
	>;
	[Platform.ADMIN]: import("@/form").IPartialNonNullable<
		ICreateUserForm<TPlatform>
	>;
}[TPlatform];

/**
 * User {@link NabiiV1} model `GET` field parameters type
 * @template TPlatform the platform currently in use
 * @template TSearch the generic request `search` value (optional)
 * @template TLimit the generic request `limit` value (optional)
 * @template TPage the generic request `page` value (optional)
 * @since v1.0.0
 */
export declare type IUserParams<
	TPlatform extends Platform,
	TSearch extends string | undefined = string | undefined,
	TLimit extends number = number,
	TPage extends number = number,
> = import("@v1/types/nabii").IPaginateOptions<
	{
		[Platform.APPLICATION]: "id" | "firstName" | "lastName" | "email";
		[Platform.ADMIN]:
			| "id"
			| "firstName"
			| "lastName"
			| "email"
			| "role"
			| "createdAt"
			| "updatedAt";
	}[TPlatform],
	TSearch,
	TLimit,
	TPage
>;

/**
 * Result when private information is updated.
 *
 * *This interface represents the result returned after updating a user's private information.*
 *
 * @since v1.0.0
 */
export declare interface IUserUpdatedResult
	extends Pick<IUser<Platform>, "id" | "email"> {
	/**
	 * The date when the user was last edited.
	 *
	 * @type {string}
	 */
	updatedAt: string;
}

/**
 * Result when an email is sent.
 *
 * *This interface represents the result returned after sending an email to a user.*
 *
 * @since v1.0.0
 */
export declare interface IEmailSentResult
	extends Pick<IUser<Platform>, "email"> {
	/**
	 * A boolean indicating that the email has been successfully sent.
	 *
	 * @type {boolean}
	 */
	emailSuccess: true;
}

/**
 * List of user roles.
 *
 * *This interface defines the various roles a user can have in the system.
 * Each role is associated with a specific integer value.*
 *
 * @since v1.0.0
 */
export declare interface IRoles {
	/**
	 * The banned role value.
	 *
	 * @type {number}
	 * @readonly
	 */
	readonly BANNED: 0;
	/**
	 * The default user role value.
	 *
	 * @type {number}
	 * @readonly
	 */
	readonly USER: 100;
	/**
	 * The supervisor role value.
	 *
	 * @type {number}
	 * @readonly
	 */
	readonly SUPERVISOR: 150;
	/**
	 * The administrator role value.
	 *
	 * @type {number}
	 * @readonly
	 */
	readonly ADMIN: 200;
}

/**
 * List of user role values.
 *
 * *This type represents the possible role values for users.*
 *
 * @since v1.0.0
 */
export declare type IRole = IRoles[keyof IRoles];

/**
 * A deleted user from the administrator's perspective, with a deletion date.
 *
 * *This type represents a user who has been deleted by an administrator, including the date of deletion.*
 *
 * @since v1.0.0
 */
export declare interface IDeletedUser
	extends Omit<IUser<Platform.ADMIN>, "deletedAt"> {
	/**
	 * The date when the user was deleted.
	 *
	 * @type {string}
	 */
	deletedAt: string;
}

/**
 * Result of importing multiple users.
 *
 * *This interface represents the result of a bulk user creation operation, including counts of successes and failures.*
 *
 * @since v1.0.0
 */
export declare interface IBulkCreateResult {
	/**
	 * The array of users created successfully.
	 *
	 * @type {IUser<Platform.ADMIN>[]}
	 */
	succeed: IUser<Platform.ADMIN>[];
	/**
	 * The array of users that were not created.
	 *
	 * @type {IDeletedUser[]}
	 */
	failed: IDeletedUser[];
}

/**
 * ####  ✨ List of {@link NabiiV1} user module types ✨:
 * - {@link IUser}
 * - {@link ICreateUserForm}
 * - {@link IUpdateUserForm}
 * - {@link IUserParams}
 * - {@link IUserUpdatedResult}
 * - {@link IEmailSentResult}
 * - {@link IRoles}
 * - {@link IRole}
 * - {@link IDeletedUser}
 * - {@link IBulkCreateResult}
 * ---------------------------
 * Do you have ideas or recommendations for improvement?
 *  * @author Ulysse Dupont -->
 *  [Email](mailto:ulyssedupont2707@gmail.com)
 *  | [Github](https://github.com/Dulysse)
 *  | [LinkedIn](https://www.linkedin.com/in/ulysse-dupont)
 * @since v1.0.0
 */
export declare namespace IUserTypes {
	export { IUser };
	export { ICreateUserForm };
	export { IUpdateUserForm };
	export { IUserParams };
	export { IUserUpdatedResult };
	export { IEmailSentResult };
	export { IRoles };
	export { IRole };
	export { IDeletedUser };
	export { IBulkCreateResult };
}
