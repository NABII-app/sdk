import globals from "globals";
import pluginJs from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import unusedImports from "eslint-plugin-unused-imports";

const interfaceExeptions = ["NabiiV1", "ProcessEnv"];

/**
 * @param {string[]} exceptions
 * @returns {string}
 */
const generateRegex = exceptions => {
	const escapedExceptions = exceptions.map(e =>
		e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
	);
	return `^((?!${escapedExceptions.join("|")}).)*$`;
};

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		ignores: ["node_modules/**/*", "dist/**/*"],
		files: ["**/*.{js,mjs,cjs,ts}"],
		languageOptions: {
			parser: tsParser,
			globals: {
				...globals.node,
				NodeJS: "readonly",
			},
		},
		plugins: {
			"@typescript-eslint": tsPlugin,
			prettier: prettierPlugin,
			"unused-imports": unusedImports,
		},
		settings: {
			"import/resolver": {
				typescript: {
					alwaysTryTypes: true,
				},
			},
		},
		rules: {
			...pluginJs.configs.recommended.rules,
			...tsPlugin.configs.recommended.rules,
			"@typescript-eslint/no-empty-interface": [
				"error",
				{ allowSingleExtends: true },
			],
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/no-explicit-any": [
				"error",
				{ fixToUnknown: true, ignoreRestArgs: false },
			],
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"no-debugger": "error",
			"prettier/prettier": "error",
			"no-throw-literal": "error",
			"@typescript-eslint/ban-types": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-namespace": "off",
			"no-restricted-syntax": [
				"warn",
				{
					selector:
						"CallExpression[callee.object.name='console'][callee.property.name=/^(log|warn|error|info|trace|dir)$/]",
					message:
						'"console" function is not recommanded, you should import and use "logger" service instead to get colored logs.',
				},
			],
			"no-redeclare": "off",
			"@typescript-eslint/no-unsafe-declaration-merging": "off",
			"no-var": "error",
			"prefer-const": [
				"error",
				{
					destructuring: "all",
					ignoreReadBeforeAssign: true,
				},
			],
			"no-const-assign": "error",
			"@typescript-eslint/no-use-before-define": [
				"error",
				{ functions: true, classes: true, variables: true, typedefs: false },
			],
			"@typescript-eslint/no-inferrable-types": [
				"error",
				{
					ignoreParameters: true,
					ignoreProperties: true,
				},
			],
			"no-unused-expressions": "error",
			"no-useless-constructor": "error",
			"no-useless-rename": [
				"error",
				{
					ignoreDestructuring: false,
					ignoreImport: false,
					ignoreExport: false,
				},
			],
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{
					prefer: "type-imports",
					disallowTypeAnnotations: false,
				},
			],
			eqeqeq: ["error", "always"],
			"@typescript-eslint/naming-convention": [
				"warn",
				{
					selector: "import",
					format: ["camelCase", "PascalCase", "UPPER_CASE"],
				},
				{
					selector: "variable",
					modifiers: ["const"],
					leadingUnderscore: "allow",
					format: ["camelCase", "UPPER_CASE"],
				},
				{
					selector: "class",
					format: ["PascalCase"],
				},
				{
					selector: "interface",
					format: ["PascalCase"],
					prefix: ["I"],
					filter: {
						regex: generateRegex(interfaceExeptions),
						match: true,
					},
				},
				{
					selector: "typeAlias",
					format: ["PascalCase"],
					prefix: ["I"],
				},
				{
					selector: "typeParameter",
					format: ["PascalCase"],
					custom: {
						regex: "^(T|T[A-Z][a-zA-Z]+)$",
						match: true,
					},
				},
			],
			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": [
				"warn",
				{
					vars: "all",
					varsIgnorePattern: "^_",
					args: "after-used",
					argsIgnorePattern: "^_",
				},
			],
		},
	},
	{
		files: ["src/**/*.ts"],
		rules: {
			"no-restricted-syntax": [
				"error",
				{
					selector:
						"CallExpression[callee.object.name='console'][callee.property.name=/^(log|warn|error|info|trace|dir)$/]",
					message:
						'"console" function is not allow in the souce code! Use throw Error instead or carefully "console.debug" function.',
				},
			],
		},
	},
	{
		files: ["*/**/logger.ts"],
		rules: {
			"no-restricted-syntax": "off",
		},
	},
];
