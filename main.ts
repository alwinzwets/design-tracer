import { app, BrowserWindow, screen, Tray, Menu, globalShortcut } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as pkgInfo from './package.json';

let win: BrowserWindow = null;
let tray: Tray = null;
let ignoreMouseEvents = false;
let showWindow = true;

enum AppAction {
  ENABLE_EDIT,
  DISABLE_EDIT,
  HIDE_INTERFACE,
  SHOW_INTERFACE
}

const args = process.argv.slice(1),
     serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    width: size.width,
    height: size.height,
    icon: './assets/icon.ico',
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
    },
  });

  if (serve) {

    win.webContents.openDevTools();

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');

  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  win.setSkipTaskbar(true);
  win.setAlwaysOnTop(true);
  win.setPosition(-1920, 0);
  win.maximize();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}


function setTray(): void {
  tray = new Tray('./assets/icon.ico');
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show controls', type: 'radio', checked: true, click(): void { setClickThrough(false); } },
    { label: 'Hide controls', type: 'radio', click(): void { setClickThrough(true); } },
    { type: 'separator' },
    { label: 'Show overlay', type: 'radio', checked: true, click(): void { setVisibility(true); } },
    { label: 'Hide overlay', type: 'radio', click(): void { setVisibility(false); } },
    { type: 'separator' },
    { label: 'Exit DesignTracer', click(): void { win.close(); app.exit(); } },
  ]);
  tray.setToolTip(`DesignTracer v${pkgInfo.version}`);
  tray.setContextMenu(contextMenu);
}


function registerShortcuts(): void {
  const toggleVisibility = globalShortcut.register('CmdOrCtrl+Alt+H', () => {
  	setVisibility( !showWindow );
  });
  const toggleClickThrough = globalShortcut.register('CmdOrCtrl+Alt+E', () => {
    setClickThrough( !ignoreMouseEvents );
  });
}

function setVisibility(state: boolean): void {
    showWindow = state;
    win.webContents.send('action', showWindow ? AppAction.SHOW_INTERFACE : AppAction.HIDE_INTERFACE );
    win.setIgnoreMouseEvents(!showWindow ? true : ignoreMouseEvents);
}

function setClickThrough(state: boolean): void {
    ignoreMouseEvents = state;
    win.setIgnoreMouseEvents(ignoreMouseEvents);
    win.webContents.send('action', ignoreMouseEvents ? AppAction.DISABLE_EDIT : AppAction.ENABLE_EDIT );
}



try {

  app.allowRendererProcessReuse = true;

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => {
    setTimeout(() => {
      setTray();
      createWindow();
      registerShortcuts();
    }, 400);
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
