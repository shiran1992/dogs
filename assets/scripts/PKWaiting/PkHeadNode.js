const Helper = require('Helper');

cc.Class({
    extends: cc.Component,

    properties: {
        head: cc.Sprite,
    },

    ctor() {
        this._userInfo = null;
    },

    setData(user) {
        this._userInfo = user;
        this.initView();
    },

    initView() {
        if (this._userInfo) {
            Helper.loadHttpImg(this.head, this._userInfo.avatar);
        }
    },
});
