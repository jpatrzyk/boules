import { MAX_COLORS_COUNT, NEXT_BALLS_COUNT, DEFAULT_LINE_LENGTH } from 'utils/constants';
import { chooseNextColors, init, addRandomBalls, handleBoardClicked, handleMoveFinished } from './useModel';

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
      lineLength: DEFAULT_LINE_LENGTH,
      colorsCount,
      selectedBall: -1,
      nextColors: expect.arrayContaining([expect.any(Number)]),
    });
  });

  it('should return model of length = size * size with NEXT_BALLS_COUNT random numbers and zeros', () => {
    const size = 3;
    const state = init(size, 5);
    expect(state.model).toHaveLength(size * size);
    expect(state.model.filter(a => a === 0)).toHaveLength(size * size - NEXT_BALLS_COUNT);
  });
});

describe('addRandomBalls', () => {
  it('should fill some of the empty places with balls specified in state.nextColors', () => {
    const state = {
      model: [0, 1, 0, 0, 2, 0, 0, 3, 0],
      size: 3,
      lineLength: 3,
      colorsCount: 6,
      selectedBall: -1,
      nextColors: [4, 5, 6],
    };
    const updatedState = addRandomBalls(state);
    expect(updatedState.model).toMatchObject(expect.arrayContaining([0, 1, 2, 3, 4, 5, 6]));
  });

  it('should add no more new balls than available empty places', () => {
    const state = {
      model: [1, 1, 1, 2, 2, 2, 0, 3, 0],
      size: 3,
      lineLength: 3,
      colorsCount: 6,
      selectedBall: -1,
      nextColors: [4, 5, 6],
    };
    const updatedState = addRandomBalls(state);
    expect(updatedState.model).toMatchObject(expect.arrayContaining([1, 2, 3, 4, 5]));
    expect(updatedState.model).toMatchObject(expect.not.arrayContaining([0]));
    expect(updatedState.model).toMatchObject(expect.not.arrayContaining([6]));
  });
});

describe('handleBoardClicked', () => {
  it('should select clicked ball', () => {
    const state = {
      // prettier-ignore
      model: [
        1, 2, 0,
        2, 1, 3,
        0, 1, 2],
      size: 3,
      lineLength: 3,
      colorsCount: 5,
      selectedBall: 0,
      nextColors: [4, 5, 5],
    };
    const updatedState = handleBoardClicked(state, 5);
    expect(updatedState.selectedBall).toBe(5);
  });

  it('should un-select a ball if clicked on currently selected ball', () => {
    const state = {
      // prettier-ignore
      model: [
        1, 2, 0,
        2, 1, 3,
        0, 1, 2],
      selectedBall: 5,
      size: 3,
      lineLength: 3,
      colorsCount: 5,
      nextColors: [4, 5, 5],
    };
    const updatedState = handleBoardClicked(state, 5);
    expect(updatedState.selectedBall).toBe(-1);
  });

  it('should un-select a ball if no path exists', () => {
    const state = {
      // prettier-ignore
      model: [
        1, 2, 0,
        2, 1, 3,
        0, 1, 2],
      selectedBall: 1,
      size: 3,
      lineLength: 3,
      colorsCount: 5,
      nextColors: [4, 5, 5],
    };
    const updatedState = handleBoardClicked(state, 6);
    expect(updatedState.selectedBall).toBe(-1);
  });

  it('should set path if such exists', () => {
    const state = {
      // prettier-ignore
      model: [
        1, 0, 0,
        0, 0, 0,
        0, 0, 0],
      selectedBall: 0,
      size: 3,
      lineLength: 3,
      colorsCount: 5,
      nextColors: [4, 5, 5],
    };
    const updatedState = handleBoardClicked(state, 2);
    expect(updatedState).toMatchObject({
      selectedBall: 0,
      currentlyAnimatingPath: [1, 2],
    });
  });
});

describe('handleMoveFinished', () => {
  it('should move selected ball and remove the first element of the path', () => {
    const state = {
      // prettier-ignore
      model: [
        1, 0, 0,
        0, 0, 0,
        0, 0, 0],
      selectedBall: 0,
      currentlyAnimatingPath: [1, 2],
      size: 3,
      lineLength: 3,
      colorsCount: 5,
      nextColors: [4, 5, 5],
    };
    const updatedState = handleMoveFinished(state);
    expect(updatedState).toMatchObject({
      // prettier-ignore
      model: [
        0, 1, 0,
        0, 0, 0,
        0, 0, 0],
      selectedBall: 1,
      currentlyAnimatingPath: [2],
    });
  });

  it('should un-select the moved ball if finished', () => {
    const state = {
      model: [0, 1, 0, 0, 0, 0, 0, 0, 0],
      selectedBall: 1,
      currentlyAnimatingPath: [2],
      size: 3,
      lineLength: 3,
      colorsCount: 5,
      nextColors: [4, 5, 5],
    };
    const updatedState = handleMoveFinished(state);
    expect(updatedState).toMatchObject({
      selectedBall: -1,
      currentlyAnimatingPath: undefined,
    });
  });

  it('should add next balls if finished and no line built', () => {
    const state = {
      model: [0, 1, 0, 0, 0, 0, 0, 0, 0],
      selectedBall: 1,
      currentlyAnimatingPath: [2],
      size: 3,
      lineLength: 3,
      colorsCount: 5,
      nextColors: [4, 5, 5],
    };
    const updatedState = handleMoveFinished(state);
    expect(updatedState.model).toMatchObject(expect.arrayContaining([0, 1, 4, 5, 5]));
  });

  it('should remove the line of same balls if no shorter than model.lineLength', () => {
    const state = {
      // prettier-ignore
      model: [
        0, 3, 0,
        2, 0, 0,
        0, 2, 2],
      lineLength: 3,
      selectedBall: 3,
      currentlyAnimatingPath: [6],
      size: 3,
      colorsCount: 5,
      nextColors: [4, 5, 5],
    };
    const updatedState = handleMoveFinished(state); // moving from (1,0) to (2,0)
    expect(updatedState).toMatchObject({
      // prettier-ignore
      model: [
        0, 3, 0,
        0, 0, 0,
        0, 0, 0],
      selectedBall: -1,
      currentlyAnimatingPath: undefined,
    });
  });
});
