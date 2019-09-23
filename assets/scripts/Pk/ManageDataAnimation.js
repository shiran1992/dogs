cc.Class({
    extends: cc.Component,

    properties: {
        dot0: cc.Node,
        dot1: cc.Node,
        dot2: cc.Node,
    },

    onLoad() {
        let num = 0;
        this.timer = setInterval(() => {
            this.dot0.active = false;
            this.dot1.active = false;
            this.dot2.active = false;
            num = (num + 1) % 4;
            for (let i = 0; i < num; i++) {
                this["dot" + i].active = true;
            }
        }, 1000);
    },

    onDestroy() {
        this.timer && clearInterval(this.timer);
        this.timer = null;
    }
});
