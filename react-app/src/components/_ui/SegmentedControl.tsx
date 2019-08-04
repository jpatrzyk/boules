import React from 'react';
import classNames from 'classnames';

import './SegmentedControl.scss';

interface Option<T> {
  value: T;
  label: string;
}

interface Props<T> {
  vertical?: boolean;
  options: (Option<T> | T)[];
  value?: T;
  onChange: (value: T) => void;
}

export class SegmentedControl<T extends string | number | boolean> extends React.PureComponent<
  Props<T>
> {
  render() {
    const { vertical, options, value: selectedValue, onChange } = this.props;
    return (
      <div className={classNames('SegmentedControl', { 'SegmentedControl--vertical': vertical })}>
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

interface ButtonProps<T> {
  label: string;
  value: T;
  selected?: boolean;
  onSelect: (value: T) => void;
}

class SegmentedControlButton<T> extends React.PureComponent<ButtonProps<T>> {
  buttonClicked = () => {
    this.props.onSelect(this.props.value);
  };

  render() {
    const { label, selected } = this.props;
    return (
      <button
        type="button"
        className={classNames('SegmentedControl-button', {
          'SegmentedControl-button--selected': selected,
        })}
        onClick={this.buttonClicked}
      >
        {label}
      </button>
    );
  }
}
