import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Score, loadTopScoresDescending, clearAllScores } from 'utils/storage';
import { Modal } from '../_ui/Modal';
import { Button } from '../_ui/Button';

import './LeaderboardModal.scss';
import { OkCancelModal } from '../_ui/OkCancelModal';

export type CloseBehavior = 'new_game' | 'show_leaderboard' | 'quit';

interface Props {
  open: boolean;
  onRequestClose: (behavior?: CloseBehavior) => void;
}

export const LeaderboardModal: React.FC<Props> = ({ open, onRequestClose }) => {
  const { t } = useTranslation();
  const [scores, setScores] = useState<Score[]>([]);
  const [isConfirmationOpen, setConfirmationOpen] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      loadScores();
    }
  }, [open]);

  async function loadScores() {
    const allScores = await loadTopScoresDescending();
    setScores(allScores);
  }

  const clearScoresRequested = useCallback(() => {
    setConfirmationOpen(true);
  }, [setConfirmationOpen]);

  const clearScoresConfirmed = useCallback(async () => {
    await clearAllScores();
    await loadScores();
  }, []);

  const handleConfirmationCancelled = useCallback(() => {
    setConfirmationOpen(false);
  }, [setConfirmationOpen]);

  const handleRequestClose = useCallback(() => {
    setConfirmationOpen(false);
    onRequestClose();
  }, [setConfirmationOpen, onRequestClose]);

  return (
    <Modal open={open} onRequestClose={handleRequestClose} title={t('leaderboard.modal_title')}>
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
          <Button variant="primary" onClick={handleRequestClose}>
            {t('leaderboard.close')}
          </Button>
          <Button onClick={clearScoresRequested}>{t('leaderboard.clear')}</Button>
        </div>
        <OkCancelModal
          title={t('leaderboard.clear_scores_title')}
          okLabel={t('global.yes')}
          open={isConfirmationOpen}
          onOk={clearScoresConfirmed}
          onCancel={handleConfirmationCancelled}
          focusedButton="cancel"
        >
          {t('leaderboard.clear_scores_message')}
        </OkCancelModal>
      </div>
    </Modal>
  );
};
