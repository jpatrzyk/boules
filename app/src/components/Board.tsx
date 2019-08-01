import React from 'react';

import { State, StateType } from 'model/state';
import { findKey, range } from 'utils/helpers';
import { BoardCell } from './BoardCell';
import { Direction } from './ColoredCell';

import './Board.scss';

interface Props {
  state: State;
  onClick: (position: number) => void;
  onAnimationFinished: () => void;
}

export const Board: React.FC<Props> = ({ state, onClick, onAnimationFinished }: Props) => {
  const { size, model } = state;

  let selectedBall = -1,
    isAnimating = false,
    nextPathPosition = -1,
    isLastMove = false,
    nextPositionToAddBall = -1,
    newBallColor = 0,
    ballsToRemove = [] as number[];

  if (state.type === StateType.Waiting) {
    selectedBall = state.selectedBall;
  }
  if (state.type === StateType.Moving) {
    selectedBall = state.selectedBall;
    isAnimating = true;
    nextPathPosition = state.remainingPath[0];
    isLastMove = state.remainingPath.length === 1;
  }
  if (state.type === StateType.Adding) {
    isAnimating = true;
    nextPositionToAddBall = findKey(state.positionsToFill, (k, v) => v > 0, -1);
    newBallColor = state.positionsToFill[nextPositionToAddBall];
  }
  if (state.type === StateType.Freeing) {
    isAnimating = true;
    ballsToRemove = state.ballsToRemove;
  }

  function handleMoveFinished() {
    if (isLastMove) {
      setTimeout(() => {
        onAnimationFinished();
      }, 100);
    } else {
      onAnimationFinished();
    }
  }

  return (
    <div className="Board">
      {range(size).map(x => {
        return (
          <div key={x} className="Board-row">
            {range(size).map(y => {
              const position = x * size + y;
              const value = model[position];
              const isSelected = selectedBall === position;
              const isAddingNewBall = nextPositionToAddBall === position;
              const isDisappearing = ballsToRemove.includes(position);
              return (
                <BoardCell
                  key={y}
                  position={position}
                  value={value}
                  selected={isSelected}
                  disabled={isAnimating}
                  moveTo={
                    isSelected && isAnimating
                      ? getAnimationDirection(position, nextPathPosition, size)
                      : undefined
                  }
                  fillNewValue={isAddingNewBall ? newBallColor : undefined}
                  disappearing={isDisappearing}
                  onClick={isAnimating ? noop : onClick}
                  onAnimationFinished={handleMoveFinished}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

function getAnimationDirection(position: number, nextPosition: number, size: number) {
  if (nextPosition === position - size) {
    return Direction.up;
  }
  if (nextPosition === position + size) {
    return Direction.down;
  }
  if (nextPosition === position - 1) {
    return Direction.left;
  }
  return Direction.right;
}

function noop() {}
