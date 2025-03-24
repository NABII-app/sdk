import Imap from "imap";
import type { Box, FetchOptions } from "imap";

/**
 * The email object result
 */
declare interface IEmailData {
	uid: number;
	date: Date;
	flags: string[];
	body: string;
}

/**
 * Imap service to retrieve emails of a client
 */
export class ImapService {
	protected imap!: Imap;
	protected isLogged = false;
	constructor(email: string, password: string, host = "imap.gmail.com") {
		this.imap = new Imap({
			user: email,
			password,
			host,
			port: 993,
			tls: true,
			tlsOptions: {
				rejectUnauthorized: false,
			},
		});
	}
	private login(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.imap.once("ready", () => {
				this.isLogged = true;
				resolve();
			});
			this.imap.once("error", () => {
				this.isLogged = false;
				reject();
			});
			this.imap.connect();
		});
	}
	private logout(): Promise<void> {
		return new Promise(resolve => {
			this.imap.once("end", () => {
				this.isLogged = false;
				resolve();
			});
			this.imap.end();
		});
	}
	private openInbox(): Promise<Box> {
		return new Promise((resolve, reject) => {
			this.imap.openBox("INBOX", true, (err, box) => {
				if (err) reject(err);
				else resolve(box);
			});
		});
	}
	private searchEmails(email: string): Promise<number[]> {
		return new Promise((resolve, reject) => {
			this.openInbox()
				.then(() => {
					const searchCriteria = [["HEADER", "FROM", email]];
					this.imap.search(searchCriteria, (searchErr, results) => {
						if (searchErr) reject(searchErr);
						else resolve(results);
					});
				})
				.catch(reject);
		});
	}
	private fetchEmailData(uid: number): Promise<IEmailData> {
		return new Promise((resolve, reject) => {
			const fetchOptions: FetchOptions = {
				bodies: "",
				markSeen: false,
				struct: true,
			};
			const fetch = this.imap.fetch(uid, fetchOptions);
			fetch.on("message", msg => {
				const emailData: IEmailData = {
					uid: 0,
					date: new Date(),
					flags: [],
					body: "",
				};
				msg.on("body", stream => {
					let buffer = "";
					stream.on("data", chunk => {
						buffer += chunk.toString("utf8");
					});
					stream.once("end", () => {
						emailData.body = buffer;
					});
				});
				msg.once("attributes", attrs => {
					emailData.uid = attrs.uid as number;
					emailData.date = attrs.date as Date;
					emailData.flags = attrs.flags as string[];
				});
				msg.once("end", () => {
					resolve(emailData);
				});
			});
			fetch.once("error", err => {
				reject(err);
			});
		});
	}
	/**
	 * ####  Get the last email sent by a specific user
	 * @param email the target email of the sender
	 * @returns the {@link IEmailData} object or `null` of there is no result
	 */
	public async getLastEmailFrom(email: string): Promise<IEmailData | null> {
		try {
			if (!this.isLogged) {
				await this.login();
			}
			const results = await this.searchEmails(email);
			if (results.length === 0) {
				return null;
			}
			return await this.fetchEmailData(results[results.length - 1]!);
		} catch (err) {
			if (!err) {
				throw new Error("Incorrect login credentials.");
			}
			throw err;
		} finally {
			await this.logout();
		}
	}
}
