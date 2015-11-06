import Ember from 'ember';
import CountUp from 'countUp';
export default Ember.Component.extend({
  classNames: ['ember-countup'],
  tagName: 'span',
  countUp: null,
  didInsertElement() {
    this._insertAndStartCountUp();
  },

  changed: Ember.observer('startVal', 'decimals', 'duration', 'useEasing', 'useGrouping', 'separator', 'decimal', 'prefix', 'suffix', function() {
    this._insertAndStartCountUp();
  }),
  changed_value: Ember.observer('endVal', function() {
    this._update();
  }),
  _update() {
    this.get('countUp').update(this.get('endVal'));
  },
  _insertAndStartCountUp() {
    Ember.run.next(() => {
      this.set('countUp', new CountUp(
        this.get('elementId'),
        this.get('startVal') || 0,
        this.get('endVal') || 0,
        this.get('decimals') || 0,
        this.get('duration') || 2, {
          useEasing: this.get('useEasing'),
            useGrouping: this.get('useGrouping'),
            separator: this.get('separator') || ',',
            decimal: this.get('decimal') || '.',
            prefix: this.get('prefix') || '',
            suffix: this.get('suffix') || ''
        }
      ));
      this.get('countUp').start();
    });
  }
});
