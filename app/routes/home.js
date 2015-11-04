import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return Ember.$.ajax('http://localhost:3000/api/v2/stats/active_users.json');
  }
});
