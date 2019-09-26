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
    },

    setCallback(callback) {
        this._callback = callback;
    },

    //销毁掉
    doDestroy() {
        this._callback && this._callback();
        this.node.destroy();
    },

    onDestroy() {
        this.doDestroy();
    }
});
