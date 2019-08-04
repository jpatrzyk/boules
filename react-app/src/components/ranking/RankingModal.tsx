import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Score, loadTopScoresDescending, clearAllScores } from 'utils/storage';
import { Modal } from '../_ui/Modal';
import { Button } from '../_ui/Button';

import './RankingModal.scss';

export type CloseBehavior = 'new_game' | 'show_ranking' | 'quit';

interface Props {
  open: boolean;
  onRequestClose: (behavior?: CloseBehavior) => void;
}

export const RankingModal: React.FC<Props> = ({ open, onRequestClose }) => {
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
    <Modal open={open} onRequestClose={onRequestClose} title={t('ranking.modal_title')}>
      <div className="RankingModal">
        <div className="RankingModal-tableWrapper">
          <table>
            <thead>
              <tr>
                <th>{t('ranking.th_player')}</th>
                <th>{t('ranking.th_score')}</th>
                <th>{t('ranking.th_date')}</th>
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
        <div className="RankingModal-buttons">
          <Button onClick={handleRequestClearScores}>{t('ranking.clear')}</Button>
          <Button variant="primary" onClick={onRequestClose}>
            {t('ranking.close')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
