export const DIRECTIONS = {
	up: { x: 0, y: -1 },
	down: { x: 0, y: 1 },
	left: { x: -1, y: 0 },
	right: { x: 1, y: 0 },
};

export const DEFAULT_GRID = {
	cols: 16,
	rows: 16,
};

export function areOppositeDirections(a, b){
	return a.x + b.x === 0 && a.y + b.y === 0;
}

export function clampDirection(nextDirection, currentDirection, snakeLength){
	if (!nextDirection){
		return currentDirection;
	}

	if (snakeLength > 1 && areOppositeDirections(nextDirection, currentDirection)){
		return currentDirection;
	}

	return nextDirection;
}

export function listFreeCells(snake, cols, rows){
	const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
	const freeCells = [];

	for (let y = 0; y < rows; y += 1){
		for (let x = 0; x < cols; x += 1){
			if (!occupied.has(`${x},${y}`)){
				freeCells.push({ x, y });
			}
		}
	}

	return freeCells;
}

export function placeFood(snake, cols, rows, randomValue = Math.random()){
	const freeCells = listFreeCells(snake, cols, rows);

	if (freeCells.length === 0){
		return null;
	}

	const safeRandom = Math.min(Math.max(randomValue, 0), 0.999999999999);
	const index = Math.floor(safeRandom * freeCells.length);
	return freeCells[index];
}

export function createInitialState(config = {}){
	const cols = config.cols ?? DEFAULT_GRID.cols;
	const rows = config.rows ?? DEFAULT_GRID.rows;
	const startX = Math.floor(cols / 2);
	const startY = Math.floor(rows / 2);
	const snake = [
		{ x: startX, y: startY },
		{ x: startX - 1, y: startY },
		{ x: startX - 2, y: startY },
	];
	const direction = DIRECTIONS.right;

	return {
		cols,
		rows,
		snake,
		direction,
		queuedDirection: direction,
		food: placeFood(snake, cols, rows, config.randomValue),
		score: 0,
		isGameOver: false,
		isPaused: false,
	};
}

export function queueDirection(state, nextDirection){
	return {
		...state,
		queuedDirection: clampDirection(nextDirection, state.direction, state.snake.length),
	};
}

export function stepGame(state, randomValue = Math.random()){
	if (state.isGameOver || state.isPaused){
		return state;
	}

	const direction = clampDirection(state.queuedDirection, state.direction, state.snake.length);
	const head = state.snake[0];
	const nextHead = {
		x: head.x + direction.x,
		y: head.y + direction.y,
	};

	const hitWall =
		nextHead.x < 0 ||
		nextHead.x >= state.cols ||
		nextHead.y < 0 ||
		nextHead.y >= state.rows;

	if (hitWall){
		return {
			...state,
			direction,
			queuedDirection: direction,
			isGameOver: true,
		};
	}

	const willEat = Boolean(state.food) && nextHead.x === state.food.x && nextHead.y === state.food.y;
	const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1);
	const hitSelf = bodyToCheck.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);

	if (hitSelf){
		return {
			...state,
			direction,
			queuedDirection: direction,
			isGameOver: true,
		};
	}

	const nextSnake = [nextHead, ...state.snake];
	if (!willEat){
		nextSnake.pop();
	}

	return {
		...state,
		snake: nextSnake,
		direction,
		queuedDirection: direction,
		food: willEat ? placeFood(nextSnake, state.cols, state.rows, randomValue) : state.food,
		score: willEat ? state.score + 1 : state.score,
		isGameOver: false,
	};
}

export function togglePause(state){
	if (state.isGameOver){
		return state;
	}

	return {
		...state,
		isPaused: !state.isPaused,
	};
}
