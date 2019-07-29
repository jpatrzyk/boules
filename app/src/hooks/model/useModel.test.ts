import { MAX_COLORS_COUNT, NEXT_BALLS_COUNT } from 'utils/constants';
import { chooseNextColors, init, addRandomBalls, handleBoardClicked } from './useModel';

describe('chooseNextColors', () => {
  it('should return array of NEXT_BALLS_COUNT length', () => {
    const nextColors = chooseNextColors(5);
    expect(nextColors).toHaveLength(NEXT_BALLS_COUNT);
  });

  it('should return array of positive numbers of specified max value', () => {
    const colorsCount = 5;
    const nextColors = chooseNextColors(colorsCount);
    nextColors.forEach(color => {
      expect(color).toBeGreaterThan(0);
      expect(color).toBeLessThanOrEqual(colorsCount);
    });
  });

  it('should not return value higher than MAX_COLORS_COUNT', () => {
    const nextColors = chooseNextColors(MAX_COLORS_COUNT + 10);
    nextColors.forEach(color => {
      expect(color).toBeLessThanOrEqual(MAX_COLORS_COUNT);
    });
  });
});

describe('init', () => {
  it('should return state with all necessary fields', () => {
    const size = 7;
    const colorsCount = 5;
    const state = init(size, colorsCount);
    expect(state).toEqual({
      model: expect.arrayContaining([expect.any(Number)]),
      size,
      colorsCount,
      nextColors: expect.arrayContaining([expect.any(Number)]),
    });
  });

  it('should return model of length = size * size filled out with zeros', () => {
    const size = 3;
    const state = init(size, 5);
    expect(state.model).toHaveLength(size * size);
    expect(state.model).toMatchObject(expect.arrayContaining([0, 0, 0, 0, 0, 0, 0, 0, 0])); // 9 * 0
  });
});

describe('addRandomBalls', () => {
  it('should fill some of the empty places with balls specified in state.nextColors', () => {
    const state = {
      model: [0, 1, 0, 0, 2, 0, 0, 3, 0],
      size: 3,
      colorsCount: 5,
      nextColors: [4, 5, 5],
    };
    const updatedState = addRandomBalls(state);
    expect(updatedState.model).toMatchObject(expect.arrayContaining([0, 0, 0, 1, 2, 3, 4, 5, 5]));
  });

  it('should add no more new balls than available empty places', () => {
    const state = {
      model: [1, 1, 1, 2, 2, 2, 0, 3, 0],
      size: 3,
      colorsCount: 5,
      nextColors: [4, 5, 5],
    };
    const updatedState = addRandomBalls(state);
    expect(updatedState.model).toMatchObject(expect.arrayContaining([1, 1, 1, 2, 2, 2, 3, 4, 5]));
  });
});

describe('handleBoardClicked', () => {
  it('should select clicked ball', () => {
    const state = {
      model: [1, 2, 0, 2, 1, 3, 0, 1, 2],
      size: 3,
      colorsCount: 5,
      nextColors: [4, 5, 5],
    };
    const updatedState = handleBoardClicked(state, 1, 2);
    expect(updatedState.selectedBall).toBe(5); // 5 = 1 * size + 2, and model[5] > 0
  });

  it('should un-select a ball if clicked on currently selected ball', () => {
    const state = {
      model: [1, 2, 0, 2, 1, 3, 0, 1, 2],
      selectedBall: 5,
      size: 3,
      colorsCount: 5,
      nextColors: [4, 5, 5],
    };
    const updatedState = handleBoardClicked(state, 1, 2);
    expect(updatedState.selectedBall).toBeUndefined();
  });
});
