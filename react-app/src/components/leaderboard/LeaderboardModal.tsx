import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Score, loadTopScoresDescending, clearAllScores } from 'utils/storage';
import { Modal } from '../_ui/Modal';
import { Button } from '../_ui/Button';

import './LeaderboardModal.scss';

export type CloseBehavior = 'new_game' | 'show_leaderboard' | 'quit';

interface Props {
  open: boolean;
  onRequestClose: (behavior?: CloseBehavior) => void;
}

export const LeaderboardModal: React.FC<Props> = ({ open, onRequestClose }) => {
  const { t } = useTranslation();
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    if (open) {
      loadScores();
    }
  }, [open]);

  async function loadScores() {
    const allScores = await loadTopScoresDescending();
    setScores(allScores);
  }

  const handleRequestClearScores = useCallback(async () => {
    await clearAllScores();
    await loadScores();
  }, []);

  return (
    <Modal open={open} onRequestClose={onRequestClose} title={t('leaderboard.modal_title')}>
      <div className="LeaderboardModal">
        <div className="LeaderboardModal-tableWrapper">
          <table>
            <thead>
              <tr>
                <th>{t('leaderboard.th_player')}</th>
                <th>{t('leaderboard.th_score')}</th>
                <th>{t('leaderboard.th_date')}</th>
              </tr>
            </thead>
            <tbody>
              {scores.map(({ playerName, score, timestamp }) => (
                <tr key={timestamp}>
                  <td>{playerName}</td>
                  <td>{score}</td>
                  <td>{new Date(timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="LeaderboardModal-buttons">
          <Button onClick={handleRequestClearScores}>{t('leaderboard.clear')}</Button>
          <Button variant="primary" onClick={onRequestClose}>
            {t('leaderboard.close')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
