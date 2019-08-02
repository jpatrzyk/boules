import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BaseState } from 'model/state';
import { Button } from 'components/_ui/Button';
import { LoadGameModal } from './LoadGameModal';

interface Props {
  onGameLoaded: (gameState: BaseState) => void;
}

export const LoadGameSection: React.FC<Props> = ({ onGameLoaded }) => {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = useCallback(() => {
    setModalOpen(true);
  }, [setModalOpen]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  const loadGame = useCallback(
    (gameState: BaseState) => {
      setModalOpen(false);
      onGameLoaded(gameState);
    },
    [setModalOpen, onGameLoaded],
  );

  return (
    <>
      <Button onClick={openModal}>{t('app.load_game')}</Button>
      <LoadGameModal open={isModalOpen} onRequestClose={closeModal} onGameLoaded={loadGame} />
    </>
  );
};
