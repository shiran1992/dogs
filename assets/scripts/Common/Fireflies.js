cc.Class({
    extends: cc.Component,

    properties: {
        fireflies: cc.Node,
    },

    onLoad() {
        this.fireflieses = [this.fireflies];
        let count = Math.floor(Math.random() * 5) + 5;
        this.winSize = cc.director.getWinSize();
        for (let i = 0; i < count; i++) {
            let fireflies = cc.instantiate(this.fireflies);
            fireflies.parent = this.node;
            fireflies.x = -this.winSize.width / 2 + Math.random() * this.winSize.width;
            fireflies.y = -this.winSize.height / 2 + Math.random() * this.winSize.height;
            this.fireflieses.push(fireflies);
        }

        for (let i = 0; i < this.fireflieses.length; i++) {
            let fireflies = this.fireflieses[i];
            this.firefliesRunActions(fireflies)
        }
    },

    firefliesRunActions(fireflies) {
        fireflies.scale = Math.random() * 0.7 + 0.2;
        fireflies.opacity = Math.random() * 100 + 155;
        let dx = -Math.random() * 100 + 50;
        let dy = -Math.random() * 150 + 75;
        let time = Math.random() * 3 + 1.5;
        let scale = Math.random() * 0.7 + 0.2;
        let action1 = cc.moveBy(time, cc.v2(dx, dy));
        let action2 = cc.fadeTo(time, 0);
        let action3 = cc.scaleTo(time, scale);
        fireflies.runAction(cc.sequence(cc.delayTime(Math.random()), cc.spawn(action1, action2, action3), cc.delayTime(1.5 * Math.random()), cc.callFunc(() => {
            this.firefliesRunActions(fireflies)
        })));
    }
});
