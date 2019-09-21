const Helper = require('Helper');
cc.Class({
    extends: cc.Component,

    properties: {
        num: cc.Label,
        icon: cc.Sprite,
        head: cc.Sprite,
        border: cc.Sprite,
        nick: cc.Label,
        score: cc.Label,
        iconFrames: [cc.SpriteFrame],
    },

    initView(obj = {}) {
        let num = parseInt(obj.orderIndex, 10);
        if (num < 4) {
            this.icon.spriteFrame = this.iconFrames[num - 1];
        } else {
            this.icon.node.active = false;
            this.num.string = num;
        }

        if (obj.cName.length >= 5) {
            this.nick.string = obj.cName.substr(0, 4)+"...";
        }else{
            this.nick.string = obj.cName;
        }
        this.score.string = obj.brainValue;
        Helper.loadHttpImg(this.border, obj.avatar);
    }
});
