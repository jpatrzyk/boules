import React from 'react';

import { useModel, randomBalls } from "./hooks/useModel";
import { Board } from './components/Board';
import './App.css';

const size = 8;

const App: React.FC = () => {
  const [model, dispatch] = useModel(size, 10);

  function boardClicked(x: number, y: number) {
    dispatch(randomBalls());
  }

  return (
    <div className="App">
      <header>
        <h1>Kulki</h1>
      </header>
      <main>
        <Board size={size} model={model} onClick={boardClicked} />
      </main>
    </div>
  );
};

export default App;
