import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import './locale/init';
import { loadGameConditions, persistGameConditions } from './utils/storage';

import App from './App';
import {
  DEFAULT_BOARD_SIZE,
  DEFAULT_COLORS_COUNT,
  DEFAULT_SHOW_NEXT_COLORS,
} from './utils/constants';

jest.mock('./components/game-over/GameOverModal', () => ({
  GameOverModal: () => <div />,
}));
jest.mock('./components/leaderboard/LeaderboardSection', () => ({
  LeaderboardSection: () => <div />,
}));
jest.mock('./components/options/OptionsSection', () => ({
  OptionsSection: () => <div />,
}));
jest.mock('./components/load-game/LoadGameSection', () => ({
  LoadGameSection: () => <div />,
}));
jest.mock('./components/save-game/SaveGameSection', () => ({
  SaveGameSection: () => <div />,
}));
jest.mock('./utils/storage', () => ({
  loadGameConditions: jest.fn(async () => {}),
  persistGameConditions: jest.fn(() => {}),
}));

describe('App', () => {
  let container: HTMLDivElement | null = null;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    jest.resetAllMocks();
  });

  afterEach(() => {
    if (container) {
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  it('renders without crashing', async () => {
    await act(async () => {
      ReactDOM.render(<App />, container);
    });
  });

  it('calls loadGameConditions on mount', async () => {
    await act(async () => {
      ReactDOM.render(<App />, container);
    });
    expect(loadGameConditions).toHaveBeenCalled();
  });

  it('calls persistGameConditions with default conditions if no were stored', async () => {
    await act(async () => {
      ReactDOM.render(<App />, container);
    });
    expect(persistGameConditions).toHaveBeenCalledWith({
      size: DEFAULT_BOARD_SIZE,
      showNextColors: DEFAULT_SHOW_NEXT_COLORS,
      colorsCount: DEFAULT_COLORS_COUNT,
    });
  });

  it('does not call persistGameConditions if there were already stored conditions', async () => {
    (loadGameConditions as jest.Mock).mockReturnValue({
      size: 5,
      showNextColors: true,
      colorsCount: 5,
    });
    await act(async () => {
      ReactDOM.render(<App />, container);
    });
    expect(persistGameConditions).not.toHaveBeenCalled();
  });
});
