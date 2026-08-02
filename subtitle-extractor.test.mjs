import test from "node:test";
import assert from "node:assert/strict";

import { cleanDialogueText, parseASS } from "./subtitle-extractor.mjs";

test("extracts dialogue lines from the [Events] section", () => {
	const content = [
		"[Script Info]",
		"Title: Test",
		"",
		"[Events]",
		"Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
		"Dialogue: 0,0:00:01.00,0:00:03.00,Default,,0,0,0,,Hello world",
		"Dialogue: 0,0:00:03.00,0:00:05.00,Default,,0,0,0,,Second line",
	].join("\n");
	assert.deepEqual(parseASS(content), ["Hello world", "Second line"]);
});

test("strips ASS override tags and converts \\N to newlines", () => {
	assert.equal(cleanDialogueText("{\\pos(400,570)}Line one\\NLine two"), "Line one\nLine two");
});

test("keeps commas inside the dialogue text", () => {
	const content = "[Events]\nDialogue: 0,0:00:01.00,0:00:03.00,Default,,0,0,0,,Hello, world!";
	assert.deepEqual(parseASS(content), ["Hello, world!"]);
});

test("ignores dialogue lines outside the events section", () => {
	const content = "Dialogue: 0,0:00:01.00,0:00:03.00,Default,,0,0,0,,Before events";
	assert.deepEqual(parseASS(content), []);
});

test("normalizes CRLF line endings", () => {
	const content = "[Events]\r\nDialogue: 0,0:00:01.00,0:00:03.00,Default,,0,0,0,,Hello\r\n";
	assert.deepEqual(parseASS(content), ["Hello"]);
});

test("deduplicates identical dialogue lines preserving order", () => {
	const content = [
		"[Events]",
		"Dialogue: 0,0:00:01.00,0:00:03.00,Default,,0,0,0,,Repeat",
		"Dialogue: 0,0:00:04.00,0:00:06.00,Default,,0,0,0,,Unique",
		"Dialogue: 0,0:00:07.00,0:00:09.00,Default,,0,0,0,,Repeat",
	].join("\n");
	assert.deepEqual(parseASS(content), ["Repeat", "Unique"]);
});

test("skips empty dialogue text after stripping tags", () => {
	const content = "[Events]\nDialogue: 0,0:00:01.00,0:00:03.00,Default,,0,0,0,,{\\i1}";
	assert.deepEqual(parseASS(content), []);
});
