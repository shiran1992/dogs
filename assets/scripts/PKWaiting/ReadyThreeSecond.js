cc.Class({
    extends: cc.Component,

    properties: {
        num: cc.Label,
        smog: cc.Sprite,
    },

    ctor() {
        this._num = 2;
        this.timer = null;
        this.callback = null;
    },

    onLoad() {
        this.startAnimation();
    },

    startNumDown(callback) {
        this.callback = callback;
        this.timer = setInterval(() => {
            if (this._num < 0) {
                this.callback && this.callback();
                this.timer && clearInterval(this.timer);
                this.timer = null;
            } else if (this._num == 0) {
                this.num.string = "GO";
                this.startAnimation();
                this._num--;
            } else {
                this.num.string = this._num;
                this.startAnimation();
                this._num--;
            }
        }, 1 * 800);
    },

    startAnimation() {
        this.num.node.scale = 2;
        this.num.node.opacity = 255;
        let scaleTo = cc.scaleTo(0.3, 0.8).easing(cc.easeQuarticActionIn());
        let fadeTo = cc.fadeTo(0.3, this._num > 0 ? 0 : 255);
        this.num.node.runAction(cc.sequence(scaleTo, cc.callFunc(() => {
            if (this._num < 0) {
                this.smog.node.scale = 4;
                let animation = this.smog.getComponent(cc.Animation);
                animation.play("smog");
            }
        }), fadeTo));
    },

    doDestroy() {
        this.timer && clearInterval(this.timer);
        this.timer = null;
    },

    onDestroy() {
        this.doDestroy();
    }
});
