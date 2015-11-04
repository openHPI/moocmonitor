import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      active_users: Ember.$.getJSON('http://localhost:3000/api/v2/stats/active_users.json'),
      all_users: Ember.$.getJSON('http://localhost:3000/api/v2/stats/global.json')
    });
  },
  polling_model_interval: null,
  /**
   Create the polling interval
   */
  activate: function() {
    this._super();
    this.clearInterval();
    this.polling_model_interval = setInterval(() => {
      Ember.$.getJSON('http://localhost:3000/api/v2/stats/active_users.json').then(response => this.controller.set('model.active_users', response));
    }, 5000);
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
  }
});
