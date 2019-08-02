import React, { ChangeEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BaseState } from 'model/state';
import { currentDateFormatted } from 'utils/helpers';
import { persistGame } from 'utils/storage';
import { Modal } from 'components/_ui/Modal';
import { Button } from 'components/_ui/Button';

import './SaveGameModal.scss';

interface Props {
  gameState: BaseState;
  open: boolean;
  onRequestClose: () => void;
}

export const SaveGameModal: React.FC<Props> = ({ gameState, open, onRequestClose }) => {
  const { t } = useTranslation();
  const [gameName, setGameName] = useState<string>(
    t('save_game.initial_game_name', { date: currentDateFormatted() }),
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setGameName(e.target.value);
    },
    [setGameName],
  );

  const handleSaveClick = useCallback(async () => {
    await persistGame(gameName, gameState);
    onRequestClose();
  }, [gameName, gameState, onRequestClose]);

  return (
    <Modal open={open} onRequestClose={onRequestClose} title={t('save_game.modal_title')}>
      <div className="SaveGameModal">
        <div className="SaveGameModal-inputWrapper">
          <label>{t('save_game.input_label')}</label>
          <input type="text" value={gameName} onChange={handleInputChange} />
        </div>
        <div className="SaveGameModal-buttons">
          <Button onClick={onRequestClose}>{t('global.cancel')}</Button>
          <Button variant="primary" onClick={handleSaveClick}>
            {t('global.save')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
