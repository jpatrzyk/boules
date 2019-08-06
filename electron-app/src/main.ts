import path from 'path';
import { app, BrowserWindow } from 'electron';
import MenuBuilder from './menu';
import initI18n from './locale/init';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

async function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 912, // enough for the largest board size
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const { t } = await initI18n( app.getLocale());

  const indexHtmlPath = path.resolve(__dirname, '../../react-app/build/index.html');
  win.loadURL(`file://${indexHtmlPath}`);

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  const menuBuilder = new MenuBuilder(win, t);
  menuBuilder.buildMenu();
}
