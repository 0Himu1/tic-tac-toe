import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import ParticlesBackground from './components/ParticlesBackground';
import { getBestMove, checkWinner } from './utils/tickyBot';
import { FaRobot, FaUser, FaUsers } from 'react-icons/fa';
import { GiArtificialIntelligence } from 'react-icons/gi';

function Square({ value, onClick, index }) {
	const className = `square ${value ? 'filled' : ''} ${
		value ? value.toLowerCase() : ''
	}`;

	return (
		<div className={className} onClick={onClick}>
			{value}
		</div>
	);
}

function Board({ squares, onClick, disabled }) {
	return (
		<div className="container">
			{squares.map((square, i) => (
				<Square
					key={i}
					value={square}
					onClick={() => !disabled && onClick(i)}
					index={i}
				/>
			))}
		</div>
	);
}

function Game() {
	const [squares, setSquares] = useState(Array(9).fill(null));
	const [xIsNext, setXIsNext] = useState(true);
	const [gameMode, setGameMode] = useState('pvp'); // 'pvp' or 'pvbot'
	const [botDifficulty, setBotDifficulty] = useState('pro'); // 'friendly' or 'pro'
	const [isThinking, setIsThinking] = useState(false);

	const isBoardFull = squares => {
		return squares.every(square => square !== null);
	};

	useEffect(() => {
		// Bot's turn
		if (
			gameMode === 'pvbot' &&
			!xIsNext &&
			!checkWinner(squares) &&
			!isBoardFull(squares)
		) {
			setIsThinking(true);

			// Add delay to make it feel more natural
			const thinkingTime = botDifficulty === 'pro' ? 800 : 500;

			setTimeout(() => {
				const botMove = getBestMove(squares, 'O', 'X', botDifficulty);
				if (botMove !== null) {
					const newSquares = squares.slice();
					newSquares[botMove] = 'O';
					setSquares(newSquares);
					setXIsNext(true);
				}
				setIsThinking(false);
			}, thinkingTime);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [xIsNext, gameMode, botDifficulty]);

	const handleClick = i => {
		const newSquares = squares.slice();

		// Prevent clicking if game is over or square is filled
		if (checkWinner(newSquares) || newSquares[i] || isBoardFull(newSquares)) {
			return;
		}

		// Prevent player from clicking during bot's turn
		if (gameMode === 'pvbot' && !xIsNext) {
			return;
		}

		newSquares[i] = xIsNext ? 'X' : 'O';
		setSquares(newSquares);
		setXIsNext(!xIsNext);
	};

	const resetGame = () => {
		setSquares(Array(9).fill(null));
		setXIsNext(true);
		setIsThinking(false);
	};

	const changeGameMode = mode => {
		setGameMode(mode);
		resetGame();
	};

	const changeBotDifficulty = difficulty => {
		setBotDifficulty(difficulty);
		if (gameMode === 'pvbot') {
			resetGame();
		}
	};

	const winner = checkWinner(squares);
	const boardFull = isBoardFull(squares);

	let status;
	if (winner) {
		const winnerName =
			gameMode === 'pvbot' && winner === 'O' ? 'Ticky' : `Player ${winner}`;
		status = (
			<div className="status">
				<div className="winner-announcement">🎉 {winnerName} Wins! 🎉</div>
				<button className="btn btn-primary reset-btn" onClick={resetGame}>
					Play Again
				</button>
			</div>
		);
	} else if (boardFull) {
		status = (
			<div className="status">
				<div className="status-text">It's a Draw! 🤝</div>
				<button className="btn btn-primary reset-btn" onClick={resetGame}>
					Play Again
				</button>
			</div>
		);
	} else {
		const nextPlayer = xIsNext ? 'X' : 'O';
		const playerName =
			gameMode === 'pvbot'
				? xIsNext
					? 'Your Turn'
					: isThinking
					? 'Ticky is thinking...'
					: "Ticky's Turn"
				: `Player ${nextPlayer}'s Turn`;

		status = (
			<div className="status">
				<div className="status-text">
					{gameMode === 'pvbot' && !xIsNext ? (
						<GiArtificialIntelligence />
					) : (
						<FaUser />
					)}
					{playerName}
				</div>
			</div>
		);
	}

	return (
		<>
			<ParticlesBackground />
			<div className="game">
				<div className="game-header">
					<h1 className="game-title">Tic-Tac-Toe</h1>
					<p className="game-subtitle">Challenge Ticky, the AI bot!</p>
				</div>

				<div className="controls">
					<div className="control-group">
						<span className="control-label">Game Mode</span>
						<div className="btn-group">
							<button
								className={`btn btn-secondary ${
									gameMode === 'pvp' ? 'active' : ''
								}`}
								onClick={() => changeGameMode('pvp')}
							>
								<FaUsers /> Player vs Player
							</button>
							<button
								className={`btn btn-secondary ${
									gameMode === 'pvbot' ? 'active' : ''
								}`}
								onClick={() => changeGameMode('pvbot')}
							>
								<FaRobot /> vs Ticky
							</button>
						</div>
					</div>

					{gameMode === 'pvbot' && (
						<div className="control-group">
							<span className="control-label">Ticky's Mood</span>
							<div className="btn-group">
								<button
									className={`btn btn-secondary ${
										botDifficulty === 'friendly' ? 'active' : ''
									}`}
									onClick={() => changeBotDifficulty('friendly')}
								>
									😊 Friendly
								</button>
								<button
									className={`btn btn-secondary ${
										botDifficulty === 'pro' ? 'active' : ''
									}`}
									onClick={() => changeBotDifficulty('pro')}
								>
									🔥 Pro
								</button>
							</div>
						</div>
					)}
				</div>

				{gameMode === 'pvbot' && (
					<div className="bot-indicator">
						<div className="bot-avatar">
							<GiArtificialIntelligence />
						</div>
						<div className="bot-info">
							<div className="bot-name">Ticky</div>
							<div className="bot-mode">
								{botDifficulty === 'pro'
									? 'Pro Mode - Unbeatable!'
									: 'Friendly Mode - Having Fun!'}
							</div>
						</div>
					</div>
				)}

				{status}

				<Board
					squares={squares}
					onClick={handleClick}
					disabled={isThinking || winner || boardFull}
				/>

				{!winner && !boardFull && (
					<button className="btn btn-secondary reset-btn" onClick={resetGame}>
						Reset Game
					</button>
				)}
			</div>
		</>
	);
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game />);
