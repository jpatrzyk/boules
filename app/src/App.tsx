import React, { useCallback } from 'react';

import { useModel, boardClicked, moveFinished, newGame } from 'hooks/model/useModel';
import { Board } from 'components/Board';
import { NextColors } from 'components/NextColors';

import { GameOverModal, CloseBehavior } from './components/GameOverModal';

import './App.scss';

const size = 3;

// change model
// show animation if necessary
// onAnimationFinished

const App: React.FC = () => {
  const [state, dispatch] = useModel(size, 3);

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

  const handleModalClosed = useCallback(
    (closeBehavior?: CloseBehavior) => {
      if (closeBehavior === 'quit') {
        // todo
      } else if (closeBehavior === 'show_ranking') {
        // todo
      } else {
        dispatch(newGame());
      }
    },
    [dispatch],
  );

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
      <GameOverModal score={state.score} open={isGameOver} onRequestClose={handleModalClosed} />
    </div>
  );
};

export default App;
