import {
  MAX_COLORS_COUNT,
  NEXT_BALLS_COUNT,
  DEFAULT_LINE_LENGTH,
  INITIAL_BALLS_COUNT,
} from 'utils/constants';
import {
  chooseNextColors,
  init,
  choosePositionsToAddNewBalls,
  handleBoardClicked,
  handleAnimationFinished,
  StateType,
  WaitingState,
  MovingState,
  AddingState,
  FreeingState,
} from './useModel';

describe('chooseNextColors', () => {
  it('should return array of NEXT_BALLS_COUNT length by default', () => {
    const nextColors = chooseNextColors(5);
    expect(nextColors).toHaveLength(NEXT_BALLS_COUNT);
  });

  it('should return array of specified length, if provided', () => {
    const expectedLength = 7;
    const nextColors = chooseNextColors(5, expectedLength);
    expect(nextColors).toHaveLength(expectedLength);
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
    expect(state).toMatchObject({
      size,
      lineLength: DEFAULT_LINE_LENGTH,
      colorsCount,
      score: 0,
      model: new Array(size * size).fill(0),
      nextColors: expect.any(Array),
      type: StateType.Adding,
      positionsToFill: expect.any(Object),
    });
  });

  it('should return model of length = size * size filled with zeros', () => {
    const size = 3;
    const state = init(size, 5);
    expect(state.model).toHaveLength(size * size);
    expect(state.model.filter(a => a === 0)).toHaveLength(size * size); // all zeros
  });

  it('should return positionsToFill with INITIAL_BALLS_COUNT keys and values from state.nextColors', () => {
    const size = 3;
    const state = init(size, 5);
    expect(Object.keys(state.positionsToFill)).toHaveLength(INITIAL_BALLS_COUNT);
    expect(Object.values(state.positionsToFill)).toEqual(expect.arrayContaining(state.nextColors));
  });
});

describe('choosePositionsToAddNewBalls', () => {
  it('should return positionsToFill with keys set to some empty places and values to state.nextColors', () => {
    const state: WaitingState = {
      size: 3,
      lineLength: 3,
      colorsCount: 6,
      score: 0,
      model: [0, 1, 0, 0, 2, 0, 0, 3, 0],
      nextColors: [4, 5, 6],
      type: StateType.Waiting,
      selectedBall: -1,
    };
    const updatedState = choosePositionsToAddNewBalls(state);
    expect(Object.keys(updatedState.positionsToFill)).toHaveLength(state.nextColors.length);
    expect(Object.values(updatedState.positionsToFill)).toMatchObject(
      expect.arrayContaining([4, 5, 6]),
    );
    Object.keys(updatedState.positionsToFill).forEach(position => {
      expect(state.model[Number(position)]).toBe(0);
    });
  });

  it('should add no more new balls than available empty places', () => {
    const state: WaitingState = {
      size: 3,
      lineLength: 3,
      colorsCount: 6,
      score: 0,
      model: [1, 1, 1, 2, 2, 2, 0, 3, 0],
      nextColors: [4, 5, 6],
      type: StateType.Waiting,
      selectedBall: -1,
    };
    const updatedState = choosePositionsToAddNewBalls(state);
    expect(Object.keys(updatedState.positionsToFill)).toHaveLength(2);
    expect(Object.values(updatedState.positionsToFill)).toMatchObject(
      expect.arrayContaining([4, 5]),
    );
  });
});

describe('handleBoardClicked', () => {
  it('should select clicked ball', () => {
    const state: WaitingState = {
      size: 3,
      lineLength: 3,
      colorsCount: 5,
      score: 0,
      // prettier-ignore
      model: [
        1, 2, 0,
        2, 1, 3,
        0, 1, 2],
      nextColors: [4, 5, 5],
      type: StateType.Waiting,
      selectedBall: 0,
    };
    const updatedState = handleBoardClicked(state, 5);
    expect(updatedState.selectedBall).toBe(5);
  });

  it('should un-select a ball if clicked on currently selected ball', () => {
    const state: WaitingState = {
      size: 3,
      lineLength: 3,
      colorsCount: 5,
      score: 0,
      // prettier-ignore
      model: [
        1, 2, 0,
        2, 1, 3,
        0, 1, 2],
      nextColors: [4, 5, 5],
      type: StateType.Waiting,
      selectedBall: 5,
    };
    const updatedState = handleBoardClicked(state, 5);
    expect(updatedState.selectedBall).toBe(-1);
  });

  it('should un-select a ball if no path exists', () => {
    const state: WaitingState = {
      size: 3,
      lineLength: 3,
      colorsCount: 5,
      score: 0,
      // prettier-ignore
      model: [
        1, 2, 0,
        2, 1, 3,
        0, 1, 2],
      nextColors: [4, 5, 5],
      type: StateType.Waiting,
      selectedBall: 1,
    };
    const updatedState = handleBoardClicked(state, 6);
    expect(updatedState.selectedBall).toBe(-1);
  });

  it('should set path if such exists', () => {
    const state: WaitingState = {
      size: 3,
      lineLength: 3,
      colorsCount: 5,
      score: 0,
      // prettier-ignore
      model: [
        1, 0, 0,
        0, 0, 0,
        0, 0, 0],
      nextColors: [4, 5, 5],
      type: StateType.Waiting,
      selectedBall: 0,
    };
    const updatedState = handleBoardClicked(state, 2);
    expect(updatedState).toMatchObject({
      type: StateType.Moving,
      selectedBall: 0,
      remainingPath: [1, 2],
    });
  });
});

describe('handleAnimationFinished', () => {
  it('should move selected ball and remove the first element of the path', () => {
    const state: MovingState = {
      size: 3,
      lineLength: 3,
      colorsCount: 5,
      score: 0,
      // prettier-ignore
      model: [
        1, 0, 0,
        0, 0, 0,
        0, 0, 0],
      nextColors: [4, 5, 5],
      type: StateType.Moving,
      selectedBall: 0,
      remainingPath: [1, 2],
    };
    const updatedState = handleAnimationFinished(state);
    expect(updatedState).toMatchObject({
      // prettier-ignore
      model: [
        0, 1, 0,
        0, 0, 0,
        0, 0, 0],
      type: StateType.Moving,
      selectedBall: 1,
      remainingPath: [2],
    });
  });

  it('should start adding new balls if no line built', () => {
    const state: MovingState = {
      size: 3,
      lineLength: 3,
      colorsCount: 5,
      score: 0,
      model: [0, 1, 0, 0, 0, 0, 0, 0, 0],
      nextColors: [4, 5, 5],
      type: StateType.Moving,
      selectedBall: 1,
      remainingPath: [2],
    };
    const updatedState = handleAnimationFinished(state);
    expect(updatedState.type).toEqual(StateType.Adding);
    expect(Object.values((updatedState as AddingState).positionsToFill)).toEqual(
      expect.arrayContaining(state.nextColors),
    );
  });

  it('should start removing the line of identical balls if no shorter than model.lineLength', () => {
    const state: MovingState = {
      size: 3,
      lineLength: 3,
      colorsCount: 5,
      score: 0,
      // prettier-ignore
      model: [
        0, 3, 0,
        2, 0, 0,
        0, 2, 2],
      nextColors: [4, 5, 5],
      type: StateType.Moving,
      selectedBall: 3,
      remainingPath: [6],
    };
    const updatedState = handleAnimationFinished(state); // moving from (1,0) to (2,0)
    expect(updatedState).toMatchObject({
      score: 3,
      // prettier-ignore
      model: [
        0, 3, 0,
        0, 0, 0,
        2, 2, 2],
      type: StateType.Freeing,
      ballsToRemove: [6, 7, 8],
    });
  });

  it('should animate adding balls one by one', () => {
    const state: AddingState = {
      size: 3,
      lineLength: 3,
      colorsCount: 5,
      score: 0,
      // prettier-ignore
      model: [
        0, 1, 0,
        0, 0, 0,
        0, 0, 0],
      nextColors: [4, 5, 5],
      type: StateType.Adding,
      positionsToFill: {
        0: 4,
        4: 5,
        6: 5,
      },
    };
    const updatedState = handleAnimationFinished(state);
    expect(updatedState.type).toEqual(StateType.Adding);
    expect(updatedState.model).toEqual([4, 1, 0, 0, 0, 0, 0, 0, 0]);
    expect((updatedState as AddingState).positionsToFill).toEqual({
      0: -1,
      4: 5,
      6: 5,
    });
  });

  it('should start waiting for user after last ball added', () => {
    const state: AddingState = {
      size: 3,
      lineLength: 3,
      colorsCount: 5,
      score: 0,
      // prettier-ignore
      model: [
        4, 1, 0,
        0, 5, 0,
        0, 0, 0],
      nextColors: [4, 5, 5],
      type: StateType.Adding,
      positionsToFill: {
        0: -1,
        4: -1,
        6: 5,
      },
    };
    const updatedState = handleAnimationFinished(state) as WaitingState;
    expect(updatedState.type).toEqual(StateType.Waiting);
    expect(updatedState.model).toEqual([4, 1, 0, 0, 5, 0, 5, 0, 0]);
    expect(updatedState.selectedBall).toEqual(-1);
    expect(updatedState.nextColors).not.toEqual(state.nextColors);
  });

  it('should start removing the line of identical balls if such was automatically created', () => {
    const state: AddingState = {
      size: 3,
      lineLength: 3,
      colorsCount: 5,
      score: 0,
      // prettier-ignore
      model: [
        0, 3, 0,
        1, 0, 0,
        0, 2, 2],
      nextColors: [3, 1, 2],
      type: StateType.Adding,
      positionsToFill: {
        1: -1,
        3: -1,
        6: 2,
      },
    };
    const updatedState = handleAnimationFinished(state);
    expect(updatedState).toMatchObject({
      score: 3,
      // prettier-ignore
      model: [
        0, 3, 0,
        1, 0, 0,
        2, 2, 2],
      type: StateType.Freeing,
      ballsToRemove: [6, 7, 8],
    });
    expect(updatedState.nextColors).not.toEqual(state.nextColors);
  });

  it('should start waiting for user after removing the full lines', () => {
    const state: FreeingState = {
      size: 3,
      lineLength: 3,
      colorsCount: 5,
      score: 3,
      // prettier-ignore
      model: [
        0, 3, 0,
        0, 0, 0,
        2, 2, 2],
      nextColors: [4, 5, 5],
      type: StateType.Freeing,
      ballsToRemove: [6, 7, 8],
    };
    const updatedState = handleAnimationFinished(state) as WaitingState;
    expect(updatedState).toMatchObject({
      score: 3,
      // prettier-ignore
      model: [
        0, 3, 0,
        0, 0, 0,
        0, 0, 0],
      nextColors: state.nextColors,
      type: StateType.Waiting,
      selectedBall: -1,
    });
  });
});
