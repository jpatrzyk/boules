import React from 'react';

import { SegmentedControlButton } from './SegmentedControlButton';
import './SegmentedControl.scss';

interface Option<T> {
  value: T;
  label: string;
}

interface Props<T> {
  options: (Option<T> | T)[];
  value: T;
  onChange: (value: T) => void;
}

export class SegmentedControl<T extends string | number | boolean> extends React.PureComponent<
  Props<T>
> {
  render() {
    const { options, value: selectedValue, onChange } = this.props;
    return (
      <div className="SegmentedControl">
        {options.map(sanitizeOption).map(option => (
          <SegmentedControlButton
            key={option.value.toString()}
            label={option.label}
            value={option.value}
            selected={option.value === selectedValue}
            onSelect={onChange}
          />
        ))}
      </div>
    );
  }
}

function sanitizeOption<T extends string | number | boolean>(option: Option<T> | T): Option<T> {
  if (typeof option === 'object') {
    return option;
  }
  return {
    value: option,
    label: option.toString(),
  };
}
