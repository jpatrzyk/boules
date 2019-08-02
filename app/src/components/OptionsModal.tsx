import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import { GameConditions } from 'model/state';
import { DEFAULT_LINE_LENGTH, MAX_COLORS_COUNT, MIN_COLORS_COUNT } from 'utils/constants';
import { persistGameConditions } from 'utils/storage';
import { range } from 'utils/helpers';
import { calculateScore } from 'hooks/model/useModel';
import { Modal } from './_ui/Modal';
import { Button } from './_ui/Button';
import { SegmentedControl } from './_ui/SegmentedControl';

import './OptionsModal.scss';

interface Props {
  open: boolean;
  initialValue: GameConditions;
  onSubmit: (value: GameConditions) => void;
  onCancel: () => void;
}

const colorsOptions = range(MAX_COLORS_COUNT + 1, MIN_COLORS_COUNT).map(value => ({
  value,
  label: value.toString(),
}));

export const OptionsModal: React.FC<Props> = ({ open, initialValue, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [showNextColors, setShowNextColors] = useState<boolean>(initialValue.showNextColors);
  const [colorsCount, setColorsCount] = useState<number>(initialValue.colorsCount);

  const switchOptions = useMemo(
    () => [{ value: false, label: t('options.hide') }, { value: true, label: t('options.show') }],
    [t],
  );

  useEffect(() => {
    if (open) {
      setShowNextColors(initialValue.showNextColors);
      setColorsCount(initialValue.colorsCount);
    }
  }, [open, initialValue]);

  const handleSwitchChange = useCallback(
    (value: boolean) => {
      setShowNextColors(value);
    },
    [setShowNextColors],
  );

  const handleColorsCountChange = useCallback(
    (value: number) => {
      setColorsCount(value);
    },
    [setColorsCount],
  );

  const handleSubmit = useCallback(async () => {
    await persistGameConditions({ showNextColors, colorsCount });
    onSubmit({ showNextColors, colorsCount });
  }, [showNextColors, colorsCount, onSubmit]);

  const estimatedScore = calculateScore(DEFAULT_LINE_LENGTH, { showNextColors, colorsCount });
  return (
    <Modal open={open} onRequestClose={onCancel} title={t('options.modal_title')}>
      <div className="OptionsModal">
        <p>{t('options.info')}</p>
        <h4>{t('options.show_next_colors')}</h4>
        <SegmentedControl
          options={switchOptions}
          value={showNextColors}
          onChange={handleSwitchChange}
        />

        <h4>{t('options.number_of_colors')}</h4>
        <SegmentedControl
          options={colorsOptions}
          value={colorsCount}
          onChange={handleColorsCountChange}
        />
        <Trans i18nKey="options.summary" parent="p">
          With these settings, for <strong>{{ lineLength: DEFAULT_LINE_LENGTH }}-cell-long</strong>{' '}
          row you will earn <strong>{{ estimatedScore }}</strong> points.
        </Trans>
      </div>
      <div className="OptionsModal-buttons">
        <Button onClick={onCancel}>{t('global.cancel')}</Button>
        <Button variant="primary" onClick={handleSubmit}>
          {t('global.save')}
        </Button>
      </div>
    </Modal>
  );
};
