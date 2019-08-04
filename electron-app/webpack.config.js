module.exports = {
  entry: './main.js',
  target: 'electron-main',
  mode: 'production',
  node: {
    __dirname: false,
    __filename: false
  },
  output: {
    path: __dirname,
    filename: 'main.bundle.js',
  },
};
