import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { runCommand } from "@utils/exec";
import { logger } from "@utils/logger";
import nabii from "@/.";
const keys = Object.keys(nabii);

const BUILD_DIR = "dist";
const TYPE_CJS_PATH = resolve(process.cwd(), BUILD_DIR, "index.d.cts");
const TYPE_PATHS = [
	resolve(process.cwd(), BUILD_DIR, "index.d.ts"),
	TYPE_CJS_PATH,
] as const;

function Description(message: string) {
	return function <
		T,
		TKey extends keyof T,
		TDescriptor extends TypedPropertyDescriptor<
			(...args: unknown[]) => Promise<void>
		>,
	>(_: T, __: TKey, descriptor: TDescriptor): TDescriptor {
		if (!descriptor.value) {
			throw new TypeError("Invalid property descriptor");
		}
		const original = descriptor.value;
		descriptor.value = async function <TArgs>(...args: TArgs[]) {
			logger.info(` ℹ Start ${message}...`);
			const applied = await original.apply(this, args);
			logger.success(
				`✅ ${message.charAt(0).toUpperCase() + message.slice(1)} done.`,
			);
			return applied;
		};
		return descriptor;
	};
}

class PostBuildModules {
	@Description("update type names for versioning")
	public async updateTypeNames(): Promise<void> {
		for (const typePath of TYPE_PATHS) {
			if (!existsSync(typePath)) {
				logger.error(`Build file ${typePath} is missing !`);
				process.kill(process.pid);
			}
			let file = readFileSync(typePath).toString("utf-8");
			// replace duplicate identifier with multiple versioning
			for (let i = 0; i < keys.length; i++) {
				const newKey = keys[i]?.toLocaleUpperCase();
				if (!newKey) continue;
				const oldKey = `$${keys.length - 1 - i}`;
				file = file.replaceAll(oldKey, newKey);
			}
			writeFileSync(typePath, file);
		}
	}
	@Description("prettify DTS dist files")
	public async prettierFormatDist(): Promise<void> {
		const path = resolve(process.cwd(), ".gitignore");
		if (!existsSync(path)) {
			logger.error(".gitignore is missing !");
			process.kill(process.pid);
		}
		let file = readFileSync(path).toString("utf-8");
		// comment dist directory
		file = file.replaceAll(BUILD_DIR, "#" + BUILD_DIR);
		writeFileSync(path, file);

		// format dist typing files
		for (const typePath of TYPE_PATHS) {
			if (!existsSync(typePath)) {
				logger.error(`Build file ${typePath} is missing !`);
				process.kill(process.pid);
			}
			const typeDistPath = (
				BUILD_DIR +
				typePath.split(BUILD_DIR)[typePath.split(BUILD_DIR).length - 1]
			).replaceAll("\\", "/");
			await runCommand(`npx prettier ${typeDistPath} --write --ignore-unknown`);
		}
		// uncomment dist directory
		file = file.replaceAll("#" + BUILD_DIR, BUILD_DIR);
		writeFileSync(path, file);
	}
}

(async () => {
	logger.info("⚡️ Starting Post build script...");
	const modules = new PostBuildModules();
	await modules.updateTypeNames();
	await modules.prettierFormatDist();
	logger.success("⚡️ Post build script is done.");
})();
