cc.Class({
    extends: cc.Component,

    properties: {
        num: cc.Label
    },

    ctor() {
        this._num = 2;
        this.timer = null;
        this.callback = null;
    },

    startNumDown(callback) {
        this.callback = callback;
        this.timer = setInterval(() => {
            if (this._num < 0) {
                this.callback && this.callback();
                this.timer && clearInterval(this.timer);
                this.timer = null;
            } else {
                this.num.string = this._num > 0 ? this._num : "GO";
                this._num--;
            }
        }, 1 * 800);
    },

    onDestroy() {
        this.timer && clearInterval(this.timer);
        this.timer = null;
    }
});
