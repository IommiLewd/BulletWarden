var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.





// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  var mainWindow = new BrowserWindow({
    "maxWidth": "",
    "macIcon": "",
    "enableLargerThanScreen": false,
    "disableAutoHideCursor": false,
    "y": 100,
    "x": 100,
    "autoHideMenuBar": false,
    "resizable": false,
    "frame": true,
    "exeIcon": "",
    "acceptFirstMouse": false,
    "height": 600,
    "alwaysOnTop": false,
    "center": true,
    "type": "desktop",
    "minWidth": "",
    "minHeight": "",
    "titleBarStyle": "default",
    "transparent": false,
    "maxHeight": "",
    "icon": "",
    "darkTheme": false,
    "skipTaskbar": false,
    "webPreferences": {
        "webgl": true,
        "preload": "",
        "zoomFactor": 1.0,
        "textAreasAreResizable": true,
        "blinkFeatures": "",
        "directWrite": true,
        "partition": "",
        "experimentalCanvasFeatures": false,
        "images": true,
        "experimentalFeatures": false,
        "webSecurity": true,
        "allowDisplayingInsecureContent": false,
        "plugins": false,
        "javascript": true,
        "webaudio": true,
        "nodeIntegration": true,
        "allowRunningInsecureContent": false
    },
    "title": "BulletWarden",
    "fullscreen": false,
    "show": true,
    "backgroundColor": "#000000",
    "kiosk": false,
    "useContentSize": false,
    "width": 800
});
  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.webContents.setUserAgent("");

  mainWindow.webContents.on('did-finish-load',function(){
    mainWindow.setTitle("BulletWarden");
    
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
