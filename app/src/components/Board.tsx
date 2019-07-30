import React from 'react';

import { range } from 'utils/helpers';
import { BoardCell } from './BoardCell';
import { Direction } from './ColoredCell';

import './Board.scss';

interface Props {
  size: number;
  model: number[];
  selectedBall: number;
  currentlyAnimatingPath?: number[];
  onClick: (position: number) => void;
  onMoveFinished: () => void;
}

export const Board: React.FC<Props> = ({
  size,
  model,
  selectedBall,
  currentlyAnimatingPath,
  onClick,
  onMoveFinished,
}: Props) => {
  const nextPathPosition = !!currentlyAnimatingPath && !!currentlyAnimatingPath.length ? currentlyAnimatingPath[0] : -1;
  const isAnimating = nextPathPosition >= 0;
  const isLastMove = !!currentlyAnimatingPath && currentlyAnimatingPath.length === 1;

  function handleMoveFinished() {
    if (isLastMove) {
      setTimeout(() => {
        onMoveFinished();
      }, 100);
    } else {
      onMoveFinished();
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
              return (
                <BoardCell
                  key={y}
                  position={position}
                  value={value}
                  selected={isSelected}
                  disabled={isAnimating}
                  animateTo={
                    isSelected && isAnimating ? getAnimationDirection(position, nextPathPosition, size) : undefined
                  }
                  onClick={isAnimating ? noop : onClick}
                  onMoveFinished={handleMoveFinished}
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
