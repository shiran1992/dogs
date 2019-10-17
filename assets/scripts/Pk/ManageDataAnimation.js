cc.Class({
    extends: cc.Component,

    properties: {
        spriteNode: cc.Sprite,
        dot0: cc.Node,
        dot1: cc.Node,
        dot2: cc.Node,
        imgs: [cc.SpriteFrame]
    },

    startAnimation() {
        this.spriteNode.spriteFrame = this.imgs[0];

        let num = 0;
        this.timer && clearInterval(this.timer);
        this.timer = null;
        this.timer = setInterval(() => {
            this.dot0.active = false;
            this.dot1.active = false;
            this.dot2.active = false;
            num = (num + 1) % 4;
            for (let i = 0; i < num; i++) {
                this["dot" + i].active = true;
            }
        }, 400);
    },

    stopAnimation() {
        this.spriteNode.spriteFrame = this.imgs[1];
        
        this.timer && clearInterval(this.timer);
        this.timer = null;
        this.dot0.active = false;
        this.dot1.active = false;
        this.dot2.active = false;
    },

    onDestroy() {
        this.timer && clearInterval(this.timer);
        this.timer = null;
    }
});
