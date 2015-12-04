import Ember from 'ember';
var ipc = window.require("ipc");

export default Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      active_users: null,
      all_users: null
    });
  },
  auth: null,
  polling_model_interval: null,
  polling_model_frequent_interval: null,
  /**
   Create the polling interval
   */
  activate: function() {
    if (ipc !== 'undefined'){
      this.auth = ipc.send('synchronous-message', {key: 'settings.get', id: 'token'});
    }
    // console.log(this.auth);
    this._super();
    this.getData();
    this.getFrequentData();
    this.clearInterval();
    this.polling_model_frequent_interval = setInterval(() => {
      this.getFrequentData();
    }, 2500);
    this.polling_model_interval = setInterval(() => {
      this.getData();
    }, 15000);
  },

  /**
   Destroy the polling interval on deactivate
   */
  deactivate: function() {
    this._super();
    this.clearInterval();
  },

  /**
   Helper to clear the interval
   */
  clearInterval: function() {
    if (this.polling_model_interval) {
      clearInterval(this.polling_model_interval);
    }
    if (this.polling_model_frequent_interval) {
      clearInterval(this.polling_model_frequent_interval);
    }
  },

  /**
   Get data
   * TODO: nicer auth
   */
  getFrequentData: function() {
    Ember.$.getJSON('https://open.sap.com/api/v2/stats/active_users.json?token='+this.auth).then(response => this.controller.set('model.active_users', response));
  },
  getData: function() {
    Ember.$.getJSON('https://open.sap.com/api/v2/stats/global.json?token='+this.auth).then(response => this.controller.set('model.all_users', response));
  }

});
