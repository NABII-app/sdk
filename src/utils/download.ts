import axios from "axios";

export async function downloadLink(url: string): Promise<Buffer> {
	const response = await axios.get(url, { responseType: "arraybuffer" });
	return Buffer.from(response.data);
}
