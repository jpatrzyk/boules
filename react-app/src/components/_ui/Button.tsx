import React from 'react';
import classNames from 'classnames';

import { IconGlyph } from 'model/icons';
import './Button.scss';

export type ButtonVariant = 'primary' | 'default';

interface Props {
  children: string;
  icon?: IconGlyph;
  variant?: ButtonVariant;
  disabled?: boolean;
  onClick?: () => void;
}

// TODO YesNoModal etc

export const Button: React.FC<Props> = ({
  children,
  icon,
  variant = 'default',
  disabled,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={classNames('Button', `Button--${variant}`, { 'Button--disabled': disabled })}
      onClick={onClick}
      disabled={disabled}
      title={children}
      aria-label={children}
    >
      {!!icon && <i className={`icon-${icon}`} />}
      <span>{children}</span>
    </button>
  );
};
