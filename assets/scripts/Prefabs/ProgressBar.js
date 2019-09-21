const DataUtil = require('DataUtil');
cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: cc.ProgressBar,
        bar: cc.Sprite,
        redBar: cc.SpriteFrame,
    },

    onLoad() {
        this.startBar();
    },

    //启动进度调
    startBar() {
        //false：透明度降低   true：透明度上升
        this.flag = false;
        let curSubStage = DataUtil.getCurSubStage();
        let singleSeconds = curSubStage.singleSeconds || 60;
        let redStart = 5 / singleSeconds + 0.08;
        let offLen = 0.92 / (parseInt(singleSeconds, 10) * 1000 / 80);
        this.timer = setInterval(() => {
            if (this.progressBar.progress > 0.08) {
                this.progressBar.progress -= offLen;
                if (this.progressBar.progress < redStart) {
                    this.bar.spriteFrame = this.redBar;
                    if (!this.flag) {
                        this.bar.node.opacity -= 6;
                        if (this.bar.node.opacity < 150) {
                            this.flag = true;
                        }
                    } else {
                        this.bar.node.opacity += 6;
                        if (this.bar.node.opacity > 250) {
                            this.flag = false;
                        }
                    }
                }
            } else {
                this.bar.node.active = false;
                let questionScript = cc.find('Canvas/BaseView/CenterView/ScrollView/view/content').getChildByName('Question').getComponent('Question');
                questionScript.doMulSelect();
            }
        }, 80);
    },

    //停止所有actions
    stopAllActions() {
        clearTimeout(this.timer);
        this.timer = null;
    },

    doDestroy() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.node.destroy();
    },

    onDestroy() {
        clearTimeout(this.timer);
        this.timer = null;
    },
});
