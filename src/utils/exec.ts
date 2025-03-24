import { exec } from "child_process";
import { logger } from "@utils/logger";

/**
 * Executes a shell command and logs the output.
 * @param {string} command - The command to execute.
 * @returns {Promise<void>} - A promise that resolves when the command completes.
 */
export function runCommand(command: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const process = exec(command, err => {
			if (err) {
				return reject(err);
			}
			resolve();
		});

		// Log stdout and stderr as the process runs
		process.stdout?.on("data", data => {
			if (typeof data === "string") logger.log(data.replaceAll("\n", ""));
		});

		process.stderr?.on("data", data => {
			logger.error(data);
		});
	});
}
