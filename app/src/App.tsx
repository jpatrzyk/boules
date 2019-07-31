import React, { useCallback, useEffect, useState } from 'react';

import { INITIAL_BALLS_COUNT, NEXT_BALLS_COUNT } from './utils/constants';
import { animationFinished, boardClicked, newGame, useModel } from 'hooks/model/useModel';
import { Board } from 'components/Board';
import { NextColors } from 'components/NextColors';
import { Button } from './components/Button';
import { CloseBehavior, GameOverModal } from './components/GameOverModal';
import { RankingModal } from './components/RankingModal';

import './App.scss';

const size = 5;

const emptyNextColors = new Array(NEXT_BALLS_COUNT).fill(0);

const App: React.FC = () => {
  const [state, dispatch] = useModel(size, 3);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const [showRanking, setShowRanking] = useState<boolean>(false);

  useEffect(() => {
    const isGameOver = state.model.every(c => c > 0);
    setShowGameOver(isGameOver);
  }, [state.model]);

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

  const handleAnimationFinished = useCallback(() => {
    dispatch(animationFinished());
  }, [dispatch]);

  const handleModalClosed = useCallback(
    (closeBehavior?: CloseBehavior) => {
      setShowGameOver(false);
      if (closeBehavior === 'new_game') {
        dispatch(newGame());
      } else if (closeBehavior === 'show_ranking') {
        setShowRanking(true);
      }
    },
    [dispatch],
  );

  const handleRankingClosed = useCallback(() => {
    setShowRanking(false);
  }, [setShowRanking]);

  const isAddingFirstBalls = state.nextColors.length === INITIAL_BALLS_COUNT;
  const nextColors =
    !state.showNextColors || isAddingFirstBalls ? emptyNextColors : state.nextColors;

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
        <NextColors nextColors={nextColors} />
        <Board
          state={state}
          onClick={handleBoardClicked}
          onAnimationFinished={handleAnimationFinished}
        />
      </main>
      <GameOverModal score={state.score} open={showGameOver} onRequestClose={handleModalClosed} />
      <RankingModal open={showRanking} onRequestClose={handleRankingClosed} />
    </div>
  );
};

export default App;
