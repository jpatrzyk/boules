import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { SegmentedControl } from '../_ui/SegmentedControl';

const supportedLocales = ['en', 'pl'];
const options = supportedLocales.map(value => ({
  label: value.toUpperCase(),
  value,
}));

export const LocaleChooser: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = useCallback(
    lng => {
      i18n.changeLanguage(lng);
    },
    [i18n],
  );

  return (
    <div className="LocaleChooser">
      <SegmentedControl options={options} value={i18n.language} onChange={changeLanguage} />
    </div>
  );
};
