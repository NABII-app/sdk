import fs, { readdirSync } from "fs";
import path from "path";
import prompts from "prompts";
import { runCommand } from "@utils/exec";
import { logger } from "@utils/logger";
import { env } from "@/utils/env";
import { VERSIONS } from "@/utils/version";
import { toKebabCase, toTitleCase } from "@/utils/string";

async function thread(): Promise<void> {
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
	const models = readdirSync(
		path.join(process.cwd(), "src", version, "modules"),
	)
		.map(entry =>
			path.join(path.join(process.cwd(), "src", version, "modules"), entry),
		)
		.filter(entryPath => fs.statSync(entryPath).isDirectory())
		.map(dirPath => toTitleCase(path.basename(dirPath)));
	const { brickName } = await prompts({
		type: "select",
		name: "brickName",
		message: "Remove module (model):",
		choices: models.map(title => {
			return {
				title,
				value: title,
			};
		}),
	});
	const brickKebabName = toKebabCase(brickName);
	const brickPascalName = brickName.replaceAll(" ", "");
	const PATH = path.join(
		process.cwd(),
		"src",
		version,
		"modules",
		brickKebabName,
	);
	const TEST_PATH = path.join(
		process.cwd(),
		"src",
		version,
		"tests",
		`${brickKebabName}.test.ts`,
	);
	const VERSION = version.toLocaleUpperCase();
	if (!fs.existsSync(PATH) || !fs.existsSync(TEST_PATH)) {
		logger.error(`The model "${brickName}" does not exist.`);
		process.kill(process.pid);
	}
	const { validate } = await prompts({
		type: "confirm",
		initial: true,
		name: "validate",
		message: `Are you sure you want to remove the model named ${brickName} on nabii ${version}?`,
	});
	if (validate === undefined) {
		logger.error("Prompt has been cancelled.");
		process.kill(process.pid);
	}
	if (!validate) return thread();
	// remove module and test files
	await fs.promises.rm(TEST_PATH, { force: true });
	await fs.promises.rm(PATH, { force: true, recursive: true });

	// remove export module
	const exportModule = fs
		.readFileSync(
			path.join(process.cwd(), "src", version, "modules", "index.ts"),
		)
		.toString("utf-8")
		.replace(
			`\nimport { ${brickPascalName}${VERSION} } from "./${brickKebabName}/${brickKebabName}.sdk";`,
			"",
		)
		.replace(
			"\t/**\n" +
				`\t * 📦 {@link ${brickPascalName}${VERSION}} module 📦\n` +
				`\t * @since v${env.npm_package_version}\n` +
				"\t */\n" +
				`\t${brickPascalName}: ${brickPascalName}${VERSION},\n`,
			"",
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
			`\nimport type { I${brickPascalName}Types } from "./${brickKebabName}/${brickKebabName}";`,
			"",
		)
		.replace(` * - {@link I${brickPascalName}Types}\n`, "")
		.replace(`\t\tI${brickPascalName}Types,\n`, "");

	fs.writeFileSync(
		path.join(process.cwd(), "src", version, "modules", "types.d.ts"),
		exportTypeModule,
	);
	// lint code
	await runCommand("pnpm format");
	// build project
	await runCommand("pnpm build");
	// done
	logger.success(`Model ${brickPascalName} removed successfully!`);
}

thread();
