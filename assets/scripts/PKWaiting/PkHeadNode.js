const Helper = require('Helper');

cc.Class({
    extends: cc.Component,

    properties: {
        head: cc.Sprite,
    },

    ctor() {
        this._userInfo = null;
        this.anim = false;
        this.callback = null;
    },

    setData(user, anim, callback) {
        this._userInfo = user;
        this.anim = anim;
        this.callback = callback;
        this.initView();
    },

    initView() {
        if (this._userInfo) {
            if (this._userInfo.avatar) {
                cc.loader.load({ url: this._userInfo.avatar, type: "png" || "jpg" || "jpeg" }, (err, texture) => {
                    if (!err) {
                        if (this.anim) {
                            this.head.node.runAction(cc.sequence(
                                cc.scaleTo(0.3, 0, 1), 
                                cc.callFunc(()=>{
                                    this.head.spriteFrame = new cc.SpriteFrame(texture);
                                }),
                                cc.scaleTo(0.3, 1, 1),
                                cc.callFunc(()=>{
                                    this.callback && this.callback();
                                })));
                        } else {
                            this.head.spriteFrame = new cc.SpriteFrame(texture);
                        }
                    }
                });
            }

            // this._userInfo.avatar && Helper.loadHttpImg(this.head, this._userInfo.avatar);
            // this.head.node.runAction(cc.sequence(cc.scaleTo(0.3, 0, 1), cc.scaleTo(0.4, 1, 1)));
        }
    },
});
