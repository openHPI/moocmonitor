var BrowserWindow = require('browser-window');
var app = require('app');
var mainWindow = null;
var menubar = require('menubar');
var ipc = require('ipc');

var ElectronSettings = require('electron-settings');
var settings = new ElectronSettings();

var handleSquirrelEvent = function () {
    if (process.platform != 'win32') {
        return false;
    }

    function executeSquirrelCommand(args, done) {
        var updateDotExe = path.resolve(path.dirname(process.execPath),
            '..', 'update.exe');
        var child = cp.spawn(updateDotExe, args, {
            detached: true
        });
        child.on('close', function (code) {
            done();
        });
    };

    function install(done) {
        var target = path.basename(process.execPath);
        executeSquirrelCommand(["--createShortcut", target], done);
    };

    function uninstall(done) {
        var target = path.basename(process.execPath);
        executeSquirrelCommand(["--removeShortcut", target], done);
    };

    var squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
    case '--squirrel-install':
        install(app.quit);
        return true;
    case '--squirrel-updated':
        install(app.quit);
        return true;
    case '--squirrel-obsolete':
        app.quit();
        return true;
    case '--squirrel-uninstall':
        uninstall(app.quit);
        return true;
    }

    return false;
};

var checkForGitHubRelease = function () {
    var gh_releases = require('electron-gh-releases');

    var options = {
        repo: 'openhpi/moocmonitor',
        currentVersion: app.getVersion()
    }

    var update = new gh_releases(options, function (auto_updater) {
        auto_updater.on('update-downloaded', function (e, rNotes, rName, rDate, uUrl, quitAndUpdate) {
            var dialog = require('dialog');
            dialog.showMessageBox({
                type: 'info',
                buttons: ['go for it!'],
                title: 'Update Downloaded',
                message: 'We found and downdloaded a new version of the MOOC Monitor! Once you close this dialog, i will automatically update and restart.'
            });

            // Install the update
            quitAndUpdate();
        });
    });

    // Check for updates
    update.check(function (err, status) {
        if (!err && status) {
            update.download();
        }
    });
};

if (process.env.ELECTRON_ENV === 'development') {
    //mainWindow.openDevTools();
    url = 'http://localhost:5000';
} else {
    url = 'file://' + __dirname + '/dist/index.html';
}
var mb = menubar({  'index': url,
                    'height': 800,
                    'preload': true,
                    'icon': './public/icon/menubar_icon.png'
                  });
mb.on('ready', function ready (){

  if (handleSquirrelEvent()) {
    return;
  }

  // Check for update
  //checkForGitHubRelease();

  //  console.log('app is ready');
  // In main process.
  ipc.on('synchronous-message', function(event, arg) {
    //console.log(mb.window.isFullScreen());

    if (arg == 'fullscreen'){
      mb.window.setFullScreen(!mb.window.isFullScreen());
      mb.window.reload();//a ahack cause ember seems to crash on resize
    }
    else if (arg == 'exit'){
      if (process.platform !== 'darwin') {
          app.quit();
      }else{
          mb.window.close();
      }
    }else if (arg && typeof arg === 'object'){
      if (arg['key'] == 'setting.set' && arg['value'] && arg['id']){
          settings.set(arg['id'], arg['value']);
      }
      if (arg['key'] == 'setting.get' && arg['id']){
          return settings.get(arg['id']);
     }
    }
  });
})


app.on('window-all-closed', function onWindowAllClosed() {
    if (process.platform == 'darwin') {
        app.quit();
    }
});
