import { Platform } from "@v1/config";
import { Logged, Permission, Refresh } from "@v1/decorators";
import { AdminMixin, Admin } from "@v1/mixins";
import { AdminUserV1, type IAdminUserV1 } from "./admin.user.sdk";
import type { IUser, IUpdateUserForm, IEmailSentResult, IRoles } from "./user";
import { useFormData } from "@/form";

/**
 * @class {@link UserV1}
 * @since v1.0.0
 * @extends {BaseV1}
 */
@Admin(AdminUserV1)
export class UserV1 extends AdminMixin<IAdminUserV1> {
	/**
	 * `📱 SOCLE 📱`
	 *
	 * List of user roles.
	 *
	 * This interface defines the various roles a user can have in {@link NabiiV1}.
	 * Each role is associated with a specific integer value.
	 *
	 * @interface {@link IRoles}
	 */
	public get roles(): IRoles {
		return this._config.roles;
	}
	public emailIsAvailable(email: string): Promise<boolean> {
		return this._axios.get(`/user/check-email/${email}`);
	}
	/**
	 * `📱 SOCLE 📱`
	 * ####  🔄 Update my {@link NabiiV1} user profile 🔄
	 * @param data user data to update
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const user = await nabii.v1.User.updateMe({
	 * 	firstName: "updatedName"
	 * }); // {...}
	 * ```
	 * @returns the updated {@link IUser} object
	 * @since v1.0.0
	 */
	@Logged
	@Permission(Platform.APPLICATION)
	@Refresh
	public async updateMe(
		data: IUpdateUserForm<Platform.APPLICATION>,
	): Promise<IUser<Platform.APPLICATION>> {
		const formData = await useFormData(data, [
			"avatar",
			"firstName",
			"lastName",
			"password",
		]);
		return this._axios.patch("/user", formData);
	}
	/**
	 * `📱 SOCLE 📱`
	 * ## ⚠ This request is dangerous, it will trigger logout method ⚠
	 * ####  🗑️ Delete my {@link NabiiV1} user account 🗑️
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * await nabii.v1.User.deleteMe();
	 * ```
	 * @returns a void function
	 * @since v1.0.0
	 */
	@Logged
	@Permission(Platform.APPLICATION)
	@Refresh
	public async deleteMe(): Promise<void> {
		await this._axios.delete("/user");
		if (
			this._config.isLogged &&
			this._config.platform === Platform.APPLICATION
		) {
			this._config.credentials = {};
			this._config.isLogged = false;
			await this._disconnectSocket();
			await this._triggerEventListener("logout");
		}
	}
	/**
	 * `📱 SOCLE 📱`
	 * `🖥️ ADMIN 🖥️`
	 * ####  🤔 Check if a `password` match with your account `password` 🤔
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * await nabii.v1.User
	 * 	.checkPassword("my_password"); // true
	 * ```
	 * @returns a boolean at `true` if the password match with your real password
	 * @since v1.0.0
	 */
	@Logged
	@Refresh
	public checkPassword(password: string): Promise<boolean> {
		return this._axios.get(`/user/check-password/${password}`);
	}
	/**
	 * `📱 SOCLE 📱`
	 * `🖥️ ADMIN 🖥️`
	 * ## ⚠ You should logout after using this request ⚠
	 * ####  🔄 Update my {@link NabiiV1} user email 🔄
	 * @param email your new `email`
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * await nabii.v1.User.changeEmail("ulyssedupont2707@gmail.com"); // {...}
	 * ```
	 * @returns the object result of email receive
	 * @since v1.0.0
	 */
	@Logged
	@Refresh
	public changeEmail(email: string): Promise<IEmailSentResult> {
		return this._axios.patch("/user/email", { email });
	}
}
