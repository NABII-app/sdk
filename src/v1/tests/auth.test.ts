import nabii, { NabiiError } from "@/.";
import { env, hasV1EnvironmentSMTP } from "@utils/env";
import { describe, it, expect, beforeEach } from "vitest";
import { ImapService } from "@utils/imap";
import { logger } from "@utils/logger";
import { faker } from "@faker-js/faker";

beforeEach(function (ctx) {
	if (!hasV1EnvironmentSMTP()) {
		ctx.skip();
	}
});

nabii.v1.onError(err => {
	if ("response" in err) {
		logger.error(err.response?.data);
	} else {
		logger.error("No internet connection!");
	}
});

describe("Auth", () => {
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
	it("Get Google SSO login URL", () => {
		expect(nabii.v1.Auth.strategy("google")).toBe(
			`${nabii.v1.getUrl()}/auth/google`,
		);
	});
	it("Get Facebook SSO login URL", () => {
		expect(nabii.v1.Auth.strategy("facebook")).toBe(
			`${nabii.v1.getUrl()}/auth/facebook`,
		);
	});
	it("Login to application", async () => {
		expect(
			await nabii.v1.Auth.login(env.LOGIN_EMAIL_V1, env.LOGIN_PASSWORD_V1),
		).toHaveProperty("accessToken");
	});
	it("Get credentials", async () => {
		expect(await nabii.v1.Auth.getCredentials()).toHaveProperty("accessToken");
	});
	it("Get user logged", async () => {
		expect(await nabii.v1.Auth.me()).toHaveProperty("id");
	});
	it("Get user login state", () => {
		expect(nabii.v1.Auth.isLogged()).toBe(true);
	});
	it("Login with saved login state", async () => {
		if (!nabii.v1.Auth.isLogged()) {
			throw new Error("Not logged!");
		}
		const { accessToken, refreshToken } = nabii.v1.Auth.getCredentials();
		expect(
			await nabii.v1.Auth.setCredentials({
				accessToken,
				refreshToken,
			}),
		).toHaveProperty("accessToken");
	});
	it("Check if connected user is administrator", async () => {
		expect(nabii.v1.Auth.isAdmin()).toBe(true);
	});
	it("Create one account process", async () => {
		expect(
			await nabii.v1.User.Admin.create({
				firstName: faker.person.firstName(),
				lastName: faker.person.lastName(),
				email: env.GOOGLE_EMAIL_V1!,
			}),
		).toHaveProperty("id");
		// Wait 15s to receive the email
		await new Promise(res => setTimeout(res, 15_000));
		const imap = new ImapService(env.GOOGLE_EMAIL_V1!, env.GOOGLE_PASSWORD_V1!);
		const email = await imap.getLastEmailFrom(env.SMTP_EMAIL_V1!);
		expect(email?.body.includes("token=3D")).toBe(true);
		if (email?.body.includes("token=3D")) {
			const emailSplitted = email.body.split("token=3D");
			const token = `${emailSplitted[emailSplitted.length - 1]?.split('" ')[0]?.replaceAll("=", "").replaceAll(/\s/g, "")}`;
			const isValidToken = await nabii.v1.Auth.checkTokenValidity(
				token,
				"activateAccountInvite",
			);
			expect(isValidToken).toBe(true);
			if (isValidToken) {
				expect(
					await nabii.v1.Auth.setPassword(token, env.GOOGLE_PASSWORD_V1!),
				).toHaveProperty("id");
			}
		} else {
			throw new Error("NO EMAIL FOUNDED!");
		}
	});
	it("Logout", async () => {
		expect(await nabii.v1.Auth.logout()).toEqual(void 0);
	});
	it("Forgot password process", async () => {
		expect(
			await nabii.v1.Auth.forgotPassword(env.GOOGLE_EMAIL_V1!),
		).toHaveProperty("id");
		// Wait 15s to receive the email
		await new Promise(res => setTimeout(res, 15_000));
		const imap = new ImapService(env.GOOGLE_EMAIL_V1!, env.GOOGLE_PASSWORD_V1!);
		const email = await imap.getLastEmailFrom(env.SMTP_EMAIL_V1!);
		expect(email?.body.includes("token=3D")).toBe(true);
		if (email?.body.includes("token=3D")) {
			const emailSplitted = email.body.split("token=3D");
			const token = `${emailSplitted[emailSplitted.length - 1]?.split('" ')[0]?.replaceAll("=", "").replaceAll(/\s/g, "")}`;
			const isValidToken = await nabii.v1.Auth.checkTokenValidity(
				token,
				"forgotPassword",
			);
			expect(isValidToken).toBe(true);
			if (isValidToken) {
				expect(
					await nabii.v1.Auth.resetPassword(token, env.GOOGLE_PASSWORD_V1!),
				).toHaveProperty("id");
			}
		} else {
			throw new Error("NO EMAIL FOUNDED!");
		}
	});
	it("Login with created user", async () => {
		expect(
			await nabii.v1.Auth.login(env.GOOGLE_EMAIL_V1!, env.GOOGLE_PASSWORD_V1!),
		).toHaveProperty("accessToken");
	});
	it("Change email account process", async () => {
		expect(
			await nabii.v1.User.changeEmail(env.GOOGLE_EMAIL_BIS_V1!),
		).toHaveProperty("emailSuccess");
		expect(await nabii.v1.Auth.logout()).toBe(void 0);
		// Wait 15s to receive the email
		await new Promise(res => setTimeout(res, 15_000));
		const imap = new ImapService(
			env.GOOGLE_EMAIL_BIS_V1!,
			env.GOOGLE_PASSWORD_BIS_V1!,
		);
		const email = await imap.getLastEmailFrom(env.SMTP_EMAIL_V1!);
		expect(email?.body.includes("token=3D")).toBe(true);
		if (email?.body.includes("token=3D")) {
			const emailSplitted = email.body.split("token=3D");
			const token = `${emailSplitted[emailSplitted.length - 1]?.split('" ')[0]?.replaceAll("=", "").replaceAll(/\s/g, "")}`;
			const isValidToken = await nabii.v1.Auth.checkTokenValidity(
				token,
				"activateAccount",
			);
			expect(isValidToken).toBe(true);
			if (isValidToken) {
				expect(await nabii.v1.Auth.activateAccount(token)).toHaveProperty("id");
				expect(
					await nabii.v1.Auth.login(
						env.GOOGLE_EMAIL_BIS_V1!,
						env.GOOGLE_PASSWORD_V1!,
					),
				).toHaveProperty("accessToken");
			}
		} else {
			throw new Error("NO EMAIL FOUNDED!");
		}
	});
	it("Delete the created account", async () => {
		expect(await nabii.v1.User.deleteMe()).toBe(void 0);
	});
	it("Login back to application", async () => {
		expect(
			await nabii.v1.Auth.login(env.LOGIN_EMAIL_V1, env.LOGIN_PASSWORD_V1),
		).toHaveProperty("accessToken");
	});
	let createdUserId: number;
	it("Create multiple account a administrator", async () => {
		const { succeed } = await nabii.v1.User.Admin.import([
			{
				firstName: faker.person.firstName(),
				lastName: faker.person.lastName(),
				email: env.GOOGLE_EMAIL_V1!,
			},
		]);
		expect(succeed[0]).toHaveProperty("id");
		createdUserId = succeed[0]?.id ?? 0;
	});
	it("Give administrator  rights to created user", async () => {
		expect(
			await nabii.v1.User.Admin.updateRole(
				createdUserId,
				nabii.v1.User.roles.ADMIN,
			),
		).toHaveProperty("id");
	});
	it("Delete created account as administrator", async () => {
		expect(await nabii.v1.User.Admin.delete(createdUserId)).toBe(void 0);
	});
	it("This user does not exist anymore", async () => {
		try {
			await nabii.v1.Auth.login(env.GOOGLE_EMAIL_V1!, env.GOOGLE_PASSWORD_V1!);
			expect(nabii.v1.Auth.getCredentials()).toBe({});
		} catch (err) {
			expect(err instanceof NabiiError).toBe(true);
		}
	});
	it("Logout", async () => {
		expect(await nabii.v1.Auth.logout()).toEqual(void 0);
	});
});
