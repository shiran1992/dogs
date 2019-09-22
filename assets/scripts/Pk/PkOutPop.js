const DataUtil = require('DataUtil');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    ctor() {
        this._callback = null;
    },

    onLoad() {
        DataUtil.setModel(1);
        this.timer = setTimeout(() => {
            this._callback && this._callback();
            this.node.destroy();
        }, 2000);
    },

    setCallback(callback) {
        this._callback = callback;
    },

    //销毁掉
    doDestroy() {
        clearTimeout(this.timer);
        this.timer = null;
        this.node.destroy();
    },

    onDestroy() {
        this.doDestroy();
    }
});
