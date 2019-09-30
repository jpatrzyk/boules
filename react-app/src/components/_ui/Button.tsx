import React from 'react';
import classNames from 'classnames';

import './Button.scss';
import { Icon, IconGlyph } from "./Icon";

export type ButtonVariant = 'primary' | 'default';

interface Props {
  ref?: React.RefObject<HTMLButtonElement>;
  children: string;
  icon?: IconGlyph;
  variant?: ButtonVariant;
  disabled?: boolean;
  tabIndex?: number;
  onClick?: () => void;
}

export const Button = React.forwardRef<HTMLButtonElement, Props>(({
  children,
  icon,
  variant = 'default',
  disabled,
  tabIndex,
  onClick,
}, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={classNames('Button', `Button--${variant}`, { 'Button--disabled': disabled })}
      onClick={onClick}
      disabled={disabled}
      tabIndex={tabIndex}
      title={children}
      aria-label={children}
    >
      {!!icon && <Icon glyph={icon}/>}
      <span>{children}</span>
    </button>
  );
});
