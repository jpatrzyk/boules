import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from 'components/_ui/Button';
import { TutorialModal } from './TutorialModal';

export const TutorialSection: React.FC<{}> = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleRequestShowTutorial = useCallback(() => {
    setShowModal(true);
  }, [setShowModal]);

  const handleModalClosed = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  return (
    <>
      <Button icon="help" onClick={handleRequestShowTutorial}>
        {t('app.show_help')}
      </Button>
      <TutorialModal
        open={showModal}
        onRequestClose={handleModalClosed}
      />
    </>
  );
};
