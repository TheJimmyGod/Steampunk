// src/Game.js
import React, { useState, useEffect } from 'react';
import Board from './Board';
import Tetromino from './Tetromino'; // Tetromino 컴포넌트는 선택 사항입니다

const Game = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [tetromino, setTetromino] = useState(randomTetromino());
  const [position, setPosition] = useState({ x: 3, y: 0 });
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
      if (event.key === 'ArrowDown') drop();
      if (event.key === 'ArrowUp') rotate();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [tetromino, position, gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      drop();
    }, 1000);

    return () => clearInterval(interval);
  }, [position, tetromino, gameOver]);

  const move = (dir) => {
    const newPosition = { ...position, x: position.x + dir };
    if (!collides(board, tetromino, newPosition)) {
      setPosition(newPosition);
    }
  };

  const rotate = () => {
    const rotatedTetromino = tetromino[0].map((_, i) => tetromino.map(row => row[i]).reverse());
    if (!collides(board, rotatedTetromino, position)) {
      setTetromino(rotatedTetromino);
    }
  };

  const drop = () => {
    const newPosition = { ...position, y: position.y + 1 };
    if (!collides(board, tetromino, newPosition)) {
      setPosition(newPosition);
    } else {
      const newBoard = merge(board, tetromino, position);
      setBoard(clearRows(newBoard));
      if (position.y <= 0) {
        setGameOver(true);
      } else {
        setTetromino(randomTetromino());
        setPosition({ x: 3, y: 0 });
      }
    }
  };

  const collides = (board, tetromino, position) => {
    for (let y = 0; y < tetromino.length; y++) {
      for (let x = 0; x < tetromino[y].length; x++) {
        if (tetromino[y][x] && (board[y + position.y] && board[y + position.y][x + position.x]) !== 0) {
          return true;
        }
      }
    }
    return false;
  };

  const merge = (board, tetromino, position) => {
    const newBoard = board.map(row => [...row]);
    tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          newBoard[y + position.y][x + position.x] = value;
        }
      });
    });
    return newBoard;
  };

  const clearRows = (board) => {
    return board.reduce((acc, row) => {
      if (row.every(cell => cell !== 0)) {
        acc.unshift(Array(10).fill(0));
      } else {
        acc.push(row);
      }
      return acc;
    }, []);
  };

  return (
    <div className="game">
      <Board board={board} />
      {gameOver && <div className="game-over">Game Over</div>}
    </div>
  );
};

const createEmptyBoard = () => Array.from({ length: 20 }, () => Array(10).fill(0));

const randomTetromino = () => {
  const tetrominos = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 1, 0], [0, 1, 1]], // S
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]]  // J
  ];
  const randomIndex = Math.floor(Math.random() * tetrominos.length);
  return tetrominos[randomIndex];
};

export default Game;
