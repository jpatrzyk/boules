import { app, Menu, BrowserWindow, MenuItemConstructorOptions } from 'electron';
import { TFunction } from 'i18next';

export default class MenuBuilder {
  mainWindow: BrowserWindow;
  t: TFunction;

  constructor(mainWindow: BrowserWindow, t: TFunction) {
    this.mainWindow = mainWindow;
    this.t = t;
  }

  buildMenu() {
    if(process.platform === 'darwin') {
      const template = this.buildDarwinTemplate();
      const menu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(menu);
    } else {
      this.mainWindow.removeMenu();
    }
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const { t } = this;
    const subMenuAbout: MenuItemConstructorOptions = {
      label: app.getName(),
      submenu: [
        { role: 'about', label: t('menu.about') },
        { type: 'separator' },
        { role: 'hide', label: t('menu.hide') },
        { role: 'hideOthers', label: t('menu.hide_others') },
        { role: 'unhide', label: t('menu.unhide') },
        { type: 'separator' },
        { role: 'quit', label: t('menu.quit') },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: t('menu.view'),
      submenu: [
        { role: 'reload', label: t('menu.reload') },
        { role: 'forceReload', label: t('menu.force_reload') },
        { role: 'toggleDevTools', label: t('menu.toggle_devtools') },
        { type: 'separator' },
        { role: 'resetZoom', label: t('menu.reset_zoom') },
        { role: 'zoomIn', label: t('menu.zoom_in') },
        { role: 'zoomOut', label: t('menu.zoom_out') },
        { type: 'separator' },
        { role: 'togglefullscreen', label: t('menu.toggle_fullscreen') },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: t('menu.view'),
      submenu: [
        { role: 'resetZoom', label: t('menu.reset_zoom') },
        { role: 'zoomIn', label: t('menu.zoom_in') },
        { role: 'zoomOut', label: t('menu.zoom_out') },
        { type: 'separator' },
        { role: 'togglefullscreen', label: t('menu.toggle_fullscreen') },
      ],
    };
    const subMenuWindow: MenuItemConstructorOptions = {
      label: t('menu.window'),
      submenu: [
        { role: 'minimize', label: t('menu.minimize') },
        { role: 'zoom', label: t('menu.zoom') },
      ],
    };

    const subMenuView = process.env.NODE_ENV === 'production' ? subMenuViewProd : subMenuViewDev;

    return [subMenuAbout, subMenuView, subMenuWindow];
  }
}
