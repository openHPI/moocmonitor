var BrowserWindow = require('browser-window');
var app = require('app');
var mainWindow = null;
var menubar = require('menubar');
var ipc = require('ipc');
var notifier = require('node-notifier');
var ElectronSettings = require('electron-settings');
var settings = new ElectronSettings();
var GhReleases = require('electron-gh-releases')
var handleSquirrelEvent = function () {
  notifier.notify({
    title:"Plattform",
    message: process.platform + '__',
    sound: true,
    wait: false,
  }, function(error, response) {
    console.log('Notification Error', response);
  });
    if (process.platform !== 'win32') {
        return false;
    }
    function executeSquirrelCommand(args, done) {
        var updateDotExe = path.resolve(path.dirname(process.execPath),
            '..', 'update.exe');
        var child = cp.spawn(updateDotExe, args, {
            detached: false
        });
        child.on('close', function (code) {
            done();
        });
    };

    function install(done) {
        var target = path.basename(process.execPath);
        executeSquirrelCommand(["--createShortcut Desktop,StartMenu,Startup", target], done);
    };

    function uninstall(done) {
        var target = path.basename(process.execPath);
        executeSquirrelCommand(["--removeShortcut Desktop,StartMenu,Startup", target], done);
    };

    var squirrelEvent = process.argv[1];
    notifier.notify({
      title:"Squirrel event",
      message: squirrelEvent + '__',
      sound: true,
      wait: false,
    }, function(error, response) {
      console.log('Notification Error', response);
    });
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

//var checkForGitHubRelease = function () {
//    var gh_releases = require('electron-gh-releases');
//
//    var options = {
//        repo: 'openhpi/moocmonitor',
//        currentVersion: app.getVersion()
//    }
//
//    var update = new gh_releases(options, function (auto_updater) {
//        auto_updater.on('update-downloaded', function (e, rNotes, rName, rDate, uUrl, quitAndUpdate) {
//            var dialog = require('dialog');
//            dialog.showMessageBox({
//                type: 'info',
//                buttons: ['go for it!'],
//                title: 'Update Downloaded',
//                message: 'We found and downdloaded a new version of the MOOC Monitor! Once you close this dialog, i will automatically update and restart.'
//            });
//
//            // Install the update
//            quitAndUpdate();
//        });
//    });
//
//    // Check for updates
//    update.check(function (err, status) {
//        if (!err && status) {
//            update.download();
//        }
//    });
//};

if (process.env.ELECTRON_ENV === 'development') {
    url = 'http://localhost:5000';
    //mainWindow.openDevTools();
} else {
    url = 'file://' + __dirname + '/dist/index.html';
}
var mb = menubar({  'index': url,
                    'height': 750,
                    'width': 550,
                    'preload': true,
                    'showDockIcon': false,
                    'icon': './public/icon/menubar_icon.png'
                  });
mb.on('ready', function ready (){



  // Check for update
  //checkForGitHubRelease();

  //  console.log('app is ready');
  // In main process.
  ipc.on('notify', function(event, notification) {
  notifier.notify({
    title: notification.title,
    message: notification.message,
    sound: false,
    wait: false,
  }, function(error, response) {
    console.log('Notification Error', response);
  });

  notifier.on('click', function (notifierObject, options) {
    main.show();
  });
});


  ipc.on('synchronous-message', function(event, arg) {
    //console.log(mb.window.isFullScreen());

    if (arg == 'fullscreen'){
      mb.window.setFullScreen(!mb.window.isFullScreen());
      //mb.window.openDevTools();
      mb.window.reload();//a ahack cause ember seems to crash on resize
    }
    else if (arg == 'devtools'){
      mb.window.openDevTools();
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

//check squirrel
squirrel = handleSquirrelEvent();
notifier.notify({
  title:"Squirrel check",
  message: squirrel + '__',
  sound: true,
  wait: false,
}, function(error, response) {
  console.log('Notification Error', response);
});
if (squirrel) {
  return;
}


var options = {
  repo: 'openHPI/moocmonitor',
  currentVersion: app.getVersion()
}

updater = new GhReleases(options)

// Check for updates
// `status` returns true if there is a new update available
updater.check((err, status) => {
  if (!err && status) {
    // Download the update
    updater.download()
  }
})

// When an update has been downloaded
updater.on('update-downloaded', (info) => {
  // Restart the app and install the update
  updater.install()
})

// Access electrons autoUpdater
updater.autoUpdater

app.on('window-all-closed', function onWindowAllClosed() {
    if (process.platform == 'darwin') {
        app.quit();
    }
});
