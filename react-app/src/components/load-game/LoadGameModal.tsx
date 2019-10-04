import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BaseState } from 'model/state';
import { loadSavedGamesNames, loadGame } from 'utils/storage';
import { Modal } from 'components/_ui/Modal';
import { Button } from 'components/_ui/Button';
import { SegmentedControl } from 'components/_ui/SegmentedControl';

import './LoadGameModal.scss';

interface Props {
  open: boolean;
  onRequestClose: () => void;
  onGameLoaded: (gameState: BaseState) => void;
}

export const LoadGameModal: React.FC<Props> = ({ open, onGameLoaded, onRequestClose }) => {
  const { t } = useTranslation();
  const [savedGames, setSavedGames] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const games = await loadSavedGamesNames();
      setSavedGames(games);
    };

    if (open) {
      loadData();
    }
  }, [open]);

  const handleGameChosen = useCallback(
    async (name: string) => {
      const gameState = await loadGame(name);
      if (gameState) {
        onGameLoaded(gameState);
      }
    },
    [onGameLoaded],
  );

  return (
    <Modal open={open} onRequestClose={onRequestClose} title={t('load_game.modal_title')}>
      <div className="LoadGameModal">
        <div className="LoadGameModal-list">
          <SegmentedControl vertical options={savedGames} onChange={handleGameChosen} />
        </div>
        <div className="LoadGameModal-buttons">
          <Button label={t('global.cancel')} onClick={onRequestClose} />
        </div>
      </div>
    </Modal>
  );
};
