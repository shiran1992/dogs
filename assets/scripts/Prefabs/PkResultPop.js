const DataUtil = require('DataUtil');
cc.Class({
    extends: cc.Component,

    properties: {
        icons: [cc.Sprite],
        text: cc.Label,
        rText: cc.RichText,
        flowers1: [cc.Sprite],
        flowers2: [cc.Sprite],
    },

    onLoad() {
        this.timer = setTimeout(() => {
            this.node.destroy();
        }, 2000);
    },

    initView(obj = {}) {
        let { type, text, flag } = obj;
        if (type) {
            this.icons[0].node.active = true;
            this.doIcon1Actions();
        } else {
            this.icons[1].node.active = true;
            this.doIcon2Actions();
        }
        this.text.string = text;
        this.text.node.setScale(1, 0);
        this.rText.node.setScale(1, 0);
    },

    //答对icon的标志动画
    doIcon1Actions() {
        this.flowers1[0].node.scale = 0;
        this.flowers1[1].node.scale = 0;
        this.icons[0].node.scale = 3;
        let scaleTo = cc.scaleTo(0.2, 1).easing(cc.easeQuadraticActionIn());
        this.icons[0].node.runAction(cc.sequence(scaleTo, cc.callFunc(() => {
            let rotateTo1 = cc.rotateTo(0.05, 5);
            let rotateTo2 = cc.rotateTo(0.05, -4);
            let rotateTo3 = cc.rotateTo(0.05, 3);
            let rotateTo4 = cc.rotateTo(0.05, 0);
            this.icons[0].node.runAction(cc.sequence(rotateTo1, rotateTo2, rotateTo3, rotateTo4, cc.callFunc(() => {
                //第一朵花
                let scaleTo1 = cc.scaleTo(0.2, 1, 1.2).easing(cc.easeQuadraticActionIn());
                let scaleTo2 = cc.scaleTo(0.1, 1, 0.9);
                let scaleTo3 = cc.scaleTo(0.07, 1, 1.1);
                let scaleTo4 = cc.scaleTo(0.05, 1, 1);
                this.flowers1[0].node.runAction(cc.sequence(scaleTo1, scaleTo2, scaleTo3, scaleTo4));

                //第二朵花
                let scaleTo10 = cc.scaleTo(0.1, 0, 0);
                let scaleTo11 = cc.scaleTo(0.2, 1, 1.2).easing(cc.easeQuadraticActionIn());
                let scaleTo12 = cc.scaleTo(0.1, 1, 0.9);
                let scaleTo13 = cc.scaleTo(0.07, 1, 1.1);
                let scaleTo14 = cc.scaleTo(0.05, 1, 1);
                this.flowers1[1].node.runAction(cc.sequence(scaleTo10, scaleTo11, scaleTo12, scaleTo13, scaleTo14));
            })));
            this.doTextActions();
        })));
    },

    //答错icon的标志动画
    doIcon2Actions() {
        this.flowers2[0].node.scale = 0;
        this.flowers2[1].node.scale = 0;
        this.flowers2[2].node.scale = 0;
        this.flowers2[3].node.scale = 0;
        this.icons[1].node.scale = 3;
        let scaleTo = cc.scaleTo(0.2, 1).easing(cc.easeQuadraticActionIn());
        this.icons[1].node.runAction(cc.sequence(scaleTo, cc.callFunc(() => {
            let rotateTo1 = cc.rotateTo(0.05, 5);
            let rotateTo2 = cc.rotateTo(0.05, -4);
            let rotateTo3 = cc.rotateTo(0.05, 3);
            let rotateTo4 = cc.rotateTo(0.05, 0);
            this.icons[1].node.runAction(cc.sequence(rotateTo1, rotateTo2, rotateTo3, rotateTo4, cc.callFunc(() => {
                //第一朵花
                let scaleTo1 = cc.scaleTo(0.2, 1, 1.2).easing(cc.easeQuadraticActionIn());
                let scaleTo2 = cc.scaleTo(0.1, 1, 0.9);
                let scaleTo3 = cc.scaleTo(0.07, 1, 1.1);
                let scaleTo4 = cc.scaleTo(0.05, 1, 1);
                this.flowers2[0].node.runAction(cc.sequence(scaleTo1, scaleTo2, scaleTo3, scaleTo4));

                //第二朵花
                let scaleTo10 = cc.scaleTo(0.1, 0, 0);
                let scaleTo11 = cc.scaleTo(0.2, 1, 1.2).easing(cc.easeQuadraticActionIn());
                let scaleTo12 = cc.scaleTo(0.1, 1, 0.9);
                let scaleTo13 = cc.scaleTo(0.07, 1, 1.1);
                let scaleTo14 = cc.scaleTo(0.05, 1, 1);
                this.flowers2[1].node.runAction(cc.sequence(scaleTo10, scaleTo11, scaleTo12, scaleTo13, scaleTo14));

                //第三朵花
                let scaleTo21 = cc.scaleTo(0.2, 1, 1.2).easing(cc.easeQuadraticActionIn());
                let scaleTo22 = cc.scaleTo(0.1, 1, 0.9);
                let scaleTo23 = cc.scaleTo(0.07, 1, 1.1);
                let scaleTo24 = cc.scaleTo(0.05, 1, 1);
                this.flowers2[2].node.runAction(cc.sequence(scaleTo21, scaleTo22, scaleTo23, scaleTo24));

                //第四朵花
                let scaleTo30 = cc.scaleTo(0.15, 0, 0);
                let scaleTo31 = cc.scaleTo(0.2, 1, 1.2).easing(cc.easeQuadraticActionIn());
                let scaleTo32 = cc.scaleTo(0.1, 1, 0.9);
                let scaleTo33 = cc.scaleTo(0.07, 1, 1.1);
                let scaleTo34 = cc.scaleTo(0.05, 1, 1);
                this.flowers2[3].node.runAction(cc.sequence(scaleTo30, scaleTo31, scaleTo32, scaleTo33, scaleTo34));
            })));
            this.doTextActions();
        })));
    },

    //对文字进行action动画
    doTextActions() {
        this.text.node.setScale(1, 0);
        let scaleTo1 = cc.scaleTo(0.2, 1, 1.2).easing(cc.easeQuadraticActionIn());
        let scaleTo2 = cc.scaleTo(0.15, 1, 0.9);
        let scaleTo3 = cc.scaleTo(0.1, 1, 1.1);
        let scaleTo4 = cc.scaleTo(0.05, 1, 1);
        this.text.node.runAction(cc.sequence(scaleTo1, scaleTo2, scaleTo3, scaleTo4));

        this.rText.node.setScale(1, 0);
        let scaleTo11 = cc.scaleTo(0.2, 1, 1.2).easing(cc.easeQuadraticActionIn());
        let scaleTo12 = cc.scaleTo(0.15, 1, 0.9);
        let scaleTo13 = cc.scaleTo(0.1, 1, 1.1);
        let scaleTo14 = cc.scaleTo(0.05, 1, 1);
        this.rText.node.runAction(cc.sequence(scaleTo11, scaleTo12, scaleTo13, scaleTo14));
    },

    onDestroy() {
        clearTimeout(this.timer);
        this.timer = null;
    }
});
