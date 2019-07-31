import { useReducer } from 'react';
import { findAllKeys, randomInt, range } from 'utils/helpers';
import {
  DEFAULT_LINE_LENGTH,
  MAX_COLORS_COUNT,
  INITIAL_BALLS_COUNT,
  NEXT_BALLS_COUNT,
  DEFAULT_BOARD_SIZE,
  DEFAULT_COLORS_COUNT,
} from 'utils/constants';
import findPath from './findPath';
import findFullLine from './findFullLine';

type Action =
  | { type: 'board_clicked'; position: number }
  | { type: 'animation_finished' }
  | { type: 'new_game' };

interface BaseState {
  size: number;
  lineLength: number;
  colorsCount: number;
  score: number;
  model: number[];
  nextColors: number[];
}

export enum StateType {
  Waiting = 'waiting_for_click',
  Moving = 'moving_selected_ball',
  Adding = 'adding_new_balls',
  Freeing = 'freeing_full_row',
}

export interface WaitingState extends BaseState {
  type: StateType.Waiting;
  selectedBall: number; // -1 means no selection
}

export interface MovingState extends BaseState {
  type: StateType.Moving;
  selectedBall: number;
  remainingPath: number[];
}

export interface AddingState extends BaseState {
  type: StateType.Adding;
  positionsToFill: { [position: number]: number };
}

export interface FreeingState extends BaseState {
  type: StateType.Freeing;
  ballsToRemove: number[];
}

export type State = WaitingState | MovingState | AddingState | FreeingState;

export function boardClicked(position: number): Action {
  return { type: 'board_clicked', position };
}

export function animationFinished(): Action {
  return { type: 'animation_finished' };
}

export function newGame(): Action {
  return { type: 'new_game' };
}

export function useModel(size: number, colorsCount: number) {
  function initState() {
    return init(size, colorsCount);
  }

  return useReducer(reducer, undefined, initState);
}

function reducer(state: State, action: Action) {
  if (action.type === 'board_clicked' && state.type === StateType.Waiting) {
    return handleBoardClicked(state, action.position);
  }
  if (action.type === 'animation_finished' && state.type !== StateType.Waiting) {
    return handleAnimationFinished(state as MovingState | AddingState | FreeingState);
  }
  if (action.type === 'new_game') {
    return init(state.size, state.colorsCount);
  }
  return state;
}

export function init(
  size: number = DEFAULT_BOARD_SIZE,
  colorsCount: number = DEFAULT_COLORS_COUNT,
): AddingState {
  const emptyState: BaseState = {
    size,
    lineLength: DEFAULT_LINE_LENGTH,
    colorsCount,
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
        return {
          ...state,
          model: updatedModel,
          nextColors: chooseNextColors(state.colorsCount),
          type: StateType.Waiting,
          selectedBall: -1,
        };
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

export function calculateScore(lineLength: number, state: BaseState): number {
  return lineLength; // todo take state into account
}
