import React from 'react';
import ReactDOM from 'react-dom';

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

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
