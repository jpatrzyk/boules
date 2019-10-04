import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  DEFAULT_BOARD_SIZE,
  DEFAULT_COLORS_COUNT,
  DEFAULT_SHOW_NEXT_COLORS,
  INITIAL_BALLS_COUNT,
  NEXT_BALLS_COUNT,
} from './utils/constants';
import { loadGameConditions, persistGameConditions } from './utils/storage';
import { GameConditions, newGame, loadGame, BaseState, undo } from './model/state';
import { useModel } from 'hooks/model/useModel';
import { Board } from 'components/Board';
import { NextColors } from 'components/NextColors';
import { CloseBehavior, GameOverModal } from './components/game-over/GameOverModal';
import { LeaderboardSection } from './components/leaderboard/LeaderboardSection';
import { OptionsSection } from './components/options/OptionsSection';
import { TutorialSection } from './components/tutorial/TutorialSection';
import { LoadGameSection } from './components/load-game/LoadGameSection';
import { SaveGameSection } from './components/save-game/SaveGameSection';
import { InstallPromptSection } from './components/install-prompt/InstallPromptSection';
import { LocaleChooser } from './components/locale-chooser/LocaleChooser';
import { Button } from './components/_ui/Button';

import './App.scss';

const emptyNextColors = new Array(NEXT_BALLS_COUNT).fill(0);

const App: React.FC = () => {
  const { t } = useTranslation();
  const [state, dispatch] = useModel();
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);

  useEffect(() => {
    const setConditionsFromStorage = async () => {
      const savedConditions = await loadGameConditions();
      if (savedConditions) {
        dispatch(newGame(savedConditions));
      } else {
        const defaultConditions: GameConditions = {
          size: DEFAULT_BOARD_SIZE,
          showNextColors: DEFAULT_SHOW_NEXT_COLORS,
          colorsCount: DEFAULT_COLORS_COUNT,
        };
        await persistGameConditions(defaultConditions);
        dispatch(newGame(defaultConditions));
      }
    };
    setConditionsFromStorage();
  }, [dispatch]);

  const handleGameOver = useCallback(() => {
    setShowGameOver(true);
  }, [setShowGameOver]);

  const handleGameOverModalClosed = useCallback(
    (closeBehavior?: CloseBehavior) => {
      setShowGameOver(false);
      if (closeBehavior === 'new_game') {
        dispatch(newGame());
      } else if (closeBehavior === 'show_leaderboard') {
        setShowLeaderboard(true);
      }
    },
    [dispatch],
  );

  const handleNewGameClick = useCallback(() => {
    dispatch(newGame());
  }, [dispatch]);

  const handleUndoClick = useCallback(() => {
    dispatch(undo());
  }, [dispatch]);

  const handleOptionsSubmitted = useCallback(
    (options: GameConditions) => {
      dispatch(newGame(options));
    },
    [dispatch],
  );

  const handleGameLoaded = useCallback(
    (gameState: BaseState) => {
      dispatch(loadGame(gameState));
    },
    [dispatch],
  );

  const isAddingFirstBalls = state.nextColors.length === INITIAL_BALLS_COUNT;
  const nextColors =
    !state.showNextColors || isAddingFirstBalls ? emptyNextColors : state.nextColors;

  return (
    <div className="App">
      <header>
        <h1>{t('app.title')}</h1>
        <div className="App-localeChooser">
          <LocaleChooser />
        </div>
      </header>

      <nav>
        <Button icon="refresh" label={t('app.new_game')} onClick={handleNewGameClick} />
        <LoadGameSection onGameLoaded={handleGameLoaded} />
        <SaveGameSection gameState={state} />
        <Button
          icon="undo"
          label={t('app.undo')}
          disabled={!state.prevStepModel}
          onClick={handleUndoClick}
        />
        <span style={{ flexGrow: 1 }} />
        <LeaderboardSection showModal={showLeaderboard} />
        <OptionsSection value={state} onChange={handleOptionsSubmitted} />
        <TutorialSection />
      </nav>

      <main>
        <aside>
          <h2>
            {t('app.score')} {state.score}
          </h2>
          <NextColors nextColors={nextColors} />
        </aside>
        <section>
          <Board state={state} dispatch={dispatch} onGameOver={handleGameOver} />
        </section>
      </main>

      <GameOverModal
        score={state.score}
        open={showGameOver}
        onRequestClose={handleGameOverModalClosed}
      />

      <InstallPromptSection />
    </div>
  );
};

export default App;
