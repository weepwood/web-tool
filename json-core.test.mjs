import test from "node:test";
import assert from "node:assert/strict";
import { formatJson } from "./json-core.mjs";
test("formats nested values", () => {
  assert.equal(formatJson('{"a":[true,null,1]}'), '{\n  "a": [\n    true,\n    null,\n    1\n  ]\n}');
});
test("compacts JSON and preserves string whitespace", () => {
  assert.equal(formatJson(' { "a": " x y " } ', "compact"), '{"a":" x y "}');
});
test("accepts scalar values and rejects invalid JSON", () => {
  assert.equal(formatJson("null"), "null");
  assert.throws(() => formatJson("{bad}"), SyntaxError);
  assert.throws(() => formatJson("1", "unknown"), RangeError);
});
