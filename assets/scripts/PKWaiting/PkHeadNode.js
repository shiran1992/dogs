const Helper = require('Helper');

cc.Class({
    extends: cc.Component,

    properties: {
        head: cc.Sprite,
    },

    ctor() {
        this._userInfo = null;
        this.anim = false;
    },

    setData(user, anim) {
        this._userInfo = user;
        this.anim = anim;
        this.initView();
    },

    initView() {
        if (this._userInfo) {
            this._userInfo.avatar && Helper.loadHttpImg(this.head, this._userInfo.avatar);
            this.anim && this.head.node.runAction(cc.sequence(cc.scaleTo(0, -1, 1), cc.scaleTo(0.3, 0, 1), cc.scaleTo(0.4, 1, 1)));
        }
    },
});
