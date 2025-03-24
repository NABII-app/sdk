import { Platform } from "@v1/config";
import { BaseV1 } from "@v1/base";
import { Refresh, Logged, Permission } from "@v1/decorators";
import type { IPaginated } from "@v1/types/nabii";
import type { IVersion, ICreateVersionForm, IVersionParams } from "./version";
import type { Infer } from "@dulysse1/ts-branding";

/**
 * @class {@link AdminVersionV1}
 * @since v1.4.0
 * @extends {BaseV1}
 */
export class AdminVersionV1 extends BaseV1 {
	/**
	 * `🖥️ ADMIN 🖥️`
	 * ####  📚 Get all {@link NabiiV1} {@link IVersion} 📚
	 * @param params set request query {@link IPaginateOptions} (optional)
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const { data } = await nabii.v1.Version.Admin.getAll(); // [...]
	 * ```
	 * @returns a {@link IPaginated} object of {@link IVersion}
	 * @since v1.4.0
	 */
	@Logged
	@Permission(Platform.APPLICATION)
	@Refresh
	public getAll<
		TSearch extends string | undefined = undefined,
		TLimit extends number = 15,
		TPage extends number = 1,
	>(
		params?: IVersionParams<Platform.ADMIN, TSearch, TLimit, TPage>,
	): Promise<IPaginated<IVersion<Platform.ADMIN>, TSearch, TLimit, TPage>> {
		return this._axios.get("/admin/version", { params });
	}
	/**
	 * `🖥️ ADMIN 🖥️`
	 * ####  📖 Retrieve a {@link NabiiV1} {@link IVersion} by `primary key` 📖
	 * @param pk the {@link IVersion} `primary key` you want to retrieve
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const version = await nabii.v1.Version.Admin.getByPk(pk); // {...}
	 * ```
	 * @returns an {@link IVersion} object or `null`
	 * @since v1.4.0
	 */
	@Logged
	@Permission(Platform.APPLICATION)
	@Refresh
	public getByPk(
		pk: Infer.PrimaryKey<IVersion<Platform.ADMIN>>,
	): Promise<IVersion<Platform.ADMIN> | null> {
		return this._axios.get(`/admin/version/${pk}`);
	}
	/**
	 * `🖥️ ADMIN 🖥️`
	 * ####  🆕 Create a new {@link NabiiV1} {@link IVersion} 🆕
	 * @param data The data required to create the version
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const version = await nabii.v1.Version.Admin.create({
	 * 	note: "New minor version!",
	 *  type: "minor",
	 * }); // {...}
	 * ```
	 * @returns the created {@link IVersion} object
	 * @since v1.4.0
	 */
	@Logged
	@Permission(Platform.APPLICATION)
	@Refresh
	public create(
		data: ICreateVersionForm<Platform.ADMIN>,
	): Promise<IVersion<Platform.ADMIN>> {
		return this._axios.post("/admin/version", data);
	}
}

export declare type IAdminVersionV1 = typeof AdminVersionV1;
