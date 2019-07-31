import React, { useCallback, useEffect, useState } from 'react';

import { Modal } from './Modal';
import { Button } from './Button';
import { Score, getTopScoresDescending, clearAllScores } from 'utils/storage';

import './RankingModal.scss';

export type CloseBehavior = 'new_game' | 'show_ranking' | 'quit';

interface Props {
  open: boolean;
  onRequestClose: (behavior?: CloseBehavior) => void;
}

export const RankingModal: React.FC<Props> = ({ open, onRequestClose }) => {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    if (open) {
      loadScores();
    }
  }, [open]);

  async function loadScores() {
    const allScores = await getTopScoresDescending();
    setScores(allScores);
  }

  const handleRequestClearScores = useCallback(async () => {
    await clearAllScores();
    await loadScores();
  }, []);

  return (
    <Modal open={open} onRequestClose={onRequestClose} title="High Scores">
      <div className="RankingModal">
        <div className="RankingModal-tableWrapper">
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Score</th>
                <th>Date</th>
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
          <Button onClick={handleRequestClearScores}>Clear</Button>
          <Button variant="primary" onClick={onRequestClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
