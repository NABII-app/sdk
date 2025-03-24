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

describe("User", () => {
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
	it("My email is taken", async () => {
		expect(await nabii.v1.User.emailIsAvailable(env.LOGIN_EMAIL_V1)).toBe(
			false,
		);
	});
	it("Check if my password is correct", async () => {
		expect(await nabii.v1.User.checkPassword(env.LOGIN_PASSWORD_V1)).toBe(true);
	});
	it("Update my profile", async () => {
		if (!nabii.v1.Auth.isLogged()) {
			throw new Error("Not logged.");
		}
		const { user } = nabii.v1.Auth.getCredentials();
		expect(
			await nabii.v1.User.updateMe({
				firstName: user.firstName,
			}),
		).toHaveProperty("id");
	});
	it("Get all users as administrator", async () => {
		expect(await nabii.v1.User.Admin.getAll()).toHaveProperty("data");
	});
	it("Get all administrator  users as administrator", async () => {
		expect(await nabii.v1.User.Admin.getAllAdmins()).toHaveProperty("data");
	});
	it("Get all pending users as administrator", async () => {
		expect(await nabii.v1.User.Admin.getAllPending()).toHaveProperty("data");
	});
	it("Check each user roles", async () => {
		expect(nabii.v1.User.roles.BANNED).toBe(0);
		expect(nabii.v1.User.roles.USER).toBe(100);
		expect(nabii.v1.User.roles.SUPERVISOR).toBe(150);
		expect(nabii.v1.User.roles.ADMIN).toBe(200);
	});
	it("Update an user as administrator", async () => {
		if (!nabii.v1.Auth.isLogged()) {
			throw new Error("Not logged.");
		}
		const { user } = nabii.v1.Auth.getCredentials();
		expect(
			await nabii.v1.User.Admin.update(user.id, {
				firstName: user.firstName,
			}),
		).toHaveProperty("id");
	});
	it("Get an user by ID as administrator", async () => {
		if (!nabii.v1.Auth.isLogged()) {
			throw new Error("Not logged.");
		}
		const { user } = nabii.v1.Auth.getCredentials();
		expect(await nabii.v1.User.Admin.getByPk(user.id)).toHaveProperty("id");
	});
	it("Export all users as administrator", async () => {
		expect(typeof (await nabii.v1.User.Admin.export())).toBe("string");
	});
	it("Logout", async () => {
		expect(await nabii.v1.Auth.logout()).toEqual(void 0);
	});
});
