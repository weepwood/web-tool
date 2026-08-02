import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const ROOT = new URL("./", import.meta.url);
const html = fs.readFileSync(new URL("./index.html", import.meta.url), "utf8");

test("every local tool entry in index.html has a matching file", () => {
	const urls = [...html.matchAll(/url: "([^"]+)"/g)].map((m) => m[1]);
	const local = urls.filter((u) => !/^https?:/.test(u));
	assert.ok(local.length > 0, "index.html 应至少有一个本地工具入口");
	for (const u of local) {
		assert.ok(fs.existsSync(new URL(`./${u}`, ROOT)), `index.html 引用了缺失文件: ${u}`);
	}
});
