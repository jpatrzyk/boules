import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
      onChange(options);
    },
    [setShowOptions, onChange],
  );

  return (
    <>
      <Button
        icon="build"
        label={t('app.show_options')}
        hideLabel
        onClick={handleRequestShowOptions}
      />
      <OptionsModal
        open={showOptions}
        initialValue={value}
        onSubmit={handleOptionsSubmitted}
        onCancel={handleOptionsClosed}
      />
    </>
  );
};
