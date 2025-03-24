import type { Op } from "@dulysse1/ts-helper";
/**
 * Unpack socket event parameters.
 *
 * @template T - The type representing an array of event listener functions.
 */
export declare type IUnpackEventParam<T> = T extends ((
	...args: infer Param
) => unknown)[]
	? Op.Satisfy<Param, unknown[]>
	: never;
/**
 * Unpack socket event listener function.
 *
 * @template T - The type representing an array of event listener functions.
 * @returns {Function} - The unpacked event listener function.
 */
export declare type IUnpackEventFunction<T> = T extends (infer Func)[]
	? Func
	: never;
/**
 * Check if a `type` contains a specific `Brand`.
 *
 * @template T - The type to check for the presence of the brand.
 * @template Brand - The brand symbol to check for in the type.
 * @returns {boolean} - `true` if the brand is present in the type, otherwise `false`.
 */
export declare type IIsBranded<
	T,
	TBrand extends symbol,
> = TBrand extends keyof T ? true : false;
/**
 * A type representing a class with a constructor.
 *
 * @template TArgs - The type of arguments the constructor accepts. Defaults to an array of unknown types.
 * @template TReturn - The type of the instance returned by the constructor. Defaults to an unknown type.
 */
export declare interface IClass<
	TArgs extends unknown[] = unknown[],
	TReturn = unknown,
> {
	new (...args: TArgs): TReturn;
}
