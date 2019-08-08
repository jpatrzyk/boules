import React from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'components/_ui/Modal';
import { Button } from 'components/_ui/Button';

import './OkCancelModal.scss';

interface Props {
  title: string;
  okLabel?: string;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export const OkCancelModal: React.FC<Props> = ({
  title,
  okLabel,
  children,
  open,
  onOk,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <Modal priority="top" open={open} onRequestClose={onCancel} title={title}>
      <div className="OkCancelModal">
        <div className="OkCancelModal-content">{children}</div>
        <div className="OkCancelModal-buttons">
          <Button onClick={onCancel}>{t('global.cancel')}</Button>
          <Button onClick={onOk}>{okLabel || t('global.ok')}</Button>
        </div>
      </div>
    </Modal>
  );
};
