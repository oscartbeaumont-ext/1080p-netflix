// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');
const path = require('path');
const globToRegExp = require('glob-to-regexp');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

//Load Widevine Only On Mac - Castlab Electron is used for all other platforms
if (process.platform == 'darwin') {
  require('electron-widevinecdm').load(app);
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: false, // Must be disabled for preload script. I am not aware of a workaround but this *shouldn't* effect security
      plugins: true,
      webSecurity: false, // TEMP To Disable CSP Errors
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL('https://netflix.com');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Replaces background.js Of Chrome Extention

  const pattern1 = globToRegExp('*://assets.nflxext.com/*/ffe/player/html/*');
  const pattern2 = globToRegExp(
    '*://www.assets.nflxext.com/*/ffe/player/html/*'
  );

  mainWindow.webContents.session.webRequest.onBeforeRequest(
    [], // This url matching is broken so regex is used
    (details, cb) => {
      if (pattern1.test(details.url) || pattern2.test(details.url)) {
        console.log('BACKGROUND TRIGGERED: ', details.url);
        console.log(
          `file://${path.resolve(
            __dirname,
            'cadmium-playercore-6.0015.328.011-1080p.js'
          )}`
        );
        cb({
          redirectURL: `file://${path.resolve(
            __dirname,
            'cadmium-playercore-6.0015.328.011-1080p.js'
          )}`

          // 'https://raw.githubusercontent.com/truedread/netflix-1080p/master/cadmium-playercore-6.0015.328.011-1080p.js' // TODO: Include with app
        });
      } else {
        cb({
          cancel: false
        });
      }
    }
  );

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
