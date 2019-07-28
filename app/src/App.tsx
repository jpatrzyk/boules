import React from 'react';

import { useModel, randomBalls } from "./hooks/useModel";
import { Board } from './components/Board';
import { NextColors } from "./components/NextColors";

import './App.css';

const size = 8;

const App: React.FC = () => {
  const [state, dispatch] = useModel(size, 10);

  function boardClicked(x: number, y: number) {
    dispatch(randomBalls());
  }

  return (
    <div className="App">
      <header>
        <h1>Kulki</h1>
      </header>
      <main>
        <NextColors nextColors={state.nextColors} />
        <Board size={size} model={state.model} onClick={boardClicked} />
      </main>
    </div>
  );
};

export default App;
