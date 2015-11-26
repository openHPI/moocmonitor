import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      active_users: 0,//Ember.$.getJSON('http://localhost:3000/api/v2/stats/active_users.json'),
      all_users: 0///Ember.$.getJSON('http://localhost:3000/api/v2/stats/global.json')
    });
  },
  polling_model_interval: null,
  polling_model_frequent_interval: null,
  /**
   Create the polling interval
   */
  activate: function() {
    this._super();
    this.getData();
    this.getFrequentData();
    this.clearInterval();
    this.polling_model_frequent_interval = setInterval(() => {
      this.getFrequentData()
    }, 2000);
    this.polling_model_interval = setInterval(() => {
      this.getData()
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
   */
  getFrequentData: function() {
    Ember.$.getJSON('https://open.sap.com/api/v2/stats/active_users.json').then(response => this.controller.set('model.active_users', response));

  },
  getData: function() {
    Ember.$.getJSON('https://open.sap.com/api/v2/stats/global.json').then(response => this.controller.set('model.all_users', response));
  }

});
