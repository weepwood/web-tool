import test from "node:test";
import assert from "node:assert/strict";
import {colorFormats,diffLines,regexMatches} from "./lab-core.mjs";
test("color conversions",()=>{assert.deepEqual(colorFormats("#f00"),{hex:"#ff0000",rgb:"rgb(255, 0, 0)",hsl:"hsl(0, 100%, 50%)"});assert.equal(colorFormats("fff").hsl,"hsl(0, 0%, 100%)");assert.throws(()=>colorFormats("bad!"));});
test("line diff",()=>{assert.deepEqual(diffLines("a\nb","a\nc"),[{type:"same",text:"a"},{type:"remove",text:"b"},{type:"add",text:"c"}]);assert.deepEqual(diffLines("","x"),[{type:"add",text:"x"}]);assert.throws(()=>diffLines("x\n".repeat(401),""));});
test("regex indices, groups and empty unicode matches",()=>{assert.deepEqual(regexMatches("(a)","g","aba"),[{index:0,text:"a",groups:["a"]},{index:2,text:"a",groups:["a"]}]);assert.equal(regexMatches("(?=)","gu","😀").length,2);assert.throws(()=>regexMatches("(","g",""));assert.throws(()=>regexMatches("x","gg","x"));});
