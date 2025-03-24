import { BaseV1 } from "@v1/base";
import { Platform } from "@v1/config";

function applyMixins(
	derivedCtor: import("@v1/types/utils").IClass,
	childCtors: [string, import("@v1/types/utils").IClass][],
) {
	const generateBaseV1 = () => {
		return class GeneratedBaseV1 extends BaseV1 {};
	};
	childCtors.forEach(([className, childCtor]) => {
		// generate an empty Base new class
		const generatedBaseV1 = generateBaseV1();
		// then, adding all properties and methods of this constructor to this new class
		Object.getOwnPropertyNames(childCtor.prototype).forEach(propertyKey => {
			if (propertyKey !== "constructor") {
				const attributes = Object.getOwnPropertyDescriptor(
					childCtor.prototype,
					propertyKey,
				);
				if (attributes) {
					Object.defineProperty(
						generatedBaseV1.prototype,
						propertyKey,
						attributes,
					);
				}
			}
		});
		// finally, add this new class as new property to the derived constructor
		Object.defineProperty(derivedCtor.prototype, className, {
			value: new generatedBaseV1(),
			writable: false,
			enumerable: false,
			configurable: false,
		});
	});
}

/**
 * ####  Load mixin interfaces
 *
 * *This utility type takes a record of classes and returns a new type where each key in the record is
 * mapped to an instance of the corresponding class. This is useful for loading and working with
 * multiple module instances in a type-safe manner.*
 *
 * @template T - A record where the key is a string and the value is a class constructor.
 *
 * @example
 * ```typescript
 * import { MyClass1, MyClass2 } from '@v1/modules';
 *
 * type IObject = {
 *   class1: typeof MyClass1;
 *   class2: typeof MyClass2;
 * };
 *
 * type ILoadedModules = ILoadModules<IObject>;
 * // ILoadedModules is now { class1: MyClass1; class2: MyClass2; }
 * ```
 */
export declare type ILoadModules<
	T extends Record<string, import("@v1/types/utils").IClass>,
> = {
	[key in keyof T]: InstanceType<T[key]>;
};

/**
 * ####  Apply interface `Admin` mixin to a module
 *
 * *This abstract class is used to apply an `Admin` mixin to a module. It extends `BaseV1` and
 * ensures that the module includes the properties and methods of the `Admin` class.*
 *
 * @template T - The type of administrator constructor, which should extend from the `IClass` type.
 *
 * @extends BaseV1
 *
 * @example
 *
 * ```tsx
 * class ModuleV1 {
 * 	// administrator methods and properties!
 * 	readonly Admin: new AdminModuleV1();
 * }
 * ```
 */
export abstract class AdminMixin<
	T extends import("@v1/types/utils").IClass,
> extends BaseV1 {
	/**
	 * #####  🖥️ Administrator `methods` and `properties` of this module 🖥️
	 *
	 * *An instance of the `Admin` class, which provides additional methods and properties
	 * specific to administrative functionality of this module.*
	 *
	 * @readonly
	 *
	 * @example
	 * ```tsx
	 * class ModuleV1 {
	 * 	// administrator methods and properties!
	 * 	readonly Admin: new AdminModuleV1();
	 * }
	 * ```
	 */
	public readonly Admin!: InstanceType<T>;
}

/**
 * ####  Decorator for class: Apply module mixins to a constructor
 *
 *  *This decorator function applies the specified module mixins to the module class constructor.
 * It takes an array of modules and integrates their properties and methods into the class.*
 *
 * @param modules An array of modules where each key is a module name and the value is the corresponding module class.
 * @returns {Function} A decorator function that takes a class constructor and applies the specified mixins to it.
 */
export function WithModules<
	TClass extends import("@v1/types/utils").IClass,
	TModules extends Record<string, import("@v1/types/utils").IClass> = Record<
		string,
		import("@v1/types/utils").IClass
	>,
>(modules: TModules) {
	return function (constructor: TClass): void {
		applyMixins(constructor, Object.entries(modules));
	};
}

/**
 * ####  Decorator for class: Apply `Admin` mixin to a module
 *
 * *This decorator function applies the `Admin` mixin to the module class constructor.
 * It integrates the `Admin` class's properties and methods into the specified module.*
 * @template TClass - The type of the class constructor to which the mixin is applied.
 * @template TModule - The type of the `Admin` class constructor.
 *
 * @param {TModule} module - The `Admin` class constructor that will be mixed into the module.
 *
 * @returns {Function} - A decorator function that takes a class constructor and applies the `Admin` mixin to it.
 */
export function Admin<
	TClass extends import("@v1/types/utils").IClass,
	TModule extends import("@v1/types/utils").IClass,
>(module: TModule) {
	return function (constructor: TClass): void {
		applyMixins(constructor, [
			[
				Platform.ADMIN.charAt(0).toLocaleUpperCase() + Platform.ADMIN.slice(1),
				module,
			],
		]);
	};
}
