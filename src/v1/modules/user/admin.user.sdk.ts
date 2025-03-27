import { Platform } from "@v1/config";
import { BaseV1 } from "@v1/base";
import { Refresh, Logged, Permission } from "@v1/decorators";
import type { IPaginated } from "@v1/types/nabii";
import type {
	IUser,
	ICreateUserForm,
	IUpdateUserForm,
	IUserParams,
	IRole,
	IBulkCreateResult,
} from "./user";
import type { Infer } from "@dulysse1/ts-branding";
import { useFormData } from "@/form";

/**
 * @class {@link AdminUserV1}
 * @since v1.0.0
 * @extends {BaseV1}
 */
export class AdminUserV1 extends BaseV1 {
	/**
	 * `🖥️ ADMIN 🖥️`
	 * ####  📚 Get all pending {@link NabiiV1} user} 📚
	 * @param params set request query {@link IPaginateOptions} (optional)
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const { data } = await nabii.v1.User.Admin.getAllPending(); // [...]
	 * ```
	 * @returns a {@link IPaginated} object of {@link IUser}
	 * @since v1.0.0
	 */
	@Logged
	@Permission(Platform.APPLICATION)
	@Refresh
	public getAllPending<
		TSearch extends string | undefined = undefined,
		TLimit extends number = 15,
		TPage extends number = 1,
	>(
		params?: IUserParams<Platform.ADMIN, TSearch, TLimit, TPage>,
	): Promise<IPaginated<IUser<Platform.ADMIN>, TSearch, TLimit, TPage>> {
		return this._axios.get("/admin/user/pending", { params });
	}
	/**
	 * `🖥️ ADMIN 🖥️`
	 * ####  📚 Get all {@link NabiiV1} {@link IUser} 📚
	 * @param params set request query {@link IPaginateOptions} (optional)
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const { data } = await nabii.v1.User.Admin.getAll(); // [...]
	 * ```
	 * @returns a {@link IPaginated} object of {@link IUser}
	 * @since v1.0.0
	 */
	@Logged
	@Permission(Platform.APPLICATION)
	@Refresh
	public getAll<
		TSearch extends string | undefined = undefined,
		TLimit extends number = 15,
		TPage extends number = 1,
	>(
		params?: IUserParams<Platform.ADMIN, TSearch, TLimit, TPage>,
	): Promise<IPaginated<IUser<Platform.ADMIN>, TSearch, TLimit, TPage>> {
		return this._axios.get("/admin/user", { params });
	}
	/**
	 * `🖥️ ADMIN 🖥️`
	 * ####  📖 Retrieve a {@link NabiiV1} {@link IUser} by `primary key` 📖
	 * @param pk the {@link IUser} `primary key` you want to retrieve
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const user = await nabii.v1.User.Admin.getByPk(pk); // {...}
	 * ```
	 * @returns an {@link IUser} object or `null`
	 * @since v1.0.0
	 */
	@Logged
	@Permission(Platform.APPLICATION)
	@Refresh
	public getByPk(
		pk: Infer.PrimaryKey<IUser<Platform.ADMIN>>,
	): Promise<IUser<Platform.ADMIN> | null> {
		return this._axios.get(`/admin/user/${pk}`);
	}
	/**
	 * `🖥️ ADMIN 🖥️`
	 * ####  🆕 Create a new {@link NabiiV1} {@link IUser} 🆕
	 * @param data user data to create
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const user = await nabii.v1.User.Admin.create({
	 * 	firstName : "MyName",
	 *		lastName: "MyLastName",
	 *		email: "email@domain.com",
	 * }); // {...}
	 * ```
	 * @returns the created {@link IUser} object
	 * @since v1.0.0
	 */
	@Logged
	@Permission(Platform.APPLICATION)
	@Refresh
	public async create(
		data: ICreateUserForm<Platform.ADMIN>,
	): Promise<IUser<Platform.ADMIN>> {
		const formData = await useFormData(data, [
			"avatar",
			"email",
			"firstName",
			"lastName",
		]);
		return this._axios.post("/admin/user", formData);
	}
	/**
	 * `🖥️ ADMIN 🖥️`
	 * ####  🔄 Update {@link NabiiV1} {@link IUser} by `primary key` 🔄
	 * @param pk the {@link IUser} `primary key` you want to update
	 * @param data user data to update
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const user = await nabii.v1.User.Admin.update(
	 * 	pk,
	 * 	{
	 * 		firstName: "updatedName"
	 * 	}
	 * ); // {...}
	 * ```
	 * @returns the updated {@link IUser} object
	 * @since v1.0.0
	 */
	@Logged
	@Permission(Platform.APPLICATION)
	@Refresh
	public async update(
		pk: Infer.PrimaryKey<IUser<Platform.ADMIN>>,
		data: IUpdateUserForm<Platform.ADMIN>,
	): Promise<IUser<Platform.ADMIN>> {
		const formData = await useFormData(data, [
			"avatar",
			"email",
			"firstName",
			"lastName",
		]);
		return this._axios.patch(`/admin/user/${pk}`, formData);
	}
	/**
	 * `🖥️ ADMIN 🖥️`
	 * ####  🗑️ Delete a {@link NabiiV1} {@link IUser} by `primary key` 🗑️
	 * @param pk the {@link IUser} `primary key` you want to delete
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * await nabii.v1.User.Admin.delete(pk);
	 * ```
	 * @returns a void function
	 * @since v1.0.0
	 */
	@Logged
	@Permission(Platform.APPLICATION)
	@Refresh
	public async delete(
		pk: Infer.PrimaryKey<IUser<Platform.ADMIN>>,
	): Promise<void> {
		await this._axios.delete(`/admin/user/${pk}`);
	}
	/**
	 * `🖥️ ADMIN 🖥️`
	 * ####  🔄 Update {@link NabiiV1} {@link IUser} `role` by `primary key` 🔄
	 * @param pk the {@link IUser} `primary key` you want to update
	 * @param newRole the new {@link IRole}
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const user = await nabii.v1.User.Admin.updateRole(
	 * 	pk,
	 * 	nabii.v1.User.roles.ADMIN
	 * ); // {...}
	 * ```
	 * @returns the updated {@link IUser} object
	 * @since v1.0.0
	 */
	@Logged
	@Permission(Platform.APPLICATION)
	@Refresh
	public updateRole(
		pk: Infer.PrimaryKey<IUser<Platform.ADMIN>>,
		newRole: IRole,
	): Promise<IUser<Platform.ADMIN>> {
		return this._axios.patch(`/admin/user/${pk}/role`, { role: newRole });
	}
	/**
	 * `🖥️ ADMIN 🖥️`
	 * ####  📚 Get all {@link NabiiV1} administrator  {@link IUser} 📚
	 * @param params set request query {@link IPaginateOptions} (optional)
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const { data } = await nabii.v1.User.Admin.getAll(); // [...]
	 * ```
	 * @returns a {@link IPaginated} object of {@link IUser}
	 * @since v1.0.0
	 */
	@Logged
	@Permission(Platform.APPLICATION)
	@Refresh
	public getAllAdmins<
		TSearch extends string | undefined = undefined,
		TLimit extends number = 15,
		TPage extends number = 1,
	>(
		params?: IUserParams<Platform.ADMIN, TSearch, TLimit, TPage>,
	): Promise<IPaginated<IUser<Platform.ADMIN>, TSearch, TLimit, TPage>> {
		return this._axios.get("/admin/user/admin", { params });
	}
	/**
	 * `🖥️ ADMIN 🖥️`
	 * ####  ⤴️ Export all your users as excel file ⤴️
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const attachment = await nabii.v1.User.Admin.export(); // "<html>...</html>"
	 * ```
	 * @returns the attachment `xls` file as `string`
	 * @since v1.0.0
	 */
	@Logged
	@Permission(Platform.APPLICATION)
	@Refresh
	public export(): Promise<string> {
		return this._axios.get("/admin/user/export");
	}
	/**
	 * `🖥️ ADMIN 🖥️`
	 * ####  ⤵️ Import many users ⤵️
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const { succeed, failed } = await nabii.v1.User.Admin.import([
	 * 	{
	 *			firstName: "...",
	 *			lastName: "...",
	 *			email: "name@nabii.com",
	 *		}
	 * ]);
	 * ```
	 * @returns a bulk create result object with `succeed` and `failed`
	 * @since v1.0.0
	 */
	@Logged
	@Permission(Platform.APPLICATION)
	@Refresh
	public import(
		users: ICreateUserForm<Platform.ADMIN>[],
	): Promise<IBulkCreateResult> {
		return this._axios.post("/admin/user/import", { users });
	}
}

export declare type IAdminUserV1 = typeof AdminUserV1;
