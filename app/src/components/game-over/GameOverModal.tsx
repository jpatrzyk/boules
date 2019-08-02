import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from '../_ui/Modal';
import { Button } from '../_ui/Button';
import { isInTopScores, putScore } from 'utils/storage';

import './GameOverModal.scss';

export type CloseBehavior = 'new_game' | 'show_ranking' | 'quit';

interface Props {
  score: number;
  open: boolean;
  onRequestClose: (behavior?: CloseBehavior) => void;
}

export const GameOverModal: React.FC<Props> = ({ score, open, onRequestClose }) => {
  const { t } = useTranslation();
  const [isTopScore, setIsTopScore] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>('');

  useEffect(() => {
    if (open) {
      checkIfTopScore(score);
    }
  }, [score, open]);

  async function checkIfTopScore(score: number) {
    const isTop = await isInTopScores(score);
    setIsTopScore(isTop);
  }

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPlayerName(e.target.value);
    },
    [setPlayerName],
  );

  const handleSave = useCallback(async () => {
    await putScore(playerName, score);
    onRequestClose('show_ranking');
  }, [playerName, score, onRequestClose]);

  const handleRequestNewGame = useCallback(() => {
    onRequestClose('new_game');
  }, [onRequestClose]);

  function renderContent() {
    if (isTopScore) {
      return (
        <div>
          <p>{t('game_over.congratulations')}</p>
          <div className="GameOverModal-inputWrapper">
            <label>
              {t('game_over.name_label')}
              <input type="text" value={playerName} onChange={handleInputChange} />
            </label>
          </div>
        </div>
      );
    }

    return <p>{t('game_over.new_game_prompt')}</p>;
  }

  function renderButtons() {
    if (isTopScore) {
      return (
        <div className="GameOverModal-buttons">
          <Button variant="primary" onClick={handleSave}>
            {t('global.save')}
          </Button>
          <Button onClick={onRequestClose}>{t('game_over.dont_save')}</Button>
        </div>
      );
    }

    return (
      <div className="GameOverModal-buttons">
        <Button variant="primary" onClick={handleRequestNewGame}>
          {t('global.yes')}
        </Button>
        <Button onClick={onRequestClose}>{t('global.no')}</Button>
      </div>
    );
  }

  return (
    <Modal open={open} onRequestClose={onRequestClose} title={t('game_over.modal_title')}>
      <div className="GameOverModal">
        {renderContent()}
        {renderButtons()}
      </div>
    </Modal>
  );
};
