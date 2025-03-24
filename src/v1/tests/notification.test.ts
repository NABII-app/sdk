import nabii from "@/.";
import { env } from "@utils/env";
import { describe, it, expect } from "vitest";
import * as errors from "../lang/fr/error.json";
import { logger } from "@utils/logger";

nabii.v1.onError(err => {
	if ("response" in err) {
		logger.error(err.response?.data);
	} else {
		logger.error("No internet connection!");
	}
});

describe("Notification", () => {
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
	it("Login to application", async () => {
		expect(
			await nabii.v1.Auth.login(env.LOGIN_EMAIL_V1, env.LOGIN_PASSWORD_V1),
		).toHaveProperty("accessToken");
	});
	it("Enable Notification is not available on WEB", async () => {
		try {
			await nabii.v1.Notification.enable();
		} catch (err) {
			expect(
				err instanceof Error && err.message.includes(errors.firebase_platform),
			).toEqual(true);
		}
	});
	it("Disable Notification", async () => {
		expect(await nabii.v1.Notification.disable()).toBe(void 0);
	});
	it("Notification token is not defined", async () => {
		expect(nabii.v1.Notification.token).toBe(undefined);
	});
	it("Create an event listener is not available on WEB", async () => {
		try {
			await nabii.v1.Notification.addEventListener(
				"registrationError",
				logger.log,
			);
		} catch (err) {
			expect(
				err instanceof Error && err.message.includes(errors.firebase_platform),
			).toEqual(true);
		}
	});
	it("Remove all event listeners is not available on WEB", async () => {
		try {
			await nabii.v1.Notification.removeAllListeners();
		} catch (err) {
			expect(
				err instanceof Error && err.message.includes(errors.firebase_platform),
			).toEqual(true);
		}
	});
	it("Logout", async () => {
		expect(await nabii.v1.Auth.logout()).toEqual(void 0);
	});
	it("Login with enable Notification is not working on WEB", async () => {
		try {
			await nabii.v1.Notification.enable();
			await nabii.v1.Auth.login(env.LOGIN_EMAIL_V1, env.LOGIN_PASSWORD_V1);
		} catch (err) {
			expect(
				err instanceof Error && err.message.includes(errors.firebase_platform),
			).toEqual(true);
		} finally {
			expect(nabii.v1.Auth.isLogged()).toBe(false);
		}
	});
	it("Disable Notification", async () => {
		expect(await nabii.v1.Notification.disable()).toBe(void 0);
	});
});
