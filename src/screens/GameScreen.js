import React from "react";
import Board from "../components/Board";

const SHELLS = [
  { id: 0, x: 0, y: 2, isOpen: true, hasBall: false },
  { id: 1, x: 1, y: 2, isOpen: true, hasBall: true },
  { id: 2, x: 2, y: 2, isOpen: true, hasBall: false }
];
const GameScreen = () => {
  return (
    <Board
      size={6}
      shells={SHELLS}
      movesPerShuffle={8}
      timeBetweenMoves={0.1}
    />
  );
};

export default GameScreen;
