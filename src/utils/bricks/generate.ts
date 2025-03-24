import fs from "fs";
import path from "path";
import prompts from "prompts";
import fsExtra from "fs-extra";
import { runCommand } from "@utils/exec";
import { logger } from "@utils/logger";
import { env } from "@/utils/env";
import { VERSIONS } from "@/utils/version";
import { toKebabCase, toCamelCase } from "@/utils/string";

const dirname = path.resolve(process.cwd(), "src", "utils", "bricks");

async function thread(): Promise<void> {
	const { brickName } = await prompts({
		type: "text",
		name: "brickName",
		message: "Brick name (Model):",
		validate: (v: string) =>
			v.length
				? /^[a-zA-Z ]*$/.test(v)
					? true
					: "Only alphabetic characters are allowed."
				: "Shouldn't be an empty string",
	});
	if (brickName === undefined) {
		logger.error("Prompt has been cancelled.");
		process.kill(process.pid);
	}
	const { version } = await prompts({
		type: "select",
		name: "version",
		message: "Nabii version:",
		choices: VERSIONS.map((version, index) => {
			return {
				title: version.toLocaleUpperCase(),
				value: version,
				selected: index === 0,
			};
		}),
	});
	if (version === undefined) {
		logger.error("Prompt has been cancelled.");
		process.kill(process.pid);
	}
	const brickKebabName = toKebabCase(brickName);
	const brickPascalName = brickName.replaceAll(" ", "");
	const PATH = path.join(
		process.cwd(),
		"src",
		version,
		"modules",
		brickKebabName,
	);
	const VERSION = version.toLocaleUpperCase();
	if (fs.existsSync(PATH)) {
		const { warning } = await prompts({
			type: "confirm",
			initial: false,
			name: "warning",
			message: `The model "${brickName}" already exist do you want to override test ?`,
		});
		if (warning === undefined) {
			logger.error("Prompt has been cancelled.");
			process.kill(process.pid);
		}
	}
	const { validate } = await prompts({
		type: "confirm",
		initial: true,
		name: "validate",
		message: `Are you sure you want to create a new model named ${brickName} on nabii ${version}?`,
	});
	if (validate === undefined) {
		logger.error("Prompt has been cancelled.");
		process.kill(process.pid);
	}
	if (!validate) return thread();
	// copy module template
	fsExtra.copySync(path.join(dirname, "module", version), PATH, {
		overwrite: true,
	});
	// copy module unit test template
	const TEST_PATH = path.join(
		process.cwd(),
		"src",
		version,
		"tests",
		`${brickKebabName}.test.ts`,
	);
	fsExtra.copySync(
		path.join(dirname, "test", version, "module.test"),
		TEST_PATH,
		{
			overwrite: true,
		},
	);
	// load content
	const adminFile = fs
		.readFileSync(`${PATH}/admin.module.sdk`)
		.toString("utf-8");
	const moduleFile = fs.readFileSync(`${PATH}/module.sdk`).toString("utf-8");
	const declarationFile = fs.readFileSync(`${PATH}/module.d`).toString("utf-8");
	const testFile = fs.readFileSync(TEST_PATH).toString("utf-8");
	// update content
	fs.writeFileSync(
		`${PATH}/admin.module.sdk`,
		adminFile
			.replaceAll("[brick]", brickKebabName)
			.replaceAll("[Brick]", brickPascalName)
			.replaceAll("[BRICK]", brickName)
			.replaceAll("[brickName]", toCamelCase(brickPascalName))
			.replaceAll("[version]", env.npm_package_version!)
			.replaceAll("[VERSION]", VERSION),
	);
	fs.writeFileSync(
		`${PATH}/module.sdk`,
		moduleFile
			.replaceAll("[brick]", brickKebabName)
			.replaceAll("[Brick]", brickPascalName)
			.replaceAll("[BRICK]", brickName)
			.replaceAll("[brickName]", toCamelCase(brickPascalName))
			.replaceAll("[version]", env.npm_package_version!)
			.replaceAll("[VERSION]", VERSION),
	);
	fs.writeFileSync(
		`${PATH}/module.d`,
		declarationFile
			.replaceAll("[brick]", brickKebabName)
			.replaceAll("[Brick]", brickPascalName)
			.replaceAll("[BRICK]", brickName)
			.replaceAll("[brickName]", toCamelCase(brickPascalName))
			.replaceAll("[version]", env.npm_package_version!)
			.replaceAll("[VERSION]", VERSION),
	);
	fs.writeFileSync(
		TEST_PATH,
		testFile
			.replaceAll("[brick]", brickKebabName)
			.replaceAll("[Brick]", brickPascalName)
			.replaceAll("[BRICK]", brickName)
			.replaceAll("[brickName]", toCamelCase(brickPascalName))
			.replaceAll("[version]", env.npm_package_version!)
			.replaceAll("[VERSION]", VERSION),
	);
	// rename files
	fs.renameSync(
		`${PATH}/admin.module.sdk`,
		`${PATH}/admin.${brickKebabName}.sdk.ts`,
	);

	fs.renameSync(`${PATH}/module.sdk`, `${PATH}/${brickKebabName}.sdk.ts`);
	fs.renameSync(`${PATH}/module.d`, `${PATH}/${brickKebabName}.d.ts`);

	// add export module
	const exportModule = fs
		.readFileSync(
			path.join(process.cwd(), "src", version, "modules", "index.ts"),
		)
		.toString("utf-8")
		.replace(
			"\n/**",
			`import { ${brickPascalName}${VERSION} } from "./${brickKebabName}/${brickKebabName}.sdk";\n\n/**`,
		)
		.replace(
			"};",
			`\t/**
		* 📦 {@link ${brickPascalName}${VERSION}} module 📦
		* @since v${env.npm_package_version}
		*/
		${brickPascalName}: ${brickPascalName}${VERSION},\n};`,
		);

	fs.writeFileSync(
		path.join(process.cwd(), "src", version, "modules", "index.ts"),
		exportModule,
	);

	// add types export module
	const exportTypeModule = fs
		.readFileSync(
			path.join(process.cwd(), "src", version, "modules", "types.d.ts"),
		)
		.toString("utf-8")
		.replace(
			"\n/**",
			`import type { I${brickPascalName}Types } from "./${brickKebabName}/${brickKebabName}";\n\n/**`,
		)
		.replace(
			"* ---------------------------",
			`* - {@link I${brickPascalName}Types}\n* ---------------------------`,
		)
		.replace("};", `\tI${brickPascalName}Types,\n\t};`);
	fs.writeFileSync(
		path.join(process.cwd(), "src", version, "modules", "types.d.ts"),
		exportTypeModule,
	);
	// lint code
	await runCommand("pnpm format");
	// build project
	await runCommand("pnpm build");
	// done
	logger.success(
		`Model ${brickPascalName} generated successfully!\nModule file: ${PATH}/${brickKebabName}.sdk.ts\nAdmin module file: ${PATH}/admin.${brickKebabName}.sdk.ts\nTypes file: ${PATH}/${brickKebabName}.ts\nTests file: ${TEST_PATH}`,
	);
}

thread();
