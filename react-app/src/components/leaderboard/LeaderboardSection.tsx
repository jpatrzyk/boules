import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from 'components/_ui/Button';
import { LeaderboardModal } from './LeaderboardModal';

interface Props {
  showModal: boolean;
}

export const LeaderboardSection: React.FC<Props> = ({ showModal }) => {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState<boolean>(showModal);

  useEffect(() => {
    setModalOpen(showModal);
  }, [showModal]);

  const handleRequestShowRanking = useCallback(() => {
    setModalOpen(true);
  }, [setModalOpen]);

  const handleRankingClosed = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  return (
    <>
      <Button icon="leaderboard" onClick={handleRequestShowRanking}>
        {t('app.show_leaderboard')}
      </Button>
      <LeaderboardModal open={isModalOpen} onRequestClose={handleRankingClosed} />
    </>
  );
};
