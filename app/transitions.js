/**
 * Liquid Fire Transitions
 */
var transition = function () {
    this.transition(
        this.fromRoute('home'),
        this.toRoute('alerts'),
        this.use('toLeft'),
        this.reverse('toRight')
    );
    this.transition(
        this.fromRoute('alerts'),
        this.toRoute('timeline'),
        this.use('crossFade'),
        this.reverse('crossFade')
    );
    this.transition(
        this.fromRoute('home'),
        this.toRoute('timeline'),
        this.use('crossFade'),
        this.reverse('crossFade')
    );


};

export default transition;
