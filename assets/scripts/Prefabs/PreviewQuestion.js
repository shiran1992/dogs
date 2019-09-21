const DataUtil = require('DataUtil');
cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Node,
        title: cc.Label,
        successView: cc.Node,
        errorView: cc.Node,
        timeoutView: cc.Node,
        count: cc.RichText,
        time: cc.RichText,
        score: cc.RichText,
        btnSubmit: cc.Node,
        detail1: cc.Node,
        detail2: cc.Node,
        detail3: cc.Node,
    },

    ctor() {
        this.callBack = () => { };
    },

    initView(obj = {}) {
        let curSubStage = DataUtil.getCurSubStage();
        let questions = DataUtil.getQuestions() || [];
        if (questions.length) {
            this.createActions();
            let orderIndex = curSubStage.orderIndex || 0;
            let singleSeconds = curSubStage.singleSeconds || 60;
            let point = curSubStage.point;
            this.title.string = '第' + (orderIndex + 1) + '关';
            this.count.string = "<color=#333333>本关共有<color=#d34a00>" + questions.length + "</color>题</color>";
            this.time.string = "<color=#333333>每题答题限时<color=#d34a00>" + singleSeconds + "</color>秒</color>";
            this.score.string = "<color=#333333>过关奖励<color=#d34a00>" + point + "</color>积分</color>";
        } else {
            this.btnSubmit.active = false;
            this.errorView.active = true;
            this.successView.active = false;
            this.title.string = '异常提示';
            /*this.btnSubmit.active = false;
            this.timeoutView.active = true;
            this.successView.active = false;
            this.title.string = '异常提示';*/
        }
    },

    createActions() {
        this.detail1.scale = 0;
        this.detail2.scale = 0;
        this.detail3.scale = 0;
        this.background.y += (cc.winSize.height / 2 + 280);
        this.background.active = true;
        let action1 = cc.moveTo(0.4, cc.v2(0, -40)).easing(cc.easeQuarticActionIn());
        let action2 = cc.moveTo(0.1, cc.v2(0, 20)).easing(cc.easeQuarticActionOut());
        let action3 = cc.moveTo(0.05, cc.v2(0, 0)).easing(cc.easeQuarticActionIn());

        this.background.runAction(cc.sequence(action1, action2, action3, cc.callFunc(() => {
            let action11 = cc.scaleTo(0.15, 1.2);
            let action12 = cc.scaleTo(0.1, 0.8);
            let action13 = cc.scaleTo(0.05, 1);
            this.detail1.runAction(cc.sequence(action11, action12, action13));
            let action20 = cc.scaleTo(0.1, 0);
            let action21 = cc.scaleTo(0.15, 1.2);
            let action22 = cc.scaleTo(0.1, 0.8);
            let action23 = cc.scaleTo(0.05, 1);
            this.detail2.runAction(cc.sequence(action20, action21, action22, action23));
            let action30 = cc.scaleTo(0.2, 0);
            let action31 = cc.scaleTo(0.15, 1.2);
            let action32 = cc.scaleTo(0.1, 0.8);
            let action33 = cc.scaleTo(0.05, 1);
            this.detail3.runAction(cc.sequence(action30, action31, action32, action33, cc.callFunc(() => {
                this.btnSubmit.active = true;
                this.btnSubmit.opacity = 0;
                let action40 = cc.fadeTo(0.2, 255);
                this.btnSubmit.runAction(action40);
            })));
        })));
    },

    //设置回调
    setCallBack(callBack) {
        this.callBack = callBack;
    },

    doSubmit() {
        this.callBack && this.callBack();
        this.node.destroy();
    }
});
