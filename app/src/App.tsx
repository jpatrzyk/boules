import React, { useCallback, useState } from 'react';

import { useModel, boardClicked, moveFinished, newGame } from 'hooks/model/useModel';
import { Board } from 'components/Board';
import { NextColors } from 'components/NextColors';
import { Button } from './components/Button';
import { GameOverModal, CloseBehavior } from './components/GameOverModal';
import { RankingModal } from './components/RankingModal';

import './App.scss';

const size = 5;

// change model
// show animation if necessary
// onAnimationFinished

const App: React.FC = () => {
  const [state, dispatch] = useModel(size, 3);
  const [showRanking, setShowRanking] = useState<boolean>(false);

  const isGameOver = state.model.every(c => c > 0);

  const handleRequestNewGame = useCallback(() => {
    dispatch(newGame());
  }, [dispatch]);

  const handleRequestShowRanking = useCallback(() => {
    setShowRanking(true);
  }, [setShowRanking]);

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
        dispatch(newGame());
        setShowRanking(true);
      } else {
        dispatch(newGame());
      }
    },
    [dispatch],
  );

  const handleRankingClosed = useCallback(() => {
    setShowRanking(false);
  }, [setShowRanking]);

  return (
    <div className="App">
      <header>
        <h1>Boules</h1>
      </header>
      <nav>
        <Button onClick={handleRequestNewGame}>New Game</Button>
        <Button onClick={handleRequestShowRanking}>Show Ranking</Button>
      </nav>
      <main>
        <h2>Score: {state.score}</h2>
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
      <RankingModal open={showRanking} onRequestClose={handleRankingClosed} />
    </div>
  );
};

export default App;
