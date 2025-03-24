import nabii, { type INabiiV1 } from "@/.";
import { env } from "@utils/env";
import { describe, it, expect } from "vitest";
import { logger } from "@utils/logger";
import { faker } from "@faker-js/faker";

nabii.v1.onError(err => {
	if ("response" in err) {
		logger.object(err.response?.data);
		logger.error(err.response?.data);
	} else {
		logger.error("No internet connection!");
	}
});

let adminVersion: INabiiV1.IVersionTypes.IVersion<INabiiV1.Platform.ADMIN>;

describe("Version", () => {
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
	it("Get all as administrator", async () => {
		expect(await nabii.v1.Version.Admin.getAll()).toHaveProperty("data");
	});
	it("Create as administrator", async () => {
		adminVersion = await nabii.v1.Version.Admin.create({
			type: "minor",
			note: faker.lorem.text(),
		});
		expect(adminVersion).toHaveProperty("id");
	});
	it("Get one as administrator", async () => {
		expect(
			await nabii.v1.Version.Admin.getByPk(adminVersion.id),
		).toHaveProperty("id");
	});
	it("Check if the version is the latest", async () => {
		expect((await nabii.v1.Version.check(adminVersion.name)).isLatest).toBe(
			true,
		);
	});
	it("List of version types", async () => {
		expect(nabii.v1.Version.types.PATCH).toBe("patch");
		expect(nabii.v1.Version.types.MINOR).toBe("minor");
		expect(nabii.v1.Version.types.MAJOR).toBe("major");
	});
	it("Logout", async () => {
		expect(await nabii.v1.Auth.logout()).toEqual(void 0);
	});
});
