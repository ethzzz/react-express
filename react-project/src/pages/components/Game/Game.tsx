import { useState } from 'react';
import "./Game.css";

function Square({ value,onSquareClick}:any) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }:any) {
  function handleClick(i:number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    console.log(i)
    onPlay(nextSquares,[ Math.ceil(i/3), (i%3)+1 ]);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      {[0,1,2].map((i) => (
        <div key={i} className='board-row'>
          {[0,1,2].map((j) => (
            <Square
              key={j}
              value={squares[i*3 + j]}
              onSquareClick={() => handleClick(i*3 + j)}
            />
          ))}
        </div>
      ))}
      {/* <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div> */}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [site, setSite] = useState<any[]>([]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares:any,[row,col]:[number,number]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    // const nextSite
    setHistory(nextHistory);
    const nextSite = [...site.slice(0, currentMove), [row,col]];
    setSite(nextSite);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove:number) {
    setCurrentMove(nextMove);
  }

  // 升序降序
  const [isReverse, setIsReverse] = useState(false)
  function reverseMoves() {
    setIsReverse(!isReverse)
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move + ',' + '第' + site[move-1][0] + '行' + '第' + site[move-1][1] + '列';
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{ !isReverse ?  moves : moves.reverse()}</ol>
      </div>
      <div>
        <Button onClick={()=>reverseMoves()}>翻转步数</Button>
      </div>
    </div>
  );
}

function calculateWinner(squares:any) {
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

