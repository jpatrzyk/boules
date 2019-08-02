import { useReducer } from 'react';

import {
  AddingState,
  BaseState,
  BoardAction,
  FreeingState,
  GameConditions,
  InitialState,
  MovingState,
  State,
  StateType,
  WaitingState,
} from 'model/state';
import { findAllKeys, randomInt, range } from 'utils/helpers';
import {
  DEFAULT_BOARD_SIZE,
  DEFAULT_COLORS_COUNT,
  DEFAULT_LINE_LENGTH,
  DEFAULT_SHOW_NEXT_COLORS,
  INITIAL_BALLS_COUNT,
  MAX_COLORS_COUNT,
  NEXT_BALLS_COUNT,
} from 'utils/constants';
import findPath from './findPath';
import findFullLine from './findFullLine';

export function useModel() {
  const initialState = init();
  return useReducer(reducer, initialState);
}

function reducer(state: State, action: BoardAction) {
  if (action.type === 'board_clicked' && state.type === StateType.Waiting) {
    return handleBoardClicked(state, action.position);
  }
  if (action.type === 'animation_finished' && state.type !== StateType.Waiting) {
    return handleAnimationFinished(state as MovingState | AddingState | FreeingState);
  }
  if (action.type === 'new_game') {
    return buildNewGame(state, action.options);
  }
  if (action.type === 'load_game') {
    return {
      ...action.gameState,
      type: StateType.Waiting,
      selectedBall: -1,
    } as WaitingState;
  }
  if (
    action.type === 'undo' &&
    state.type === StateType.Waiting &&
    state.prevStepModel &&
    state.prevStepNextColors
  ) {
    return {
      ...state,
      score: state.prevStepScore || 0,
      model: state.prevStepModel,
      nextColors: state.prevStepNextColors,
      prevStepModel: undefined,
      prevStepNextColors: undefined,
      selectedBall: -1,
    };
  }
  return state;
}

export function init(size: number = DEFAULT_BOARD_SIZE): InitialState {
  return {
    size,
    lineLength: DEFAULT_LINE_LENGTH,
    colorsCount: DEFAULT_COLORS_COUNT,
    showNextColors: DEFAULT_SHOW_NEXT_COLORS,
    score: 0,
    model: new Array(size * size).fill(0),
    nextColors: new Array(NEXT_BALLS_COUNT).fill(0),
    type: StateType.Initial,
  };
}

export function buildNewGame(prevState: BaseState, options?: GameConditions): AddingState {
  const { size, colorsCount, showNextColors } = options || prevState;
  const emptyState: BaseState = {
    lineLength: prevState.lineLength,
    size,
    colorsCount,
    showNextColors,
    score: 0,
    model: new Array(size * size).fill(0),
    nextColors: chooseNextColors(colorsCount, INITIAL_BALLS_COUNT),
  };
  return choosePositionsToAddNewBalls(emptyState);
}

export function chooseNextColors(colorsCount: number, nextBallsCount: number = NEXT_BALLS_COUNT) {
  const maxColor = Math.min(colorsCount, MAX_COLORS_COUNT) + 1;
  return range(nextBallsCount).map(() => randomInt(1, maxColor));
}

export function choosePositionsToAddNewBalls(state: BaseState): AddingState {
  const emptyPlaces: number[] = [];
  state.model.forEach((value, position) => {
    if (value === 0) {
      emptyPlaces.push(position);
    }
  });

  let places = [];
  const count = state.nextColors.length;
  if (emptyPlaces.length <= count) {
    places = emptyPlaces;
  } else {
    const sliceLength = emptyPlaces.length / count;
    places = range(count).map(x => emptyPlaces[randomInt(x * sliceLength, (x + 1) * sliceLength)]);
  }

  const positionsToFill = {} as { [position: number]: number };
  places.forEach((position, i) => {
    positionsToFill[position] = state.nextColors[i];
  });

  return {
    ...state,
    type: StateType.Adding,
    positionsToFill,
  };
}

export function handleBoardClicked(
  state: WaitingState,
  position: number,
): WaitingState | MovingState {
  if (state.model[position]) {
    if (state.selectedBall === position) {
      return {
        ...state,
        selectedBall: -1,
      };
    }
    return {
      ...state,
      selectedBall: position,
    };
  }
  if (state.selectedBall >= 0) {
    const path = findPath(state.selectedBall, position, state.model, state.size);
    if (path === null) {
      return {
        ...state,
        selectedBall: -1,
      };
    }
    return {
      ...state,
      type: StateType.Moving,
      remainingPath: path,
      prevStepScore: state.score,
      prevStepModel: [...state.model],
      prevStepNextColors: [...state.nextColors],
    };
  }
  return state;
}

export function handleAnimationFinished(state: MovingState | AddingState | FreeingState): State {
  if (state.type === StateType.Moving) {
    const [updatedBallPosition, ...remainingPath] = state.remainingPath;
    const updatedModel = [...state.model];
    updatedModel[updatedBallPosition] = updatedModel[state.selectedBall];
    updatedModel[state.selectedBall] = 0;
    if (remainingPath.length > 0) {
      return {
        ...state,
        model: updatedModel,
        remainingPath,
        selectedBall: updatedBallPosition,
      };
    } else {
      const fullLine = findFullLine(
        updatedModel,
        state.size,
        state.lineLength,
        updatedBallPosition,
      );
      if (fullLine === null) {
        return choosePositionsToAddNewBalls({
          ...state,
          model: updatedModel,
        });
      } else {
        return {
          ...state,
          model: updatedModel,
          score: state.score + calculateScore(fullLine.length, state),
          type: StateType.Freeing,
          ballsToRemove: fullLine,
        };
      }
    }
  }
  if (state.type === StateType.Adding) {
    const updatedModel = [...state.model];
    const positionsYetToFill = findAllKeys(state.positionsToFill, (_k, v) => v > 0);
    if (positionsYetToFill.length < 1) {
      throw new Error();
    }

    const newBallPosition = positionsYetToFill[0];
    updatedModel[newBallPosition] = state.positionsToFill[newBallPosition];

    if (positionsYetToFill.length > 1) {
      return {
        ...state,
        model: updatedModel,
        positionsToFill: {
          ...state.positionsToFill,
          [newBallPosition]: -1,
        },
      };
    } else {
      const fullLines = Object.keys(state.positionsToFill)
        .map(k => Number(k))
        .map(position => findFullLine(updatedModel, state.size, state.lineLength, position));
      if (fullLines.some(line => line !== null)) {
        const allBallsToRemove = fullLines.flatMap(line => (line === null ? [] : line));
        return {
          ...state,
          model: updatedModel,
          nextColors: chooseNextColors(state.colorsCount),
          score: state.score + calculateScore(allBallsToRemove.length, state),
          type: StateType.Freeing,
          ballsToRemove: allBallsToRemove,
        };
      } else {
        const updatedState: WaitingState = {
          ...state,
          model: updatedModel,
          nextColors: chooseNextColors(state.colorsCount),
          type: StateType.Waiting,
          selectedBall: -1,
        };
        if (updatedState.model.every(c => c > 0)) {
          // game over
          updatedState.prevStepScore = undefined;
          updatedState.prevStepModel = undefined;
          updatedState.prevStepNextColors = undefined;
        }
        return updatedState;
      }
    }
  }
  if (state.type === StateType.Freeing) {
    const updatedModel = [...state.model];
    state.ballsToRemove.forEach(position => {
      updatedModel[position] = 0;
    });
    return {
      ...state,
      model: updatedModel,
      type: StateType.Waiting,
      selectedBall: -1,
    };
  }
  throw new Error();
}

export function calculateScore(lineLength: number, state: GameConditions): number {
  const { size, colorsCount, showNextColors } = state;
  const ballCost = Math.max(1, colorsCount - 5);
  const bonus = 9 - size;
  const cumulativeSum = lineLength * ballCost + bonus;
  if (showNextColors) {
    return cumulativeSum - Math.round(cumulativeSum / 3);
  }
  return cumulativeSum;
}
