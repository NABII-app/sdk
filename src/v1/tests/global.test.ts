import nabii, { type INabiiV1, NabiiError } from "@/.";
import { env } from "@utils/env";
import { describe, it, expect } from "vitest";
import * as errors from "../lang/fr/error.json";

nabii.v1.setLang("fr");

describe("Global methods", () => {
	const onLogin = () => {};
	it("Add event listener on login", () => {
		expect(nabii.v1.addEventListener("login", onLogin)).toHaveProperty("Auth");
	});
	it("Get event listener created", () => {
		expect(nabii.v1.listEventListeners("login").length).toBe(1);
	});
	it("Remove event listener created", () => {
		expect(nabii.v1.removeEventListener("login", onLogin)).toHaveProperty(
			"Auth",
		);
	});
	it("There is no more event listener", () => {
		expect(nabii.v1.listEventListeners("login").length).toBe(0);
	});
	it("Default language is french", () => {
		expect(nabii.v1.getLang()).toEqual("fr");
	});
	it(`Default API URL is ${env.NABII_URL_V1}`, () => {
		expect(nabii.v1.getUrl()).toEqual(env.NABII_URL_V1);
	});
	it("Default mode is production", () => {
		expect(nabii.v1.getMode()).toEqual("production");
	});
	it("Add an incorrect server URL", async () => {
		expect(
			await nabii.v1.setUrl(env.NABII_URL_V1.replace("http", "https")).getUrl(),
		).not.toBe(env.NABII_URL_V1);
	});
	it("Check if you can't join the server", async () => {
		expect(await nabii.v1.resolve()).toBe(false);
	});
	it(`Set URL`, () => {
		expect(nabii.v1.setUrl(env.NABII_URL_V1).getUrl()).toEqual(
			env.NABII_URL_V1,
		);
	});
	it("Check if you can join the server", async () => {
		expect(await nabii.v1.resolve()).toBe(true);
	});
	it("Instance of Nabii error", async () => {
		try {
			await nabii.v1.Auth.login(env.LOGIN_EMAIL_V1, "");
		} catch (err) {
			expect(err instanceof NabiiError).toBe(true);
		}
	});
	it("Zod language errors", async () => {
		const fakeLang = "es" as unknown as INabiiV1.IGlobalTypes.ILanguage;
		try {
			nabii.v1.setLang(fakeLang);
		} catch (err) {
			expect(
				err instanceof Error &&
					err.message.includes(
						errors.invalid_language.replace("{language}", fakeLang),
					),
			).toBe(true);
		}
	});
	it("Zod mode errors", async () => {
		const fakeMode = "NABIId mode" as unknown as INabiiV1.IGlobalTypes.IMode;
		try {
			nabii.v1.setMode(fakeMode);
		} catch (err) {
			expect(
				err instanceof Error &&
					err.message.includes(errors.invalid_mode.replace("{mode}", fakeMode)),
			).toBe(true);
		}
	});
	it("Zod mode errors", async () => {
		const fakeUrl = "fake_url";
		try {
			nabii.v1.setUrl(fakeUrl);
		} catch (err) {
			expect(
				err instanceof Error &&
					err.message.includes(errors.invalid_url.replace("{url}", fakeUrl)),
			).toBe(true);
		}
	});
	it("Zod credentials errors", async () => {
		const fakeCredentials = {
			accessToken: 1,
			youveBeenTrolled: true,
		} as unknown as INabiiV1.IGlobalTypes.ICredentials;
		try {
			await nabii.v1.Auth.setCredentials(fakeCredentials);
		} catch (err) {
			expect(
				err instanceof Error &&
					err.message.includes(
						errors.invalid_credentials.replace("-> « {err} »", ""),
					),
			).toBe(true);
		}
	});
	it("Login required decorator error", async () => {
		try {
			await nabii.v1.Auth.me();
		} catch (err) {
			expect(
				err instanceof Error && err.message.includes(errors.missing_login),
			).toBe(true);
		}
	});
});
