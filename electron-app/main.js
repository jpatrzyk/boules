import path from 'path';
import { app, BrowserWindow } from 'electron';
import MenuBuilder from './menu';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 912, // enough for the largest board size
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const indexHtmlPath = path.resolve(__dirname, '../react-app/build/index.html');
  win.loadURL(`file://${indexHtmlPath}`);

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  const menuBuilder = new MenuBuilder(win);
  menuBuilder.buildMenu();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});
