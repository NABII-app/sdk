import chalk from "chalk";

type IColors = typeof chalk;

type IAllowedKey = {
	[key in keyof IColors]: IColors[key] extends (value: string) => string
		? key
		: never;
}[keyof IColors];

function recursivelyApplyColors(
	value: string,
	logColors: IAllowedKey[],
): string {
	const [logColor, ...rest] = logColors;
	return !logColor
		? value
		: recursivelyApplyColors(chalk[logColor](value), rest);
}

function Colored(logColors: IAllowedKey[]) {
	return function <
		T,
		TKey extends keyof T,
		TDescriptor extends TypedPropertyDescriptor<(...values: unknown[]) => void>,
	>(_: T, __: TKey, descriptor: TDescriptor): TDescriptor {
		if (!descriptor.value) {
			throw new TypeError("Invalid property descriptor");
		}
		const original = descriptor.value;
		descriptor.value = function <TArgs>(
			this: InstanceType<typeof Logger>,
			...args: TArgs[]
		) {
			const newArgs = [];
			for (const initialValue of args) {
				newArgs.push(recursivelyApplyColors(`${initialValue}`, logColors));
			}
			return original.apply(this, newArgs);
		};
		return descriptor;
	};
}

class Logger {
	/**
	 * #####  💬 Display an information log 💬
	 * @param value the message to be logged
	 * @returns the value with applied chalk
	 */
	@Colored(["blue", "bold", "italic"])
	public info(...values: unknown[]): void {
		for (const value of values) {
			console.log(value);
		}
	}
	/**
	 * #####  ⛔ Display an error log ⛔
	 * @param value the message to be logged
	 * @returns the value with applied chalk
	 */
	@Colored(["bgRed", "black", "bold"])
	public error(...values: unknown[]): void {
		for (const value of values) {
			console.log(value);
		}
	}
	/**
	 * #####  ⚠️ Display a warning log ⚠️
	 * @param value the message to be logged
	 * @returns the value with applied chalk
	 */
	@Colored(["bgYellow", "black", "bold"])
	public warning(...values: unknown[]): void {
		for (const value of values) {
			console.log(value);
		}
	}
	/**
	 * #####  ✅ Display a success log ✅
	 * @param value the message to be logged
	 * @returns the value with applied chalk
	 */
	@Colored(["green", "bold"])
	public success(...values: unknown[]): void {
		for (const value of values) {
			console.log(value);
		}
	}
	/**
	 * #####  ✏️ Display a standard log ✏️
	 * @param value the message to be logged
	 * @returns the value without chalk applied
	 */
	public log(...values: unknown[]): void {
		console.log(...values);
	}
	/**
	 * #####  📦 Display an object properly 📦
	 * @param value the object to be logged
	 * @param depth the depth of the object from `0` to `Infinity`
	 * @default 2
	 * @returns the object value
	 */
	public object(value: unknown, depth = 2): void {
		console.dir(value, { depth, colors: true, numericSeparator: true });
	}
}

export const logger = new Logger();
