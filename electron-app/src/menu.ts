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
    const template = this.buildTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  buildTemplate(): MenuItemConstructorOptions[] {
    const { t } = this;
    const isMac = process.platform === 'darwin';

    const subMenuAbout: MenuItemConstructorOptions = {
      label: app.getName(),
      submenu: [
        { role: 'about', label: t('menu.about') },
        { type: 'separator' },
        { role: 'hide', label: t('menu.hide') },
        { role: 'hideothers', label: t('menu.hide_others') },
        { role: 'unhide', label: t('menu.unhide') },
        { type: 'separator' },
        { role: 'quit', label: t('menu.quit') },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: t('menu.view'),
      submenu: [
        { role: 'reload', label: t('menu.reload') },
        { role: 'forcereload', label: t('menu.force_reload') },
        { role: 'toggledevtools', label: t('menu.toggle_devtools') },
        { type: 'separator' },
        { role: 'resetzoom', label: t('menu.reset_zoom') },
        { role: 'zoomin', label: t('menu.zoom_in') },
        { role: 'zoomout', label: t('menu.zoom_out') },
        { type: 'separator' },
        { role: 'togglefullscreen', label: t('menu.toggle_fullscreen') },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: t('menu.view'),
      submenu: [
        { role: 'resetzoom', label: t('menu.reset_zoom') },
        { role: 'zoomin', label: t('menu.zoom_in') },
        { role: 'zoomout', label: t('menu.zoom_out') },
        { type: 'separator' },
        { role: 'togglefullscreen', label: t('menu.toggle_fullscreen') },
      ],
    };
    const subMenuWindow: MenuItemConstructorOptions = {
      label: t('menu.window'),
      submenu: [
        { role: 'minimize', label: t('menu.minimize') },
        { role: 'zoom', label: t('menu.zoom') },
        ...((isMac
          ? []
          : [{ role: 'close', label: t('menu.close') }]) as MenuItemConstructorOptions[]),
      ],
    };

    const subMenuView = process.env.NODE_ENV === 'production' ? subMenuViewProd : subMenuViewDev;

    return [subMenuAbout, subMenuView, subMenuWindow];
  }
}
