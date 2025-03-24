import { readdirSync, statSync } from "fs";
import path from "path";

const SRC_PATH = path.join(process.cwd(), "src");
const SKIP_DIRECTORIES = ["utils"];
export const VERSIONS = readdirSync(SRC_PATH).filter(name => {
	const fullPath = path.join(SRC_PATH, name);
	return statSync(fullPath).isDirectory() && !SKIP_DIRECTORIES.includes(name);
});
