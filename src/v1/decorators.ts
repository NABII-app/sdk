import { errorParser, NabiiError } from "@v1/error";
import type { Platform } from "@v1/config";
import type { IBaseV1 } from "@v1/base";
import type { Any } from "@dulysse1/ts-helper";

declare type IAsyncFunction = (...args: Any.Strict[]) => Promise<Any.Strict>;
declare type IAnyFunction = (...args: Any.Strict[]) => Any.Strict;

/**
 * ####  Decorator for synchronous method: check if you are connected
 * @param _ target
 * @param __ key
 * @param descriptor property descriptor
 */
export function Logged<
	T,
	TKey extends keyof T,
	TDescriptor extends TypedPropertyDescriptor<IAnyFunction>,
>(_: T, __: TKey, descriptor: TDescriptor): TDescriptor {
	if (!descriptor.value) {
		throw new TypeError("Invalid property descriptor");
	}
	const original = descriptor.value;
	descriptor.value = function <TArgs>(
		this: InstanceType<IBaseV1>,
		...args: TArgs[]
	) {
		if (
			!this._config.isLogged ||
			!("accessToken" in this._config.credentials)
		) {
			throw errorParser("missing_login", this._config.lang);
		}
		return original.apply(this, args);
	};
	return descriptor;
}

/**
 * ####  Decorator for synchronous method: check if you have permission to access to a method
 * @param platform target platform that is allowed
 */
export function Permission(platform: Platform) {
	return function <
		T,
		TKey extends keyof T,
		TDescriptor extends TypedPropertyDescriptor<IAnyFunction>,
	>(_: T, __: TKey, descriptor: TDescriptor): TDescriptor {
		if (!descriptor.value) {
			throw new TypeError("Invalid property descriptor");
		}
		const original = descriptor.value;
		descriptor.value = function <TArgs>(
			this: InstanceType<IBaseV1>,
			...args: TArgs[]
		) {
			if (platform !== this._config.platform) {
				throw errorParser("missing_permission", this._config.lang, {
					platform,
				});
			}
			return original.apply(this, args);
		};
		return descriptor;
	};
}

/**
 * ####  Decorator for asynchronous method: refresh login if status code is `401`
 * @param _ target
 * @param __ key
 * @param descriptor property descriptor
 */
export function Refresh<
	T,
	TKey extends keyof T,
	TDescriptor extends TypedPropertyDescriptor<IAsyncFunction>,
>(_: T, __: TKey, descriptor: TDescriptor): TDescriptor {
	if (!descriptor.value) {
		throw new TypeError("Invalid property descriptor");
	}
	const original = descriptor.value;
	descriptor.value = async function <TArgs>(
		this: InstanceType<IBaseV1>,
		...args: TArgs[]
	) {
		try {
			return await original.apply(this, args);
		} catch (err) {
			if (err instanceof NabiiError) {
				if (err.response?.status === 401) {
					await this._refresh();
					return original.apply(this, args);
				}
				throw err;
			}
		}
	};
	return descriptor;
}
