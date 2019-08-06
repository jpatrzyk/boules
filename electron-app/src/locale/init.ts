import i18n from 'i18next';

import en from './resources/en.json';
import pl from './resources/pl.json';

export default async function initI18n(lng: string) {
  const t = await i18n.init({
    resources: {
      en: {
        translations: en,
      },
      pl: {
        translations: pl,
      },
    },
    lng,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV !== 'production',

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    keySeparator: '.',

    interpolation: {
      escapeValue: false,
    },
  });
  return { i18n, t };
}
