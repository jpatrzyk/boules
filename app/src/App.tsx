import React, { useCallback, useEffect, useState } from 'react';

import {
  DEFAULT_COLORS_COUNT,
  DEFAULT_SHOW_NEXT_COLORS,
  INITIAL_BALLS_COUNT,
  NEXT_BALLS_COUNT,
} from './utils/constants';
import { loadGameConditions, persistGameConditions } from './utils/storage';
import { GameConditions } from './model/state';
import { animationFinished, boardClicked, newGame, useModel } from 'hooks/model/useModel';
import { Board } from 'components/Board';
import { NextColors } from 'components/NextColors';
import { CloseBehavior, GameOverModal } from './components/GameOverModal';
import { RankingModal } from './components/RankingModal';
import { OptionsModal } from './components/OptionsModal';
import { Button } from './components/_ui/Button';

import './App.scss';

const size = 5;

const emptyNextColors = new Array(NEXT_BALLS_COUNT).fill(0);

const App: React.FC = () => {
  const [state, dispatch] = useModel(size);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const [showRanking, setShowRanking] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  useEffect(() => {
    const isGameOver = state.model.every((c: number) => c > 0);
    setShowGameOver(isGameOver);
  }, [state.model]);

  useEffect(() => {
    const setConditionsFromStorage = async () => {
      const savedConditions = await loadGameConditions();
      if (savedConditions) {
        dispatch(newGame(savedConditions));
      } else {
        const defaultConditions: GameConditions = {
          showNextColors: DEFAULT_SHOW_NEXT_COLORS,
          colorsCount: DEFAULT_COLORS_COUNT,
        };
        await persistGameConditions(defaultConditions);
        dispatch(newGame(defaultConditions));
      }
    };
    setConditionsFromStorage();
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

  const handleBoardClicked = useCallback(
    (position: number) => {
      dispatch(boardClicked(position));
    },
    [dispatch],
  );

  const handleAnimationFinished = useCallback(() => {
    dispatch(animationFinished());
  }, [dispatch]);

  const handleRequestNewGame = useCallback(() => {
    dispatch(newGame());
  }, [dispatch]);

  const handleRequestShowRanking = useCallback(() => {
    setShowRanking(true);
  }, [setShowRanking]);

  const handleRankingClosed = useCallback(() => {
    setShowRanking(false);
  }, [setShowRanking]);

  const handleRequestShowOptions = useCallback(() => {
    setShowOptions(true);
  }, [setShowOptions]);

  const handleOptionsClosed = useCallback(() => {
    setShowOptions(false);
  }, [setShowOptions]);

  const handleOptionsSubmitted = useCallback(
    (options: GameConditions) => {
      setShowOptions(false);
      dispatch(newGame(options));
    },
    [setShowOptions, dispatch],
  );

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
        <Button onClick={handleRequestShowOptions}>Show Options</Button>
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
      <OptionsModal
        open={showOptions}
        initialValue={state}
        onSubmit={handleOptionsSubmitted}
        onCancel={handleOptionsClosed}
      />
    </div>
  );
};

export default App;
