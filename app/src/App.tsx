import React, { useState } from 'react';
import { Board } from './components/Board';
import './App.css';

const size = 8;

const App: React.FC = () => {
  const [model, setModel] = useState<number[]>(() => {
    const model = new Array(size * size);
    model.fill(0);
    return model;
  });

  function boardClicked(x: number, y: number) {
    const index = x * size + y;
    const updatedModel = [...model];
    updatedModel[index] += 1;
    setModel(updatedModel);
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
