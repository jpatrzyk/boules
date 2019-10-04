import React, { useRef } from 'react';
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
  focusedButton?: 'ok' | 'cancel';
  primaryButton?: 'ok' | 'cancel';
}

export const OkCancelModal: React.FC<Props> = ({
  title,
  okLabel,
  children,
  open,
  onOk,
  onCancel,
  focusedButton = 'ok',
  primaryButton,
}) => {
  const { t } = useTranslation();
  const okButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const focusedRef = focusedButton === 'cancel' ? cancelButtonRef : okButtonRef;

  return (
    <Modal
      priority="top"
      open={open}
      onRequestClose={onCancel}
      title={title}
      focusElement={focusedRef.current}
    >
      <div className="OkCancelModal">
        <div className="OkCancelModal-content">{children}</div>
        <div className="OkCancelModal-buttons">
          <Button
            ref={cancelButtonRef}
            label={t('global.cancel')}
            variant={primaryButton === 'cancel' ? 'primary' : undefined}
            onClick={onCancel}
          />
          <Button
            ref={okButtonRef}
            label={okLabel || t('global.ok')}
            variant={primaryButton === 'ok' ? 'primary' : undefined}
            onClick={onOk}
          />
        </div>
      </div>
    </Modal>
  );
};
