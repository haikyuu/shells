import React from "react";
import PropTypes from "prop-types";
import Shell from "./Shell";
import { getRandomIntInclusive, waitFor, getRandomPair } from "../utils";
const SQUARE_SIZE = 130;
const DIRECTIONS = [
  "UP",
  "DOWN",
  "LEFT",
  "RIGHT",
  "UP_LEFT",
  "UP_RIGHT",
  "DOWN_LEFT",
  "DOWN_RIGHT"
];
class Board extends React.Component {
  static propTypes = {
    size: PropTypes.number.isRequired,
    shells: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        isOpen: PropTypes.bool.isRequired,
        hasBall: PropTypes.bool.isRequired
      })
    ).isRequired
  };

  constructor(props) {
    super(props);
    const shells = props.shells.reduce(
      (acc, shell) => ({
        ...acc,
        [shell.id]: shell
      }),
      {}
    );
    const shellsMap = props.shells.map(({ id }) => id);
    this.state = {
      shells,
      shellsMap,
      isShuffling: false
    };
  }
  getPosition = (direction, { x, y, id }) => {
    const { size } = this.props;

    if (
      (direction.indexOf("UP") > -1 && y === 0) ||
      (direction.indexOf("DOWN") > -1 && y === size - 1) ||
      (direction.indexOf("LEFT") > -1 && x === 0) ||
      (direction.indexOf("RIGHT") > -1 && x === size - 1)
    ) {
      console.error(`Shell ${id} tried to move beyond the board`);
      return { x, y, error: true };
    }
    switch (direction) {
      case "UP":
        return { x, y: y - 1 };
      case "DOWN":
        return { x, y: y + 1 };
      case "LEFT":
        return { x: x - 1, y };
      case "RIGHT":
        return { x: x + 1, y };
      case "UP_RIGHT":
        return { x: x + 1, y: y - 1 };
      case "UP_LEFT":
        return { x: x - 1, y: y - 1 };
      case "DOWN_LEFT":
        return { x: x - 1, y: y + 1 };
      case "DOWN_RIGHT":
        return { x: x + 1, y: y + 1 };
      default:
        return { x, y };
    }
  };
  getRandomDirection = () => {
    const rand = getRandomIntInclusive(0, DIRECTIONS.length - 1);

    return DIRECTIONS[rand];
  };
  toggleShellsOpen = isOpen => {
    this.setState(({ shells, shellsMap }) => ({
      shells: shellsMap.reduce(
        (acc, id) => ({
          ...acc,
          [id]: { ...shells[id], isOpen: isOpen }
        }),
        {}
      )
    }));
  };
  openShells = () => this.toggleShellsOpen(true);
  closeShells = () => this.toggleShellsOpen(false);

  shuffleShells = async () => {
    const { movesPerShuffle } = this.props;
    this.setState({ isShuffling: true });
    this.closeShells();
    await Array.from({ length: movesPerShuffle }).reduce(
      async previousMovePromise => {
        await previousMovePromise;
        const { shellsMap, shells } = this.state;
        const { i, j } = getRandomPair(shellsMap);
        const moves = this.exchangeShells(
          shells[shellsMap[i]],
          shells[shellsMap[j]]
        );
        return await this.executeMoves(moves);
      },
      Promise.resolve()
    );
    this.setState({ isShuffling: false });
  };

  getShellInCenter = shells => {
    const shellsToReturn = shells.filter(({ x, y }) => {
      return x === 1 && y === 2;
    });
    return shellsToReturn.length > 0 ? shellsToReturn[0] : null;
  };
  getShellInRight = shells => {
    const shellsToReturn = shells.filter(({ x, y }) => {
      return x === 2 && y === 2;
    });
    return shellsToReturn.length > 0 ? shellsToReturn[0] : null;
  };
  getShellInLeft = shells => {
    const shellsToReturn = shells.filter(({ x, y }) => {
      return x === 0 && y === 2;
    });
    return shellsToReturn.length > 0 ? shellsToReturn[0] : null;
  };
  exchangeShells(shell1, shell2) {
    // the shells are in one of the positions "left", "center" or "right"
    const shellInCenter = this.getShellInCenter([shell1, shell2]);
    const shellInLeft = this.getShellInLeft([shell1, shell2]);
    const shellInRight = this.getShellInRight([shell1, shell2]);
    const moves = [];
    if (shellInCenter) {
      //next to each other
      // move the one in the center down
      moves.push({ id: shellInCenter.id, direction: "DOWN" });
      // x   x
      //   o
      if (shellInLeft) {
        // o   x
        //   o
        // move the left one right
        moves.push({ id: shellInLeft.id, direction: "RIGHT" });

        //   o  x
        //   o

        // move the center one up left
        moves.push({ id: shellInCenter.id, direction: "UP_LEFT" });
        // o o x
      } else {
        // x   o
        //   o
        // move the right one left
        moves.push({ id: shellInRight.id, direction: "LEFT" });

        // x o
        //   o
        // move the center one up right
        moves.push({ id: shellInCenter.id, direction: "UP_RIGHT" });
        // x o o
      }
    } else {
      // one is left and one is right
      // o x o
      // move the left one up right
      moves.push({ id: shellInLeft.id, direction: "UP_RIGHT" });
      //   o
      //   x o

      // move the right one down left
      moves.push({ id: shellInRight.id, direction: "DOWN_LEFT" });
      //   o
      //   x
      //   o

      // move the left one down right
      moves.push({ id: shellInLeft.id, direction: "DOWN_RIGHT" });
      //   o
      // o x

      // move the right one up left
      moves.push({ id: shellInRight.id, direction: "UP_LEFT" });
      // o x o
    }
    return moves;
  }
  executeMoves = async moves => {
    const { timeBetweenMoves } = this.props;
    await moves.reduce(async (previousMovePromise, moves) => {
      await previousMovePromise;
      this.move(moves.direction, moves.id);
      return waitFor(timeBetweenMoves * 1000);
    }, Promise.resolve());
  };
  move = (direction, id) => {
    const { shells } = this.state;
    const { x, y } = this.getPosition(direction, shells[id]);
    this.setState({
      shells: {
        ...shells,
        [id]: {
          ...shells[id],
          x,
          y
        }
      }
    });
  };
  onShellClick = async isRightShell => {
    this.openShells();
    await waitFor(1);
    alert(isRightShell ? "🎉 You won" : "🙃 No luck this time");
  };
  render() {
    const { size } = this.props;
    const { shells, shellsMap, isShuffling } = this.state;
    const width = size * SQUARE_SIZE;
    const height = size * SQUARE_SIZE;
    return (
      <div className="board-container" style={{ width, height }}>
        {shellsMap.map(id => {
          const { x, y, isOpen, hasBall } = shells[id];
          const top = y * SQUARE_SIZE + 15;
          const left = x * SQUARE_SIZE + 15;
          return (
            <button
              disabled={isShuffling}
              onClick={() => this.onShellClick(hasBall)}
              className="button-reset"
              key={id}
              style={{
                position: "absolute",
                top,
                left,
                transition: "all .1s"
              }}
            >
              <Shell
                squareSize={SQUARE_SIZE}
                id={id}
                hasBall={hasBall}
                isOpen={isOpen}
              />
            </button>
          );
        })}
        <button disabled={isShuffling} onClick={this.shuffleShells}>
          SHUFFLE
        </button>
      </div>
    );
  }
}

export default Board;
