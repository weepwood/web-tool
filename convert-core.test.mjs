import test from "node:test";
import assert from "node:assert/strict";
import { transformText as t } from "./convert-core.mjs";
test("URL component encoding and decoding",()=>{
  assert.equal(t("你好 &+", "encode"),"%E4%BD%A0%E5%A5%BD%20%26%2B");
  assert.equal(t("%E4%BD%A0+%2B", "decode"),"你++");
  assert.equal(t("a+b%2Bc", "form-decode"),"a b+c");
  assert.throws(()=>t("%GG","decode"));
});
test("UTC timestamps with explicit units",()=>{
  assert.equal(t("0","seconds"),"1970-01-01T00:00:00.000Z");
  assert.equal(t("-1","milliseconds"),"1969-12-31T23:59:59.999Z");
  assert.equal(t("1970-01-01T00:00:00.123Z","iso"),"秒: 0.123\n毫秒: 123");
  assert.throws(()=>t("2025-02-30T00:00:00Z","iso"));
  assert.throws(()=>t("1.1","seconds"));
  assert.throws(()=>t("999999999999999999","milliseconds"));
});
