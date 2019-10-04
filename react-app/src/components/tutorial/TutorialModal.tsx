import React from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'components/_ui/Modal';
import { Button } from 'components/_ui/Button';

import './TutorialModal.scss';

interface Props {
  open: boolean;
  onRequestClose: () => void;
}

export const TutorialModal: React.FC<Props> = ({ open, onRequestClose }) => {
  const { t } = useTranslation();

  return (
    <Modal open={open} onRequestClose={onRequestClose} title={t('tutorial.modal_title')}>
      <div className="TutorialModal">
        <p>{t('tutorial.info')}</p>
        <p>{t('tutorial.moving_balls')}</p>
        <p>{t('tutorial.scoring')}</p>
        <p>{t('tutorial.score_rules')}</p>
        <p>{t('tutorial.game_over')}</p>
      </div>
      <div className="TutorialModal-buttons">
        <Button label={t('global.ok')} onClick={onRequestClose} />
      </div>
    </Modal>
  );
};
