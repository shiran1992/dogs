const Helper = require('Helper');

cc.Class({
    extends: cc.Component,

    properties: {
        head: cc.Sprite,

        _userInfo: null
    },

    setData(user) {
        this._userInfo = user;

        this.initView();
    },

    initView() {
        if (this._userInfo) {
            this._userInfo.avatar && Helper.loadHttpImg(this.head, this._userInfo.avatar);
            //this.hn.runAction(cc.sequence(cc.delayTime(delay), cc.scaleTo(0, -1, 1), cc.scaleTo(0.3, 0, 1), cc.scaleTo(0.3, 1, 1)));
        }
    },
});
