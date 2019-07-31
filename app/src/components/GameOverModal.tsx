import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { Modal } from './Modal';
import { Button } from './Button';
import { isInTopScores, putScore } from 'utils/storage';

export type CloseBehavior = 'new_game' | 'show_ranking' | 'quit';

interface Props {
  score: number;
  open: boolean;
  onRequestClose: (behavior?: CloseBehavior) => void;
}

export const GameOverModal: React.FC<Props> = ({ score, open, onRequestClose }) => {
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
          <p>Congratulations! You achieved a very high score!</p>
          <label>Your name:</label>
          <input type="text" value={playerName} onChange={handleInputChange} />
        </div>
      );
    }

    return <p>Game Over. Would you like to start a new game?</p>;
  }

  function renderButtons() {
    if (isTopScore) {
      return (
        <div>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
          <Button onClick={onRequestClose}>Don't save</Button>
        </div>
      );
    }

    return (
      <div>
        <Button variant="primary" onClick={handleRequestNewGame}>
          Yes
        </Button>
        <Button onClick={onRequestClose}>No</Button>
      </div>
    );
  }

  return (
    <Modal open={open} onRequestClose={onRequestClose} title="Game Over">
      {renderContent()}
      {renderButtons()}
    </Modal>
  );
};
