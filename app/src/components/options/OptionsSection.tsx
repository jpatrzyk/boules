import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { persistGameConditions } from 'utils/storage';
import { GameConditions } from 'model/state';
import { Button } from 'components/_ui/Button';
import { OptionsModal } from './OptionsModal';

interface Props {
  value: GameConditions;
  onChange: (newOptions: GameConditions) => void;
}

export const OptionsSection: React.FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const handleRequestShowOptions = useCallback(() => {
    setShowOptions(true);
  }, [setShowOptions]);

  const handleOptionsClosed = useCallback(() => {
    setShowOptions(false);
  }, [setShowOptions]);

  const handleOptionsSubmitted = useCallback(
    async (options: GameConditions) => {
      setShowOptions(false);
      await persistGameConditions(options);
      onChange(options);
    },
    [setShowOptions, onChange],
  );

  return (
    <>
      <Button onClick={handleRequestShowOptions}>{t('app.show_options')}</Button>
      <OptionsModal
        open={showOptions}
        initialValue={value}
        onSubmit={handleOptionsSubmitted}
        onCancel={handleOptionsClosed}
      />
    </>
  );
};
