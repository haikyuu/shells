import React from "react";
import PropTypes from "prop-types";

const Shell = ({ id, isOpen, hasBall, squareSize }) => {
  const SHELL_SIZE = squareSize * 0.75;
  const BALL_SIZE = SHELL_SIZE * 0.4;
  return (
    <div
      className={`shell-container ${isOpen ? "open" : ""}`}
      style={{ width: SHELL_SIZE, height: SHELL_SIZE }}
    >
      {isOpen && hasBall ? (
        <div
          className="ball"
          style={{
            width: BALL_SIZE,
            height: BALL_SIZE,
            top: `calc(50% - ${BALL_SIZE / 2}px)`,
            left: `calc(50% - ${BALL_SIZE / 2}px)`
          }}
        />
      ) : null}
    </div>
  );
};
Shell.propTypes = {
  id: PropTypes.number.isRequired,
  squareSize: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  hasBall: PropTypes.bool.isRequired
};

export default Shell;
