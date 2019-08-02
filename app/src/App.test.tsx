import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

jest.mock('./components/GameOverModal', () => ({
  GameOverModal: () => <div />,
}));
jest.mock('./components/RankingModal', () => ({
  RankingModal: () => <div />,
}));
jest.mock('./components/options/OptionsSection', () => ({
  OptionsSection: () => <div />,
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
