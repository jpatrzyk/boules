import React from 'react';

import { RadioButton } from './RadioButton';
import './RadioGroup.scss';

interface Option<T> {
  value: T;
  label: string;
}

interface Props<T> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export class RadioGroup<T extends string | number | boolean> extends React.PureComponent<Props<T>> {
  render() {
    const { options, value, onChange } = this.props;

    return (
      <div className="RadioGroup">
        {options.map(option => (
          <RadioButton
            key={option.value.toString()}
            label={option.label}
            value={option.value}
            selected={option.value === value}
            onSelect={onChange}
          />
        ))}
      </div>
    );
  }
}
