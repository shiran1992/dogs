const DataUtil = require('DataUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        desc0: cc.Node,//已被淘汰
        desc1: cc.Node,//已经错过
    },

    ctor() {
        this._callback = null;
    },

    initView(type) {
        if (type == 1) {//错过
            this.desc0.active = false;
            this.desc1.active = true;
        } else {//淘汰
            this.desc0.active = true;
            this.desc1.active = false;
        }
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
