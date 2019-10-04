import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import { GameConditions } from 'model/state';
import {
  DEFAULT_BOARD_SIZE,
  DEFAULT_LINE_LENGTH,
  MAX_COLORS_COUNT,
  MIN_COLORS_COUNT,
} from 'utils/constants';
import { range } from 'utils/helpers';
import { calculateScore } from 'hooks/model/useModel';
import { Modal } from 'components/_ui/Modal';
import { Button } from 'components/_ui/Button';
import { SegmentedControl } from 'components/_ui/SegmentedControl';

import './OptionsModal.scss';

interface Props {
  open: boolean;
  initialValue: GameConditions;
  onSubmit: (value: GameConditions) => void;
  onCancel: () => void;
}

const colorsOptions = range(MAX_COLORS_COUNT + 1, MIN_COLORS_COUNT);
const sizesOptions = range(DEFAULT_BOARD_SIZE + 3, DEFAULT_LINE_LENGTH);

export const OptionsModal: React.FC<Props> = ({ open, initialValue, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [showNextColors, setShowNextColors] = useState<boolean>(initialValue.showNextColors);
  const [colorsCount, setColorsCount] = useState<number>(initialValue.colorsCount);
  const [size, setSize] = useState<number>(initialValue.size);

  const switchOptions = useMemo(
    () => [{ value: false, label: t('options.hide') }, { value: true, label: t('options.show') }],
    [t],
  );

  useEffect(() => {
    if (open) {
      setShowNextColors(initialValue.showNextColors);
      setColorsCount(initialValue.colorsCount);
      setSize(initialValue.size);
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

  const handleSizeChange = useCallback(
    (value: number) => {
      setSize(value);
    },
    [setSize],
  );

  const handleSubmit = useCallback(async () => {
    onSubmit({ size, showNextColors, colorsCount });
  }, [size, showNextColors, colorsCount, onSubmit]);

  const estimatedScore = calculateScore(DEFAULT_LINE_LENGTH, { size, showNextColors, colorsCount });
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

        <h4>{t('options.board_size')}</h4>
        <SegmentedControl options={sizesOptions} value={size} onChange={handleSizeChange} />

        <Trans i18nKey="options.summary" parent="p">
          With these settings, for <strong>{{ lineLength: DEFAULT_LINE_LENGTH }}-cell-long</strong>{' '}
          row you will earn <strong>{{ estimatedScore }}</strong> points.
        </Trans>
      </div>
      <div className="OptionsModal-buttons">
        <Button label={t('global.cancel')} onClick={onCancel} />
        <Button label={t('global.save')} variant="primary" onClick={handleSubmit} />
      </div>
    </Modal>
  );
};
