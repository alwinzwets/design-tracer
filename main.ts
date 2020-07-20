import { app, BrowserWindow, screen, Tray, Menu, globalShortcut, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as pkgInfo from './package.json';

// Init global vars to prevent GC from cleaning to eagerly
let win: BrowserWindow = null;
let tray: Tray = null;

// Flags
let clickThroughEnabled = false;
let showWindow = true;

// Actions
enum AppAction {
  ENABLE_EDIT,
  DISABLE_EDIT,
  HIDE_INTERFACE,
  SHOW_INTERFACE
}

// Determine dev or build
const args = process.argv.slice(1),
     serve = args.some(val => val === '--serve');

const iconPath = app.isPackaged ? path.join(process.resourcesPath, "build/icon.ico") : "build/icon.ico";


function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the transparent, frameless window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    width: size.width,
    height: size.height,
    icon: iconPath,
    resizable: false,
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

  // Window behaviour
  win.setSkipTaskbar(true);
  win.setAlwaysOnTop(true);
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

  // Init Tray icon and menu.
  tray = new Tray(iconPath);
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

  // Register global hot keys.
  // TODO: These should be moved to a config file
  globalShortcut.register('CmdOrCtrl+Alt+H', () => {
  	setVisibility( !showWindow );
  });
  globalShortcut.register('CmdOrCtrl+Alt+E', () => {
    setClickThrough( !clickThroughEnabled );
  });
}

function setVisibility(state: boolean): void {
  // Set window visibily state
  // Not hiding the windows as Windows is preventing code execution on hidden windows
  // and Windows is animating window toggles which gets in the way of toggling the
  // overlay quickly.
  showWindow = state;
  win.webContents.send('action', showWindow ? AppAction.SHOW_INTERFACE : AppAction.HIDE_INTERFACE );
  win.setIgnoreMouseEvents(!showWindow ? true : clickThroughEnabled);
}

function setClickThrough(state: boolean): void {
  // Set interaction state of
  clickThroughEnabled = state;
  win.setIgnoreMouseEvents(clickThroughEnabled);
  win.webContents.send('action', clickThroughEnabled ? AppAction.DISABLE_EDIT : AppAction.ENABLE_EDIT );
}

function moveWindow( x: number ): void {
  const currentScreen = screen.getDisplayNearestPoint({x: win.getBounds().x, y: win.getBounds().y});
  const screens = screen.getAllDisplays().sort((a, b) => (a.bounds.x > b.bounds.x) ? 1 : -1);
  const screenIds = screens.map( screen => screen.id );
  const currentIndex = screenIds.indexOf( currentScreen.id );

  if( x < 0 && currentIndex === 0 || x > 0 && currentIndex === screens.length-1 ) return;

  win.setPosition( screens[currentIndex+x].bounds.x, screens[currentIndex+x].bounds.y);
  win.maximize();
}


try {

  app.allowRendererProcessReuse = true;

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => {

    ipcMain.on('move-window', (event, arg) => {
        moveWindow(arg === 'LEFT' ? -1 : 1 );
        event.returnValue = 'ok'
    })

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
