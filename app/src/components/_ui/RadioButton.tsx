import React from 'react';
import classNames from 'classnames';

import './RadioButton.scss';

interface Props<T> {
  label: string;
  value: T;
  selected?: boolean;
  onSelect: (value: T) => void;
}

export class RadioButton<T> extends React.PureComponent<Props<T>> {
  buttonClicked = () => {
    this.props.onSelect(this.props.value);
  };

  render() {
    const { label, selected } = this.props;
    return (
      <button
        type="button"
        className={classNames('RadioButton', { 'RadioButton--selected': selected })}
        onClick={this.buttonClicked}
      >
        {label}
      </button>
    );
  }
}
