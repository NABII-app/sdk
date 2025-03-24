import nabii from "@/.";
import { env } from "@utils/env";
import { describe, it, expect } from "vitest";
import { logger } from "@utils/logger";

nabii.v1.onError(err => {
	if ("response" in err) {
		logger.error(err.response?.data);
	} else {
		logger.error("No internet connection!");
	}
});

describe("Socket", () => {
	it("Check if you can join the server", async () => {
		expect(await nabii.v1.resolve()).toBe(true);
	});
	it("Set mode to test", () => {
		nabii.v1.setMode("test");
		expect(nabii.v1.getMode()).toEqual("test");
	});
	it(`Set URL`, () => {
		expect(nabii.v1.setUrl(env.NABII_URL_V1).getUrl()).toEqual(
			env.NABII_URL_V1,
		);
	});
	it(`Set Lang`, () => {
		expect(nabii.v1.setLang("fr").getLang()).toEqual("fr");
	});
	it("Socket is not logged", () => {
		expect(nabii.v1.Socket.isLogged()).toBe(false);
	});
	it("Login to application", async () => {
		expect(
			await nabii.v1.Auth.login(env.LOGIN_EMAIL_V1, env.LOGIN_PASSWORD_V1),
		).toHaveProperty("accessToken");
	});
	it("Socket is logged", () => {
		expect(nabii.v1.Socket.isLogged()).toBe(true);
	});
	it("Disable sockets", async () => {
		expect(await nabii.v1.Socket.disable()).toBe(void 0);
	});
	it("Socket is not logged", () => {
		expect(nabii.v1.Socket.isLogged()).toBe(false);
	});
	it("Enable sockets", async () => {
		expect(await nabii.v1.Socket.enable()).toBe(void 0);
	});
	it("Socket is logged", () => {
		expect(nabii.v1.Socket.isLogged()).toBe(true);
	});
	it("Create socket event listener", () => {
		expect(nabii.v1.Socket.emit("ping", { now: new Date() })).toBe(void 0);
	});
	it("Test 'disconnect' event", async () => {
		const handleDisconnectEvent = new Promise((resolve, reject) => {
			try {
				nabii.v1.Socket.on("disconnect", m => resolve(m));
				nabii.v1.Socket.disable();
			} catch (err) {
				reject(err instanceof Error ? err : new Error(`${err}`));
			}
		});
		expect(await handleDisconnectEvent).toBe("io client disconnect");
	});
	it("Test 'connect' event", async () => {
		const handleConnectEvent = new Promise<void>((resolve, reject) => {
			try {
				nabii.v1.Socket.on("connect_success", resolve);
				nabii.v1.Socket.on("connect_error", reject);
				nabii.v1.Socket.enable();
			} catch (err) {
				reject(err instanceof Error ? err : new Error(`${err}`));
			}
		});
		expect(await handleConnectEvent).toBe(void 0);
	});
	it("Test 'ping/pong' event", async () => {
		const handlePingPongEvent = new Promise((resolve, reject) => {
			try {
				nabii.v1.Socket.on("pong", ({ responseTime }) => resolve(responseTime));
				nabii.v1.Socket.emit("ping", { now: new Date() });
			} catch (err) {
				reject(err instanceof Error ? err : new Error(`${err}`));
			}
		});
		expect(typeof (await handlePingPongEvent)).toBe("number");
	});
	it("Kill socket event listeners", () => {
		expect(nabii.v1.Socket.off("disconnect")).toBe(void 0);
		expect(nabii.v1.Socket.off("pong")).toBe(void 0);
	});
	it("Logout", async () => {
		expect(await nabii.v1.Auth.logout()).toEqual(void 0);
	});
});
