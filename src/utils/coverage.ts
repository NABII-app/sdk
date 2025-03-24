import { runCommand } from "@utils/exec";
import { logger } from "@utils/logger";

const command = "start coverage/index.html";

runCommand(command).catch(err => {
	logger.error(`Error executing command: ${err.message}`);
	logger.error(
		"Failed to generate coverage report! Please run `pnpm test` before.",
	);
});
