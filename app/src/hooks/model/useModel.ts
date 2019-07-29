import { useReducer } from 'react';
import { randomInt, range } from 'utils/helpers';
import { DEFAULT_LINE_LENGTH, MAX_COLORS_COUNT, NEXT_BALLS_COUNT } from 'utils/constants';
import findPath from './findPath';
import findFullLineStart from './findFullLineStart';

type Action = { type: 'board_clicked'; position: number } | { type: 'move_finished' };

interface State {
  points: number;
  model: number[];
  size: number;
  lineLength: number;
  colorsCount: number;
  selectedBall: number; // -1 means no selection
  nextColors: number[];
  currentlyAnimatingPath?: number[];
}

export function boardClicked(position: number): Action {
  return { type: 'board_clicked', position };
}

export function moveFinished(): Action {
  return { type: 'move_finished' };
}

export function useModel(size: number, colorsCount: number) {
  function initState() {
    return init(size, colorsCount);
  }

  return useReducer(reducer, {}, initState);
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'board_clicked':
      return handleBoardClicked(state, action.position);
    case 'move_finished':
      return handleMoveFinished(state);
    default:
      throw new Error();
  }
}

export function init(size: number, colorsCount: number): State {
  const model = new Array(size * size);
  model.fill(0);
  const emptyState = {
    points: 0,
    model,
    size,
    lineLength: DEFAULT_LINE_LENGTH,
    colorsCount,
    selectedBall: -1,
    nextColors: chooseNextColors(colorsCount),
  };
  return addRandomBalls(emptyState);
}

export function chooseNextColors(colorsCount: number) {
  const maxColor = Math.min(colorsCount, MAX_COLORS_COUNT) + 1;
  return range(NEXT_BALLS_COUNT).map(() => randomInt(1, maxColor));
}

export function addRandomBalls({ model, nextColors, ...state }: State): State {
  const emptyPlaces: number[] = [];
  model.forEach((value, position) => {
    if (value === 0) {
      emptyPlaces.push(position);
    }
  });

  let places = [];
  if (emptyPlaces.length <= NEXT_BALLS_COUNT) {
    places = emptyPlaces;
  } else {
    const sliceLength = emptyPlaces.length / NEXT_BALLS_COUNT;
    places = range(NEXT_BALLS_COUNT).map(x => emptyPlaces[randomInt(x * sliceLength, (x + 1) * sliceLength)]);
  }

  const updatedModel = [...model];
  places.forEach((position, i) => {
    updatedModel[position] = nextColors[i];
  });

  return {
    ...state,
    model: updatedModel,
    nextColors: chooseNextColors(state.colorsCount),
  };
}

export function handleBoardClicked(state: State, position: number): State {
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
      currentlyAnimatingPath: path,
    };
  }
  return state;
}

export function handleMoveFinished(state: State): State {
  if (!state.currentlyAnimatingPath || !state.currentlyAnimatingPath.length) {
    return state;
  }
  const [nextSelectedBall, ...remainingPath] = state.currentlyAnimatingPath;
  const updatedModel = [...state.model];
  updatedModel[nextSelectedBall] = updatedModel[state.selectedBall];
  updatedModel[state.selectedBall] = 0;
  if (remainingPath.length) {
    return {
      ...state,
      model: updatedModel,
      currentlyAnimatingPath: remainingPath,
      selectedBall: nextSelectedBall,
    };
  } else {
    const { fullLineStart, length, next } = findFullLineStart(updatedModel, state.size, state.lineLength, nextSelectedBall);
    if (fullLineStart >= 0) {
      return {
        ...state,
        model: removeFullLine(updatedModel, fullLineStart, next),
        points: state.points + length,
        currentlyAnimatingPath: undefined,
        selectedBall: -1,
      };
    }

    return addRandomBalls({
      ...state,
      model: updatedModel,
      currentlyAnimatingPath: undefined,
      selectedBall: -1,
    });
  }
}

function removeFullLine(model: number[], start: number, next: (i: number) => number): number[] {
  const updatedModel = [...model];
  let i = start;
  while (model[i] === model[start]) {
    updatedModel[i] = 0;
    i = next(i);
  }
  return updatedModel;
}
