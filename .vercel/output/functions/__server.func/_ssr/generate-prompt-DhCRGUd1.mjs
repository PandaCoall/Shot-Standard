import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { o as writePlateFromDataUrl } from "./write-plate-DaED1JwI.mjs";
import { i as string, r as object } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generate-prompt-DhCRGUd1.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var InputSchema = object({ imageDataUrl: string().min(32).max(4e6) });
var generatePrompt_createServerFn_handler = createServerRpc({
	id: "ae0b66bc00cda576a80e03abb5ceaab9ac189b8280d56d030ca6f8306bf252f0",
	name: "generatePrompt",
	filename: "src/lib/generate-prompt.ts"
}, (opts) => generatePrompt.__executeServer(opts));
var generatePrompt = createServerFn({ method: "POST" }).validator((input) => InputSchema.parse(input)).handler(generatePrompt_createServerFn_handler, async ({ data }) => {
	const result = await writePlateFromDataUrl(data.imageDataUrl.trim());
	if (!result.ok) return {
		ok: false,
		error: result.error
	};
	return {
		ok: true,
		prompt: result.plate
	};
});
//#endregion
export { generatePrompt_createServerFn_handler };
