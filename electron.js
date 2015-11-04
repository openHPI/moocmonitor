var BrowserWindow = require('browser-window');
var app = require('app');
var mainWindow = null;
var menubar = require('menubar');
var ipc = require('ipc');


if (process.env.ELECTRON_ENV === 'development') {
    //mainWindow.openDevTools();
    url = 'http://localhost:5000';
} else {
    url = 'file://' + __dirname + '/dist/index.html';
}
var mb = menubar({'index': url})
mb.on('ready', function ready (){
  console.log('app is ready');
  // In main process.
})
ipc.on('synchronous-message', function(event, arg) {
  //console.log(mb.window.isFullScreen());
  if (arg == 'fullscreen'){
    mb.window.setFullScreen(!mb.window.isFullScreen());
  }
});


/**app.on('window-all-closed', function onWindowAllClosed() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', function onReady() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    delete mainWindow.module;



    mainWindow.on('closed', function onClosed() {
        mainWindow = null;
    });
});
*/
