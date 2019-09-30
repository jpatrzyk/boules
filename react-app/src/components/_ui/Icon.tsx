import React from 'react';
import { icons } from './icons/icons';

export type IconGlyph = keyof typeof icons;

interface Props extends React.SVGProps<SVGSVGElement> {
  glyph: IconGlyph;
}

export const Icon: React.FC<Props> = ({ glyph, ...props }) => {
  const IconComponent = icons[glyph];
  return <IconComponent {...props} />;
};
