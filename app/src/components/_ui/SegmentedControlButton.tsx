import React from 'react';
import classNames from 'classnames';

import './SegmentedControlButton.scss';

interface Props<T> {
  label: string;
  value: T;
  selected?: boolean;
  onSelect: (value: T) => void;
}

export class SegmentedControlButton<T> extends React.PureComponent<Props<T>> {
  buttonClicked = () => {
    this.props.onSelect(this.props.value);
  };

  render() {
    const { label, selected } = this.props;
    return (
      <button
        type="button"
        className={classNames('SegmentedControlButton', {
          'SegmentedControlButton--selected': selected,
        })}
        onClick={this.buttonClicked}
      >
        {label}
      </button>
    );
  }
}
