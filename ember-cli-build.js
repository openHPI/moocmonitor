/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here

  });
  //css
  app.import('bower_components/bootstrap/dist/css/bootstrap.css');
  app.import('bower_components/AdminLTE/dist/css/AdminLTE.css');
  app.import('bower_components/AdminLTE/dist/css/skins/skin-black-light.css');
  app.import('bower_components/AdminLTE/dist/css/skins/skin-blue.css');

  app.import('bower_components/AdminLTE/plugins/jvectormap/jquery-jvectormap-1.2.2.css');

  // js
  app.import('bower_components/bootstrap/dist/js/bootstrap.js');
  app.import('bower_components/AdminLTE/dist/js/app.js');

  app.import('bower_components/AdminLTE/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js');
  app.import('bower_components/AdminLTE/plugins/jvectormap/jquery-jvectormap-world-mill-en.js');

  //d3
  app.import('bower_components/d3/d3.min.js');
  //globe stuff
  app.import('bower_components/topojson/topojson.js');
  app.import('bower_components/planetary.js/dist/planetaryjs.js');

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
