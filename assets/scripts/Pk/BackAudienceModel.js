const DataUtil = require('DataUtil');

cc.Class({
    extends: cc.Component,

    ctor() {
        this._callback = null;
    },

    setCallback(cb) {
        this._callback = cb;
    },

    //点击取消
    onClickCancel() {
        this.node.destroy();
    },

    //点击确定
    onClickOK() {
        this._callback && this._callback();
    },
});
