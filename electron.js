var BrowserWindow = require('browser-window');
var app = require('app');
var mainWindow = null;
var menubar = require('menubar');


if (process.env.ELECTRON_ENV === 'development') {
    //mainWindow.openDevTools();
    url = 'http://localhost:5000';
} else {
    url = 'file://' + __dirname + '/dist/index.html';
}
var mb = menubar({'index': url})
mb.on('ready', function ready (){
  console.log('app is ready');
})
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
