import { app, BrowserWindow, Tray, Menu, globalShortcut } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow;
let ignoreMouseEvents = false;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    transparent: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '/design-tracer/index.html'));
  mainWindow.setSkipTaskbar(true);
  mainWindow.setAlwaysOnTop(true);
  mainWindow.maximize();

}

function setTray(): void {
  const tray = new Tray('./assets/icon.png');
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show interface', click(): void { mainWindow.webContents.send('action', 'show-interface'); } },
    { label: 'Hide interface' },
    { label: 'Show overlay', click(): void { mainWindow.show(); } },
    { label: 'Hide overlay', click(): void { mainWindow.hide(); } },
    { type: 'separator' },
    { label: 'Exit DesignTracer', role: 'quit' },
  ]);
  tray.setToolTip('DesignTracer v1.0.0');
  tray.setContextMenu(contextMenu);
}

function registerShortcuts(): void {
  const toggleVisibility = globalShortcut.register('CmdOrCtrl+Alt+D', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
  const toggleClickThrough = globalShortcut.register('CmdOrCtrl+Alt+E', () => {
    ignoreMouseEvents = !ignoreMouseEvents;
    mainWindow.setIgnoreMouseEvents(ignoreMouseEvents);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {

  setTray();
  createWindow();
  registerShortcuts();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) { createWindow(); }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
