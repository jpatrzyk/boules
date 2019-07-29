import { useReducer } from 'react';
import { randomInt, range } from 'utils/helpers';
import { MAX_COLORS_COUNT, NEXT_BALLS_COUNT } from 'utils/constants';

type Action = { type: 'board_clicked'; position: number } | { type: 'move_finished' };

interface State {
  model: number[];
  size: number;
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

export function chooseNextColors(colorsCount: number) {
  const maxColor = Math.min(colorsCount, MAX_COLORS_COUNT) + 1;
  return range(NEXT_BALLS_COUNT).map(() => randomInt(1, maxColor));
}

export function init(size: number, colorsCount: number): State {
  const model = new Array(size * size);
  model.fill(0);
  const emptyState = {
    model,
    size,
    colorsCount,
    selectedBall: -1,
    nextColors: chooseNextColors(colorsCount),
  };
  return addRandomBalls(emptyState);
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

export function findPath(fromPosition: number, toPosition: number, model: number[], size: number): number[] | null {
  if (fromPosition === toPosition) {
    return [];
  }
  if (model[toPosition] > 0) {
    return null;
  }

  const positionsToCheck = [fromPosition];
  const backWay: number[] = [];
  backWay[fromPosition] = -1;
  let nextToCheck = 0;
  const visited: boolean[] = [];
  visited[fromPosition] = true;

  while (nextToCheck < positionsToCheck.length) {
    let startingPosition = positionsToCheck[nextToCheck];
    if (startingPosition === toPosition) {
      const path = [toPosition];
      let prevPositionOnPath = backWay[toPosition];
      while (prevPositionOnPath !== fromPosition) {
        path.push(prevPositionOnPath);
        prevPositionOnPath = backWay[prevPositionOnPath];
      }
      return path.reverse();
    }
    let candidate = startingPosition - size; // upper cell
    if (candidate >= 0 && model[candidate] === 0 && !visited[candidate]) {
      // upper cell exists, is empty & not visited
      positionsToCheck.push(candidate);
      visited[candidate] = true;
      backWay[candidate] = startingPosition;
    }
    candidate = startingPosition + size; // lower cell
    if (candidate < model.length && model[candidate] === 0 && !visited[candidate]) {
      positionsToCheck.push(candidate);
      visited[candidate] = true;
      backWay[candidate] = startingPosition;
    }
    candidate = startingPosition - 1; // left cell
    if (startingPosition % size !== 0 && model[candidate] === 0 && !visited[candidate]) {
      positionsToCheck.push(candidate);
      visited[candidate] = true;
      backWay[candidate] = startingPosition;
    }
    candidate = startingPosition + 1; // right cell
    if (startingPosition % size !== size - 1 && model[candidate] === 0 && !visited[candidate]) {
      positionsToCheck.push(candidate);
      visited[candidate] = true;
      backWay[candidate] = startingPosition;
    }
    nextToCheck++;
  }

  return null;
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
    return addRandomBalls({
      ...state,
      model: updatedModel,
      currentlyAnimatingPath: undefined,
      selectedBall: -1,
    });
  }
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

export function useModel(size: number, colorsCount: number) {
  function initState() {
    return init(size, colorsCount);
  }

  return useReducer(reducer, {}, initState);
}
