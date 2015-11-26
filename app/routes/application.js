import Ember from 'ember';

export default Ember.Route.extend({

  activate: function() {
    //if not logged in
     //console.log(Ipc.send('asynchronous-message', {key: 'settings.get', id: 'token'}));
     //this.transitionTo('login');
  },

  deactivate: function() {

  }

});
