import { useReducer } from 'react';
import { randomInt, range } from "../utils/helpers";

const NEW_BALLS_COUNT = 3;
const MAX_COLORS_COUNT = 11;

type Action =
  | { type: 'next_random' };

export function randomBalls(): Action {
    return { type: 'next_random' };
}

export function useModel(size: number, colorsCount: number) {
  function init(size: number): number[] {
    const model = new Array(size * size);
    model.fill(0);
    return model;
  }

  function addRandomBalls(model: number[]): number[] {
      const emptyPlaces: number[] = [];
      model.forEach((value, position) => {
          if (value === 0) {
              emptyPlaces.push(position);
          }
      });

      let places = [];
      if (emptyPlaces.length <= NEW_BALLS_COUNT) {
          places = emptyPlaces;
      } else {
          const sliceLength = emptyPlaces.length / NEW_BALLS_COUNT;
          places = range(NEW_BALLS_COUNT)
            .map(x => emptyPlaces[randomInt(x * sliceLength, (x + 1) * sliceLength)]);
      }

      const updatedModel = [...model];
      places.forEach(position => {
          updatedModel[position] = randomInt(1, Math.min(colorsCount, MAX_COLORS_COUNT) + 1);
      });
      return updatedModel;
  }

  function reducer(state: number[], action: Action) {
    switch (action.type) {
      case 'next_random':
        return addRandomBalls(state);
      default:
        throw new Error();
    }
  }

  return useReducer(reducer, size, init);
}
