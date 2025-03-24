import { runCommand } from "@utils/exec";
import prompts from "prompts";
import fs, { readdirSync } from "fs";
import path from "path";
import { logger } from "@utils/logger";
import { VERSIONS } from "@/utils/version";
import { toKebabCase, toTitleCase } from "@/utils/string";

(async () => {
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
	const models = readdirSync(path.join(process.cwd(), "src", version, "tests"))
		.filter(entryPath => entryPath.includes(".test.ts"))
		.map(entryPath => toTitleCase(`${entryPath.split(".test.ts")[0]}`));
	const { brickName } = await prompts({
		type: "select",
		name: "brickName",
		message: "Test module (model):",
		choices: models.map(title => {
			return {
				title,
				value: title,
			};
		}),
	});
	if (brickName === undefined) {
		logger.error("Prompt has been cancelled.");
		process.kill(process.pid);
	}
	const brickKebabName = toKebabCase(brickName);
	const PATH = path.join(
		process.cwd(),
		"src",
		version,
		"tests",
		`${brickKebabName}.test.ts`,
	);
	if (!fs.existsSync(PATH)) {
		logger.error("No test file named: " + brickKebabName);
		process.kill(process.pid);
	}
	logger.info("start...");
	await runCommand(`vitest src/${version}/tests/${brickKebabName}.test.ts`);
	logger.success(`All tests passed successfully!\nTests: ${PATH}`);
})();
