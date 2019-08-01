import React, { useCallback, useEffect, useState } from 'react';

import { GameConditions } from 'model/state';
import { DEFAULT_LINE_LENGTH, MAX_COLORS_COUNT, MIN_COLORS_COUNT } from 'utils/constants';
import { persistGameConditions } from 'utils/storage';
import { range } from 'utils/helpers';
import { calculateScore } from 'hooks/model/useModel';
import { Modal } from './_ui/Modal';
import { Button } from './_ui/Button';
import { RadioGroup } from './_ui/RadioGroup';

import './OptionsModal.scss';

interface Props {
  open: boolean;
  initialValue: GameConditions;
  onSubmit: (value: GameConditions) => void;
  onCancel: () => void;
}

const switchOptions = [{ value: false, label: 'Hide' }, { value: true, label: 'Show' }];
const colorsOptions = range(MAX_COLORS_COUNT + 1, MIN_COLORS_COUNT).map(value => ({
  value,
  label: value.toString(),
}));

export const OptionsModal: React.FC<Props> = ({ open, initialValue, onSubmit, onCancel }) => {
  const [showNextColors, setShowNextColors] = useState<boolean>(initialValue.showNextColors);
  const [colorsCount, setColorsCount] = useState<number>(initialValue.colorsCount);

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
    <Modal open={open} onRequestClose={onCancel} title="Options">
      <div className="OptionsModal">
        <p>
          The more colors, the higher is the score. Also, hiding next colors makes score higher. See
          below.
        </p>
        <h4>Show next colors?</h4>
        <RadioGroup options={switchOptions} value={showNextColors} onChange={handleSwitchChange} />

        <h4>Number of colors:</h4>
        <RadioGroup
          options={colorsOptions}
          value={colorsCount}
          onChange={handleColorsCountChange}
        />
        <p>
          Points earned for line of length {DEFAULT_LINE_LENGTH}: <strong>{estimatedScore}</strong>
        </p>
      </div>
      <div className="OptionsModal-buttons">
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </Modal>
  );
};
