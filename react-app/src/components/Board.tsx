import React, { useCallback, useEffect } from 'react';

import { State, StateType, BoardAction, boardClicked, animationFinished } from 'model/state';
import { delay, findKey, range } from 'utils/helpers';
import { BoardCell } from './BoardCell';
import { Direction } from './ColoredCell';

import './Board.scss';

interface Props {
  state: State;
  dispatch: (action: BoardAction) => void;
  onGameOver: () => void;
}

export const Board: React.FC<Props> = ({ state, dispatch, onGameOver }: Props) => {
  const { size, model } = state;

  useEffect(() => {
    const isGameOver = state.type === StateType.Waiting && state.model.every((c: number) => c > 0);
    if (isGameOver) {
      onGameOver();
    }
  }, [state.type, state.model, onGameOver]);

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

  const handleBoardClicked = useCallback(
    (position: number) => {
      if (isAnimating) {
        return;
      }
      dispatch(boardClicked(position));
    },
    [dispatch, isAnimating],
  );

  const handleAnimationFinished = useCallback(async () => {
    if (isLastMove) {
      await delay(100);
    }
    dispatch(animationFinished());
  }, [dispatch, isLastMove]);

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
                  x={x}
                  y={y}
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
                  onClick={handleBoardClicked}
                  onAnimationFinished={handleAnimationFinished}
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
