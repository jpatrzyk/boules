import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from 'components/_ui/Button';
import { RankingModal } from './RankingModal';

interface Props {
  openRankingModal: boolean;
}

export const RankingSection: React.FC<Props> = ({ openRankingModal }) => {
  const { t } = useTranslation();
  const [showRanking, setShowRanking] = useState<boolean>(openRankingModal);

  useEffect(() => {
    setShowRanking(openRankingModal);
  }, [openRankingModal]);

  const handleRequestShowRanking = useCallback(() => {
    setShowRanking(true);
  }, [setShowRanking]);

  const handleRankingClosed = useCallback(() => {
    setShowRanking(false);
  }, [setShowRanking]);

  return (
    <>
      <Button onClick={handleRequestShowRanking}>{t('app.show_ranking')}</Button>
      <RankingModal open={showRanking} onRequestClose={handleRankingClosed} />
    </>
  );
};
