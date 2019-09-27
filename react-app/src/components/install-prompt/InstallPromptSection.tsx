import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { OkCancelModal } from 'components/_ui/OkCancelModal';

interface BeforeInstallPromptEvent extends Event {
  platforms: string[];
  userChoice: Promise<'accepted' | 'dismissed'>;
  prompt: () => Promise<void>;
}

interface InstallPrompt {
  isModalOpen: boolean;
  event?: BeforeInstallPromptEvent;
}

export const InstallPromptSection: React.FC = () => {
  const { t } = useTranslation();
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt>({
    isModalOpen: false,
  });

  useEffect(() => {
    function handleInstallPrompt(e: Event) {
      console.info(e);
      setInstallPrompt({
        isModalOpen: true,
        event: e as BeforeInstallPromptEvent,
      });
    }
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, [setInstallPrompt]);

  const handleCancel = useCallback(() => {
    setInstallPrompt({
      isModalOpen: false,
    });
  }, [setInstallPrompt]);

  const handleOk = useCallback(async () => {
    if (installPrompt.event) {
      installPrompt.event.prompt();
      setInstallPrompt({
        isModalOpen: false,
      });
    }
  }, [installPrompt]);

  return (
    <>
      <OkCancelModal
        title={t('install_prompt.modal_title')}
        okLabel={t('install_prompt.ok_label')}
        open={installPrompt.isModalOpen}
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
