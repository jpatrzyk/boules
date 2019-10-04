import React from 'react';
import classNames from 'classnames';

import './Button.scss';
import { Icon, IconGlyph } from './Icon';

export type ButtonVariant = 'primary' | 'default';

interface Props {
  ref?: React.RefObject<HTMLButtonElement>;
  children?: never;
  label: string;
  hideLabel?: boolean;
  icon?: IconGlyph;
  variant?: ButtonVariant;
  disabled?: boolean;
  tabIndex?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ label, hideLabel, icon, variant = 'default', disabled, tabIndex, onClick }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={classNames('Button', `Button--${variant}`, { 'Button--disabled': disabled, 'Button--icon-only': !!hideLabel })}
        onClick={onClick}
        disabled={disabled}
        tabIndex={tabIndex}
        title={label}
        aria-label={label}
      >
        {!!icon && <Icon glyph={icon} />}
        {!hideLabel && <span>{label}</span>}
      </button>
    );
  },
);
