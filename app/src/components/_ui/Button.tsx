import React from 'react';
import classNames from 'classnames';

import './Button.scss';

export type ButtonVariant = 'primary' | 'default';

interface Props {
  children: React.ReactNode;
  variant?: ButtonVariant;
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<Props> = ({ children, variant = 'default', disabled, onClick }) => {
  return (
    <button
      type="button"
      className={classNames('Button', `Button--${variant}`, { 'Button--disabled': disabled })}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
