import { env } from "@utils/env";
import { logger } from "@/utils/logger";
import nabii, { NabiiError } from "@/.";
import { downloadLink } from "@/utils/download";
import { faker } from "@faker-js/faker";
//import nabii, { NabiiError } from "../dist"; // run "pnpm build" to test dist build

(async () => {
	try {
		nabii.v1.onError(function (err) {
			if (err.response) {
				logger.error(err.response.data);
			} else {
				logger.error("No internet connection!");
			}
		});
		await nabii.v1.Auth.login(env.LOGIN_EMAIL_V1, env.LOGIN_PASSWORD_V1);

		// write your code here !
		// example:
		const me = await nabii.v1.User.Admin.create({
			firstName: "John",
			lastName: "Doe",
			email: "john@nabii.com",
			avatar: await downloadLink(faker.image.personPortrait({ sex: "male" })),
		});
		logger.object(me);
	} catch (err) {
		if (!(err instanceof NabiiError)) {
			logger.object(err);
		}
	} finally {
		if (nabii.v1.Auth.isLogged()) await nabii.v1.Auth.logout();
	}
})();
