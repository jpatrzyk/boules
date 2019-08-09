# Boules
[![CircleCI](https://circleci.com/gh/jpatrzyk/boules.svg?style=svg&circle-token=71b29362cc58e7fbee87d105c9d84782a8bf05c9)](https://circleci.com/gh/jpatrzyk/boules)

## Getting started
* Prerequisites: `Node.js` and `yarn`
* `yarn install`

### Starting React App in devserver
* `yarn workspace react-app start`

### Starting Electron app
* `yarn workspace electron-app start`

### Building React App for Production
* `yarn workspace react-app build` or `yarn workspace react-app build:pl` for Polish version

### Packaging Electron App
* `yarn workspace react-app build`
* `yarn workspace electron-app build`
* `yarn workspace electron-app package`

### Building distributable Electron App
* `yarn workspace react-app build`
* `yarn workspace electron-app build`
* `yarn workspace electron-app dist`

or, to build a Polish version:
* `yarn workspace react-app build:pl`
* `yarn workspace electron-app build`
* `yarn workspace electron-app dist:pl`