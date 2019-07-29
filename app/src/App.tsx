import React from 'react';

import { useModel, randomBalls, boardClicked } from 'hooks/model/useModel';
import { Board } from 'components/Board';
import { NextColors } from 'components/NextColors';

import './App.css';

const size = 8;

const App: React.FC = () => {
  const [state, dispatch] = useModel(size, 10);

  function handleBoardClicked(x: number, y: number) {
    dispatch(boardClicked(x, y));
    dispatch(randomBalls());
  }

  return (
    <div className="App">
      <header>
        <h1>Kulki</h1>
      </header>
      <main>
        <NextColors nextColors={state.nextColors} />
        <Board size={size} model={state.model} selectedBall={state.selectedBall} onClick={handleBoardClicked} />
      </main>
    </div>
  );
};

export default App;
