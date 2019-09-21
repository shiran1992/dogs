const Helper = require('Helper');
const DataUtil = require('DataUtil');
cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Node,
        detail: cc.Node,
        usersNode: cc.Node,
        btnNext: cc.Node,
        btnRestart: cc.Node,
        btnFinish: cc.Node,
        resNode: cc.Node,
        iconItem: cc.Node,

        fail: cc.SpriteFrame,
        success: cc.SpriteFrame,
    },

    onDestroy() {
        this.onClose();
    },

    onLoad() {
        this.btn = null;
        this.title.active = false;
        this.detail.active = false;
        this.usersNode.active = false;
        this.resNode.active = false;

        if (cc.winSize.height < 1200) {
            let changeH = 1200 - cc.winSize.height;

            this.node.setScale((1 - changeH / 1334));
        }
    },

    setCallback(callback) {
        this.exitHandler = callback;
    },

    onClickBtn() {
        Helper.playButtonMusic();
        this.exitHandler();
    },

    setOverData(obj = {}) {
        DataUtil.switchLog && console.log('游戏结束本地保存的数据', obj);
        let localData = obj.localData;
        this.brainNum = localData.getBrainValue;
        this.goldNum = localData.getGoldCoin;
        this.isPass = localData.isPass;
        this.rankData = obj.subStageRank;
        let resultIcon = this.title.getChildByName("result").getComponent(cc.Sprite);
        let tips1 = this.detail.getChildByName("text1").getComponent(cc.Label);
        let tips2 = this.detail.getChildByName("text2").getComponent(cc.Label);
        let tips21 = this.detail.getChildByName("text21").getComponent(cc.Label);
        let tips3 = this.detail.getChildByName("text3").getComponent(cc.Label);
        if (localData.isPass > 0) {
            //判断当前大关卡是否已经闯完
            let curSubStage = DataUtil.getCurSubStage() || {};
            let orderIndex = curSubStage.orderIndex;
            let allSubStage = DataUtil.getAllSubStage() || [];
            if (orderIndex + 1 >= allSubStage.length) {
                this.btnFinish.active = true;
                this.btnFinish.scale = 0;
                this.btn = this.btnFinish;
            } else {
                this.btnNext.active = true;
                this.btnNext.scale = 0;
                this.btn = this.btnNext;
            }
            Helper.playWinMusic();
            resultIcon.spriteFrame = this.success;
            tips1.string = "恭喜您，本次闯关成功!";
        } else {
            this.btnRestart.active = true;
            this.btnRestart.scale = 0;
            this.btn = this.btnRestart;
            Helper.playFailMusic();
            resultIcon.spriteFrame = this.fail;
            tips1.string = "很遗憾，您本次闯关失败!";
        }

        //本关排名
        if (obj.currentRank && obj.currentRank > 0) {
            tips3.string = "位列本关 " + obj.currentRank + " 名";
        } else {
            tips3.string = "本关你还没有名次";
        }

        let totalNum = localData.correctQty + localData.errorQty;
        let usedTime = Math.round(localData.usedTime);
        tips2.string = "共答" + totalNum + "题，答对" + localData.correctQty + "题。";
        tips21.string = "本次挑战消耗" + usedTime + "秒。";

        this.playTitle();
    },

    comAction(target, callback) {
        target.runAction(cc.sequence(cc.scaleTo(0.25, 1.16), cc.callFunc(() => {
            if (callback) {
                callback();
            }
        }), cc.scaleTo(0.2, 0.9), cc.scaleTo(0.1, 1.1), cc.scaleTo(0.1, 1)));
    },

    comAction1(target) {
        target.runAction(cc.sequence(cc.scaleTo(0.25, 1.16), cc.scaleTo(0.2, 0.9), cc.scaleTo(0.1, 1)));
    },

    playTitle() {
        this.title.active = true;
        let bg = this.title.getChildByName("bg");
        let result = this.title.getChildByName("result");
        bg.setScale(0, 0);
        result.setScale(0, 0);

        this.comAction(bg, () => {
            this.comAction(result, () => {
                let ani = bg.getComponent(cc.Animation);
                ani.play();
                this.playDetail();
            })
        });
    },

    playDetail() {
        let bg = this.detail.getChildByName("bg");
        let text1 = this.detail.getChildByName("text1");
        let text2 = this.detail.getChildByName("text2");
        let text21 = this.detail.getChildByName("text21");
        let text3 = this.detail.getChildByName("text3");
        text1.setScale(0, 0);
        text2.setScale(0, 0);
        text21.setScale(0, 0);
        text3.setScale(0, 0);
        this.detail.active = true;

        let bgWPos = this.detail.convertToWorldSpaceAR(bg.position)
        let moveH = bgWPos.y + cc.winSize.height / 2 + bg.height / 2 + 50
        bg.y = -moveH;
        bg.runAction(cc.sequence(cc.moveBy(0.5, cc.p(0, moveH)), cc.spawn(cc.sequence(
            cc.moveBy(0.15, cc.p(0, 50)), cc.delayTime(0.05), cc.moveBy(0.1, cc.p(0, -60)), cc.moveBy(0.1, cc.p(0, 30)), cc.moveBy(0.06, cc.p(0, -20))), cc.sequence(
                cc.rotateBy(0.15, -6), cc.delayTime(0.05), cc.rotateBy(0.15, 8), cc.rotateBy(0.06, -2)
            )), cc.callFunc(() => {
                this.comAction(text1);
                this.handlerOut2 = setTimeout(() => {
                    this.comAction1(text2);
                    clearTimeout(this.handlerOut2);
                }, 200);
                this.handlerOut21 = setTimeout(() => {
                    this.comAction1(text21);
                    clearTimeout(this.handlerOut21);
                }, 200);
                this.handlerOut3 = setTimeout(() => {
                    this.comAction1(text3);
                    clearTimeout(this.handlerOut3);
                }, 300);
                this.handlerOut4 = setTimeout(() => {
                    this.playList();
                    clearTimeout(this.handlerOut4);
                }, 600);
            })));
    },

    playList() {
        this.usersNode.active = true;
        let raw1 = this.usersNode.getChildByName("raw1");
        let raw2 = this.usersNode.getChildByName("raw2");

        raw1.removeAllChildren();
        raw2.removeAllChildren();

        let index = 0;
        this.handler1 = setInterval(() => {
            if (index >= 10 || this.rankData.length <= index) {
                clearInterval(this.handler1);
                this.playExit();
                return;
            }
            let item = cc.instantiate(this.iconItem);
            item.setScale(0, 0);
            item.active = true;

            if (index < 5) {
                item.parent = raw1;
                item.y = 0;
            } else {
                item.parent = raw2;
                item.y = 0;
            }

            let scp = item.getComponent("headItem");
            scp.setData(this.rankData[index]);
            if (index == 0) {
                scp.showCrown();
            }

            this.comAction(item);
            index += 1;
        }, 120);
    },

    playExit() {
        this.comAction(this.btn);
        if (!this.isPass || this.isPass <= 0) { return; }
        this.handlerOut1 = setTimeout(() => {
            this.playRes();
            clearTimeout(this.handlerOut1);
        }, 500);
    },

    playRes() {
        Helper.playAccountMusic();
        let brainNum = this.brainNum || 0;
        let gold = this.goldNum || 0;
        this.resNode.active = true;

        let num1 = this.resNode.getChildByName("brainNum");
        num1 = num1.getComponent(cc.Label);
        let title1 = this.resNode.getChildByName("brainTitle");
        title1 = title1.getComponent(cc.Label);

        let num2 = this.resNode.getChildByName("goldNum");
        num2 = num2.getComponent(cc.Label);
        let title2 = this.resNode.getChildByName("goldTitle");
        title2 = title2.getComponent(cc.Label);
        let updatefun = (num) => {
            let value1 = Math.min(num, brainNum);
            let value2 = Math.min(num, gold);

            num1.string = "+" + value1;
            title1.node.x = num1.node.x + num1.node.width;
            num2.string = "+" + value2;
            title2.node.x = num2.node.x + num2.node.width;
        }

        let count = 0;
        let step = 1;
        updatefun(count);
        count += step;
        let max = Math.max(brainNum, gold);
        let timeSpace = Math.floor(1800 / max);  //voice within 2s
        this.handler2 = setInterval(() => {
            if (count > max) {
                clearInterval(this.handler2);
                this.resNode.runAction(cc.sequence(cc.delayTime(1), cc.fadeOut(0.8)));
                return;
            }
            updatefun(count);
            count += step;
        }, timeSpace);
    },

    onClose() {
        if (this.handlerOut1) {
            clearTimeout(this.handlerOut1);
        }
        clearTimeout(this.handlerOut2);
        clearTimeout(this.handlerOut3);
        clearTimeout(this.handlerOut4);
        clearInterval(this.handler1);
        clearInterval(this.handler2);
    }
});
