import React, { useCallback } from 'react';

import { useModel, boardClicked, moveFinished, newGame } from 'hooks/model/useModel';
import { Board } from 'components/Board';
import { NextColors } from 'components/NextColors';

import './App.scss';
import { Modal } from './components/Modal';

const size = 5;

const App: React.FC = () => {
  const [state, dispatch] = useModel(size, 12);

  const isGameOver = state.model.every(c => c > 0);

  const handleBoardClicked = useCallback(
    (position: number) => {
      dispatch(boardClicked(position));
    },
    [dispatch],
  );

  const handleMoveFinished = useCallback(() => {
    dispatch(moveFinished());
  }, [dispatch]);

  const handleModalClosed = useCallback(() => {
    dispatch(newGame());
  }, [dispatch]);

  return (
    <div className="App">
      <header>
        <h1>Kulki</h1>
      </header>
      <main>
        <h2>Punkty: {state.score}</h2>
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
      <Modal open={isGameOver} onRequestClose={handleModalClosed} title="Game Over">
        Game Over!
      </Modal>
    </div>
  );
};

export default App;
