import Ember from 'ember';

export default Ember.Component.extend({

  initGlobe: function () {
    var planetaryjs = window.planetaryjs;
    var canvas = document.getElementById('mapCanvas');
    console.log(canvas);
    var globe = planetaryjs.planet();
    // Load our custom `autorotate` plugin; see below.
    globe.loadPlugin(autorotate(10));

    // The `earth` plugin draws the oceans and the land; it's actually
    // a combination of several separate built-in plugins.
    globe_get_data();
    globe.loadPlugin(planetaryjs.plugins.earth({
      topojson: {file: './js/world-110m.json'},
      oceans: {fill: '#222222'},
      land: {fill: '#111111'},
      borders: {stroke: '#222222'}
    }));
    // The `pings` plugin draws animated pings on the globe.
    globe.loadPlugin(planetaryjs.plugins.pings());
    // The `zoom` and `drag` plugins enable
    // manipulating the globe with the mouse.
    globe.loadPlugin(planetaryjs.plugins.zoom({
      scaleExtent: [50, 2000]
    }));
    globe.loadPlugin(planetaryjs.plugins.drag({
      // Dragging the globe should pause the
      // automatic rotation until we release the mouse.
      onDragStart: function () {
        this.plugins.autorotate.pause();
      },
      onDragEnd: function () {
        //this.plugins.autorotate.resume();
      }
    }));
    // Set up the globe's initial scale, offset, and rotation.
    globe.projection.scale(250).translate([250, 250]).rotate([0, -10, 0]);
    setInterval(function () {
      globe_get_data();
    }, 60000);
    //initial load

    // Special code to handle high-density displays (e.g. retina, some phones)
    // In the future, Planetary.js will handle this by itself (or via a plugin).
    if (window.devicePixelRatio === 2) {
      canvas.width = 1000;
      canvas.height = 1000;
      //context = canvas.getContext('2d');
      //context.scale(2, 2);
    }
    // Draw that globe!
    globe.draw(canvas);
    function globe_get_data() {

      Ember.$.ajax({
        url: "https://open.sap.com/api/v2/stats/geo.json",
      }).done(function (result) {
        Ember.$.each(result, function (index, value) {
          var lat = value['lat'];
          var lng = value['lon'];
          var color = '#f0ab00';
          var angle = Math.min(value['count'], 10) / 5;
          globe.plugins.pings.add(lng, lat, {color: color, ttl: 240000, angle: angle});
        });
      });

    }
    globe_get_data();
    // This plugin will automatically rotate the globe around its vertical
    // axis a configured number of degrees every second.
    function autorotate(degPerSec) {
      // Planetary.js plugins are functions that take a `planet` instance
      // as an argument...
      return function (planet) {
        var lastTick = null;
        var paused = false;
        planet.plugins.autorotate = {
          pause: function () {
            paused = true;
          },
          resume: function () {
            paused = false;
          }
        };
        // ...and configure hooks into certain pieces of its lifecycle.
        planet.onDraw(function () {
          if (paused || !lastTick) {
            lastTick = new Date();
          } else {
            var now = new Date();
            var delta = now - lastTick;
            // This plugin uses the built-in projection (provided by D3)
            // to rotate the globe each time we draw it.
            var rotation = planet.projection.rotate();
            rotation[0] += degPerSec * delta / 1000;
            if (rotation[0] >= 180) {rotation[0] -= 360};
            planet.projection.rotate(rotation);
            lastTick = now;
          }//if
        });//onDraw
      };//function planet
    };//function
  }.on('didInsertElement'),
  cleanUp:function(){}.on('willDestroyElement')
});
