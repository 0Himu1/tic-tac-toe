/**
 * Ticky Bot - Tic-Tac-Toe AI
 * Implements two difficulty modes: Friendly and Pro
 */

// Helper function to check for a winner
export function checkWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}

// Get all empty squares
function getEmptySquares(squares) {
	return squares
		.map((val, idx) => (val === null ? idx : null))
		.filter(val => val !== null);
}

// Check if board is full
function isBoardFull(squares) {
	return squares.every(square => square !== null);
}

// Minimax algorithm with Alpha-Beta Pruning for Pro mode
function minimax(
	squares,
	depth,
	isMaximizing,
	alpha,
	beta,
	botPlayer,
	humanPlayer
) {
	const winner = checkWinner(squares);

	// Terminal states
	if (winner === botPlayer) {
		return 10 - depth; // Prefer faster wins
	}
	if (winner === humanPlayer) {
		return depth - 10; // Prefer slower losses
	}
	if (isBoardFull(squares)) {
		return 0; // Draw
	}

	if (isMaximizing) {
		let maxScore = -Infinity;
		const emptySquares = getEmptySquares(squares);

		for (let i = 0; i < emptySquares.length; i++) {
			const idx = emptySquares[i];
			squares[idx] = botPlayer;
			const score = minimax(
				squares,
				depth + 1,
				false,
				alpha,
				beta,
				botPlayer,
				humanPlayer
			);
			squares[idx] = null; // Undo move

			maxScore = Math.max(score, maxScore);
			alpha = Math.max(alpha, score);

			// Alpha-Beta Pruning
			if (beta <= alpha) {
				break;
			}
		}
		return maxScore;
	} else {
		let minScore = Infinity;
		const emptySquares = getEmptySquares(squares);

		for (let i = 0; i < emptySquares.length; i++) {
			const idx = emptySquares[i];
			squares[idx] = humanPlayer;
			const score = minimax(
				squares,
				depth + 1,
				true,
				alpha,
				beta,
				botPlayer,
				humanPlayer
			);
			squares[idx] = null; // Undo move

			minScore = Math.min(score, minScore);
			beta = Math.min(beta, score);

			// Alpha-Beta Pruning
			if (beta <= alpha) {
				break;
			}
		}
		return minScore;
	}
}

// Find winning move for a player
function findWinningMove(squares, player) {
	const emptySquares = getEmptySquares(squares);

	for (let i = 0; i < emptySquares.length; i++) {
		const idx = emptySquares[i];
		const testSquares = [...squares];
		testSquares[idx] = player;

		if (checkWinner(testSquares) === player) {
			return idx;
		}
	}
	return null;
}

// Friendly mode - strategic but beatable
function getFriendlyMove(squares, botPlayer, humanPlayer) {
	const emptySquares = getEmptySquares(squares);

	// 1. Win if possible (70% chance)
	if (Math.random() > 0.3) {
		const winMove = findWinningMove(squares, botPlayer);
		if (winMove !== null) return winMove;
	}

	// 2. Block opponent's winning move (60% chance)
	if (Math.random() > 0.4) {
		const blockMove = findWinningMove(squares, humanPlayer);
		if (blockMove !== null) return blockMove;
	}

	// 3. Take center if available (50% chance)
	if (squares[4] === null && Math.random() > 0.5) {
		return 4;
	}

	// 4. Take a corner (40% chance)
	const corners = [0, 2, 6, 8].filter(idx => squares[idx] === null);
	if (corners.length > 0 && Math.random() > 0.6) {
		return corners[Math.floor(Math.random() * corners.length)];
	}

	// 5. Random move
	return emptySquares[Math.floor(Math.random() * emptySquares.length)];
}

// Pro mode - unbeatable using Minimax
function getProMove(squares, botPlayer, humanPlayer) {
	const emptySquares = getEmptySquares(squares);
	let bestScore = -Infinity;
	let bestMove = emptySquares[0];

	for (let i = 0; i < emptySquares.length; i++) {
		const idx = emptySquares[i];
		squares[idx] = botPlayer;
		const score = minimax(
			[...squares],
			0,
			false,
			-Infinity,
			Infinity,
			botPlayer,
			humanPlayer
		);
		squares[idx] = null;

		if (score > bestScore) {
			bestScore = score;
			bestMove = idx;
		}
	}

	return bestMove;
}

/**
 * Get the best move for Ticky bot
 * @param {Array} squares - Current board state
 * @param {string} botPlayer - Bot's symbol ('X' or 'O')
 * @param {string} humanPlayer - Human's symbol ('X' or 'O')
 * @param {string} difficulty - 'friendly' or 'pro'
 * @returns {number} - Index of the best move
 */
export function getBestMove(
	squares,
	botPlayer,
	humanPlayer,
	difficulty = 'pro'
) {
	const emptySquares = getEmptySquares(squares);

	// Safety check
	if (emptySquares.length === 0) return null;

	// First move optimization - pick random for variety
	if (emptySquares.length === 9) {
		const firstMoves = [0, 2, 4, 6, 8]; // Center or corners
		return firstMoves[Math.floor(Math.random() * firstMoves.length)];
	}

	if (difficulty === 'friendly') {
		return getFriendlyMove(squares, botPlayer, humanPlayer);
	} else {
		return getProMove(squares, botPlayer, humanPlayer);
	}
}
