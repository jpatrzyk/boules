import { useReducer } from 'react';
import { randomInt, range } from 'utils/helpers';
import { MAX_COLORS_COUNT, NEXT_BALLS_COUNT } from 'utils/constants';

type Action = { type: 'next_random' } | { type: 'board_clicked'; x: number; y: number };

interface State {
  model: number[];
  selectedBall?: number;
  nextColors: number[];
}

export function randomBalls(): Action {
  return { type: 'next_random' };
}

export function boardClicked(x: number, y: number): Action {
  return { type: 'board_clicked', x, y };
}

export function useModel(size: number, colorsCount: number) {
  function chooseNextColors() {
    const maxColor = Math.min(colorsCount, MAX_COLORS_COUNT) + 1;
    return range(NEXT_BALLS_COUNT).map(() => randomInt(1, maxColor));
  }

  function init(size: number): State {
    const model = new Array(size * size);
    model.fill(0);
    return {
      model,
      nextColors: chooseNextColors(),
    };
  }

  function addRandomBalls({ model, nextColors, ...state }: State): State {
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
      nextColors: chooseNextColors(),
    };
  }

  function handleBoardClicked(state: State, x: number, y: number): State {
    const position = x * size + y;
    console.log({ position, hasBall: state.model[position] });
    if (state.model[position] === 0 || state.selectedBall === position) {
      return {
        ...state,
        selectedBall: undefined,
      };
    }
    return {
      ...state,
      selectedBall: position,
    };
  }

  function reducer(state: State, action: Action) {
    switch (action.type) {
      case 'next_random':
        return addRandomBalls(state);
      case 'board_clicked':
        return handleBoardClicked(state, action.x, action.y);
      default:
        throw new Error();
    }
  }

  return useReducer(reducer, size, init);
}
