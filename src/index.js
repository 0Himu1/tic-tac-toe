import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";

function Square(props) {
  return (
    <div className="square" onClick={props.onClick}>
      {props.value}
    </div>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div className="container">
        {this.renderSquare(0)}
        {this.renderSquare(1)}
        {this.renderSquare(2)}
        {this.renderSquare(3)}
        {this.renderSquare(4)}
        {this.renderSquare(5)}
        {this.renderSquare(6)}
        {this.renderSquare(7)}
        {this.renderSquare(8)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  resetGame() {
    const current = this.state.squares;
    const winner = calculateWinner(current);
    if (winner) {
      this.setState({
        squares: Array(9).fill(null),
        xIsNext: !this.state.xIsNext,
      });
    }
  }

  render() {
    const current = this.state.squares;
    const winner = calculateWinner(current);

    let status;
    if (winner) {
      status = (
        <div>
          <h1>{`Winner is ${winner}`}</h1>
          <button>Start a New Game</button>
        </div>
      );
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }

    return (
      <div className="game">
        <div className="status" onClick={() => this.resetGame()}>
          <h1>{status}</h1>
        </div>
        <Board squares={current} onClick={(i) => this.handleClick(i)} />
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
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
