const fs = require('fs');
const path = require('path');

const {
  REACT_APP_DEFAULT_LOCALE = 'en',
  REACT_APP_NAME = 'Boules',
  REACT_APP_DESCRIPTION = 'Simple puzzle game.',
} = process.env;

const manifestTemplate = {
  name: REACT_APP_NAME,
  description: REACT_APP_DESCRIPTION,
  default_locale: REACT_APP_DEFAULT_LOCALE,
  icons: [
    {
      src: 'app-icon-192.png',
      type: 'image/png',
      sizes: '192x192',
    },
    {
      src: 'app-icon-512.png',
      type: 'image/png',
      sizes: '512x512',
    },
  ],
  start_url: '.',
  display: 'standalone',
  theme_color: '#0788de',
  background_color: '#ffffff',
};

const manifestJson = JSON.stringify(manifestTemplate, null, 2);
const manifestPath = path.resolve(__dirname, 'build/manifest.json');

fs.writeFileSync(manifestPath, manifestJson);
