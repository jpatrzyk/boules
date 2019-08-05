import { app, Menu, BrowserWindow, MenuItemConstructorOptions } from 'electron';

// todo i18n

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    const template =
      process.platform === 'darwin' ? this.buildDarwinTemplate() : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: MenuItemConstructorOptions = {
      label: 'Boules',
      submenu: [
        {
          label: 'About Boules',
          role: 'about',
        },
        { type: 'separator' },
        {
          label: 'Hide Boules',
          accelerator: 'Command+H',
          role: 'hide',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideothers',
        },
        { label: 'Show All', role: 'unhide' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          role: 'reload',
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          role: 'togglefullscreen',
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          role: 'toggledevtools',
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          role: 'togglefullscreen',
        },
      ],
    };
    const subMenuWindow: MenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          role: 'minimize',
        },
        { label: 'Close', accelerator: 'Command+W', role: 'close' },
        { type: 'separator' },
        { label: 'Bring All to Front', role: 'front' },
      ],
    };

    const subMenuView = process.env.NODE_ENV === 'production' ? subMenuViewProd : subMenuViewDev;

    return [subMenuAbout, subMenuView, subMenuWindow];
  }

  buildDefaultTemplate(): MenuItemConstructorOptions[] {
    const subMenuFile = {
      label: '&File',
      submenu: [
        {
          label: '&Open',
          accelerator: 'Ctrl+O',
        },
        {
          label: '&Close',
          accelerator: 'Ctrl+W',
          click: () => {
            this.mainWindow.close();
          },
        },
      ],
    };
    const subMenuViewDev = {
      label: '&View',
      submenu: [
        {
          label: '&Reload',
          accelerator: 'Ctrl+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle &Full Screen',
          accelerator: 'F11',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle &Developer Tools',
          accelerator: 'Alt+Ctrl+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd = {
      label: '&View',
      submenu: [
        {
          label: 'Toggle &Full Screen',
          accelerator: 'F11',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuView = process.env.NODE_ENV === 'production' ? subMenuViewProd : subMenuViewDev;

    return [subMenuFile, subMenuView];
  }
}
