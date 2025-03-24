/**
 * @example "Demo Model" => "demoModel"
 * @param value the string input
 * @returns the string to camelCase output format
 */
export const toCamelCase = (value: string) =>
	value
		.replace(/\s(.)/g, (_match, letter) => letter.toUpperCase())
		.replace(/^\w/, firstChar => firstChar.toLowerCase());

/**
 * @example "Demo Model" => "demo-model"
 * @param value the string input
 * @returns the string to kebabCase output format
 */
export const toKebabCase = (value: string) =>
	value
		.replaceAll(/([a-z])([A-Z])/g, "$1-$2")
		.replaceAll(" ", "-")
		.toLowerCase();

/**
 * @example "demo-model" => "Demo Model"
 * @param value the string input
 * @returns the string to titleCase output format
 */
export const toTitleCase = (value: string) =>
	value
		.split("-")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
