import { Platform } from "@v1/config";
import { Logged, Permission, Refresh } from "@v1/decorators";
import { Admin, AdminMixin } from "@v1/mixins";
import { AdminVersionV1, type IAdminVersionV1 } from "./admin.version.sdk";
import type { ICheckVersionResult, IVersionTypes } from "./version";

/**
 * @class {@link VersionV1}
 * @since v1.0.0
 * @extends {BaseV1}
 */
@Admin(AdminVersionV1)
export class VersionV1 extends AdminMixin<IAdminVersionV1> {
	/**
	 * `📱 SOCLE 📱`
	 *
	 * List of version types.
	 *
	 * This interface defines the various types a version can have in {@link NabiiV1}.
	 * Each type is associated with a specific string value.
	 *
	 * @interface {@link IVersionTypes}
	 */
	public get types(): IVersionTypes {
		return <const>{
			MAJOR: "major",
			MINOR: "minor",
			PATCH: "patch",
		};
	}
	/**
	 * `📱 SOCLE 📱`
	 * ####  📖 Check a {@link NabiiV1} {@link IVersion} by version `name` 📖
	 * @param name the {@link IVersion} name (ex: `1.0.0`)
	 * @example
	 * ```tsx
	 * import { nabii } from "nabii-sdk";
	 *
	 * const { current, latest, isLatest } = await nabii.v1.Version.check("1.3.0");
	 * ```
	 * @returns the {@link ICheckVersionResult} check object
	 * @since v1.0.0
	 */
	@Logged
	@Permission(Platform.APPLICATION)
	@Refresh
	public check(name: string): Promise<ICheckVersionResult> {
		return this._axios.get(`/version/check/${name}`);
	}
}
