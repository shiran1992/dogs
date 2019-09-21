const DataUtil = require('DataUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: cc.ProgressBar,
        bar: cc.Sprite,
    },

    ctor() {
        this._pkRoom = null;
        this._callback = null;
    },

    onLoad() {
        this._pkRoom = DataUtil.getPkRoom();
        this.startBar();
    },

    //启动进度调
    startBar() {
        //false：透明度降低   true：透明度上升
        let singleSeconds = this._pkRoom.singleSeconds || 10;
        let offLen = 1 / (parseInt(singleSeconds, 10) * 1000 / 80);
        this.timer = setInterval(() => {
            if (this.progressBar.progress > 0) {
                this.progressBar.progress -= offLen;
            } else {
                this.bar.node.active = false;
                this.stopAllActions();
                
                this._callback && this._callback();
            }
        }, 80);
    },

    //停止所有actions
    stopAllActions() {
        this.timer && clearInterval(this.timer);
        this.timer = null;
    },

    //时间用完的回调
    setEndCallback(callback) {
        this._callback = callback;
    },

    //销毁掉
    doDestroy() {
        this.stopAllActions();

        this.node.destroy();
    },

    onDestroy() {
        this.stopAllActions();
    },
});
