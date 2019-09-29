import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { persistLastInstallPromptDate, shouldShowInstallPrompt } from 'utils/storage';
import { OkCancelModal } from 'components/_ui/OkCancelModal';

interface BeforeInstallPromptEvent extends Event {
  platforms: string[];
  userChoice: Promise<'accepted' | 'dismissed'>;
  prompt: () => Promise<void>;
}

export const InstallPromptSection: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [shouldShowModal, setShouldShowModal] = useState<boolean>(false);

  useEffect(() => {
    async function checkConfig() {
      const showPrompt = await shouldShowInstallPrompt();
      setShouldShowModal(showPrompt);
    }
    checkConfig();
  }, [setShouldShowModal]);

  useEffect(() => {
    function handleInstallPrompt(e: Event) {
      setInstallPromptEvent(e as BeforeInstallPromptEvent);
    }
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, [setInstallPromptEvent]);

  useEffect(() => {
    if (shouldShowModal && !!installPromptEvent) {
      setModalOpen(true);
    }
  }, [shouldShowModal, installPromptEvent]);

  const handleCancel = useCallback(() => {
    setModalOpen(false);
    persistLastInstallPromptDate(Date.now());
  }, [setModalOpen]);

  const handleOk = useCallback(async () => {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      setModalOpen(false);
    }
  }, [installPromptEvent, setModalOpen]);

  return (
    <>
      <OkCancelModal
        title={t('install_prompt.modal_title')}
        okLabel={t('install_prompt.ok_label')}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        focusedButton="ok"
        primaryButton="ok"
      >
        {t('install_prompt.prompt')}
      </OkCancelModal>
    </>
  );
};
