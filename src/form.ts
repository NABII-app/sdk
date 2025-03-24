import { NabiiError } from "@/v1/error";
import type { Any, Op } from "@dulysse1/ts-helper";
import FormData from "form-data";
import { fileTypeFromBuffer } from "file-type";
/**
 * Symbol used to brand objects with form error information.
 * Values branded with this symbol indicate an error condition in form data.
 */
declare const formErrorBrand: unique symbol;

/**
 * Make all properties in T optional but non-nullable.
 *
 * @template T - The type whose properties will be made optional and non-nullable.
 */
export declare type IPartialNonNullable<T> = {
	[Key in keyof T]?: T[Key] extends object
		? IPartialNonNullable<T[Key]>
		: NonNullable<T[Key]>;
};

/**
 * Check if a type `T` is not `any`.
 *
 * This utility type resolves to `T` if `T` is not `any`. Otherwise, it resolves to `never`.
 *
 * @template T - The type to be checked.
 */
declare type IResolve<T> = Any.Is<T> extends true ? never : T;

/**
 * Simple form for creation/modification
 * @template TModel the data resource type
 */
export declare type ISimpleForm<TModel = object> =
	IPartialNonNullable<TModel> & {
		[key in string]?:
			| string
			| boolean
			| number
			| INabiiFile
			| unknown[]
			| undefined;
	};

/**
 * Simple `form-data` for creation/modification
 * @template TModel the data resource type
 */
declare type ISimpleFormData<TModel = object> = IPartialNonNullable<TModel> & {
	[key: string]: string | boolean | number;
} & {
	[key: string]: INabiiFile | INabiiFile[];
};

/**
 * Represents the format of a form data file to upload for {@link NabiiV1}.
 *
 * The file can be of several types, including:
 * - A resolved `Buffer` object from the `buffer` module.
 */
export declare type INabiiFile = IResolve<import("buffer").Buffer>;

/**
 * Improved type definition for `form-data` objects.
 *
 * This interface extends the built-in `FormData` interface, adding type safety for appending data.
 * The `append` method only accepts keys and values that exist in the provided type `T`.
 *
 * @template T - The type of the data object. Keys and values of this type will be enforced when appending data.
 */
declare interface IFormData<T = object> extends FormData {
	append: <TKey extends keyof T>(
		key: TKey extends string ? TKey : string,
		value: T[TKey],
	) => void;
}

/**
 * Utility type to ensure there is at least one file in a `form-data` object.
 *
 * *This type checks if any property in the given object type `T` is of type `INabiiFile` or `INabiiFile[]`.
 * If at least one property matches, it returns `T`; otherwise, it returns `{@link ISimpleFormData}.*
 *
 * @template T - The type of the data object to be checked.
 */
declare type IRequireFile<T = object> =
	Op.Or<
		INabiiFile extends NonNullable<T[keyof T]> ? true : false,
		INabiiFile[] extends NonNullable<T[keyof T]> ? true : false
	> extends true
		? Partial<T>
		: ISimpleFormData<T>;

/**
 * A type representing safe form data.
 *
 * This type ensures type safety when dealing with form data objects. It uses conditional types to enforce
 * specific rules:
 *
 * - If the type `T` extends `IFormData`, it is returned as is.
 * - If the type `T` satisfies the condition defined by `IRequireFile`, it is converted to `FormData`.
 * - Otherwise, the type `T` itself is returned.
 *
 * The type also ensures compatibility with {@link IFormErrorBrand}, making it a safe choice for optional form data parameters.
 *
 * @template T - The type of the data object to be checked. Defaults to `object`.
 */
export declare type ISafeForm<T = object> = Op.Satisfy<
	T extends IFormData
		? T
		: Op.Or<
					INabiiFile extends NonNullable<T[keyof T]> ? true : false,
					INabiiFile[] extends NonNullable<T[keyof T]> ? true : false
			  > extends true
			? T & {
					[formErrorBrand]: "You are using 'INabiiFile' data in your form, please bind 'data' using the 'useFormData' function!";
				}
			: T,
	T | undefined
>;

/**
 * #####  Create a `form-data` object with type safety.
 *
 * *This function ensures that the provided data object includes at least one {@link INabiiFile} value.
 * If no file is included, TypeScript will infer the type as {@link IFormData}.*
 *
 * @template T - The type of the data object.
 * @param {IRequireFile<T>} data - The `form-data` values as an object. This object must contain at least one {@link INabiiFile} value.
 * @returns {IFormData<T>} A `form-data` object created with the provided data.
 */
export async function useFormData<const T extends object>(
	data: IRequireFile<T>,
): Promise<IFormData<T>> {
	try {
		if (typeof data !== "object") {
			throw new Error("Form Data should be an object.");
		}
		const form = new FormData();
		const appendToFormData = async <TValue>(key: string, value: TValue) => {
			if (Buffer.isBuffer(value)) {
				const fileType = await fileTypeFromBuffer(value);
				const contentType = fileType
					? fileType.mime
					: "application/octet-stream";
				form.append(key, value, {
					contentType,
					filename: key,
				});
			} else {
				form.append(key, `${value}`);
			}
		};
		for (const [key, value] of Object.entries(data)) {
			if (Array.isArray(value)) {
				for (let i = 0; i < value.length; i++) {
					await appendToFormData(`${key}[${i}]`, value[i]);
				}
			} else {
				await appendToFormData(key, value);
			}
		}
		form.append("__timestamp__", new Date().getTime().toString());
		return form;
	} catch (error) {
		if (error instanceof Error) {
			throw new NabiiError({
				message: error.message,
				isAxiosError: false,
				toJSON: () => ({}),
				name: error.name,
			});
		} else {
			throw error;
		}
	}
}
