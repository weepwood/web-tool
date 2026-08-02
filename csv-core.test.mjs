import test from "node:test";
import assert from "node:assert/strict";

import { filterRows, getFilterValues, guessMapping } from "./csv-core.mjs";

const rows = [
	{ Name: "设计评审", 创建: "2025-01-10", 标签: "工作, 重要" },
	{ Name: "买菜", 创建: "2025-01-12", 标签: "生活" },
	{ Name: "读书笔记", 创建: "2025-01-11", 标签: "学习" },
	{ Name: "周报", 创建: "2025-01-09", 标签: "工作" },
];

test("guesses Chinese column mapping", () => {
	const m = guessMapping(["Name", "创建时间", "标签", "链接"]);
	assert.equal(m.title, "Name");
	assert.equal(m.date, "创建时间");
	assert.equal(m.tag, "标签");
	assert.equal(m.link, "链接");
	assert.equal(m.filter, "标签");
});

test("guesses English column mapping", () => {
	const m = guessMapping(["title", "created", "category", "url"]);
	assert.equal(m.title, "title");
	assert.equal(m.date, "created");
	assert.equal(m.tag, "category");
	assert.equal(m.link, "url");
});

test("falls back to first column for title", () => {
	const m = guessMapping(["A", "B"]);
	assert.equal(m.title, "A");
});

test("filters by search across all fields", () => {
	const r = filterRows(rows, { search: "设计" });
	assert.deepEqual(r.map((x) => x.Name), ["设计评审"]);
});

test("filters by multi-select value (comma separated)", () => {
	const r = filterRows(rows, { filterValue: "重要", filterColumn: "标签" });
	assert.deepEqual(r.map((x) => x.Name), ["设计评审"]);
});

test("sorts by date desc when requested", () => {
	const r = filterRows(rows, { dateColumn: "创建", sort: "desc" });
	assert.deepEqual(r.map((x) => x.Name), ["买菜", "读书笔记", "设计评审", "周报"]);
});

test("returns all rows without filters", () => {
	const r = filterRows(rows, {});
	assert.equal(r.length, 4);
});

test("extracts unique sorted filter values", () => {
	assert.deepEqual(getFilterValues(rows, "标签"), ["学习", "工作", "生活", "重要"]);
	assert.deepEqual(getFilterValues(rows, ""), []);
	assert.deepEqual(getFilterValues(rows, "不存在的列"), []);
});
