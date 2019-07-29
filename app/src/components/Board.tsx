import React from 'react';

import { range } from 'utils/helpers';
import { BoardCell } from './BoardCell';
import { Direction } from './ColoredCell';

import './Board.css';

interface Props {
  size: number;
  model: number[];
  selectedBall: number;
  currentlyAnimatingPath?: number[];
  onClick: (position: number) => void;
  onMoveFinished: (position: number) => void;
}

export const Board: React.FC<Props> = ({
  size,
  model,
  selectedBall,
  currentlyAnimatingPath,
  onClick,
  onMoveFinished,
}: Props) => {
  const nextPathPosition =
    !!currentlyAnimatingPath && !!currentlyAnimatingPath.length
      ? currentlyAnimatingPath[0]
      : -1;
  const isAnimating = nextPathPosition >= 0;
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
                  isSelected={isSelected}
                  animateTo={
                    isSelected && isAnimating ? getAnimationDirection(position, nextPathPosition, size) : undefined
                  }
                  onClick={isAnimating ? noop : onClick}
                  onMoveFinished={onMoveFinished}
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
    return Direction.top;
  }
  if (nextPosition === position + size) {
    return Direction.bottom;
  }
  if (nextPosition === position - 1) {
    return Direction.left;
  }
  return Direction.right;
}

function noop() {}
