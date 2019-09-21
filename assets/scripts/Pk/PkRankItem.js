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
        tishu: cc.Label,
        iconFrames: [cc.SpriteFrame],
    },

    initView(obj = {}) {
        this.node.runAction(cc.sequence(cc.delayTime(0.08), cc.scaleTo(0.1, 1.05)));
        let num = parseInt(obj.orderIndex, 10);
        if (num < 4) {
            this.icon.node.active = true;
            this.num.node.active = false;
            this.icon.spriteFrame = this.iconFrames[num - 1];
        } else {
            this.icon.node.active = false;
            this.num.node.active = true;
            this.num.string = num;
        }
        if (obj.cName.length >= 5) {
            this.nick.string = obj.cName.substr(0, 4) + "...";
        } else {
            this.nick.string = obj.cName;
        }
        this.score.string = obj.getScore + "分";
        this.tishu.string = obj.totalRightNum + "题";
        Helper.loadHttpImg(this.border, obj.avatar);
    }
});
