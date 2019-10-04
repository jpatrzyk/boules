import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BaseState } from 'model/state';
import { Button } from 'components/_ui/Button';
import { SaveGameModal } from './SaveGameModal';

interface Props {
  gameState: BaseState;
}

export const SaveGameSection: React.FC<Props> = ({ gameState }) => {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = useCallback(() => {
    setModalOpen(true);
  }, [setModalOpen]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  return (
    <>
      <Button label={t('app.save_game')} icon="save" onClick={openModal} />
      <SaveGameModal gameState={gameState} open={isModalOpen} onRequestClose={closeModal} />
    </>
  );
};
