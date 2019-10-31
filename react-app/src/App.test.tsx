import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import './locale/init';
import { loadCurrentGame } from './utils/storage';

import App from './App';

jest.mock('./components/game-over/GameOverModal', () => ({
  GameOverModal: () => <div />,
}));
jest.mock('./components/leaderboard/LeaderboardSection', () => ({
  LeaderboardSection: () => <div />,
}));
jest.mock('./components/options/OptionsSection', () => ({
  OptionsSection: () => <div />,
}));
jest.mock('./components/tutorial/TutorialSection', () => ({
  TutorialSection: () => <div />,
}));
jest.mock('./components/load-game/LoadGameSection', () => ({
  LoadGameSection: () => <div />,
}));
jest.mock('./components/save-game/SaveGameSection', () => ({
  SaveGameSection: () => <div />,
}));
jest.mock('./components/install-prompt/InstallPromptSection', () => ({
  InstallPromptSection: () => <div />,
}));
jest.mock('./utils/storage', () => ({
  loadCurrentGame: jest.fn(async () => {}),
  persistCurrentGame: jest.fn(async () => {}),
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

  it('calls loadCurrentGame on mount', async () => {
    await act(async () => {
      ReactDOM.render(<App />, container);
    });
    expect(loadCurrentGame).toHaveBeenCalled();
  });
});
