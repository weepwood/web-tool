import test from "node:test";
import assert from "node:assert/strict";

import {
	DIRECTIONS,
	createInitialState,
	listFreeCells,
	placeFood,
	queueDirection,
	stepGame,
	togglePause,
} from "./snake-game.mjs";

test("moves one cell in the current direction", () => {
	const state = createInitialState({ cols: 10, rows: 10, randomValue: 0 });
	const next = stepGame(state, 0.2);

	assert.deepEqual(next.snake[0], { x: 6, y: 5 });
	assert.equal(next.score, 0);
	assert.equal(next.isGameOver, false);
});

test("grows and increases score after eating food", () => {
	const state = {
		cols: 8,
		rows: 8,
		snake: [{ x: 2, y: 2 }, { x: 1, y: 2 }, { x: 0, y: 2 }],
		direction: DIRECTIONS.right,
		queuedDirection: DIRECTIONS.right,
		food: { x: 3, y: 2 },
		score: 0,
		isGameOver: false,
		isPaused: false,
	};

	const next = stepGame(state, 0);

	assert.equal(next.snake.length, 4);
	assert.deepEqual(next.snake[0], { x: 3, y: 2 });
	assert.equal(next.score, 1);
	assert.notDeepEqual(next.food, { x: 3, y: 2 });
});

test("prevents reversing directly into the snake body", () => {
	const state = createInitialState({ cols: 10, rows: 10, randomValue: 0 });
	const queued = queueDirection(state, DIRECTIONS.left);
	const next = stepGame(queued, 0.1);

	assert.deepEqual(next.snake[0], { x: 6, y: 5 });
	assert.equal(next.isGameOver, false);
});

test("ends the game on wall collision", () => {
	const state = {
		cols: 4,
		rows: 4,
		snake: [{ x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }],
		direction: DIRECTIONS.right,
		queuedDirection: DIRECTIONS.right,
		food: { x: 0, y: 0 },
		score: 0,
		isGameOver: false,
		isPaused: false,
	};

	const next = stepGame(state, 0.5);
	assert.equal(next.isGameOver, true);
});

test("ends the game on self collision", () => {
	const state = {
		cols: 6,
		rows: 6,
		snake: [
			{ x: 2, y: 2 },
			{ x: 2, y: 3 },
			{ x: 1, y: 3 },
			{ x: 1, y: 2 },
		],
		direction: DIRECTIONS.down,
		queuedDirection: DIRECTIONS.down,
		food: { x: 5, y: 5 },
		score: 0,
		isGameOver: false,
		isPaused: false,
	};

	const next = stepGame(state, 0.5);
	assert.equal(next.isGameOver, true);
});

test("places food only on free cells deterministically", () => {
	const snake = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
	const freeCells = listFreeCells(snake, 3, 2);

	assert.equal(freeCells.length, 4);
	assert.deepEqual(placeFood(snake, 3, 2, 0), { x: 2, y: 0 });
	assert.deepEqual(placeFood(snake, 3, 2, 0.99), { x: 2, y: 1 });
});

test("pause freezes simulation until resumed", () => {
	const state = createInitialState({ cols: 10, rows: 10, randomValue: 0 });
	const paused = togglePause(state);
	const frozen = stepGame(paused, 0.5);

	assert.deepEqual(frozen, paused);
	assert.equal(togglePause(paused).isPaused, false);
});
