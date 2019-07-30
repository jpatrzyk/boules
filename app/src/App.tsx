import React, { useCallback } from 'react';

import { useModel, boardClicked, moveFinished } from 'hooks/model/useModel';
import { Board } from 'components/Board';
import { NextColors } from 'components/NextColors';

import './App.css';

const size = 8;

const App: React.FC = () => {
  const [state, dispatch] = useModel(size, 5);

  const handleBoardClicked = useCallback((position: number) => {
    dispatch(boardClicked(position));
  }, [dispatch]);

  const handleMoveFinished = useCallback(() => {
    dispatch(moveFinished());
  }, [dispatch]);

  return (
    <div className="App">
      <header>
        <h1>Kulki</h1>
      </header>
      <main>
        <h2>Punkty: {state.points}</h2>
        <NextColors nextColors={state.nextColors} />
        <Board
          size={size}
          model={state.model}
          selectedBall={state.selectedBall}
          currentlyAnimatingPath={state.currentlyAnimatingPath}
          onClick={handleBoardClicked}
          onMoveFinished={handleMoveFinished}
        />
      </main>
    </div>
  );
};

export default App;
