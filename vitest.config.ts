import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import dotenv from "dotenv";
dotenv.config();
import { env } from "process";
import { readdirSync, statSync } from "fs";
import path from "path";

const SRC_PATH = path.join(process.cwd(), "src");
const SKIP_DIRECTORIES = ["utils"];
const VERSIONS = readdirSync(SRC_PATH).filter(name => {
	const fullPath = path.join(SRC_PATH, name);
	return statSync(fullPath).isDirectory() && !SKIP_DIRECTORIES.includes(name);
});

function getIncludeConfigCoverage(versions: string[]): string[] {
	const [first, ...rest] = versions;
	return versions.length
		? [
				`src/${first}/index.ts`,
				`src/${first}/modules/**`,
				...getIncludeConfigCoverage(rest),
			]
		: [];
}

function getExcludeConfigCoverage(versions: string[]): string[] {
	const [first, ...rest] = versions;
	return versions.length
		? [
				...(!(
					env[`GOOGLE_EMAIL_${first.toLocaleUpperCase()}`] &&
					env[`GOOGLE_PASSWORD_${first.toLocaleUpperCase()}`] &&
					env[`SMTP_EMAIL_${first.toLocaleUpperCase()}`] &&
					env[`GOOGLE_EMAIL_BIS_${first.toLocaleUpperCase()}`] &&
					env[`GOOGLE_PASSWORD_BIS_${first.toLocaleUpperCase()}`]
				)
					? [
							`src/${first}/**/*.d.ts`,
							`src/${first}/modules/auth/**`,
							`src/${first}/modules/user/**`,
						]
					: []),
				...getIncludeConfigCoverage(rest),
			]
		: [];
}

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		testTimeout: 60_000,
		bail: 1,
		watch: false,
		fileParallelism: true,
		coverage: {
			reporter: ["text", "json", "html"],
			provider: "v8",
			thresholds: {
				lines: 90,
				functions: 100,
				statements: 90,
				perFile: true,
				autoUpdate: false,
			},
			include: getIncludeConfigCoverage(VERSIONS),
			exclude: getExcludeConfigCoverage(VERSIONS),
		},
	},
});
